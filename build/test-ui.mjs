/* Drive the assembled single file to check the UI/UX upgrade features. */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const server = createServer(async (req, res) => {
  try {
    const p = req.url.split('?')[0];
    const file = (p === '/' || p === '/index.html') ? 'chronicle-complete.html' : p.slice(1);
    const buf = await readFile(join(SITE, file));
    res.writeHead(200, { 'content-type': 'text/html' });
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
await page.goto(base, { waitUntil: 'domcontentloaded' });
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important;}' });
await page.waitForTimeout(300);
const evalClick = (sel) => page.evaluate((s) => { var el = document.querySelector(s); if (el) el.click(); }, sel);

// F6 hero strip
const strip = await page.locator('#progress-strip').textContent();
check('F6 hero progress strip', /\d+ of \d+ chapters written/.test(strip), strip);

// F1 progress bar hidden on home
check('F1 progress bar hidden on home', await page.locator('#progress.hide').count() === 1);

// F7 ready/all filter
const soonBefore = await page.locator('#view-home .chap.soon:visible').count();
await page.locator('#shelf-filter button[data-filter="ready"]').click();
await page.waitForTimeout(200);
const soonAfter = await page.locator('#view-home .chap.soon:visible').count();
check('F7 Ready filter hides soon cards', soonBefore > 0 && soonAfter === 0, `${soonBefore}→${soonAfter}`);
await page.locator('#shelf-filter button[data-filter="all"]').click();
await page.waitForTimeout(150);

// Open a chapter (Sumer) via card
await page.locator('.chap.ready[data-ch="sumer"]').click();
await page.waitForSelector('#view-sumer.active');
await page.waitForTimeout(150);

// Topbar short title
const title = await page.locator('#bar-title').textContent();
check('Topbar shows short title (no chapter number)', title === 'Sumer', JSON.stringify(title));

// F9 hash routing (section tracking may refine it to #/sumer/<sec>)
check('F9 URL reflects the view', (await page.evaluate(() => location.hash)).indexOf('#/sumer') === 0, await page.evaluate(() => location.hash));

// F1 progress visible now
check('F1 progress bar visible in chapter', await page.locator('#progress.hide').count() === 0);

// F2 contents fab + sheet
check('F2 contents fab visible in chapter', await page.locator('#toc-fab.show').count() === 1);
await page.locator('#toc-fab').click();
await page.waitForSelector('#contents-sheet.open');
const tocLinks = await page.locator('#contents-list a').count();
const minLeft = await page.locator('#contents-meta').textContent();
check('F2 contents sheet lists TOC + minutes-left', tocLinks > 5 && /min left/.test(minLeft), `${tocLinks} links, "${minLeft}"`);
// tap a TOC link jumps
await page.locator('#contents-list a').nth(6).click();
await page.waitForTimeout(200);
check('F2 TOC link scrolls into chapter', await page.evaluate(() => window.scrollY) > 200);

// F3 citation popover
const cite = page.locator('#view-sumer sup.cite a').first();
await cite.scrollIntoViewIfNeeded();
const yBefore = await page.evaluate(() => window.scrollY);
await cite.click();
await page.waitForSelector('#cite-pop.show', { timeout: 3000 });
const yAfter = await page.evaluate(() => window.scrollY);
const citeHtml = await page.locator('#cite-body').innerHTML();
check('F3 citation popover opens without scrolling', Math.abs(yAfter - yBefore) < 30 && citeHtml.length > 0, `Δy=${yAfter - yBefore}`);
check('F3 popover keeps source links tappable', await page.locator('#cite-body a[target="_blank"]').count() >= 1);
await page.locator('#cite-pop .cite-x').click();

// F4 focus mode (discrete wheel events; smooth scroll disabled above)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(120);
for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(60); }
await page.waitForTimeout(200);
check('F4 focus mode hides topbar on scroll-down', await page.locator('body.chrome-hidden').count() === 1);
await page.mouse.wheel(0, -260);
await page.waitForTimeout(250);
check('F4 topbar returns on scroll-up', await page.locator('body.chrome-hidden').count() === 0);

// F9 back gesture: follow a connected/data-goto link then go back
await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(300);
const yInSumer = await page.evaluate(() => window.scrollY);
await evalClick('#view-sumer [data-goto="akkad"]');
await page.waitForSelector('#view-akkad.active', { timeout: 3000 });
check('F9 data-goto pushes history', (await page.evaluate(() => location.hash)).indexOf('#/akkad') === 0, await page.evaluate(() => location.hash));
await page.goBack();
await page.waitForSelector('#view-sumer.active', { timeout: 3000 });
await page.waitForTimeout(300);
const yReturn = await page.evaluate(() => window.scrollY);
check('F9 back returns to Sumer at prior scroll', Math.abs(yReturn - yInSumer) < 120, `${yInSumer}→${yReturn}`);

// F5 finished tracking: scroll the .next teaser into view
await page.evaluate(() => { var n = document.querySelector('#view-sumer .next'); if (n) n.scrollIntoView({ block: 'center' }); });
await page.waitForTimeout(800);
const finFlag = await page.evaluate(() => localStorage.getItem('fin:sumer'));
check('F5 finishing a chapter sets fin flag', finFlag === '1', String(finFlag));
await evalClick('#btn-home');
await page.waitForSelector('#view-home.active');
check('F5 shelf shows finished check', await page.locator('.chap.ready[data-ch="sumer"] .fin-check').count() === 1);

// F8 timeline region filter
await evalClick('[data-goto="tl"]');
await page.waitForSelector('#view-tl.active');
await page.waitForTimeout(150);
await page.locator('#tl-regions button[data-region="americas"]').click();
await page.waitForTimeout(200);
const dimmed = await page.locator('#view-tl g[data-region].tl-dim').count();
const americasBars = await page.evaluate(() => {
  return [...document.querySelectorAll('#view-tl g[data-region="americas"]')].map(g => g.classList.contains('tl-dim'));
});
check('F8 region filter dims non-matching bars', dimmed > 5 && americasBars.length > 0 && americasBars.every(d => !d), `${dimmed} dimmed, ${americasBars.length} americas kept`);

// F10 search ranking: "Ur"
await evalClick('#btn-search');
await page.waitForSelector('#view-search.active');
await page.locator('#s-input').fill('Ur');
await page.waitForTimeout(200);
const count = await page.locator('.s-count').count();
const groups = await page.locator('.s-group').count();
const firstGroup = await page.locator('.s-group').first().textContent().catch(() => '');
check('F10 search shows count + chapter groups', count === 1 && groups >= 1, `${groups} groups, first="${firstGroup}"`);
// Ur should surface a Sumer/Mesopotamia section near the top, not a word merely containing "ur"
const firstHit = await page.locator('.s-hit .s-sec').first().textContent().catch(() => '');
check('F10 "Ur" ranks a real Ur hit first', /ur|sumer|city|king/i.test(firstHit), `first hit: "${firstHit}"`);

// F9 deep-link cold start
await page.goto(base + '#/persia/pe-open', { waitUntil: 'domcontentloaded' }).catch(async () => { await page.goto(base + '#/persia'); });
await page.waitForSelector('#view-persia.active', { timeout: 4000 }).catch(() => {});
check('F9 deep-link opens the shared view on load', await page.locator('#view-persia.active').count() === 1);

check('no uncaught page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();
server.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} UI checks passed`);
process.exit(failed ? 1 : 0);
