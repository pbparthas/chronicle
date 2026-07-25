#!/usr/bin/env python3
"""
check_regression.py — catch a stale-load rollback before it ships.

WHY THIS EXISTS
  codexfs.save() rewrites shell.html AND every chunk file from whatever full
  text it is holding. A session that loaded the master before another session's
  work landed will, on save, silently revert every file it did not touch. The
  result is internally consistent, so validate_codex.py passes and nothing
  catches it. This is the failure mode when two cycles run in parallel.

USAGE
  python check_regression.py <baseline-master-dir> <candidate-master-dir>

  Baseline = the last ACCEPTED master. Candidate = what a session just handed you.

WHAT IT REPORTS
  Per file: ids, citations, sections, bytes, and whether the file changed.
  FAILS on any decrease in ids, citations or sections in ANY file — the
  signature of a rollback. Growth and unchanged files are fine.

  A file that is UNCHANGED when you expected it to change, or CHANGED when the
  session was told not to touch it, is also worth your attention — both are
  printed.
"""

import os
import re
import sys


def files_of(d):
    out = {}
    shell = os.path.join(d, "shell.html")
    if os.path.exists(shell):
        out["shell.html"] = open(shell, encoding="utf-8").read()
    content = os.path.join(d, "content")
    if os.path.isdir(content):
        for fn in sorted(os.listdir(content)):
            if fn.endswith(".html"):
                out["content/" + fn] = open(os.path.join(content, fn), encoding="utf-8").read()
    return out


def metrics(t):
    return {
        "ids": len(re.findall(r'\sid="[^"]+"', t)),
        "citations": len(re.findall(r'<sup class="cite"', t)),
        "refs": len(re.findall(r'<li id="[a-z]+-r\d+"', t)),
        "sections": len(re.findall(r"<section\b", t)),
        "bytes": len(t.encode("utf-8")),
    }


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    base_dir, cand_dir = sys.argv[1], sys.argv[2]
    base, cand = files_of(base_dir), files_of(cand_dir)

    failures, notes = [], []

    missing = sorted(set(base) - set(cand))
    for m in missing:
        failures.append(f"{m}: PRESENT in baseline, MISSING from candidate")
    added = sorted(set(cand) - set(base))
    for a in added:
        notes.append(f"{a}: new file in candidate")

    print(f"{'file':<26}{'ids':>14}{'cites':>14}{'refs':>14}{'sections':>14}{'bytes':>16}")
    print("-" * 98)
    for f in sorted(set(base) & set(cand)):
        b, c = metrics(base[f]), metrics(cand[f])
        changed = base[f] != cand[f]
        row = f"{f:<26}"
        for k in ("ids", "citations", "refs", "sections", "bytes"):
            d = c[k] - b[k]
            cell = f"{b[k]}->{c[k]}" if d else f"{b[k]}"
            if d:
                cell += f" ({d:+d})"
            row += f"{cell:>14}" if k != "bytes" else f"{cell:>16}"
        row += "   CHANGED" if changed else ""
        print(row)

        for k in ("ids", "citations", "refs", "sections"):
            if c[k] < b[k]:
                failures.append(
                    f"{f}: {k} DECREASED {b[k]} -> {c[k]}. "
                    "This is the signature of a stale-load rollback — the session "
                    "almost certainly loaded the master before another cycle's work landed."
                )
        if not changed:
            notes.append(f"{f}: unchanged")

    print()
    for n in notes:
        print("  note:", n)
    if failures:
        print(f"\nFAIL — {len(failures)} problem(s):")
        for f in failures:
            print("  X", f)
        print("\nDo NOT accept this delivery. Take only the files the session was")
        print("supposed to change, and drop them onto the current accepted master.")
        sys.exit(1)
    print("\nPASS — no file regressed. (Still confirm the CHANGED set matches what the session was asked to do.)")


if __name__ == "__main__":
    main()
