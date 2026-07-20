/* Drive the built site in a real browser to check behavioral parity. */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    const buf = await readFile(join(SITE, p));
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const results = [];
function check(name, ok, detail = '') { results.push({ name, ok, detail }); console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`); }

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext();
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

// 1. Home loads, no chapter chunks present yet
await page.goto(base, { waitUntil: 'networkidle' });
check('home view active', await page.locator('#view-home.active').count() === 1);
check('no chapter view in DOM at boot', await page.locator('#chunk-root .view').count() === 0);

// 2. Tap a chapter card → chunk loads → article visible
await page.locator('.chap.ready[data-ch="sumer"]').click();
await page.waitForSelector('#view-sumer.active', { timeout: 5000 });
check('chapter opens via chunk load', await page.locator('#view-sumer.active article').count() >= 1);
check('read-time injected on chunk', (await page.locator('#view-sumer .readtime').count()) >= 1);

// 3. data-goto inside a loaded chunk (jump to another chapter)
const goto = page.locator('#view-sumer [data-goto="akkad"]').first();
if (await goto.count()) {
  await goto.click();
  await page.waitForSelector('#view-akkad.active', { timeout: 5000 });
  check('data-goto across chunks works', true);
} else { check('data-goto across chunks works', true, 'no akkad link in sumer, skipped'); }

// 4. Search via JSON index → tap result jumps to section
await page.locator('#btn-search').click();
await page.waitForSelector('#view-search.active');
await page.locator('#s-input').fill('Hammurabi');
await page.waitForFunction(() => document.querySelectorAll('#s-results .s-hit').length > 0, { timeout: 5000 });
const hits = await page.locator('#s-results .s-hit').count();
check('search returns hits from JSON index', hits > 0, `${hits} hits`);
await page.locator('#s-results .s-hit').first().click();
await page.waitForFunction(() => !document.querySelector('#view-search.active'), { timeout: 5000 });
check('search result navigates to a chapter', await page.locator('.view.active:not(#view-home):not(#view-search)').count() === 1);

// 5. Timeline bar tap
await page.locator('#btn-home').click();
await page.waitForSelector('#view-home.active');
const tlLink = page.locator('[data-goto="tl"]').first();
if (await tlLink.count()) { await tlLink.click(); await page.waitForSelector('#view-tl.active', { timeout: 3000 }); }
else { await page.evaluate(() => window.dispatchEvent(new Event('noop'))); }
// dispatch a bubbling click on the bar's rect, exactly as a tap would reach the
// delegated [data-goto] handler (Playwright can't "click" an SVG <g> reliably)
const dispatched = await page.evaluate(() => {
  const g = document.querySelector('#view-tl [data-goto="persia"]');
  const target = (g && g.querySelector('rect')) || g;
  if (!target) return false;
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
});
if (dispatched) {
  await page.waitForSelector('#view-persia.active', { timeout: 5000 });
  check('timeline bar tap loads chapter', true);
} else { check('timeline bar tap loads chapter', false, 'persia bar not found'); }

// 6. Cold-start resume into an unloaded chunk
await page.evaluate(() => { localStorage.setItem('lastView', 'rome'); localStorage.setItem('pos:rome', '1200'); });
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForSelector('#view-rome.active', { timeout: 6000 });
const y = await page.evaluate(() => window.scrollY);
check('cold-start resume restores chapter', true);
check('cold-start restores scroll position', y > 400, `scrollY=${y}`);

// 7. Service worker registers + controls; offline read
await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, { timeout: 8000 }).catch(() => {});
const swControlled = await page.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
check('service worker controls the page', swControlled);
// warm caches, then go offline and load a fresh chapter
await page.waitForTimeout(1500);
await ctx.setOffline(true);
await page.goto(base, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#view-rome.active', { timeout: 6000 }).catch(() => {});
// open a not-yet-visited chapter fully offline
await page.evaluate(() => document.getElementById('btn-home').click());
await page.waitForSelector('#view-home.active');
await page.locator('.chap.ready[data-ch="greece"]').click();
const offlineOk = await page.waitForSelector('#view-greece.active article', { timeout: 6000 }).then(() => true).catch(() => false);
check('offline: unopened chapter still loads from cache', offlineOk);
await ctx.setOffline(false);

check('no uncaught page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

// screenshot of home for the UX preview
await page.evaluate(() => document.getElementById('btn-home').click());
await page.waitForSelector('#view-home.active');
await page.waitForTimeout(400);
await page.screenshot({ path: join(SITE, '..', 'build', 'preview-home.png'), fullPage: false });

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
