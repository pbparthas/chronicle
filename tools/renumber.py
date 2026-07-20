#!/usr/bin/env python3
"""Derive all chapter numbers from shelf position. Usage: python renumber.py chronicle.html
Numbering is era-scoped: {ERA}\u00b7{position}, e.g. II\u00b73 = third chapter of Era II.
Run after ANY chapter injection, card insertion, or card move. Never hand-assign numbers.
Also normalizes all next-chapter teasers to numberless 'Next \u2014 <name>'.
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import codexfs

def main(path):
    s, _mode = codexfs.load(path)
    # 1. Walk the five main era shelves in DOM order
    era_iter = list(re.finditer(r'<div class="era-head"[^>]*><span class="num">(I{1,3}|IV|V)</span>', s))
    assignments = {}  # slug -> chapter id (for ready cards)
    out = s
    for idx, m in enumerate(era_iter):
        era = m.group(1)
        start = m.end()
        end = era_iter[idx+1].start() if idx+1 < len(era_iter) else s.find('<!-- ============ SEARCH', start)
        # bound by next era-head of ANY kind (incl. sub-shelves)
        nxt = re.search(r'<div class="era-head"', s[start:])
        if nxt: end = min(end, start + nxt.start()) if end != -1 else start + nxt.start()
        block = s[start:end]
        newblock = block
        pos = 0
        for c in re.finditer(r'(<div class="chap (?:ready|soon)"(?: data-ch="([a-z-]+)")?>)(\s*<div class="rn">)([^<]*)(</div>)', block):
            pos += 1
            cid = f'{era}\u00b7{pos}'
            newblock = newblock.replace(c.group(0), c.group(1) + c.group(3) + cid + c.group(5), 1)
            if c.group(2): assignments[c.group(2)] = cid
        out = out.replace(block, newblock, 1)
    s = out
    # 2. Sync written chapters: cover mark, data-title, JS titles
    for slug, cid in assignments.items():
        s = re.sub(r'(<article id="ch-' + slug + r'" data-title="Chapter )[IVXLC0-9\u00b7]+( \u2014)', r'\g<1>' + cid + r'\g<2>', s)
        # cover mark: first chapter-mark inside this article
        art = re.search(r'<article id="ch-' + slug + r'".*?</article>', s, re.S)
        if art:
            fixed = re.sub(r'(<div class="chapter-mark">Chapter )[IVXLC0-9\u00b7]+(</div>)', r'\g<1>' + cid + r'\g<2>', art.group(0), count=1)
            s = s.replace(art.group(0), fixed, 1)
        s = re.sub(r"(['\"]?" + slug + r"['\"]?\s*:\s*'Chapter )[IVXLC0-9\u00b7]+( \u2014)", r'\g<1>' + cid + r'\g<2>', s)
    # 3. Teasers: always numberless
    s = re.sub(r'(<div class="eyebrow">Next in the Chronicle</div>\s*<h3>(?:<a[^>]*>)?)Chapter [IVXLC0-9\u00b7]+ \u2014 ', '\\g<1>Next — ', s)
    codexfs.save(path, s, _mode)
    print('renumbered:', ', '.join(f'{k}={v}' for k, v in assignments.items()))

if __name__ == '__main__':
    main(sys.argv[1])
