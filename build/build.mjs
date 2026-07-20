#!/usr/bin/env node
/**
 * The Chronicle — PWA build.
 *
 * Deterministic transform of the authoring master folder (master/shell.html +
 * master/content/*.html) into the deployable site/ directory:
 *
 *   - site/index.html            app shell, router patched for async chunk loading
 *   - site/content/*.html        chapter chunks, copied through verbatim
 *   - site/search-index.json     build-time search index (mirrors runtime shape)
 *   - site/manifest-chunks.json  { version, chunks, bySlug }
 *   - site/app.webmanifest       PWA manifest
 *   - site/sw.js                 service worker (VERSION stamped in)
 *   - site/icons/*.png           icons rendered from the cover skyline SVG
 *   - site/chronicle-complete.html  standalone single-file fallback (assemble.py)
 *
 * The master is the single source of truth. Chapter HTML is never edited here
 * beyond extraction; the shell patch is injection-only so the standalone file
 * keeps its own runtime search indexer.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parse } from 'node-html-parser';
import { Resvg } from '@resvg/resvg-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTER = join(ROOT, 'master');
const CONTENT = join(MASTER, 'content');
const SITE = join(ROOT, 'site');

// Canonical section order (from codexfs.py). This is a fixed list of shelf
// sections, NOT a chapter list — chapters are discovered by scanning views.
const ORDER = ['era-1', 'era-2', 'era-3', 'era-4', 'era-5',
  'interludes', 'east-asia', 'epics', 'cities', 'faiths'];

const SHELL_VIEWS = new Set(['home', 'search', 'world', 'tl']);

function die(msg) { console.error('\n✗ build failed: ' + msg + '\n'); process.exit(1); }
function log(msg) { console.log(msg); }

/** Replace `find` in `str` exactly once; fail the build otherwise. */
function replaceOnce(str, find, repl, label) {
  const parts = str.split(find);
  if (parts.length !== 2) die(`expected exactly one "${label}" anchor, found ${parts.length - 1}`);
  return parts[0] + repl + parts[1];
}

// ---------------------------------------------------------------------------
// 1. Read the master
// ---------------------------------------------------------------------------
if (!existsSync(join(MASTER, 'shell.html'))) die('master/shell.html not found');
const shellSrc = readFileSync(join(MASTER, 'shell.html'), 'utf8');

const chunkFiles = ORDER
  .map((name) => ({ name, file: name + '.html', path: join(CONTENT, name + '.html') }))
  .filter((c) => existsSync(c.path))
  .map((c) => ({ ...c, src: readFileSync(c.path, 'utf8') }));

if (!chunkFiles.length) die('no content chunks found in master/content/');

// ---------------------------------------------------------------------------
// 2. Content hash (version) over the whole master, order-stable
// ---------------------------------------------------------------------------
const hash = createHash('sha256');
hash.update(shellSrc);
for (const c of chunkFiles) hash.update('\0' + c.name + '\0').update(c.src);
const VERSION = hash.digest('hex').slice(0, 12);

// ---------------------------------------------------------------------------
// 3. Map every chapter view to its chunk file (scan id="view-<slug>")
// ---------------------------------------------------------------------------
const viewLocation = new Map(); // slug -> chunk file (or '<shell>')
function recordViews(html, where) {
  for (const m of html.matchAll(/id="view-([a-z0-9-]+)"/g)) {
    const slug = m[1];
    if (viewLocation.has(slug)) {
      die(`duplicate view id "view-${slug}" in ${where} and ${viewLocation.get(slug)}`);
    }
    viewLocation.set(slug, where);
  }
}
recordViews(shellSrc, '<shell>');
for (const c of chunkFiles) recordViews(c.src, c.file);

const bySlug = {};       // chapter slug -> chunk file
const chunkList = [];    // chunk file names (in ORDER)
for (const c of chunkFiles) chunkList.push(c.file);
for (const [slug, where] of viewLocation) {
  if (where !== '<shell>') bySlug[slug] = where;
}
const CHUNKS = { version: VERSION, chunks: chunkList, bySlug };

// ---------------------------------------------------------------------------
// 4. Integrity checks (§4.7) — fail the build on any violation
// ---------------------------------------------------------------------------
const viewsBlock = (shellSrc.match(/var views = \{([\s\S]*?)\};/) || [])[1];
if (!viewsBlock) die('could not locate the JS `views` map in the shell');
const viewSlugs = new Set([...viewsBlock.matchAll(/view-([a-z0-9-]+)/g)].map((m) => m[1]));

// (a) every slug in views resolves to exactly one location
for (const slug of viewSlugs) {
  if (!viewLocation.has(slug)) die(`views map slug "${slug}" has no matching #view-${slug} div`);
}
// (b) every chapter view div is registered in the views map
for (const [slug] of viewLocation) {
  if (!viewSlugs.has(slug)) die(`#view-${slug} exists but is missing from the views map`);
}
// (c) data-ch on shelf cards must resolve (these are live navigation targets);
//     data-goto may legitimately point at planned-but-unwritten chapters, which
//     the runtime router falls back to home for — collect those as warnings.
const allHtml = shellSrc + '\n' + chunkFiles.map((c) => c.src).join('\n');
for (const m of allHtml.matchAll(/data-ch="([a-z0-9-]+)"/g)) {
  if (!viewSlugs.has(m[1])) die(`data-ch card target "${m[1]}" is not a known view`);
}
const forwardRefs = new Set();
for (const m of allHtml.matchAll(/data-goto="([a-z0-9-]+)"/g)) {
  if (!viewSlugs.has(m[1])) forwardRefs.add(m[1]);
}
// (d) no duplicate element ids across shell + all chunks
const seenIds = new Map();
function checkIds(html, where) {
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) {
    const id = m[1];
    if (seenIds.has(id)) die(`duplicate element id "${id}" in ${where} and ${seenIds.get(id)}`);
    seenIds.set(id, where);
  }
}
checkIds(shellSrc, '<shell>');
for (const c of chunkFiles) checkIds(c.src, c.file);

// ---------------------------------------------------------------------------
// 5. Build the search index (mirrors the runtime index shape)
// ---------------------------------------------------------------------------
function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
const index = [];
function indexView(viewEl) {
  const id = viewEl.getAttribute('id') || '';
  const view = id.replace('view-', '');
  for (const art of viewEl.querySelectorAll('article')) {
    const chTitle = art.getAttribute('data-title') || view;
    for (const sec of art.querySelectorAll('section')) {
      const head = sec.querySelector('h2, h3');
      const secTitle = head ? norm(head.text) : chTitle;
      index.push({ view, chTitle, secTitle, secId: sec.getAttribute('id') || '', text: norm(sec.text) });
    }
  }
  for (const h of viewEl.querySelectorAll('.hint')) {
    index.push({
      view, chTitle: 'Glossary', secTitle: norm(h.text), secId: '',
      text: norm(h.text) + ' — ' + norm(h.getAttribute('data-hint') || ''),
    });
  }
}
const shellDoc = parse(shellSrc);
for (const v of shellDoc.querySelectorAll('.view')) {
  const id = v.getAttribute('id') || '';
  if (id === 'view-home' || id === 'view-search') continue; // home = cards below; search = empty
  indexView(v);
}
// shelf cards (written + planned) — every name on the shelf is findable
const home = shellDoc.querySelector('#view-home');
if (home) {
  for (const card of home.querySelectorAll('.chap')) {
    const h4 = card.querySelector('h4');
    if (!h4) continue;
    index.push({ view: 'home', chTitle: 'The Shelf', secTitle: norm(h4.text), secId: '', text: norm(card.text) });
  }
}
for (const c of chunkFiles) {
  const doc = parse(c.src);
  for (const v of doc.querySelectorAll('.view')) indexView(v);
}

// ---------------------------------------------------------------------------
// 6. Patch the shell into the app shell (injection-only)
// ---------------------------------------------------------------------------
let shell = shellSrc;

// 6a. chunk mount point where the chapter views used to sit
shell = replaceOnce(shell, '<!-- @CHAPTER-CHUNKS -->', '<div id="chunk-root"></div>', '@CHAPTER-CHUNKS');

// 6b. head: manifest, iOS meta, icons, PWA styles
const headInject = `
<link rel="manifest" href="app.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Chronicle">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="icons/icon-512.png">
<style id="pwa-style">
  #chunk-loading{position:fixed;left:50%;top:calc(var(--topbar-h) + 18px);transform:translateX(-50%);
    background:var(--topbar-bg,rgba(245,237,221,.96));color:var(--ink-soft);
    border:1px solid var(--sand-deep);border-radius:20px;padding:6px 16px;
    font-family:'Barlow Condensed',sans-serif;font-size:14px;letter-spacing:.05em;
    z-index:80;opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 4px 16px var(--shadow);}
  #chunk-loading.show{opacity:1;}
  #update-toast{position:fixed;left:12px;right:12px;bottom:16px;margin:0 auto;max-width:420px;
    background:var(--ink);color:var(--paper);border-radius:12px;padding:12px 16px;
    font-family:'Barlow Condensed',sans-serif;font-size:15px;letter-spacing:.02em;text-align:center;cursor:pointer;
    z-index:90;opacity:0;transform:translateY(20px);pointer-events:none;transition:.25s;box-shadow:0 6px 24px var(--shadow);}
  #update-toast.show{opacity:1;transform:none;pointer-events:auto;}
  #btn-install{display:none;width:100%;margin-top:8px;padding:11px;border:1px solid var(--sand-deep);
    background:var(--sand);color:var(--ink);border-radius:8px;
    font-family:'Barlow Condensed',sans-serif;font-size:14.5px;letter-spacing:.03em;cursor:pointer;}
  #btn-install.show{display:block;}
</style>
</head>`;
shell = replaceOnce(shell, '</head>', headInject, '</head>');

// 6c. body elements (loading pill + update toast), just before the main script
const MAIN_SCRIPT = '<script>\n(function(){';
const bodyInject = `<div id="chunk-loading">opening chapter…</div>
<div id="update-toast">New chapters have been added — tap to update</div>
${MAIN_SCRIPT}`;
shell = replaceOnce(shell, MAIN_SCRIPT, bodyInject, 'main <script>');

// 6d. install hint inside the settings sheet (before the sheet's closing div)
shell = replaceOnce(shell,
  `    <button class="lh-btn" data-lh="1.95">Relaxed</button>
  </div>
</div>`,
  `    <button class="lh-btn" data-lh="1.95">Relaxed</button>
  </div>
  <div class="set-h">This Book</div>
  <button id="btn-install">⤓ Add to home screen</button>
</div>`,
  'settings sheet close');

// 6e. rename the synchronous router core
shell = replaceOnce(shell, '  function show(name, opts){', '  function _showCore(name, opts){', 'show() def');

// 6f. inject the async loader + show() wrapper right after barTitle
const loaderJs = `  var barTitle = document.getElementById('bar-title');

  /* ---------- PWA chunk loader (injected by build) ---------- */
  var CHUNKS = ${JSON.stringify(CHUNKS)};
  var loaded = new Set();
  var inflight = {};
  var swWaiting = null;
  function showLoading(on){
    var el = document.getElementById('chunk-loading');
    if (el) el.classList.toggle('show', !!on);
  }
  function onChunkInserted(view){ if (view) addReadTimes(view); }
  function ensureChunk(name){
    var chunk = CHUNKS.bySlug[name];
    if (!chunk || loaded.has(chunk)) return Promise.resolve();
    if (inflight[chunk]) return inflight[chunk];
    var p = fetch('content/' + chunk + '?v=' + CHUNKS.version)
      .then(function(r){ if (!r.ok) throw new Error('chunk ' + chunk); return r.text(); })
      .then(function(html){
        document.getElementById('chunk-root').insertAdjacentHTML('beforeend', html);
        loaded.add(chunk); delete inflight[chunk];
        onChunkInserted(document.getElementById('view-' + name));
      })
      .catch(function(e){ delete inflight[chunk]; throw e; });
    inflight[chunk] = p;
    return p;
  }
  function show(name, opts){
    opts = opts || {};
    if (!views[name]) name = 'home';
    if (name === 'search') loadIndex();
    var chunk = CHUNKS.bySlug[name];
    if (!chunk || loaded.has(chunk)) { _showCore(name, opts); return Promise.resolve(); }
    showLoading(true);
    return ensureChunk(name)
      .then(function(){ showLoading(false); _showCore(name, opts); })
      .catch(function(){ showLoading(false); _showCore('home', opts); });
  }
`;
shell = replaceOnce(shell, '  var barTitle = document.getElementById(\'bar-title\');', loaderJs, 'barTitle anchor');

// 6g. replace the runtime DOM search indexer with a lazy JSON loader
const idxStart = shell.indexOf('  /* ---------- search (built from live DOM) ---------- */');
const idxEnd = shell.indexOf('  var sInput = document.getElementById(\'s-input\');');
if (idxStart === -1 || idxEnd === -1 || idxEnd < idxStart) die('could not locate the search indexer block');
const searchLoader = `  /* ---------- search (build-time index, loaded lazily) ---------- */
  var index = null, indexLoading = null;
  function loadIndex(){
    if (index) return Promise.resolve(index);
    if (indexLoading) return indexLoading;
    indexLoading = fetch('search-index.json?v=' + CHUNKS.version)
      .then(function(r){ return r.json(); })
      .then(function(rows){
        index = rows.map(function(it){ it.lower = (it.text || '').toLowerCase(); return it; });
        return index;
      })
      .catch(function(){ index = []; return index; });
    return indexLoading;
  }
`;
shell = shell.slice(0, idxStart) + searchLoader + shell.slice(idxEnd);

// 6h. guard the search input handler against a not-yet-loaded index
shell = replaceOnce(shell,
  `  sInput.addEventListener('input', function(){
    var q = sInput.value.trim().toLowerCase();`,
  `  sInput.addEventListener('input', function(){
    if (!index) { loadIndex().then(function(){ sInput.dispatchEvent(new Event('input')); }); return; }
    var q = sInput.value.trim().toLowerCase();`,
  'search input handler');

// 6i. search result tap: navigate (async chunk load), then jump by section id
shell = replaceOnce(shell,
  `      div.addEventListener('click', function(){
        show(h.item.view, { scrollTo: 0 });
        var target = h.item.el || (h.item.secId ? document.getElementById(h.item.secId) : null);
        if (target) setTimeout(function(){ target.scrollIntoView(); window.scrollBy(0,-60); }, 40);
      });`,
  `      div.addEventListener('click', function(){
        show(h.item.view, { scrollTo: 0 }).then(function(){
          var target = h.item.secId ? document.getElementById(h.item.secId) : null;
          if (target) { target.scrollIntoView(); window.scrollBy(0,-60); }
        });
      });`,
  'search tap handler');

// 6j. read-time: turn the one-shot pass into a reusable per-root function
shell = replaceOnce(shell,
  `  /* ---------- reading time + back to top ---------- */
  document.querySelectorAll('article').forEach(function(art){
    var words = art.textContent.trim().split(/\\s+/).length;
    var mins = Math.max(1, Math.round(words / 220));
    var mark = art.querySelector('.chapter-mark');
    if (mark) {
      var span = document.createElement('span');
      span.className = 'readtime';
      span.textContent = '\\u00b7 ~' + mins + ' min read';
      mark.appendChild(span);
    }
  });`,
  `  /* ---------- reading time (runs on the shell + each chunk as it loads) ---------- */
  function addReadTimes(root){
    root.querySelectorAll('article').forEach(function(art){
      if (art.dataset.rt) return; art.dataset.rt = '1';
      var words = art.textContent.trim().split(/\\s+/).length;
      var mins = Math.max(1, Math.round(words / 220));
      var mark = art.querySelector('.chapter-mark');
      if (mark) {
        var span = document.createElement('span');
        span.className = 'readtime';
        span.textContent = '\\u00b7 ~' + mins + ' min read';
        mark.appendChild(span);
      }
    });
  }`,
  'read-time block');

// 6j-bis. [data-goto] must use event delegation: chapter chunks (and their
// cross-reference links) are inserted after init, so the one-time querySelectorAll
// binding would never reach them. Hints already delegate on document; do the same here.
shell = replaceOnce(shell,
  `  document.querySelectorAll('[data-goto]').forEach(function(el){
    el.addEventListener('click', function(e){ e.preventDefault(); show(el.getAttribute('data-goto')); });
  });`,
  `  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-goto]');
    if (el) { e.preventDefault(); show(el.getAttribute('data-goto')); }
  });`,
  'data-goto delegation');

// 6k. init tail: read-times on shell, restore last view, boot PWA
shell = replaceOnce(shell,
  `  if (window.requestIdleCallback) { requestIdleCallback(buildIndex, { timeout: 4000 }); }
  else { setTimeout(buildIndex, 600); }
  var last = store.get('lastView');
  if (last && views[last] && last !== 'search') { show(last); } else { show('home'); }`,
  `  addReadTimes(document);
  var last = store.get('lastView');
  if (last && views[last] && last !== 'search') { show(last); } else { show('home'); }

  /* ---------- PWA boot: service worker, offline warm, update check, install ---------- */
  function showUpdateToast(){
    var t = document.getElementById('update-toast');
    if (!t) return;
    t.classList.add('show');
    t.onclick = function(){
      if (swWaiting) { swWaiting.postMessage({ type: 'SKIP_WAITING' }); }
      else { window.location.reload(); }
    };
  }
  function bootPWA(){
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(function(reg){
        reg.addEventListener('updatefound', function(){
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function(){
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              swWaiting = reg.waiting || nw; showUpdateToast();
            }
          });
        });
      }).catch(function(){});
      var reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', function(){
        if (reloaded) return; reloaded = true; window.location.reload();
      });
    }
    // idle-time warm: prime the cache with every chunk + the index for full offline
    var warm = function(){
      CHUNKS.chunks.forEach(function(c){ fetch('content/' + c + '?v=' + CHUNKS.version).catch(function(){}); });
      fetch('search-index.json?v=' + CHUNKS.version).catch(function(){});
    };
    if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 8000 }); else setTimeout(warm, 3000);
    // update check: if the deployed manifest version differs from ours, offer the toast
    fetch('manifest-chunks.json', { cache: 'no-store' })
      .then(function(r){ return r.json(); })
      .then(function(m){ if (m && m.version && m.version !== CHUNKS.version) showUpdateToast(); })
      .catch(function(){});
    // install prompt (subtle, lives in the Aa settings sheet)
    var deferred = null;
    var ib = document.getElementById('btn-install');
    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault(); deferred = e; if (ib) ib.classList.add('show');
    });
    if (ib) ib.addEventListener('click', function(){
      if (!deferred) return;
      deferred.prompt(); deferred = null; ib.classList.remove('show');
    });
  }
  bootPWA();`,
  'init tail');

// ---------------------------------------------------------------------------
// 7. Icons — render from the cover skyline SVG
// ---------------------------------------------------------------------------
const coverMatch = shellSrc.match(/<div class="cover-art">(<svg[\s\S]*?<\/svg>)<\/div>/);
if (!coverMatch) die('could not locate the cover skyline SVG');
const VARS = {
  '--gold': '#bd9433', '--ink-soft': '#4a423a', '--clay-deep': '#9c5a37',
  '--clay': '#c07b52', '--paper': '#f5eddd', '--ink': '#241f1a',
  '--sand-deep': '#ddceb2', '--sand': '#ece2cf', '--reed': '#7d8a5c',
};
let skyline = coverMatch[1].replace(/var\((--[a-z-]+)\)/g, (_, v) => VARS[v] || '#4a423a');
// strip the outer <svg ...> / </svg>; keep the children only
const inner = skyline.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

function iconSvg(pad) {
  const w = 512 * (1 - pad * 2);
  const s = w / 900;
  const h = 262 * s;
  const x = (512 - w) / 2;
  const y = (512 - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
    `<rect width="512" height="512" fill="${VARS['--paper']}"/>` +
    `<g transform="translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${s.toFixed(4)})">${inner}</g></svg>`;
}
function renderPng(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

// ---------------------------------------------------------------------------
// 8. Emit site/
// ---------------------------------------------------------------------------
rmSync(SITE, { recursive: true, force: true });
mkdirSync(join(SITE, 'content'), { recursive: true });
mkdirSync(join(SITE, 'icons'), { recursive: true });

writeFileSync(join(SITE, 'index.html'), shell);
for (const c of chunkFiles) writeFileSync(join(SITE, 'content', c.file), c.src);
writeFileSync(join(SITE, 'search-index.json'), JSON.stringify(index));
writeFileSync(join(SITE, 'manifest-chunks.json'), JSON.stringify(CHUNKS, null, 2));

// webmanifest (theme/background from the parchment CSS custom properties)
const webmanifest = {
  name: 'The Chronicle — A Tale of Time',
  short_name: 'Chronicle',
  description: 'The whole human story, told slowly and in full.',
  start_url: '.',
  scope: '.',
  display: 'standalone',
  orientation: 'portrait',
  background_color: VARS['--paper'],
  theme_color: VARS['--paper'],
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
writeFileSync(join(SITE, 'app.webmanifest'), JSON.stringify(webmanifest, null, 2));

// service worker, VERSION stamped in
const swTemplate = readFileSync(join(ROOT, 'build', 'templates', 'sw.js'), 'utf8');
writeFileSync(join(SITE, 'sw.js'), swTemplate.replace(/__VERSION__/g, VERSION));

// icons
writeFileSync(join(SITE, 'icons', 'icon-192.png'), renderPng(iconSvg(0.10), 192));
writeFileSync(join(SITE, 'icons', 'icon-512.png'), renderPng(iconSvg(0.10), 512));
writeFileSync(join(SITE, 'icons', 'icon-maskable-512.png'), renderPng(iconSvg(0.20), 512));

// standalone single-file fallback (reuse assemble.py — do not reimplement)
execFileSync('python3', [join(ROOT, 'tools', 'assemble.py'), MASTER, join(SITE, 'chronicle-complete.html')],
  { stdio: 'inherit' });

// ---------------------------------------------------------------------------
// 9. Build log
// ---------------------------------------------------------------------------
const perChunk = chunkFiles.map((c) =>
  `${c.name}: ${Object.values(bySlug).filter((f) => f === c.file).length}`).join(', ');
log('');
log('✓ Chronicle PWA build complete');
log(`  version        ${VERSION}`);
log(`  chunks         ${chunkFiles.length} (${perChunk})`);
log(`  chapters       ${Object.keys(bySlug).length}`);
log(`  shell views    ${[...viewLocation].filter(([, w]) => w === '<shell>').map(([s]) => s).join(', ') || '(none)'}`);
log(`  search rows    ${index.length}`);
log(`  integrity      all checks passed`);
if (forwardRefs.size) {
  log(`  forward refs   ${[...forwardRefs].sort().join(', ')}`);
  log(`                 (data-goto links to planned chapters; router falls back to home — expected)`);
}
log('');
