#!/usr/bin/env node
/**
 * The Chronicle — map data preparation (Phase 4).
 *
 * Run MANUALLY (not in CI) when refreshing map data:
 *   node build/map-prep.mjs [cacheDir]
 *
 * Downloads (or reuses from cacheDir):
 *   - Cliopatria polity borders (CC BY 4.0, Seshat Global History Databank)
 *   - Natural Earth 110m land (public domain)
 * then simplifies with mapshaper, quantizes + delta-encodes coordinates, and
 * slices into era-chunked payloads matching the book's shelves.
 *
 * Output (committed to the repo; build.mjs copies it into site/map/):
 *   mapdata/era-1.json … era-5.json   polity borders per book era
 *   mapdata/basemap.json              land outline
 *   mapdata/ATTRIBUTION.md            data licenses
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'mapdata');
const CACHE = process.argv[2] || join(ROOT, '.map-cache');
mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const CLIOPATRIA_URL = 'https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip';
const NE_LAND_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';

// Book eras (shelf sections) → year windows. A polity shape lands in every era
// its [FromYear, ToYear] overlaps.
const ERAS = [
  { file: 'era-1', from: -3400, to: -539 },  // First Cradles
  { file: 'era-2', from: -539, to: 500 },    // Classical World
  { file: 'era-3', from: 500, to: 1450 },    // Medieval World
  { file: 'era-4', from: 1450, to: 1800 },   // Early Modern
  { file: 'era-5', from: 1800, to: 2024 },   // The Modern World
];

function sh(cmd, args) { execFileSync(cmd, args, { stdio: 'inherit' }); }
function fetchTo(url, dest) {
  if (existsSync(dest)) { console.log('cached:', dest); return; }
  console.log('downloading:', url);
  sh('curl', ['-sSL', '--fail', '-o', dest, url]);
}

// ---------------------------------------------------------------------------
// 1. Acquire sources
// ---------------------------------------------------------------------------
const clioZip = join(CACHE, 'cliopatria.geojson.zip');
const clioRaw = join(CACHE, 'cliopatria.geojson');
const neRaw = join(CACHE, 'ne_110m_land.geojson');
fetchTo(CLIOPATRIA_URL, clioZip);
if (!existsSync(clioRaw)) {
  sh('python3', ['-c', `
import zipfile, shutil, sys
z = zipfile.ZipFile(${JSON.stringify(clioZip)})
name = [n for n in z.namelist() if n.endswith('.geojson')][0]
with z.open(name) as src, open(${JSON.stringify(clioRaw)}, 'wb') as dst:
    shutil.copyfileobj(src, dst)
print('unzipped', name)
`]);
}
fetchTo(NE_LAND_URL, neRaw);

// ---------------------------------------------------------------------------
// 2. Simplify with mapshaper.
//    NOTE: never use -clean here — Cliopatria features overlap in TIME (same
//    territory, different year ranges) and -clean removes them as duplicates.
// ---------------------------------------------------------------------------
const mapshaper = join(ROOT, 'node_modules', '.bin', 'mapshaper');
const clioSimp = join(CACHE, 'cliopatria_simplified.geojson');
const neSimp = join(CACHE, 'ne_land_simplified.geojson');
if (!existsSync(clioSimp)) {
  sh('node', ['--max-old-space-size=6000', mapshaper, clioRaw,
    '-filter', 'Type == "POLITY"',
    '-simplify', 'visvalingam', 'keep-shapes', 'percentage=4%',
    '-filter-fields', 'Name,FromYear,ToYear,Wikipedia',
    '-o', clioSimp, 'force', 'precision=0.01', 'format=geojson']);
}
if (!existsSync(neSimp)) {
  sh('node', [mapshaper, neRaw,
    '-simplify', 'visvalingam', 'keep-shapes', 'percentage=30%',
    '-o', neSimp, 'force', 'precision=0.01', 'format=geojson']);
}

// ---------------------------------------------------------------------------
// 3. Encode. Rings are flattened per geometry (canvas 'evenodd' fill handles
//    holes). Coordinates quantized to 0.01° ints, delta-encoded per ring.
// ---------------------------------------------------------------------------
function q(v) { return Math.round(v * 100); }
function encodeRings(geom) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates]
    : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  const rings = [];
  for (const poly of polys) for (const ring of poly) {
    if (ring.length < 4) continue;
    const flat = [];
    let px = 0, py = 0;
    for (const [lon, lat] of ring) {
      const x = q(lon), y = q(lat);
      flat.push(x - px, y - py);
      px = x; py = y;
    }
    rings.push(flat);
  }
  return rings;
}

const clio = JSON.parse(readFileSync(clioSimp, 'utf8'));
let skipped = 0;
for (const era of ERAS) {
  const polities = [];
  const yearSet = new Set([era.from]);
  for (const f of clio.features) {
    const p = f.properties;
    if (p.FromYear == null || p.ToYear == null) { skipped++; continue; }
    if (p.ToYear < era.from || p.FromYear > era.to) continue;
    const rings = encodeRings(f.geometry);
    if (!rings.length) { skipped++; continue; }
    if (p.FromYear >= era.from) yearSet.add(p.FromYear);
    if (p.ToYear + 1 <= era.to) yearSet.add(p.ToYear + 1);
    polities.push({ n: p.Name, f: p.FromYear, t: p.ToYear, w: p.Wikipedia || '', rings });
  }
  const years = [...yearSet].sort((a, b) => a - b);
  const payload = { window: [era.from, era.to], years, polities };
  const out = join(OUT, era.file + '.json');
  writeFileSync(out, JSON.stringify(payload));
  const bytes = JSON.stringify(payload).length;
  console.log(`${era.file}: ${polities.length} shapes, ${years.length} change-years, ${(bytes / 1048576).toFixed(2)} MB raw`);
}

const ne = JSON.parse(readFileSync(neSimp, 'utf8'));
const baseRings = [];
for (const f of ne.features) baseRings.push(...encodeRings(f.geometry));
writeFileSync(join(OUT, 'basemap.json'), JSON.stringify({ rings: baseRings }));
console.log(`basemap: ${baseRings.length} rings, ${(JSON.stringify({ rings: baseRings }).length / 1024).toFixed(0)} KB raw`);
if (skipped) console.log(`skipped ${skipped} features (no years or empty geometry)`);

writeFileSync(join(OUT, 'ATTRIBUTION.md'), `# Map data attribution

- **Polity borders:** [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria),
  Seshat Global History Databank — CC BY 4.0. Simplified and re-encoded for mobile delivery.
- **Land basemap:** [Natural Earth](https://www.naturalearthdata.com/) — public domain.

Regenerate with \`node build/map-prep.mjs\`.
`);
console.log('done → mapdata/');
