#!/usr/bin/env python3
"""gates.py — G1..G7, run in order, every time (spec §6).

Usage:
    python pipeline/lib/gates.py --baseline <dir> --chunk <name> \
        [--shell-work] [--fragments <file>] [--log <path>]

Exit 0 only if every gate passes. G6/G7 encode observed defect classes; add
gates here whenever a new class recurs — that is the standing rule.
"""
import argparse
import os
import re
import subprocess
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
results = []


def run(cmd):
    p = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    return p.returncode, (p.stdout + p.stderr)


def gate(name, ok, detail):
    results.append((name, ok, detail.strip()))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {detail.strip().splitlines()[-1] if detail.strip() else ''}")
    return ok


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--chunk", required=True, help="target content chunk name, e.g. era-1")
    ap.add_argument("--shell-work", action="store_true")
    ap.add_argument("--fragments", help="writer fragments file (for G5)")
    ap.add_argument("--log")
    a = ap.parse_args()

    ok = True

    rc, out = run([sys.executable, "scripts/validate_codex.py", "master/"])
    ok &= gate("G1 validate_codex (incl. round-trip)", rc == 0, out)

    rc, out = run([sys.executable, "scripts/check_regression.py", a.baseline, "master"])
    g2 = rc == 0
    changed = re.findall(r"^\s*(\S+)\s+.*\bCHANGED\s*$", out, re.M)
    for f in changed:
        base = os.path.basename(f).replace(".html", "")
        if base == "shell" and not a.shell_work:
            g2 = False
            out += "\nshell.html changed but the brief does not declare shell work"
        elif base != "shell" and base != a.chunk:
            g2 = False
            out += f"\nunexpected content change in {f} — stale-load rollback signature"
    ok &= gate("G2 regression vs baseline", g2, out)

    rc, out = run([sys.executable, "scripts/assemble.py", "master", "/tmp/gate-assembled.html"])
    ok &= gate("G3 assemble", rc == 0, out)

    # G4 (absence re-run) is orchestrated by run_cycle (needs the target list);
    # recorded here as informational.
    gate("G4 absence hunt", True, "recorded separately in logs/<run>/hunt-after.txt")

    if a.fragments and os.path.exists(os.path.join(ROOT, a.fragments)):
        raw = open(os.path.join(ROOT, a.fragments), encoding="utf-8").read()
        bad = re.findall("[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f\\ufffd]", raw)
        ok &= gate("G5 encoding sweep of fragments", not bad,
                   f"{len(bad)} forbidden characters" if bad else "clean")
    else:
        gate("G5 encoding sweep", True, "no fragments file supplied (patch-only cycle)")

    chunk_path = os.path.join(ROOT, "master", "content", a.chunk + ".html")
    chunk = open(chunk_path, encoding="utf-8").read()
    scenes = len(re.findall(r'class="scene[" ]', chunk))
    provs = len(re.findall(r'class="prov[" ]', chunk))
    ok &= gate("G6 scene/prov parity", scenes == provs, f"{scenes} scenes vs {provs} prov notes")

    h2_in_scene = []
    for m in re.finditer(r'<div class="scene">', chunk):
        depth, j = 0, m.start()
        for t in re.finditer(r"<div\b[^>]*>|</div>", chunk[m.start():m.start() + 60000]):
            depth += 1 if not t.group(0).startswith("</") else -1
            if depth == 0:
                if "<h2" in chunk[m.start():m.start() + t.end()]:
                    h2_in_scene.append(m.start())
                break
    ok &= gate("G7 no <h2> inside .scene", not h2_in_scene,
               f"{len(h2_in_scene)} scene block(s) contain <h2>" if h2_in_scene else "clean")

    report = "\n".join(f"{'PASS' if o else 'FAIL'}  {n}\n{d}\n" for n, o, d in results)
    if a.log:
        os.makedirs(os.path.dirname(os.path.join(ROOT, a.log)), exist_ok=True)
        open(os.path.join(ROOT, a.log), "w", encoding="utf-8").write(report)
    print("\nGATES:", "ALL PASS" if ok else "FAILED")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
