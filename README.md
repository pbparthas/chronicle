# The Chronicle — PWA

An offline-first, installable Progressive Web App for **The Chronicle — A Tale of
Time**, a single-file narrative history book. The book itself remains the source
of truth; this repo is the **deterministic build** that turns it into an
installable, offline-capable app that keeps working while the book grows.

## How it works

```
master/            ← the authoring master (source of truth)
  shell.html         app shell + all CSS/JS; <!-- @CHAPTER-CHUNKS --> marks where chapters sit
  content/*.html     chapter views, grouped by shelf section (era-1, era-2, epics, …)
tools/             ← the authoring pipeline's own scripts, reused verbatim (not reimplemented)
  codexfs.py, assemble.py, validate_codex.py, renumber.py
build/
  build.mjs          the deterministic transform: master/ → site/
  templates/sw.js    service-worker template (VERSION stamped in at build time)
site/              ← generated output, deployed to GitHub Pages (gitignored)
.github/workflows/deploy.yml
```

`build/build.mjs` consumes the `master/` folder directly (the authoring side
already maintains the split) and emits `site/`:

- **`index.html`** — the app shell, with a small, injection-only router patch:
  `show()` becomes async and loads the chapter's chunk on first visit; the
  runtime DOM search indexer is swapped for a prebuilt JSON index; `[data-goto]`
  links use event delegation so links inside lazily-loaded chapters work; the
  service worker, manifest, icons, update toast, and install hint are wired in.
- **`content/*.html`** — chapter chunks, copied through **verbatim** (chapter HTML
  is never edited during the build).
- **`search-index.json`** — full-text index, loaded lazily on first search.
- **`manifest-chunks.json`** — `{ version, chunks, bySlug }`; `version` is a
  content hash of the whole master and is stamped into `sw.js` too.
- **`app.webmanifest`**, **`sw.js`**, **`icons/`** — icons are rendered from the
  book's own cover skyline SVG.
- **`chronicle-complete.html`** — the standalone single-file book (produced by
  `tools/assemble.py`), published at the site root as the durable
  share-anywhere / offline fallback. It keeps its own runtime search indexer and
  is unaffected by the shell patch.

The chunk map is **derived by scanning the views**, never hardcoded — chapters
added later are picked up automatically.

### Integrity checks (the build fails on any violation)

- every slug in the JS `views` map resolves to exactly one chunk (or the shell);
- every chapter view div is registered in the `views` map;
- every `data-ch` shelf-card target is a known view (`data-goto` may point at
  planned-but-unwritten chapters — the router falls back to home, as it always has);
- no duplicate element ids across the shell + all chunks.

The standalone fallback is additionally run through `tools/validate_codex.py` in CI.

## The ongoing update loop

1. Writing chats produce an updated master (single file, or the `master/` folder).
2. You commit it to this repo (`master/`) — drag-and-drop on github.com is fine.
3. GitHub Actions rebuilds → runs integrity checks → deploys `site/` to Pages.
4. The SW version bumps automatically (content hash). On next launch each reader
   sees a small in-theme toast — *"New chapters have been added — tap to update"* —
   which swaps to the new version and reloads. Reading is never interrupted.

Nothing about the authoring workflow changes: **one file in, deployed book out.**

## Local build

```bash
npm ci            # Node 20+, Python 3 on PATH (for assemble.py)
npm run build     # → site/
npm test          # drives site/ in headless Chromium (parity + offline checks)
```

Serve `site/` over HTTP (a service worker needs http/https, not `file://`), e.g.
`npx serve site` or `python3 -m http.server -d site`.

## Deploying (GitHub Pages)

One-time: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
After that, every push to `main` that touches `master/`, `build/`, or `tools/`
redeploys automatically. The output is a plain static folder, so switching to
Cloudflare Pages later is trivial.

## The Map of Time (Phase 4)

A PWA-only interactive historical-borders map (`#view-map`), injected into the
shell at build time — it never enters the authoring master or the standalone
`chronicle-complete.html`. A vanilla canvas renderer (no framework, ~14 KB)
loads lazily on first open, along with era-chunked border data:

- **Data:** [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria)
  polity borders (CC BY 4.0) + [Natural Earth](https://www.naturalearthdata.com/)
  land (public domain), simplified and delta-encoded by `build/map-prep.mjs`
  into `mapdata/era-*.json` (committed; 22 KB–1.2 MB gzipped per era — CI never
  downloads external data). Re-run `node build/map-prep.mjs` to refresh.
- **UI:** year slider snapping to actual border-change years, play button,
  era preset chips matching the shelves ("First Cradles" → 2500 BCE), pinch/pan,
  tap a polity for name + dates — and a "Read its chapter →" button when the
  polity maps to a written chapter.
- **`mapdata/map-links.json`** is the curated polity→chapter mapping (optionally
  year-constrained, e.g. Babylonia before/after 1595 BCE). Entries pointing at
  unwritten chapters are held back automatically until the chapter lands —
  grow the file freely as the book grows.
- **Offline:** map chunks inherit the service worker's cache-first strategy
  after first use; any mapdata change bumps the build version and triggers the
  update toast.
- **Credits:** `#view-about` (linked from the map's attribution line) credits
  Cliopatria, Natural Earth, and the book's sources.

## Notes

- **No visual or content changes.** The book's look, typography, and chapter HTML
  are untouched; this repo only splits, wires offline support, and deploys.
- **First-run state.** Bookmarks and reader settings live in `localStorage`, which
  is scoped to the hosted origin and persists across every update. State from an
  old `file://` copy of `chronicle.html` does **not** migrate — you start fresh
  once on the hosted version, then it sticks forever.
- **Offline.** After one online session (the app warms every chunk in the
  background at idle), the whole book reads offline in airplane mode until the
  next update.
