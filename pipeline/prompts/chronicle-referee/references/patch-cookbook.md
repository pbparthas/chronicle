# Patch cookbook (proven patterns)
## Anchoring an insertion
Find a distinctive substring in the RAW file (beware markup inside phrases). `i = s.find(frag)`; end of sentence: `j = s.find('.', i)+1`; then skip a trailing citation: `re.match(r'<sup class="cite"><a href="#[a-z]+-r\d+">\[\d+\]</a></sup>', s[j:])` and advance. Insert after.
## Adding a reference
Detect the chapter's prefix: first `<section id="([a-z]+)-` inside its article. `n = max ref number + 1`. Append a new `<li id="{p}-r{n}">` after the last existing li; cite in prose with the matching sup.
## Timeline spines (vertical chart in #view-tl)
`y = 40 + (3500 − startYear) × 0.35` (CE years negative); `height = span × 0.35` (min 26). Lane free only if NO occupant's bar OR label-overflow intersects the full span (labels run ~7.4px/char + 16 from y+10). New lane: widen viewBox by 50, extend tick x2 by 50. Written bars: fill #c07b52, text #fff3e2 weight 600, wrap `<g data-goto="slug" style="cursor:pointer">`. Bars represent CIVILIZATIONS, not chapters (Rome = one bar; successive polities like Akkad→Babylon = stacked bars with a 5px seam).
## Folder toolchain
All tools accept the folder path. `codexfs.load/save` handles assemble/split; chunk membership derives from the shelf DOM. After edits: renumber (if cards changed) → validate → assemble → ship folder zip + chronicle.html.
## After any content move
Check the seams: prose that said "as we saw / back to where Chapter X left off" may now point across chapters. Read the moved block's first and last paragraphs.
