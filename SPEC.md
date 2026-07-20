# The Chronicle — PWA Build Specification
**For: Claude Code · Owner: Partha · Version 1.0**

---

## 1. What this project is

**The Chronicle — A Tale of Time** is a single-file, offline-first HTML book (`chronicle.html`, currently ~1.2 MB, 16 written chapters of a planned ~85) covering world history in narrative style. It is read primarily on a Samsung Galaxy S25 Ultra. It contains:

- A home view: cover art (inline SVG), title hero, "trust strip", section navigator, a "⚑ Continue reading" resume card, and the full shelf of chapter cards across 10 sections (Eras I–V, Interludes, East Asia, Epics & Myths, Great Cities, Faiths).
- One `.view` div per chapter (`#view-<slug>`) each containing `<article id="ch-<slug>">` with cover, TOC, sections, voices, connected-panel, next-teaser, and numbered references.
- Special views: `#view-tl` (vertical SVG Grand Timeline, bars tappable via `data-goto`), `#view-world` ("World, Year by Year" synchronic snapshots), `#view-search`.
- A hash-free JS router: `views` and `titles` maps, `show(slug)` function, global click binding on `[data-goto]` elements.
- localStorage state via a safe `store` wrapper: bookmark (`bm:view`, `bm:y`, `bm:label`), `lastView`, per-view scroll positions, and Aa reader settings (theme / font / zoom / line-height). **Read the exact keys from the source; do not guess.**
- Full-text search built at runtime from the DOM (articles + shelf cards + hint glossary), deferred to `requestIdleCallback`.
- Tap-hint glossary (`.hint[data-hint]` → `#hint-pop`), 6 CSS themes via `body.t-*` custom properties, 9 Google Fonts, `content-visibility:auto` on article sections.

**Critical context:** chapters are produced continuously by an AI writing pipeline (separate chats using a packaged skill) that edits **the single `chronicle.html`** and validates it with `validate_codex.py` / `renumber.py`. That pipeline is out of scope and must not be disturbed.

---

## 2. Core architectural decision (do not deviate)

> **`chronicle.html` remains the single source of truth and the authoring master. The PWA is a *derived build artifact*, produced by a deterministic build script. Never hand-edit generated chunks.**

Reasons: the entire writing/validation toolchain targets the single file; the book is unfinished and will receive new chapters for months; and the single file must remain usable standalone (it is also the offline fallback and the owner's phone-local copy).

Consequently, this project = **(a)** a build script that splits the master into an app shell + per-shelf content chunks, **(b)** a PWA shell (manifest + service worker + async chunk loader), **(c)** a CI pipeline so that dropping a new `chronicle.html` into the repo auto-builds and deploys.

---

## 3. Repository layout

```
chronicle-pwa/
├── master/
│   └── chronicle.html          # the authoring master (committed on every update)
├── build/
│   └── build.mjs               # Node build script (or build.py — builder's choice)
├── site/                       # generated output — deployed directory (gitignored or committed, CI's choice)
│   ├── index.html              # app shell
│   ├── content/
│   │   ├── era-1.html          # all chapter views of Era I
│   │   ├── era-2.html
│   │   ├── interludes.html
│   │   ├── east-asia.html
│   │   ├── epics.html
│   │   ├── cities.html
│   │   └── faiths.html
│   ├── search-index.json       # build-time search index (see §6)
│   ├── manifest-chunks.json    # chunk registry + version hash (see §7)
│   ├── app.webmanifest
│   ├── sw.js
│   └── icons/                  # generated from the book's SVG cover skyline
├── .github/workflows/deploy.yml
└── SPEC.md                     # this file
```

Hosting: **Cloudflare Pages or GitHub Pages** (owner has both). HTTPS is required for the service worker.

---

## 4. The build script (`build.mjs`)

Deterministic transform of `master/chronicle.html` → `site/`. Steps:

1. **Parse** the master (use a real HTML parser — `node-html-parser` or similar; the file is large but well-formed; the validator guarantees tag balance).
2. **Derive the chunk map from the shelf itself — never hardcode chapter lists.** Walk `#view-home`: each `.era-head` (they carry ids: `era-cradles`, `era-classical`, `era-medieval`, `era-earlymodern`, `era-modern`, `era-interludes`, `era-eastasia`, `era-epics`, `era-cities`, `era-faiths`) is followed by its chapter cards. Every ready card carries `data-ch="<slug>"`. That yields `shelfSection → [slugs]`, which defines which `#view-<slug>` divs go into which chunk file. Chapters added later are picked up automatically — this is what makes the pipeline maintenance-free.
3. **Extract** each chapter's `#view-<slug>` div (whole element) into its shelf's chunk file, concatenated, wrapped in nothing else (chunks are HTML fragments, not documents).
4. **Emit the shell** (`index.html`): the master minus the extracted chapter views. Keep in the shell: home, `#view-tl`, `#view-world`, `#view-search`, all CSS, all JS, hint-pop, everything else. The shell must remain a valid standalone page (it just has no chapter bodies yet).
5. **Patch the router in the shell** (small, surgical JS injection — see §5).
6. **Generate `search-index.json`** (see §6) and `manifest-chunks.json` with a content hash (see §7).
7. **Integrity checks (build fails on violation):**
   - Every slug in the JS `views` map exists in exactly one chunk (or the shell).
   - Every `data-goto` target in shell + all chunks resolves to a known view.
   - No duplicate element ids across shell + all chunks.
   - Chunk count and per-chunk chapter counts printed for the build log.

---

## 5. Shell runtime changes (keep minimal)

The router's `show(slug)` becomes async-aware via a loader; everything else is untouched.

```js
// injected by the build, near the router:
const CHUNKS = /* from manifest-chunks.json, inlined at build time */;
const loaded = new Set();
async function ensureChunk(slug) {
  const chunk = CHUNKS.bySlug[slug];          // undefined for shell views (home, tl, world, search)
  if (!chunk || loaded.has(chunk)) return;
  const html = await (await fetch(`content/${chunk}?v=${CHUNKS.version}`)).text();
  document.getElementById('chunk-root').insertAdjacentHTML('beforeend', html);
  loaded.add(chunk);
}
```

- `show()` awaits `ensureChunk(slug)` before switching views; a lightweight loading state (the existing theme colors, a small "opening chapter…" line) covers the fetch on first visit; cached loads are instant.
- `<div id="chunk-root">` is appended by the build where the chapter views used to live.
- **Resume/bookmark on cold start:** if `lastView`/`bm:view` points into a chunk, `ensureChunk` first, then restore scroll. Test this path explicitly.
- Search result taps and timeline-bar taps go through the same `show()` → they inherit chunk loading for free.
- The runtime search indexer currently walks the DOM; in the PWA it is **replaced** by loading `search-index.json` (all eras searchable even before their chunks are fetched). Keep the same result-rendering and element-jump code: on tap, load chunk, then locate by section id.

---

## 6. Search index (build-time)

For each article section, shelf card, and hint, emit: `{ view, chTitle, secTitle, secId, text }` — mirroring the runtime index's shape so the existing search UI code needs only a data-source swap. Est. size ~1–2 MB at full book; ship gzipped (hosting does this) and load it lazily on first search open, not at boot.

---

## 7. Service worker, versioning, and the ongoing-update flow

**This is the answer to "the book grows for months — how do updates work."**

- `manifest-chunks.json` contains `{ version: <content-hash of master>, chunks: {...}, bySlug: {...} }`. The build stamps the hash into the SW file too (`const VERSION = '...'`).
- **SW strategy:** precache the shell + manifest on install; **cache-first with background revalidate** for chunks and the search index, keyed by `?v=` version. On activate, purge caches from older versions.
- **Update UX:** the shell fetches `manifest-chunks.json` (network-first, tiny) on each launch. If its version ≠ the running version: show a small toast in the book's own style — *"New chapters have been added — tap to update"* — which calls `registration.update()` + reload. Never force-reload mid-reading.
- **Full offline:** after the SW has revalidated all chunks once (do an idle-time background warm of every chunk after first launch), the entire book reads offline, forever, until the next update.
- localStorage is origin-scoped: bookmarks/settings persist across every update automatically. (Note: state from the old `file://` copy does **not** migrate — the owner starts fresh once on the hosted version; say so in the README.)

**The ongoing pipeline, end to end:**
1. Writing chats keep producing → owner receives updated `chronicle.html` (single file, as today).
2. Owner commits it to `master/chronicle.html` (drag-drop on github.com is fine).
3. GitHub Action: run build → run integrity checks → deploy `site/` to Pages/Cloudflare.
4. SW version bumps automatically (content hash); readers get the update toast.

One file in, deployed book out. Nothing about the authoring workflow changes.

---

## 8. PWA packaging

- `app.webmanifest`: name "The Chronicle — A Tale of Time", short name "Chronicle", `display: standalone`, `background_color`/`theme_color` from the parchment theme (read the CSS custom properties), portrait orientation, icons 192/512 + maskable — **generate icons from the book's existing SVG cover skyline** (extract it from the master; render via `sharp` or `resvg`).
- iOS meta tags (`apple-mobile-web-app-*`, apple-touch-icon) for completeness.
- Register SW from the shell; standard install-prompt handling (a subtle "Add to home screen" hint in the Aa settings sheet, not a nag banner).

---

## 9. Phasing & acceptance criteria

**Phase 1 — Split + loader (no SW):** deployed site; all chapters open via chunk loading; bookmarks, resume, settings, search, timeline, world view, hints, themes all function identically to the single file. *Acceptance: side-by-side behavioral parity walk-through on the S25 Ultra; build integrity checks green.*

**Phase 2 — PWA:** SW offline caching, install, icons. *Acceptance: airplane-mode full read after one online session; Lighthouse PWA installable pass.*

**Phase 3 — Update loop:** CI deploy on push; version toast verified by shipping a dummy chapter change end-to-end.

**Global invariants (violating any of these is a bug):**
- No visual or typographic redesign — the book's look is final and owner-approved.
- No edits to chapter HTML content during build beyond extraction.
- No frameworks; the shell stays vanilla, as the master is.
- `chronicle.html` must remain openable standalone at all times.
- The build must be rerunnable by CI with zero manual steps.

---

## 10. Addendum (v1.1) — the authoring master is now a folder
Decision made post-v1.0: the authoring side has ALREADY adopted the split. The repo's `master/` directory contains `shell.html` + `content/*.html` (same chunk boundaries as §3), maintained by the writing pipeline via `codexfs.py` (assemble/split live in the authoring skill — reuse it, don't reimplement). Consequences for the build: the "split" step of §4 is already done upstream — the build consumes the folder directly (shell patch, search index, manifest, SW). `chronicle-complete.html` (single-file artifact, produced by `assemble.py`) should still be generated and published at the site root as the durable share-anywhere fallback.

## 11. Out of scope

Chapter writing, editing, validation, numbering (owned by the authoring pipeline); EPUB export (separate future project); any CMS/admin UI; analytics of any kind (this is a private, ad-free, tracker-free book).
