// Art from an image: a background (256x240 RGBA) becomes background tiles,
// a nametable with its attributes and a 16 byte background palette; a
// figure (any RGBA with transparency) becomes sprite tiles, one metasprite
// frame and the three colours of a sprite sub palette. The NES rules this
// obeys, in one place:
//   - 64 colours, none other; every pixel goes to its nearest;
//   - a background is 16x16 blocks, each drawn with one of four sub
//     palettes of three colours over one shared backdrop colour;
//   - the movie's background pattern table holds 128 tiles ($80 to $FF), a
//     picture that needs more has its rarest tiles replaced by their nearest;
//   - a sprite cell is 8x8, colour 0 transparent, three colours from one
//     sub palette; a frame is at most 16 by 30 cells and 64 drawn cells.
// Pure functions over Uint8ClampedArray RGBA; the page decodes the PNG.
import { MovieError } from "./bytes.mjs";
import { NES_PALETTE } from "./render.mjs";
import { NesTile } from "./assets_tile.mjs";
import { makeFrame, makeFrameTile } from "./assets_frame.mjs";
import { METASPRITE_MAX_WIDTH, METASPRITE_MAX_HEIGHT } from "./assets.mjs";

export const BACKGROUND_TILES = 128, BACKGROUND_FIRST_TILE = 0x80;
const W = 256, H = 240, BLOCKS_X = 16, BLOCKS_Y = 15;

// the palette's blacks are $0F; $0D is "blacker than black" and the rows'
// $0E/$0F/$1E... are duplicates, so a colour never lands on those
const USABLE = [];
for (let i = 0; i < 64; i++) if ((i & 0x0f) < 0x0d) USABLE.push(i);
USABLE.push(0x0f);
const RGB = NES_PALETTE.map((c) => [c >> 16, (c >> 8) & 0xff, c & 0xff]);
const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

/** the NES colour nearest an sRGB triple */
export function nearestNes(r, g, b) {
  let best = 0x0f, bestD = Infinity;
  for (const i of USABLE) { const d = dist(RGB[i], [r, g, b]); if (d < bestD) { bestD = d; best = i; } }
  return best;
}
const nesDist = (a, b) => dist(RGB[a], RGB[b]);

// the n most frequent keys of a count map
const top = (counts, n, skip = new Set()) => [...counts.entries()].filter(([k]) => !skip.has(k)).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);

/** every pixel to a NES colour index; alpha under 128 is -1 (transparent) */
export function quantize(rgba, w, h) {
  const out = new Int16Array(w * h);
  const cache = new Map();
  for (let i = 0; i < w * h; i++) {
    if (rgba[i * 4 + 3] < 128) { out[i] = -1; continue; }
    const key = (rgba[i * 4] << 16) | (rgba[i * 4 + 1] << 8) | rgba[i * 4 + 2];
    let c = cache.get(key);
    if (c === undefined) { c = nearestNes(rgba[i * 4], rgba[i * 4 + 1], rgba[i * 4 + 2]); cache.set(key, c); }
    out[i] = c;
  }
  return out;
}

/** a 256x240 picture as the movie's background: { chr, nametable, palette, tiles, warnings } */
export function importBackground(rgba, w, h) {
  if (w !== W || h !== H) throw new MovieError(`a background is ${W}x${H} pixels, this image is ${w}x${h}`);
  const px = quantize(rgba, w, h);
  const warnings = [];
  // the backdrop: the most common colour of the whole picture
  const all = new Map();
  for (const c of px) all.set(c < 0 ? 0x0f : c, (all.get(c < 0 ? 0x0f : c) || 0) + 1);
  const backdrop = top(all, 1)[0];
  // each 16x16 block wants its three most common colours besides the backdrop
  const blocks = [];
  for (let by = 0; by < BLOCKS_Y; by++) for (let bx = 0; bx < BLOCKS_X; bx++) {
    const counts = new Map();
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const c = px[(by * 16 + y) * W + bx * 16 + x];
      const k = c < 0 ? backdrop : c;
      if (k !== backdrop) counts.set(k, (counts.get(k) || 0) + 1);
    }
    blocks.push({ counts, wants: top(counts, 3) });
  }
  // four sub palettes: seeded by the most wanted colour sets, then each
  // block joins the palette that paints it best, and palettes are rebuilt
  // from their blocks; two rounds settle the common cases
  const setCounts = new Map();
  for (const b of blocks) { const k = b.wants.slice().sort((a, c) => a - c).join(","); setCounts.set(k, (setCounts.get(k) || 0) + 1); }
  let palettes = top(setCounts, 4).map((k) => (k === "" ? [] : k.split(",").map(Number)));
  while (palettes.length < 4) palettes.push([]);
  const cost = (b, pal) => {
    let e = 0;
    for (const [c, n] of b.counts) { let m = nesDist(c, backdrop); for (const p of pal) m = Math.min(m, nesDist(c, p)); e += m * n; }
    return e;
  };
  let assignment = [];
  for (let round = 0; round < 3; round++) {
    assignment = blocks.map((b) => { let best = 0, bestE = Infinity; palettes.forEach((pal, i) => { const e = cost(b, pal); if (e < bestE) { bestE = e; best = i; } }); return best; });
    palettes = palettes.map((_, i) => {
      const counts = new Map();
      blocks.forEach((b, j) => { if (assignment[j] === i) for (const [c, n] of b.counts) counts.set(c, (counts.get(c) || 0) + n); });
      return top(counts, 3);
    });
  }
  const palette = new Uint8Array(16);
  palettes.forEach((pal, i) => { palette[i * 4] = backdrop; for (let k = 0; k < 3; k++) palette[i * 4 + 1 + k] = pal[k] ?? backdrop; });
  // tiles: each pixel to the nearest of its block's four colours
  const tileMap = new Map(), tiles = [], names = new Array(960);
  const tileCounts = [];
  for (let ty = 0; ty < 30; ty++) for (let tx = 0; tx < 32; tx++) {
    const pal = assignment[(ty >> 1) * BLOCKS_X + (tx >> 1)];
    const colours = [backdrop, ...palettes[pal].slice(0, 3)];
    const pixels = new Uint8Array(64);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const c = px[(ty * 8 + y) * W + tx * 8 + x];
      let idx = 0, bestD = Infinity;
      if (c >= 0) colours.forEach((k, i) => { const d = nesDist(c, k); if (d < bestD) { bestD = d; idx = i; } });
      pixels[y * 8 + x] = idx;
    }
    const key = String.fromCharCode(...pixels);
    let id = tileMap.get(key);
    if (id === undefined) { id = tiles.length; tileMap.set(key, id); tiles.push(new NesTile(pixels)); tileCounts.push(0); }
    tileCounts[id]++;
    names[ty * 32 + tx] = id;
  }
  // too many tiles: the rarest are redrawn as their nearest common tile
  let kept = tiles.map((_, i) => i);
  if (tiles.length > BACKGROUND_TILES) {
    kept = tiles.map((_, i) => i).sort((a, b) => tileCounts[b] - tileCounts[a]).slice(0, BACKGROUND_TILES);
    const keptSet = new Set(kept);
    const nearest = new Map();
    for (let i = 0; i < tiles.length; i++) {
      if (keptSet.has(i)) continue;
      let best = kept[0], bestD = Infinity;
      for (const k of kept) { let d = 0; for (let p = 0; p < 64; p++) d += tiles[i].pixels[p] !== tiles[k].pixels[p]; if (d < bestD) { bestD = d; best = k; } }
      nearest.set(i, best);
    }
    for (let i = 0; i < 960; i++) if (nearest.has(names[i])) names[i] = nearest.get(names[i]);
    warnings.push(`the picture needed ${tiles.length} tiles and 128 fit; ${tiles.length - BACKGROUND_TILES} rare ones were redrawn as their nearest`);
  }
  const index = new Map(kept.map((id, i) => [id, i]));
  const chr = new Uint8Array(kept.length * 16);
  kept.forEach((id, i) => chr.set(tiles[id].toBytes(), i * 16));
  const nametable = new Uint8Array(1024);
  for (let i = 0; i < 960; i++) nametable[i] = BACKGROUND_FIRST_TILE + index.get(names[i]);
  for (let by = 0; by < BLOCKS_Y; by++) for (let bx = 0; bx < BLOCKS_X; bx++) {
    const pal = assignment[by * BLOCKS_X + bx];
    const shift = ((by & 1) << 2) | ((bx & 1) << 1);
    nametable[0x3c0 + (by >> 1) * 8 + (bx >> 1)] |= pal << shift;
  }
  return { chr, nametable, palette, tiles: kept.length, warnings };
}

/** a figure as sprite tiles and one frame: { tiles: NesTile[], frame, colours }
 *  where `frame` cells index the tiles from `firstTile` and use `subPalette`;
 *  transparent is alpha under 128, or the top left pixel's colour when the
 *  image has no transparency at all */
export function importFigure(rgba, w, h, firstTile, subPalette) {
  if (w < 1 || h < 1) throw new MovieError("the figure image is empty");
  const cw = Math.ceil(w / 8), ch = Math.ceil(h / 8);
  if (cw > METASPRITE_MAX_WIDTH || ch > METASPRITE_MAX_HEIGHT)
    throw new MovieError(`a figure is at most ${METASPRITE_MAX_WIDTH * 8}x${METASPRITE_MAX_HEIGHT * 8} pixels, this one is ${w}x${h}`);
  const px = quantize(rgba, w, h);
  let hasAlpha = false;
  for (let i = 0; i < w * h; i++) if (px[i] < 0) { hasAlpha = true; break; }
  if (!hasAlpha) { const key = px[0]; for (let i = 0; i < w * h; i++) if (px[i] === key) px[i] = -1; }
  const counts = new Map();
  for (const c of px) if (c >= 0) counts.set(c, (counts.get(c) || 0) + 1);
  const colours = top(counts, 3);
  if (!colours.length) throw new MovieError("the figure image has no opaque pixels");
  while (colours.length < 3) colours.push(colours[colours.length - 1]);
  const tiles = [], tileMap = new Map();
  const frame = makeFrame({ offset_x: -Math.floor(w / 2), offset_y: -Math.floor(h / 2) });
  let drawn = 0;
  for (let cy = 0; cy < ch; cy++) {
    const row = [];
    for (let cx = 0; cx < cw; cx++) {
      const pixels = new Uint8Array(64);
      let any = false;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
        const ix = cx * 8 + x, iy = cy * 8 + y;
        const c = ix < w && iy < h ? px[iy * w + ix] : -1;
        if (c < 0) continue;
        let idx = 1, bestD = Infinity;
        colours.forEach((k, i) => { const d = nesDist(c, k); if (d < bestD) { bestD = d; idx = i + 1; } });
        pixels[y * 8 + x] = idx; any = true;
      }
      if (!any) { row.push(null); continue; }
      const key = String.fromCharCode(...pixels);
      let id = tileMap.get(key);
      if (id === undefined) { id = tiles.length; tileMap.set(key, id); tiles.push(new NesTile(pixels)); }
      row.push(makeFrameTile({ index: firstTile + id, sub_palette: subPalette }));
      drawn++;
    }
    frame.tilemap.push(row);
  }
  if (drawn > 64) throw new MovieError(`a figure draws at most 64 cells, this one needs ${drawn}`);
  if (firstTile + tiles.length > 256) throw new MovieError(`the sprite pattern table is full: ${firstTile + tiles.length - 256} tiles over`);
  return { tiles, frame, colours };
}
