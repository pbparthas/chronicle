#!/usr/bin/env python3
"""
absence_hunt.py — the Chronicle's depth instrument.

Depth is measured in HISTORY COVERED, never in words. This tool probes a
chapter's RAW HTML for a curated list of attested targets and reports which
are ABSENT, which are NAME-DROPS (present but untreated), and which are
COVERED. The output of a run is the next brief.

USAGE
  python absence_hunt.py <chronicle.html | master-dir> targets.json [view]

TARGETS FILE FORMAT
  {
    "babylonia": [
      ["Nebuchadnezzar I recovers Marduk from Elam",
        ["Nebuchadnezzar I\\b", "Nebuchadrezzar I\\b"]],
      ["Akitu festival", ["Akitu", "Ak\u012btu"]]
    ]
  }
  Each target is [human-readable name, [regex, regex, ...]].
  Patterns are case-insensitive. Give several spellings/diacritic variants.

RULES OF USE (from the referee skill)
  1. Build the target list from RESEARCH, before reading the chapter.
     A list built from the chapter will always report zero absences.
  2. Presence is not coverage. A single mention is a NAME-DROP, and a
     name-drop of significant history is an absence for briefing purposes.
     Always read the surrounding context before accepting a COVERED verdict.
  3. This tool cannot see what is not on its list. A clean run means
     "nothing on the list is missing", never "the chapter is complete".
"""

import json
import os
import re
import sys

NAME_DROP_CEILING = 2   # <= this many hits, with no dedicated section, is a name-drop


def load_book(path):
    """Accept either an assembled html file or a master folder."""
    if os.path.isdir(path):
        parts = []
        shell = os.path.join(path, "shell.html")
        if os.path.exists(shell):
            parts.append(open(shell, encoding="utf-8").read())
        content = os.path.join(path, "content")
        if os.path.isdir(content):
            for fn in sorted(os.listdir(content)):
                if fn.endswith(".html"):
                    parts.append(open(os.path.join(content, fn), encoding="utf-8").read())
        return "\n".join(parts)
    return open(path, encoding="utf-8").read()


def split_views(src):
    """Map view-name -> raw html of that view."""
    starts = [(m.start(), m.group(1))
              for m in re.finditer(r'<div[^>]*id="view-([a-z0-9-]+)"', src)]
    if not starts:
        return {}
    starts.append((len(src), "__END__"))
    return {starts[i][1]: src[starts[i][0]:starts[i + 1][0]]
            for i in range(len(starts) - 1)}


def section_titles(view_html):
    """All section ids + headings, so we can tell a topic with its own section
    from one mentioned in passing."""
    out = []
    for m in re.finditer(
            r'<section id="([a-z0-9-]+)"[^>]*>\s*(?:<div class="eyebrow">(.*?)</div>)?\s*<h2>(.*?)</h2>',
            view_html, flags=re.S):
        eb = re.sub(r"<[^>]+>", "", m.group(2) or "")
        h2 = re.sub(r"<[^>]+>", "", m.group(3))
        out.append(f"{eb} {h2}")
    return out


def hunt(view_html, targets):
    titles = " || ".join(section_titles(view_html))
    absent, namedrop, covered = [], [], []
    for name, patterns in targets:
        hits = 0
        for p in patterns:
            try:
                hits += len(re.findall(p, view_html, flags=re.I))
            except re.error as e:
                print(f"    !! bad regex for '{name}': {p} ({e})", file=sys.stderr)
        # does it own a section heading?
        owns_section = any(_safe_search(p, titles) for p in patterns)

        if hits == 0:
            absent.append(name)
        elif hits <= NAME_DROP_CEILING and not owns_section:
            namedrop.append((name, hits))
        else:
            covered.append((name, hits, owns_section))
    return absent, namedrop, covered


def _safe_search(pattern, text):
    try:
        return bool(re.search(pattern, text, flags=re.I))
    except re.error:
        return False


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    book_path, targets_path = sys.argv[1], sys.argv[2]
    only = sys.argv[3] if len(sys.argv) > 3 else None

    src = load_book(book_path)
    views = split_views(src)
    targets_by_view = json.load(open(targets_path, encoding="utf-8"))

    grand_absent = 0
    grand_namedrop = 0

    for view, targets in targets_by_view.items():
        if view.startswith("_"):        # metadata / README keys
            continue
        if only and view != only:
            continue
        if view not in views:
            print(f"\n!! view '{view}' not found in {book_path}")
            continue
        absent, namedrop, covered = hunt(views[view], targets)
        grand_absent += len(absent)
        grand_namedrop += len(namedrop)

        print(f"\n{'=' * 72}")
        print(f"{view.upper()}  —  {len(targets)} targets probed")
        print(f"{'=' * 72}")
        if absent:
            print(f"  ABSENT ({len(absent)}) — history that belongs here and is not here:")
            for a in absent:
                print(f"     [ ] {a}")
        if namedrop:
            print(f"  NAME-DROP ({len(namedrop)}) — present but untreated; verify context before briefing:")
            for n, c in namedrop:
                print(f"     [~] {n}  ({c} mention{'s' if c != 1 else ''})")
        if covered:
            print(f"  COVERED ({len(covered)}):")
            for n, c, sec in covered:
                print(f"     [x] {n}  ({c}){'  · owns a section' if sec else ''}")
        if not absent and not namedrop:
            print("  Nothing on the target list is missing.")
            print("  This is NOT a completeness verdict — the tool cannot see what it was not told to look for.")

    print(f"\n{'-' * 72}")
    print(f"TOTAL: {grand_absent} absent, {grand_namedrop} name-drop")
    print("Absences and name-drops become the next brief. Read context before accepting any verdict.")


if __name__ == "__main__":
    main()
