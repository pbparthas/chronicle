#!/usr/bin/env python3
"""escalate.py — HALT and hand the decision to the owner (spec §7).

Writes logs/<run>/ESCALATION.md with the reason and evidence, prints the issue
title the session must open (`ESCALATION: <slug> — <reason>`), and exits 3.
The session's ONLY next moves are: push the branch for inspection, open the
issue, stop. An escalation is not a deliverable — no PR.
"""
import os
import sys


def escalate(run_dir, slug, reason, evidence=""):
    os.makedirs(run_dir, exist_ok=True)
    body = (f"# ESCALATION: {slug} — {reason}\n\n"
            f"The cycle HALTED. The pipeline never decides; the owner does.\n\n"
            f"## Evidence\n\n{evidence or '(see logs in this directory)'}\n")
    path = os.path.join(run_dir, "ESCALATION.md")
    open(path, "w", encoding="utf-8").write(body)
    print(f"ESCALATION: {slug} — {reason}")
    print(f"written: {path}")
    print("next: push branch for inspection, open the issue with this body, exit. NO PR.")
    return path


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("usage: escalate.py <run-dir> <slug> <reason> [evidence-file]", file=sys.stderr)
        sys.exit(2)
    ev = open(sys.argv[4], encoding="utf-8").read() if len(sys.argv) > 4 else ""
    escalate(sys.argv[1], sys.argv[2], sys.argv[3], ev)
    sys.exit(3)
