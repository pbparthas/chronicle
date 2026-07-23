#!/usr/bin/env python3
"""codexfs — load/save The Chronicle as EITHER a single file OR a master folder.
Folder layout: <dir>/shell.html + <dir>/content/{era-1,era-2,...}.html
The shell contains <!-- @CHAPTER-CHUNKS --> where chapter views are re-inserted.
Chunk membership is DERIVED from the shelf DOM (era-head ids -> ready-card data-ch),
so new chapters are picked up automatically. Never hardcode chapter lists.
"""
import os, re

ORDER = ['era-0','era-1','era-2','era-3','era-4','era-5','interludes','east-asia','epics','cities','faiths']
HEADMAP = {'era-before':'era-0','era-cradles':'era-1','era-classical':'era-2','era-medieval':'era-3',
           'era-earlymodern':'era-4','era-modern':'era-5','era-interludes':'interludes',
           'era-eastasia':'east-asia','era-epics':'epics','era-cities':'cities','era-faiths':'faiths'}
MARKER = '<!-- @CHAPTER-CHUNKS -->'

def chunk_of_slugs(s):
    """slug -> chunk name, derived from the shelf."""
    heads = [(m.start(), m.group(1)) for m in re.finditer(r'<div class="era-head" id="([a-z-]+)"', s)]
    end_shelf = s.find('<!-- ============', heads[-1][0]) if heads else len(s)
    out = {}
    for i,(pos,hid) in enumerate(heads):
        nxt = heads[i+1][0] if i+1 < len(heads) else end_shelf
        for m in re.finditer(r'data-ch="([a-z-]+)"', s[pos:nxt]):
            out[m.group(1)] = HEADMAP.get(hid)
    return out

def _extract_view(s, slug):
    """Return (start,end) spanning the view div (+ an immediately preceding banner comment)."""
    i = s.find('<div class="view" id="view-%s">' % slug)
    if i == -1: return None
    # include a directly preceding <!-- ... --> banner line
    j = s.rfind('-->', 0, i)
    if j != -1:
        k = s.rfind('<!--', 0, j)
        if k != -1 and s[j+3:i].strip() == '':
            i = k
    # balanced-div scan
    depth, p = 0, s.find('<div', i)
    while p != -1:
        if s.startswith('<div', p): depth += 1; p = min(x for x in (s.find('<div', p+4), s.find('</div>', p+4)) if x != -1)
        elif s.startswith('</div>', p):
            depth -= 1
            if depth == 0: return (i, p + 6)
            p = min(x for x in (s.find('<div', p+6), s.find('</div>', p+6)) if x != -1)
    raise ValueError('unbalanced view: ' + slug)

def split(s):
    """full text -> (shell_text, {chunk: chunk_text})"""
    mapping = chunk_of_slugs(s)
    spans = []
    for slug, chunk in mapping.items():
        sp = _extract_view(s, slug)
        if sp: spans.append((sp[0], sp[1], chunk))
    spans.sort()
    chunks, shell, last = {}, [], 0
    first = True
    for a,b,chunk in spans:
        shell.append(s[last:a])
        if first: shell.append(MARKER + '\n'); first = False
        chunks.setdefault(chunk, []).append(s[a:b])
        last = b
    shell.append(s[last:])
    return ''.join(shell), {k: '\n\n'.join(v) for k,v in chunks.items()}

def assemble(d):
    shell = open(os.path.join(d,'shell.html'), encoding='utf-8').read()
    parts = []
    for name in ORDER:
        p = os.path.join(d, 'content', name + '.html')
        if os.path.exists(p): parts.append(open(p, encoding='utf-8').read())
    return shell.replace(MARKER, '\n'.join(parts), 1)

def load(path):
    if os.path.isdir(path): return assemble(path), 'dir'
    return open(path, encoding='utf-8').read(), 'file'

def save(path, s, mode):
    if mode == 'file':
        open(path,'w',encoding='utf-8').write(s); return
    shell, chunks = split(s)
    open(os.path.join(path,'shell.html'),'w',encoding='utf-8').write(shell)
    os.makedirs(os.path.join(path,'content'), exist_ok=True)
    for k,v in chunks.items():
        open(os.path.join(path,'content',k+'.html'),'w',encoding='utf-8').write(v)
