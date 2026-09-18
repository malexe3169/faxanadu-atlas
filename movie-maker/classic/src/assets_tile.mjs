// The NES tile, ported from the pieces of eoe_core/src/common/klib/NES_tile.*
// that AtlasMovieAssets uses: decode 16 bytes into 8x8 two bit pixels and
// encode them back. Plane 0 is the first 8 bytes, plane 1 the next 8, and
// the most significant bit is the leftmost pixel.

import { MovieError } from "./bytes.mjs";

export const TILE_BYTES = 16;

export class NesTile {
  /** 64 pixels, row major, each 0..3 */
  constructor(pixels = new Uint8Array(64)) {
    this.pixels = pixels;
  }

  /** klib::NES_tile::NES_tile(const std::vector<byte>&, std::size_t) */
  static fromBytes(data, offset = 0) {
    const pixels = new Uint8Array(64);
    for (let y = 0; y < 8; y++) {
      const b0 = data[offset + y];       // plane 0
      const b1 = data[offset + 8 + y];   // plane 1
      for (let x = 0; x < 8; x++) {
        const bit = 7 - x;
        const low = (b0 >> bit) & 1;
        const high = (b1 >> bit) & 1;
        pixels[y * 8 + x] = (high << 1) | low;
      }
    }
    return new NesTile(pixels);
  }

  /** klib::NES_tile::to_bytes */
  toBytes() {
    if (this.pixels.length !== 64) throw new MovieError("NES_tile must be 8x8");
    const out = new Uint8Array(TILE_BYTES);
    for (let row = 0; row < 8; row++) {
      let plane0 = 0, plane1 = 0;
      for (let col = 0; col < 8; col++) {
        const val = this.pixels[row * 8 + col] & 0x03;
        const bit = 1 << (7 - col);
        if (val & 0x01) plane0 |= bit;
        if (val & 0x02) plane1 |= bit;
      }
      out[row] = plane0;
      out[row + 8] = plane1;
    }
    return out;
  }

  w() { return 8; }
  h() { return 8; }
  getColor(x, y) { return this.pixels[y * 8 + x]; }
  setColor(x, y, palIdx) { this.pixels[y * 8 + x] = palIdx; }

  isEmpty() { return this.pixels.every((p) => p === 0); }

  equals(rhs) {
    for (let i = 0; i < 64; i++) if (this.pixels[i] !== rhs.pixels[i]) return false;
    return true;
  }

  flipH() {
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 4; x++) {
        const a = y * 8 + x, b = y * 8 + 7 - x;
        const tmp = this.pixels[a]; this.pixels[a] = this.pixels[b]; this.pixels[b] = tmp;
      }
  }

  flipV() {
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 8; x++) {
        const a = y * 8 + x, b = (7 - y) * 8 + x;
        const tmp = this.pixels[a]; this.pixels[a] = this.pixels[b]; this.pixels[b] = tmp;
      }
  }
}
