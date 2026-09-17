// Pixels for the page's canvas, from the same asset objects the engine uses:
// a nametable with its attribute table over background tiles, and metasprite
// frames over sprite tiles, through the movie's 32 palette bytes. Pure
// functions on Uint8Arrays; no DOM. The NES master palette is the usual
// 64 entry approximation, a property of the console, not of any game.

export const WIDTH = 256, HEIGHT = 240;

// the 2C02 palette as sRGB, one common rendering of it
export const NES_PALETTE = Object.freeze([
  0x626262, 0x001fb2, 0x2404c8, 0x5200b2, 0x730076, 0x800024, 0x730b00, 0x522800,
  0x244400, 0x005700, 0x005c00, 0x005324, 0x003c76, 0x000000, 0x000000, 0x000000,
  0xababab, 0x0d57ff, 0x4b30ff, 0x8a13ff, 0xbc08d6, 0xd21269, 0xc72e00, 0x9d5400,
  0x607b00, 0x209800, 0x00a300, 0x009942, 0x007db4, 0x000000, 0x000000, 0x000000,
  0xffffff, 0x53aeff, 0x9085ff, 0xd365ff, 0xff57ff, 0xff5dcf, 0xff7757, 0xfa9e00,
  0xbdc700, 0x7ae700, 0x43f611, 0x26ef7e, 0x2cd5f6, 0x4e4e4e, 0x000000, 0x000000,
  0xffffff, 0xb6e1ff, 0xced1ff, 0xe9c3ff, 0xffbcff, 0xffbdf4, 0xffc6c3, 0xffd59a,
  0xe9e681, 0xcef481, 0xb6fb9a, 0xa9fac3, 0xa9f0f4, 0xb8b8b8, 0x000000, 0x000000,
]);

/** a blank RGBA frame, opaque black */
export function makeSurface() {
  const rgba = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
  for (let i = 3; i < rgba.length; i += 4) rgba[i] = 255;
  return rgba;
}

function put(rgba, x, y, nesColor) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const c = NES_PALETTE[nesColor & 0x3f];
  const o = (y * WIDTH + x) * 4;
  rgba[o] = c >> 16; rgba[o + 1] = (c >> 8) & 0xff; rgba[o + 2] = c & 0xff; rgba[o + 3] = 255;
}

/** paint every pixel with one palette entry (the backdrop, palette byte 0) */
export function clearTo(rgba, nesColor) {
  const c = NES_PALETTE[nesColor & 0x3f];
  for (let o = 0; o < rgba.length; o += 4) { rgba[o] = c >> 16; rgba[o + 1] = (c >> 8) & 0xff; rgba[o + 2] = c & 0xff; rgba[o + 3] = 255; }
}

/** draw one 8x8 tile; colour 0 is the backdrop for background tiles and
 *  transparent for sprites. `palette` is the 4 NES colours of the sub palette. */
export function drawTile(rgba, tile, x, y, palette, { transparent = false, hFlip = false, vFlip = false } = {}) {
  for (let py = 0; py < 8; py++) {
    for (let px = 0; px < 8; px++) {
      const c = tile.getColor(hFlip ? 7 - px : px, vFlip ? 7 - py : py);
      if (c === 0 && transparent) continue;
      put(rgba, x + px, y + py, palette[c]);
    }
  }
}

/** the nametable (960 tile bytes then 64 attribute bytes) over `tiles`, with
 *  the 16 background palette bytes: palette[0] is the backdrop everywhere */
export function drawNametable(rgba, nametable, tiles, palette) {
  if (nametable.length < 0x400) throw new Error("a nametable is 1024 bytes");
  clearTo(rgba, palette[0]);
  for (let row = 0; row < 30; row++) {
    for (let col = 0; col < 32; col++) {
      const index = nametable[row * 32 + col];
      const attr = nametable[0x3c0 + ((row >> 2) * 8) + (col >> 2)];
      const shift = ((row & 2) ? 4 : 0) + ((col & 2) ? 2 : 0);
      const sub = (attr >> shift) & 3;
      const tile = tiles[index];
      if (!tile) continue;
      const sp = [palette[0], palette[sub * 4 + 1], palette[sub * 4 + 2], palette[sub * 4 + 3]];
      drawTile(rgba, tile, col * 8, row * 8, sp);
    }
  }
}

/** a metasprite frame (its `tilemap`: rows of cells, null for an empty slot,
 *  as assets_frame.mjs decodes it) at (x, y) over `tiles`, with the 16 sprite
 *  palette bytes (palette[16..31] of the movie) */
export function drawFrame(rgba, frame, x, y, tiles, spritePalette) {
  const ox = x + (frame.offset_x || 0), oy = y + (frame.offset_y || 0);
  (frame.tilemap || frame.rows || []).forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return;
      const tile = tiles[cell.index];
      if (!tile) return;
      const sub = cell.sub_palette & 3;
      const sp = [0, spritePalette[sub * 4 + 1], spritePalette[sub * 4 + 2], spritePalette[sub * 4 + 3]];
      drawTile(rgba, tile, ox + c * 8, oy + r * 8, sp, { transparent: true, hFlip: cell.h_flip, vFlip: cell.v_flip });
    });
  });
}
