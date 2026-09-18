// The sprite animation frame, ported from the pieces of
// eoe_core/src/fe/sprite/SpriteAnimationFrame.* that AtlasMovieAssets uses.
//
// A frame is { offset_x, offset_y, pivot_x, tilemap } where tilemap is an
// array of rows, each row an array of cells, and a cell is either null (an
// empty $FF slot) or { index, sub_palette, v_flip, h_flip }.

import { MovieError } from "./bytes.mjs";

export function makeFrameTile(over = {}) {
  return { index: 0, sub_palette: 0, v_flip: false, h_flip: false, ...over };
}

/** SpriteAnimationFrame::SpriteAnimationFrame(void) */
export function makeFrame(over = {}) {
  return { offset_x: 0, offset_y: 0, pivot_x: 0, tilemap: [], ...over };
}

/** SpriteAnimationFrame::w */
export function frameWidth(frame) {
  return frame.tilemap.length === 0 ? 0 : frame.tilemap[0].length;
}

/** SpriteAnimationFrame::h */
export function frameHeight(frame) {
  return frame.tilemap.length;
}

const i8 = (v) => (v >= 0x80 ? v - 0x100 : v);

/** SpriteAnimationFrame::SpriteAnimationFrame(const std::vector<byte>&, std::size_t):
 *  the gameplay record layout, dims byte then offsets then the cells. */
export function frameFromBytes(data, offset = 0) {
  const at = (i) => {
    if (i >= data.length) throw new MovieError("Animation frame is truncated");
    return data[i];
  };
  const frame = makeFrame({
    offset_x: i8(at(offset + 1)), offset_y: i8(at(offset + 2)), pivot_x: i8(at(offset + 3)),
  });
  const w = (at(offset) % 16) + 1;
  const h = Math.floor(at(offset) / 16) + 1;
  offset += 4;
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const tileNo = at(offset++);
      if (tileNo === 0xff) row.push(null);
      else {
        const attr = at(offset++);
        row.push(makeFrameTile({
          index: tileNo,
          sub_palette: attr & 0b11,
          v_flip: (attr & 0x80) !== 0,
          h_flip: (attr & 0x40) !== 0,
        }));
      }
    }
    frame.tilemap.push(row);
  }
  return frame;
}

/** SpriteFrameTile::to_bytes; remap is a Map<number, number> or undefined */
export function frameTileToBytes(tile, remap) {
  const index = remap && remap.has(tile.index) ? remap.get(tile.index) : tile.index;
  let attr = tile.sub_palette & 0b11;
  if (tile.h_flip) attr |= 0x40;
  if (tile.v_flip) attr |= 0x80;
  return [index & 0xff, attr];
}

/** SpriteAnimationFrame::to_bytes(const std::map<byte, byte>&) */
export function frameToBytes(frame, remap = new Map()) {
  if (frame.tilemap.length === 0 || frame.tilemap[0].length === 0)
    throw new MovieError("Empty animation frames not allowed");
  const result = [];
  const dims = (frame.tilemap.length - 1) * 16 + frame.tilemap[0].length - 1;
  result.push(dims & 0xff, frame.offset_x & 0xff, frame.offset_y & 0xff, frame.pivot_x & 0xff);
  for (const row of frame.tilemap)
    for (const tile of row) {
      if (tile) result.push(...frameTileToBytes(tile, remap));
      else result.push(0xff);
    }
  return Uint8Array.from(result);
}

/** SpriteAnimationFrame::to_cinematic_bytes: the movie record layout,
 *  offset_x, offset_y, width, height, then the cells with no remap. */
export function frameToCinematicBytes(frame) {
  const result = [frame.offset_x & 0xff, frame.offset_y & 0xff,
    frameWidth(frame) & 0xff, frameHeight(frame) & 0xff];
  for (const row of frame.tilemap)
    for (const tile of row) {
      if (tile) result.push(...frameTileToBytes(tile));
      else result.push(0xff);
    }
  return Uint8Array.from(result);
}

/** SpriteAnimationFrame::get_tile_usage, as a Map<index, count> */
export function frameTileUsage(frame) {
  const result = new Map();
  for (const row of frame.tilemap)
    for (const tile of row)
      if (tile) result.set(tile.index, (result.get(tile.index) || 0) + 1);
  return result;
}

/** SpriteAnimationFrame::get_empty_tile_count */
export function frameEmptyTileCount(frame) {
  let result = 0;
  for (const row of frame.tilemap) for (const tile of row) if (!tile) result++;
  return result;
}
