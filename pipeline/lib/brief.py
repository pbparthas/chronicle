#!/usr/bin/env python3
"""brief.py — parse briefs/next.md.

Brief format (key: value header lines, then free-form body):

    slug: assyria
    chunk: era-1            # optional; derived from the shelf when omitted
    phase: 2
    model: sonnet           # sonnet (default) | opus  — work order §9.4 routing
    status: ready           # ready | draft  — preflight refuses draft
    new-chapter: no         # yes = no existing view; anchor-after required
    anchor-after: metalgold # only for new-chapter: the view slug to insert after
    shell-work: no          # yes = the brief explicitly authorises shell.html changes
    targets:                # optional inline absence targets (JSON list, one line
                            # or fenced block); merged over master/absence-targets.json
    ---
    <free-form brief body: must-cover list, tone notes, flag list, sources>
"""
import json
import re
import sys


REQUIRED = ("slug", "status")
DEFAULTS = {"model": "sonnet", "new-chapter": "no", "shell-work": "no", "chunk": "", "phase": ""}


def parse(path):
    text = open(path, encoding="utf-8").read()
    head, sep, body = text.partition("\n---\n")
    if not sep:
        raise SystemExit("brief: missing '---' separator between header and body")
    fields = dict(DEFAULTS)
    targets = None
    lines = head.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        m = re.match(r"^([a-z-]+):\s*(.*?)\s*(#.*)?$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2)
        if key == "targets":
            if val:
                targets = json.loads(val)
            else:
                # fenced JSON block on following lines until a line that is not JSON-ish
                buf = []
                while i < len(lines) and (lines[i].startswith(" ") or lines[i].startswith("[") or buf):
                    buf.append(lines[i])
                    i += 1
                    if buf and buf[-1].rstrip().endswith("]") and buf[0].lstrip().startswith("["):
                        break
                if buf:
                    targets = json.loads("\n".join(buf))
        else:
            fields[key] = val
    for k in REQUIRED:
        if not fields.get(k):
            raise SystemExit(f"brief: required field '{k}' missing")
    if fields["status"] != "ready":
        raise SystemExit(f"brief: status is '{fields['status']}', not 'ready' — refusing to run")
    if fields["model"] not in ("sonnet", "opus"):
        raise SystemExit(f"brief: model '{fields['model']}' is not sonnet|opus")
    if fields["new-chapter"] == "yes" and not fields.get("anchor-after"):
        raise SystemExit("brief: new-chapter=yes requires anchor-after: <view slug>")
    return {"fields": fields, "targets": targets, "body": body.strip(), "raw": text}


if __name__ == "__main__":
    b = parse(sys.argv[1] if len(sys.argv) > 1 else "briefs/next.md")
    print(json.dumps({"fields": b["fields"], "has_targets": b["targets"] is not None,
                      "body_chars": len(b["body"])}, indent=1))
