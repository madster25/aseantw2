// Downloads every photo in src/data/photos.ts into public/photos/ so the site no longer depends on
// external hosts. Run: npm run fetch-photos   (Node 18+, no dependencies)
// Files are saved as <slot>.jpg and <slot>-800.jpg; add the slot to LOCAL_SLOTS in src/data/photos.ts.
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/data/photos.ts', import.meta.url), 'utf8');
const CDN = src.match(/const CDN = '([^']+)'/)[1];
const UNSPLASH = src.match(/const UNSPLASH = '([^']+)'/)[1];
const entries = [];
for (const m of src.matchAll(/^  ('?[\w-]+'?): (tmp|stock)\(\s*'([^']+)',\s*(\d+),\s*(\d+),/gm)) {
  const slot = m[1].replace(/'/g, '');
  const kind = m[2], id = m[3], w = +m[4], h = +m[5];
  if (kind === 'tmp') entries.push({ slot, full: `${CDN}${id}.png`, small: `${CDN}${id}_min.webp`, fullExt: 'png', smallExt: 'webp' });
  else entries.push({ slot, full: `${UNSPLASH}${id}?auto=format&fit=crop&q=80&w=${w}&h=${h}&fm=jpg`, small: `${UNSPLASH}${id}?auto=format&fit=crop&q=75&w=800&h=${Math.round((800 * h) / w)}&fm=jpg`, fullExt: 'jpg', smallExt: 'jpg' });
}
await mkdir(new URL('../public/photos/', import.meta.url), { recursive: true });
for (const e of entries) {
  for (const [url, name] of [[e.full, `${e.slot}.${e.fullExt}`], [e.small, `${e.slot}-800.${e.smallExt}`]]) {
    const res = await fetch(url);
    if (!res.ok) { console.error('FAILED', name, res.status); continue; }
    await writeFile(new URL(`../public/photos/${name}`, import.meta.url), Buffer.from(await res.arrayBuffer()));
    console.log('saved', name);
  }
}
console.log(`${entries.length} photos done. Add any new slot to LOCAL_SLOTS in src/data/photos.ts.`);
