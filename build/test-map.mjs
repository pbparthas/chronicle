/* Drive the Map of Time view in a real browser. */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
function check(name, ok, detail = '') { results.push(ok); console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`); }

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(base, { waitUntil: 'networkidle' });

// 1. home has the map nav card
check('map nav card on home', await page.locator('[data-goto="map"]').count() >= 1);

// 2. open map → module lazy-loads, era-1 preset renders
await page.locator('.world-cta[data-goto="map"]').click();
await page.waitForSelector('#view-map.active', { timeout: 8000, state: 'attached' });
await page.waitForFunction(() => window.ChronicleMap && document.querySelectorAll('#map-chips button').length === 5, { timeout: 8000 });
check('map module loaded, 5 era chips', true);
await page.waitForFunction(() => document.getElementById('map-year').textContent.includes('BCE'), { timeout: 8000 });
const year1 = await page.evaluate(() => document.getElementById('map-year').textContent);
check('First Cradles preset year', year1.includes('2500 BCE'), year1);

// canvas actually painted polities (non-background pixels present)
const painted = await page.evaluate(() => {
  const c = document.getElementById('map-canvas');
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  const colors = new Set();
  for (let i = 0; i < d.length; i += 1013 * 4) colors.add(`${d[i]},${d[i + 1]},${d[i + 2]}`);
  return colors.size;
});
check('canvas painted with multiple colors', painted > 3, `${painted} sampled colors`);

// 3. era chip → Classical, tap Persia (55E, 32N at 450 BCE) → popover → chapter
await page.locator('#map-chips button[data-era="era-2"]').click();
await page.waitForFunction(() => document.getElementById('map-year').textContent.includes('450 BCE'), { timeout: 8000 });
await page.waitForTimeout(400);
const [px, py] = await page.evaluate(() => window.ChronicleMap.project(55, 32));
const cbox = await page.locator('#map-canvas').boundingBox();
await page.touchscreen.tap(cbox.x + px, cbox.y + py);
await page.waitForSelector('#map-pop.show', { timeout: 4000 });
const popText = await page.locator('#map-pop').textContent();
check('tap Persia → popover', popText.includes('Achaemenid'), popText.slice(0, 60));
check('popover offers chapter link', await page.locator('#map-pop [data-mapread="persia"]').count() === 1);
await page.locator('#map-pop [data-mapread="persia"]').click();
await page.waitForSelector('#view-persia.active article', { timeout: 8000 });
check('map popover routes to Persia chapter', true);

// 4. back to map — slider moves year, unwritten-polity tap still shows name
await page.locator('#btn-home').click();
await page.waitForSelector('#view-home.active');
await page.locator('.world-cta[data-goto="map"]').click();
await page.waitForSelector('#view-map.active', { state: 'attached' });
await page.evaluate(() => window.ChronicleMap.setYear(-323));
const year2 = await page.evaluate(() => document.getElementById('map-year').textContent);
check('setYear/slider updates label', year2.includes('323') || year2.includes('324'), year2);

// 5. play button advances
await page.locator('#map-play').click();
await page.waitForTimeout(1500);
const year3 = await page.evaluate(() => document.getElementById('map-year').textContent);
await page.locator('#map-play').click();
check('play advances the year', year3 !== year2, `${year2} → ${year3}`);

// 6. attribution + about view
check('attribution line present', (await page.locator('#map-attrib').textContent()).includes('Cliopatria'));
await page.locator('#map-attrib a[data-goto="about"]').click();
await page.waitForSelector('#view-about.active', { timeout: 4000 });
check('about/credits view opens', (await page.locator('#view-about').textContent()).includes('CC BY 4.0'));

// 7. offline: map data cached by SW after first use
await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, { timeout: 8000 }).catch(() => {});
await page.waitForTimeout(1200);
await ctx.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
await page.evaluate(() => { location.hash = ''; });
const offlineOk = await page.evaluate(async () => {
  const r = await fetch('map/era-2.json?v=x').catch(() => null);
  return !!(r && r.ok);
});
check('map data available offline from SW cache', offlineOk);
await ctx.setOffline(false);

check('no uncaught page errors', errors.length === 0, errors.slice(0, 2).join(' | '));

// screenshots for the owner
await page.goto(base, { waitUntil: 'networkidle' });
await page.locator('#btn-home').click();
await page.waitForSelector('#view-home.active');
await page.locator('.world-cta[data-goto="map"]').click();
await page.waitForFunction(() => window.ChronicleMap && document.getElementById('map-year').textContent.length > 0, { timeout: 8000 });
await page.waitForTimeout(600);
await page.screenshot({ path: join(SITE, '..', 'build', 'preview-map-cradles.png') });
await page.locator('#map-chips button[data-era="era-2"]').click();
await page.waitForTimeout(1200);
const [qx, qy] = await page.evaluate(() => window.ChronicleMap.project(55, 32));
const cb2 = await page.locator('#map-canvas').boundingBox();
await page.touchscreen.tap(cb2.x + qx, cb2.y + qy);
await page.waitForTimeout(400);
await page.screenshot({ path: join(SITE, '..', 'build', 'preview-map-persia.png') });

await browser.close();
server.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} map checks passed`);
process.exit(failed ? 1 : 0);
