#!/usr/bin/env python3
"""Structural QA for chronicle.html. Usage: python validate_codex.py <path-to-chronicle.html>

Checks:
  1. Balanced open/close counts for key container tags
  2. No duplicate element IDs
  3. Every internal href="#..." resolves to an existing id
  4. Every citation sup (#xx-rN) has a matching reference <li id="xx-rN">
  5. No leftover injection placeholders (<!--...CONTENT...-->)
  6. Every view in the JS `views` map exists in the DOM, and every .view div is in the map
  7. Every .chap.ready card's data-ch is a registered view
  8. JS syntax check via `node --check` when node is available

Exit code 0 = all pass; 1 = failures found.
"""
import os
import re
import subprocess
import sys
import tempfile


def main(path: str) -> int:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import codexfs
    s, _mode = codexfs.load(path)
    failures = []

    # 1. tag balance
    for tag in ["div", "section", "article", "figure", "svg", "button", "ol", "ul", "li", "nav", "header"]:
        opens = len(re.findall(r"<" + tag + r"[\s>]", s))
        closes = len(re.findall(r"</" + tag + r">", s))
        if opens != closes:
            failures.append(f"tag balance: <{tag}> open={opens} close={closes}")

    # 2. duplicate ids
    ids = re.findall(r'id="([^"]+)"', s)
    seen, dupes = set(), set()
    for i in ids:
        (dupes if i in seen else seen).add(i)
    if dupes:
        failures.append(f"duplicate ids: {sorted(dupes)}")

    # 3. internal anchors resolve
    hrefs = set(re.findall(r'href="#([^"]+)"', s))
    unresolved = hrefs - seen
    if unresolved:
        failures.append(f"unresolved internal anchors: {sorted(unresolved)}")

    # 4. citation sups have reference list items
    cites = set(re.findall(r'class="cite"><a href="#([a-z]{2,4}-r\d+)"', s))
    missing_refs = {c for c in cites if f'id="{c}"' not in s}
    if missing_refs:
        failures.append(f"citations without reference entries: {sorted(missing_refs)}")

    # 5. leftover placeholders
    placeholders = re.findall(r"<!--[A-Z_]*CONTENT[A-Z_]*-->", s)
    if placeholders:
        failures.append(f"leftover placeholders: {placeholders}")

    # 6. views map <-> DOM views
    m = re.search(r"var views\s*=\s*\{([^}]*)\}", s)
    if not m:
        failures.append("could not locate JS `views` map")
    else:
        mapped = set(re.findall(r"'view-([a-z0-9-]+)'", m.group(1)))
        dom = set(re.findall(r'class="view[^"]*"\s+id="view-([a-z0-9-]+)"', s))
        if mapped - dom:
            failures.append(f"views in JS map missing from DOM: {sorted(mapped - dom)}")
        if dom - mapped:
            failures.append(f"DOM views not registered in JS map: {sorted(dom - mapped)}")

        # 7. ready cards point at registered views
        for ch in re.findall(r'class="chap ready"\s+data-ch="([a-z0-9-]+)"', s):
            if ch not in mapped:
                failures.append(f".chap.ready data-ch='{ch}' is not a registered view")

    # 7b. no nested shelf cards (balanced divs can still hide nesting)
    shelf_start = s.find('<div class="shelf">')
    shelf_end = s.find('<script>')
    if shelf_start != -1:
        depth, card_depth = 0, None
        for m in re.finditer(r"<div[^>]*>|</div>", s[shelf_start:shelf_end]):
            t = m.group(0)
            if t.startswith("<div"):
                if re.search(r'class="chap (ready|soon)"', t):
                    if card_depth is not None:
                        failures.append("nested shelf card at: " + re.sub(r"\s+", " ", s[shelf_start+m.start():shelf_start+m.start()+80]))
                    else:
                        card_depth = depth
                depth += 1
            else:
                depth -= 1
                if card_depth is not None and depth <= card_depth:
                    card_depth = None


    # 7c. numbering sync: card rn == chapter data-title == JS titles entry
    for m in re.finditer(r'class="chap ready" data-ch="([a-z-]+)"><div class="rn">([^<]+)</div>', s):
        slug, rn = m.group(1), m.group(2)
        if f'<article id="ch-{slug}" data-title="Chapter {rn} ' not in s.replace('\u2014','—'):
            if not re.search(r'<article id="ch-' + slug + r'" data-title="Chapter ' + re.escape(rn) + r' ', s):
                failures.append(f"numbering drift: card {slug}={rn} but data-title disagrees")
        if not re.search(r"['\"]?" + slug + r"['\"]?\s*:\s*'Chapter " + re.escape(rn) + " ", s):
            failures.append(f"numbering drift: card {slug}={rn} but JS titles disagrees")

    # 7d. timeline lane overlap: no two bars in one lane may intersect
    tlm = re.search(r'<div class="tl-vert">(.*?)</div>', s, re.S)
    if tlm:
        import collections
        lanes = collections.defaultdict(list)
        for b in re.finditer(r'<rect x="(\d+)" y="(\d+)" width="\d+" height="(\d+)" rx="4"', tlm.group(1)):
            lanes[b.group(1)].append((int(b.group(2)), int(b.group(2)) + int(b.group(3))))
        for x, occ in lanes.items():
            occ.sort()
            for (a1, b1), (a2, b2) in zip(occ, occ[1:]):
                if a2 < b1 - 2:
                    failures.append(f"timeline bar overlap in lane x={x}: ({a1},{b1}) vs ({a2},{b2})")

    # 8. JS syntax via node, if available
    mjs = re.search(r"<script>([\s\S]*?)</script>", s)
    if mjs:
        try:
            with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as tf:
                tf.write(mjs.group(1))
                tmp = tf.name
            r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
            if r.returncode != 0:
                failures.append(f"JS syntax error: {r.stderr.strip()[:400]}")
        except FileNotFoundError:
            print("note: node not available, skipping JS syntax check")
    else:
        failures.append("no <script> block found")

    if failures:
        print(f"FAIL — {len(failures)} problem(s):")
        for f_ in failures:
            print("  ✗", f_)
        return 1
    print(f"ALL CHECKS PASS  ({len(s):,} chars, {len(seen)} ids, {len(cites)} citations)")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
