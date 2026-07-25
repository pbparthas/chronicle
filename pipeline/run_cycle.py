#!/usr/bin/env python3
"""run_cycle.py — stage-1 orchestrator, stepwise (spec §2, Claude Code edition).

The model calls happen in the Claude Code session (writer/referee subagents);
this CLI does everything deterministic around them and refuses to continue when
any rail is violated. State lives in pipeline/logs/<run-id>/state.json.

    start           preflight -> parse brief -> baseline -> hunt-before ->
                    assemble writer prompt. --dry-run stops here by design.
    inject          apply writer fragments (writes master/content/<chunk>.html)
    gates           run G1..G7 against the baseline
    hunt-after      re-run the absence hunt, record the delta
    assemble-referee  build the referee prompt from the diff + logs
    apply-patches   inject referee patches, then re-run gates + hunt
    next-brief      install the referee's NEXT BRIEF as briefs/next.md (branch only)
    prbody          emit the PR body (spec §8) to logs/<run>/pr-body.md
    external-hunt-due  exit 0 if this cycle must use an externally-built target list
"""
import argparse
import datetime
import json
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, os.path.join(HERE, "lib"))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

import brief as brieflib   # noqa: E402
import context             # noqa: E402
import escalate as esc     # noqa: E402

CONFIG = json.load(open(os.path.join(HERE, "config.json"))) if os.path.exists(os.path.join(HERE, "config.json")) else {}


def sh(cmd, **kw):
    kw.setdefault("cwd", ROOT)
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def die(msg, code=1):
    print(f"ABORT: {msg}", file=sys.stderr)
    sys.exit(code)


def load_state(run_id):
    p = os.path.join(HERE, "logs", run_id, "state.json")
    if not os.path.exists(p):
        die(f"no state for run {run_id}")
    return json.load(open(p)), os.path.join(HERE, "logs", run_id)


def save_state(run_dir, st):
    json.dump(st, open(os.path.join(run_dir, "state.json"), "w"), indent=1)


def resolve_chunk(slug):
    assembled, _ = __import__("codexfs").load(os.path.join(ROOT, "master"))
    mapping = __import__("codexfs").chunk_of_slugs(assembled)
    return mapping.get(slug)


def targets_for(slug, b):
    repo = json.load(open(os.path.join(ROOT, "master", "absence-targets.json")))
    t = list(repo.get(slug, []))
    if b["targets"]:
        t += b["targets"]
    return t


def cmd_start(a):
    # PREFLIGHT ----------------------------------------------------------
    sums = sh(["sha256sum", "-c", "SKILL_SHA256SUMS"], cwd=os.path.join(ROOT, "scripts"))
    if sums.returncode != 0:
        die("preflight: scripts/ do not match the pinned skill hashes:\n" + sums.stdout + sums.stderr)
    wo = open(os.path.join(HERE, "prompts", "work-order.md"), encoding="utf-8").read()
    if "ESCALATE-PLACEHOLDER" in wo:
        die("preflight: work-order.md is still the placeholder — commit the real work order first", 3)
    v = sh([sys.executable, "scripts/validate_codex.py", "master/"])
    if v.returncode != 0:
        die("preflight: main's master/ fails the validator — a broken main is not a cycle problem:\n" + v.stdout + v.stderr)

    b = brieflib.parse(os.path.join(ROOT, a.brief))
    f = b["fields"]
    slug = f["slug"]
    chunk = f["chunk"] or resolve_chunk(slug) or (resolve_chunk(f.get("anchor-after", "")) if f["new-chapter"] == "yes" else None)
    if not chunk:
        die(f"preflight: cannot resolve content chunk for '{slug}' — unknown slug", 3)
    f["chunk"] = chunk

    run_id = f"{slug}-{datetime.datetime.utcnow().strftime('%Y%m%d-%H%M')}"
    run_dir = os.path.join(HERE, "logs", run_id)
    os.makedirs(run_dir, exist_ok=True)
    shutil.copy(os.path.join(ROOT, a.brief), os.path.join(run_dir, "brief.md"))

    baseline_sha = sh(["git", "rev-parse", "HEAD"]).stdout.strip()
    baseline_dir = f"/tmp/chronicle-baseline-{run_id}"
    shutil.rmtree(baseline_dir, ignore_errors=True)
    shutil.copytree(os.path.join(ROOT, "master"), baseline_dir)

    # cycle counter for the Nth-cycle external hunt (spec §11)
    counter_path = os.path.join(HERE, "cycle-count.txt")
    count = int(open(counter_path).read().strip()) + 1 if os.path.exists(counter_path) else 1
    every = int(CONFIG.get("external_hunt_every", 5))
    external_due = every > 0 and count % every == 0
    if external_due and not a.external_targets:
        die(f"cycle {count}: EXTERNAL target list required (every {every}th cycle fails open "
            f"by design — supply --external-targets <file> built by the owner or another model)", 3)

    targets = targets_for(slug, b)
    if a.external_targets:
        targets = json.load(open(os.path.join(ROOT, a.external_targets)))
    if not targets:
        die(f"preflight: no absence targets for '{slug}' — add them to "
            f"master/absence-targets.json or the brief's targets: field", 3)
    tfile = os.path.join(run_dir, "targets.json")
    json.dump({slug: targets}, open(tfile, "w"), indent=1)

    hunt = sh([sys.executable, "scripts/absence_hunt.py", "master", tfile, slug])
    open(os.path.join(run_dir, "hunt-before.txt"), "w").write(hunt.stdout + hunt.stderr)

    st = {"run_id": run_id, "slug": slug, "chunk": chunk, "fields": f,
          "baseline_sha": baseline_sha, "baseline_dir": baseline_dir,
          "cycle_count": count, "external_hunt": bool(a.external_targets),
          "dry_run": a.dry_run}
    save_state(run_dir, st)

    _, budget = context.assemble_writer(run_dir, b, hunt.stdout)
    print(f"run-id: {run_id}\nchunk: {chunk}\nmodel: {f['model']}\nbaseline: {baseline_sha[:9]}")
    print(f"\nwriter context budget:\n{budget}")
    if a.dry_run:
        print("\nDRY RUN — stopping before any model call, as designed.")
    else:
        open(counter_path, "w").write(str(count))
        print(f"\nnext: launch the WRITER subagent (model={f['model']}) with "
              f"pipeline/logs/{run_id}/writer-prompt.md, save its output to "
              f"pipeline/logs/{run_id}/writer-output.md, then `inject`.")


def cmd_inject(a):
    st, run_dir = load_state(a.run)
    import inject
    frags = os.path.join(run_dir, "writer-output.md" if not a.fragments else "")
    src = os.path.join(ROOT, a.fragments) if a.fragments else frags
    n = inject.apply(src, os.path.join(ROOT, "master", "content", st["chunk"] + ".html"))
    st["fragments_applied"] = st.get("fragments_applied", 0) + n
    save_state(run_dir, st)


def cmd_gates(a):
    st, run_dir = load_state(a.run)
    cmd = [sys.executable, "pipeline/lib/gates.py", "--baseline", st["baseline_dir"],
           "--chunk", st["chunk"], "--log", f"pipeline/logs/{st['run_id']}/gates.txt"]
    if st["fields"].get("shell-work") == "yes":
        cmd.append("--shell-work")
    wf = os.path.join(run_dir, "writer-output.md")
    if os.path.exists(wf):
        cmd += ["--fragments", os.path.relpath(wf, ROOT)]
    r = subprocess.run(cmd, cwd=ROOT)
    sys.exit(r.returncode)


def cmd_hunt_after(a):
    st, run_dir = load_state(a.run)
    hunt = sh([sys.executable, "scripts/absence_hunt.py", "master",
               os.path.join(run_dir, "targets.json"), st["slug"]])
    name = "hunt-after-patch.txt" if a.post_patch else "hunt-after.txt"
    open(os.path.join(run_dir, name), "w").write(hunt.stdout + hunt.stderr)
    print(hunt.stdout[-1500:])


def cmd_assemble_referee(a):
    st, run_dir = load_state(a.run)
    diff = sh(["git", "diff", st["baseline_sha"], "--", "master/"]).stdout
    b = brieflib.parse(os.path.join(run_dir, "brief.md"))
    def rd(n):
        p = os.path.join(run_dir, n)
        return open(p, encoding="utf-8").read() if os.path.exists(p) else "(missing)"
    _, budget = context.assemble_referee(run_dir, b, diff, rd("hunt-before.txt"),
                                         rd("hunt-after.txt"), rd("gates.txt"))
    print(f"referee context budget:\n{budget}")
    print(f"\nnext: launch the REFEREE subagent (model=opus-4.8, pinned) with "
          f"pipeline/logs/{st['run_id']}/referee-prompt.md; save output to "
          f"pipeline/logs/{st['run_id']}/referee-output.md")


def cmd_next_brief(a):
    st, run_dir = load_state(a.run)
    text = open(os.path.join(ROOT, a.file), encoding="utf-8").read()
    brieflib_path = os.path.join(run_dir, "next-brief.md")
    open(brieflib_path, "w").write(text)
    open(os.path.join(ROOT, "briefs", "next.md"), "w").write(text)
    print("briefs/next.md replaced ON THIS BRANCH ONLY (reaches main only via merge).")


def cmd_prbody(a):
    st, run_dir = load_state(a.run)
    def rd(n):
        p = os.path.join(run_dir, n)
        return open(p, encoding="utf-8").read() if os.path.exists(p) else "(missing)"
    f = st["fields"]
    body = f"""## Cycle: {st['slug']}  (Phase {f.get('phase','?')})
Baseline: {st['baseline_sha'][:9]}   Writer: {f['model']}   Referee: opus-4.8 (pinned)

> **These checks confirm the chapter is well-formed and that the listed history
> is present. They do not confirm the history is correct, well-told, or free of
> duplication with another entry. Read the prose.**

### Referee verdict
{rd('referee-output.md')}

### Absence hunt
<details><summary>before</summary>

```
{rd('hunt-before.txt')}
```
</details>
<details><summary>after</summary>

```
{rd('hunt-after.txt')}
```
</details>

### Gates
```
{rd('gates.txt')}
```

### Next brief (lands only if this merges)
```
{rd('next-brief.md')}
```

### Run artifacts
`pipeline/logs/{st['run_id']}/` on this branch — every prompt, output, hunt and gate log.
{'**External target list used (Nth-cycle fail-open).**' if st.get('external_hunt') else ''}

---
Reply `/approve`, `/approve-with-patch <text>`, or `/reject <text>`.
"""
    open(os.path.join(run_dir, "pr-body.md"), "w").write(body)
    print(f"pipeline/logs/{st['run_id']}/pr-body.md written")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("start")
    s.add_argument("--brief", default="briefs/next.md")
    s.add_argument("--dry-run", action="store_true")
    s.add_argument("--external-targets")
    for name in ("inject", "gates", "hunt-after", "assemble-referee", "next-brief", "prbody"):
        p = sub.add_parser(name)
        p.add_argument("--run", required=True)
        if name == "inject":
            p.add_argument("--fragments")
        if name == "hunt-after":
            p.add_argument("--post-patch", action="store_true")
        if name == "next-brief":
            p.add_argument("--file", required=True)
    a = ap.parse_args()
    {"start": cmd_start, "inject": cmd_inject, "gates": cmd_gates,
     "hunt-after": cmd_hunt_after, "assemble-referee": cmd_assemble_referee,
     "next-brief": cmd_next_brief, "prbody": cmd_prbody}[a.cmd](a)


if __name__ == "__main__":
    main()
