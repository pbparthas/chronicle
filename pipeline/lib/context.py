#!/usr/bin/env python3
"""context.py — prompt assembly + context budgeting (spec §4).

The assembled book is ~1.6 MB and is NEVER sent whole. The writer gets the
target chapter, the Sumer exemplar, adjacent teasers, the id inventory, and
the hunt; the referee gets the diff and the logs. Everything is written to
logs/<run>/ so the exact prompt each model saw is a permanent artifact.
"""
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "scripts"))
import codexfs  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")


def _read(p):
    return open(os.path.join(ROOT, p), encoding="utf-8").read()


def extract_view(chunk_html, slug):
    """The full #view-<slug> div, or None. Balanced-div scan via codexfs."""
    span = codexfs._extract_view(chunk_html, slug)
    return chunk_html[span[0]:span[1]] if span else None


def view_ids(chunk_html):
    return sorted(set(re.findall(r'\sid="([^"]+)"', chunk_html)))


def adjacent_teasers(assembled, slug):
    """Titles + next-teaser text of the shelf neighbours of <slug> (±1 card)."""
    cards = re.findall(r'data-ch="([a-z0-9-]+)"', assembled)
    seen, order = set(), []
    for c in cards:
        if c not in seen:
            seen.add(c)
            order.append(c)
    if slug not in order:
        return "(new chapter — no shelf card yet; neighbours come from anchor-after)"
    i = order.index(slug)
    out = []
    for j in (i - 1, i + 1):
        if 0 <= j < len(order):
            n = order[j]
            m = re.search(r'data-ch="%s".*?<h4>(.*?)</h4>.*?<p>(.*?)</p>' % re.escape(n),
                          assembled, re.S)
            if m:
                out.append(f"- {n}: {m.group(1)} — {m.group(2)[:300]}")
    return "\n".join(out) or "(no adjacent cards found)"


def budget_row(name, text):
    n = len(text)
    return (name, n, n // 4)  # ~4 chars/token heuristic


def assemble_writer(run_dir, brief, hunt_before_text):
    f = brief["fields"]
    slug, chunk = f["slug"], f["chunk"]
    assembled, _ = codexfs.load(os.path.join(ROOT, "master"))
    chunk_path = f"master/content/{chunk}.html"
    chunk_html = _read(chunk_path)

    if f["new-chapter"] == "yes":
        current = "(NEW CHAPTER — there is no existing view. You will produce " \
                  f"insert-after fragments anchored inside/after view-{f['anchor-after']}.)"
    else:
        current = extract_view(chunk_html, slug)
        if current is None:
            raise SystemExit(f"context: view-{slug} not found in {chunk_path}")

    era1 = _read("master/content/era-1.html")
    exemplar = extract_view(era1, "sumer")
    parts = [
        ("SYSTEM: writer skill", _read("pipeline/prompts/chronicle-writer/SKILL.md")),
        ("style guide", _read("pipeline/prompts/chronicle-writer/references/style-guide.md")),
        ("work order", _read("pipeline/prompts/work-order.md")),
        ("brief", brief["raw"]),
        ("absence hunt (this IS your target list — close every ABSENT and "
         "upgrade every NAME-DROP)", hunt_before_text),
        ("current target chapter HTML", current),
        ("style exemplar — Sumer, the flagship standard (match its register and "
         "depth; do NOT copy its content)", exemplar or "(sumer not found!)"),
        ("adjacent chapters (titles + teasers only, for chain continuity)",
         adjacent_teasers(assembled, slug)),
        ("existing ids in the target chunk (do not collide)",
         "\n".join(view_ids(chunk_html))),
        ("OUTPUT CONTRACT", _read("pipeline/prompts/fragment-contract.md")),
    ]
    return _emit(run_dir, "writer", parts)


def assemble_referee(run_dir, brief, diff_text, hunt_before, hunt_after, gate_log):
    parts = [
        ("SYSTEM: referee skill", _read("pipeline/prompts/chronicle-referee/SKILL.md")),
        ("honeypot doctrine", _read("pipeline/prompts/chronicle-referee/references/referee-honeypots.md")),
        ("work order", _read("pipeline/prompts/work-order.md")),
        ("brief", brief["raw"]),
        ("unified diff of the cycle branch", diff_text),
        ("absence hunt BEFORE", hunt_before),
        ("absence hunt AFTER", hunt_after),
        ("gate logs", gate_log),
        ("OUTPUT CONTRACT", _read("pipeline/prompts/referee-contract.md")),
    ]
    return _emit(run_dir, "referee", parts)


def _emit(run_dir, role, parts):
    lines, report = [], [f"{'part':60s} {'chars':>9s} {'~tokens':>9s}"]
    total = 0
    for name, text in parts:
        text = text or ""
        lines.append(f"\n\n===== {name.upper()} =====\n\n{text}")
        _, n, t = budget_row(name, text)
        total += n
        report.append(f"{name[:60]:60s} {n:9d} {t:9d}")
    report.append(f"{'TOTAL':60s} {total:9d} {total // 4:9d}")
    prompt = "".join(lines).lstrip()
    with open(os.path.join(run_dir, f"{role}-prompt.md"), "w", encoding="utf-8") as fh:
        fh.write(prompt)
    with open(os.path.join(run_dir, f"{role}-budget.txt"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(report) + "\n")
    return prompt, "\n".join(report)
