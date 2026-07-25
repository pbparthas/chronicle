# Codex Architecture — chronicle.html Contract (v2)

The Chronicle ("The Chronicle — A Tale of Time") is ONE self-contained HTML file. No external CSS/JS, no build step. It must work opened from local storage on Android Chrome, fully offline (photos degrade gracefully; everything else must work with zero network).

## Top-level anatomy
```
<style>            — all CSS; design tokens in :root; THEME OVERRIDES via body.t-* classes
.topbar            — Home / title / ⚑ Resume / Aa (settings) / Search
#progress          — reading progress bar
#bm-fab            — floating bookmark ribbon (auto-shown on chapter views)
#top-fab           — back-to-top button (auto-shown when scrolled)
#toast             — toast notifications
#view-home         — hero + trust strip + grand timeline SVG + chapter shelves
#view-search       — live full-text search (auto-indexes all <article><section>s)
#view-<slug>       — one per chapter; contains <article id="ch-<slug>" data-title="...">
#settings-sheet / #settings-backdrop — Kindle-style reader settings (themes, fonts, size, spacing)
<script>           — router, safe storage, scroll memory, bookmarks, search, settings, read-time
```

## Non-negotiables (breaking these breaks the user's saved state or features)
- NEVER rename existing view IDs, section IDs, or storage keys (`bm:*`, `pos:*`, `set:*`, `lastView`).
- NEVER use bare `localStorage`; only the existing `store` wrapper.
- NEVER touch the settings, bookmark, scroll-memory, search, or read-time JS blocks.
- NEVER add external JS/CSS deps, fetch(), or service workers.
- NEVER modify existing chapters' prose (exception: the previous chapter's "Next in the Chronicle" teaser).
- The shelf is LOCKED: no new shelves/eras/cards unless the user explicitly asks.

## Theme compatibility (REQUIRED for all new content)
Six themes exist: default parchment + body classes t-white / t-sepia / t-mint / t-dark / t-black, implemented as CSS-variable overrides. Therefore in any new content:
- Use CSS variables (--ink, --ink-soft, --sand, --sand-deep, --paper, --clay, --clay-deep, --reed, --gold) — never hardcode text/background colors in new CSS.
- In the GRAND TIMELINE SVG, text uses fill="currentColor". In chapter map SVGs (parchment-artifact style with their own painted background), self-contained hardcoded colors are acceptable.
- Reuse existing classes; do not invent parallel ones.

## Automatic features (do NOT hand-write these)
- Reading time: computed at runtime from word count and injected into each `.chapter-mark`. Do not add manual "X min read" text.
- Search indexing: automatic from `<article><section>` structure — which is why every section needs a heading.

## How to inject a new chapter (exact steps)
1. Slug: short, unique (e.g. `persia`). Section prefix: unique 2–4 letters (`su-` and `ak-` are taken).
2. Add view before `<script>`:
```html
<div class="view" id="view-persia">
  <div class="wrap">
    <article id="ch-persia" data-title="Chapter III — Achaemenid Persia">
      ...cover (.cover with .chapter-mark), toc (.toc), sections, refs (.refs)...
    </article>
  </div>
</div>
```
3. Register in the JS maps (near top of script):
   `views = { ..., persia: 'view-persia' }` and `titles = { ..., persia: 'Chapter III — Achaemenid Persia' }`
4. Flip the shelf card by EDITING THE EXISTING CARD IN PLACE: change `soon`→`ready`, add `data-ch`, set the rn numeral, change status text to `Read`. NEVER insert new card markup — nesting a card inside the old one breaks the shelf layout (the validator now detects this). When moving a card, cut the COMPLETE element (through its `<div class="status">…</div></div>` tail).
5. Timeline: the grand timeline is a VERTICAL spine chart in `#view-tl` (time flows downward; y = 40 + (3500 − startYear) × 0.35, CE years negative; bar height = span × 0.35; lanes scroll horizontally — adding a lane is cheap: widen viewBox by 50 and extend tick x2 by 50). To flip a bar when its chapter is written: change its rect fill to `#c07b52`, its text fill to `#fff3e2`, and add ` data-goto="<slug>" style="cursor:pointer"` to its enclosing `<g>` — do NOT reposition anything. To ADD a new bar: a lane is usable ONLY if NO occupant (bar or label overflow) intersects ANY part of your full span — check every bar in the lane, not just the nearest one (a bar drawn over another was a real production defect); if unsure, flag to the user instead of guessing. The "World, Year by Year" view now runs to 1900 CE (15 snapshots).
6. Update the previous chapter's "Next in the Chronicle" teaser to a live link: `<a data-goto="persia" href="#">` (the router binds `[data-goto]` present at load).
7. All internal anchors (TOC → `#pe-...`, citations → `#pe-rN`) must use the chapter prefix; references `<li id="pe-rN">` must exist for every citation.

## Content classes available
.cover .chapter-mark .sub .epigraph .dateline / .toc / .eyebrow .lead .pull .rule .next /
.scene (+ .prov provenance line) / .war (+ .tag .meta .sources) / .king (+ .name .years) /
.note / .voice (+ .v-text .v-who .v-note) / .refs / badges: b-att b-inf b-leg /
citations: `<sup class="cite"><a href="#xx-rN">[N]</a></sup>` / figures: .imgrow(.tri), .map-fig for SVG maps.

## Chapter numbering (DERIVED — never hand-assigned)
Numbers are era-scoped: {ERA}·{position} (II·3 = third chapter of the Classical World shelf). They are computed, not chosen: after ANY chapter injection, card insertion, card move, or reorder, run `python scripts/renumber.py chronicle.html`. It walks the five era shelves in DOM order, assigns every card its number, and syncs each written chapter's cover mark, data-title, and JS title. Inserting a chapter between existing ones is therefore safe — downstream numbers update automatically. Sub-shelves (E·, M·, C·, F·, In·) keep their own catalog IDs. Shelving rule: a civilization goes in the era where its STORY BEGINS (chapters begin before the buildings), not where it peaked. Teasers are always numberless ("Next — <name>"); renumber.py enforces this.

## Tap hints (micro-glossary)
For terms that don't warrant an interlude but assume knowledge, wrap the first mention:
`<span class="hint" data-hint="...">term</span>` — renders dotted-underlined; tapping opens the #hint-pop card (system already built; do not re-implement).
Rules: max ~40 words; orientation only (who/what/where); NO new contested claims, NO citations, NO numbers that would need verification beyond common reference; plain text only in data-hint (no HTML; escape quotes). Do not hint terms that have their own paragraph, chapter, or interlude — let prose or a pointer carry those. First mention per chapter only. Good candidates: peoples mentioned in passing, place/geographic terms, technical or foreign words (magus, hoplite, diorite).

## Validation
Run `scripts/validate_codex.py` at intake AND before delivery; all checks must pass. Also complete `references/chapter-checklist.md` before handing the file back.
