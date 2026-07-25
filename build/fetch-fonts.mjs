#!/usr/bin/env node
/**
 * The Chronicle — self-hosted fonts (UI v2, item 6).
 *
 * Run MANUALLY when the shell's font roster changes:
 *   node build/fetch-fonts.mjs
 *
 * Reads the Google Fonts @import URL out of master/shell.html, downloads the
 * latin-subset woff2 for every family/weight/style it names, and writes:
 *   fonts/<family>-<weight>[-italic].woff2   (committed to the repo)
 *   fonts/fonts.css                          (@font-face set, url('fonts/…'))
 *
 * build.mjs then swaps the shell's @import for fonts.css in the PWA artifact,
 * so the app never flashes fallback serif and reads offline in its own faces.
 * The standalone chronicle-complete.html keeps the Google @import (it is the
 * share-anywhere file; inlining ~1 MB of fonts there is not worth it).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'fonts');
mkdirSync(OUT, { recursive: true });

const shell = readFileSync(join(ROOT, 'master', 'shell.html'), 'utf8');
const imp = shell.match(/@import url\('(https:\/\/fonts\.googleapis\.com[^']*)'\);/);
if (!imp) { console.error('no Google Fonts @import found in shell'); process.exit(1); }

// A browser UA makes Google return woff2 sources.
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const css = execFileSync('curl', ['-sS', '--fail', '--max-time', '30', '-A', UA, imp[1]]).toString();

// Keep only the /* latin */ subset blocks (each carries its unicode-range).
const blocks = [...css.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face \{[^}]+\})/g)]
  .filter((m) => m[1] === 'latin');
if (!blocks.length) { console.error('no latin @font-face blocks in Google CSS'); process.exit(1); }

const faces = [];
let bytes = 0;
for (const [, , block] of blocks) {
  const fam = block.match(/font-family: '([^']+)'/)[1];
  const weight = block.match(/font-weight: (\d+)/)[1];
  const style = block.match(/font-style: (\w+)/)[1];
  const range = block.match(/unicode-range: ([^;]+);/)[1];
  const url = block.match(/url\((https:\/\/[^)]+\.woff2)\)/)[1];
  const name = `${fam.toLowerCase().replace(/ /g, '-')}-${weight}${style === 'italic' ? '-italic' : ''}.woff2`;
  const data = execFileSync('curl', ['-sS', '--fail', '--max-time', '30', url]);
  writeFileSync(join(OUT, name), data);
  bytes += data.length;
  faces.push(
    `@font-face{font-family:'${fam}';font-style:${style};font-weight:${weight};font-display:swap;` +
    `src:url('fonts/${name}') format('woff2');unicode-range:${range};}`
  );
  console.log(`${name}  ${(data.length / 1024).toFixed(0)} KB`);
}
writeFileSync(join(OUT, 'fonts.css'), faces.join('\n') + '\n');
console.log(`\n${faces.length} faces, ${(bytes / 1024).toFixed(0)} KB total → fonts/`);
