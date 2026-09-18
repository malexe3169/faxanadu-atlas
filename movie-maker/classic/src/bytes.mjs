// Byte reading and writing, mirroring the helpers in
// eoe_core/src/fe/AtlasMovieBundle.cpp so the two implementations refuse the
// same inputs with the same words. Everything is little endian. A Reader is
// bounded: it refuses to read past its limit and done() refuses trailing bytes.

export class MovieError extends Error {}

export function require(condition, message) {
  if (!condition) throw new MovieError(message);
}

export function requireU8(value, label) {
  require(value <= 0xff, `${label} exceeds 255`);
}

const printable = (c) => c >= 0x20 && c <= 0x7e;

export class Reader {
  /** @param {Uint8Array} data  @param {string} label  @param {number} [start]  @param {number} [size] */
  constructor(data, label, start = 0, size = undefined) {
    this.data = data;
    this.label = label;
    this.cursor = start;
    this.limit = size === undefined ? data.length : start + size;
    require(this.limit <= data.length, `${label} is truncated`);
  }
  u8() {
    require(this.cursor < this.limit, `${this.label} is truncated`);
    return this.data[this.cursor++];
  }
  i8() {
    const v = this.u8();
    return v >= 0x80 ? v - 0x100 : v;
  }
  u16() {
    const lo = this.u8(), hi = this.u8();
    return lo | (hi << 8);
  }
  u32() {
    let result = 0;
    for (let shift = 0; shift < 32; shift += 8) result |= this.u8() << shift;
    return result >>> 0;
  }
  bytes(count) {
    require(count <= this.limit - this.cursor, `${this.label} is truncated`);
    const out = this.data.slice(this.cursor, this.cursor + count);
    this.cursor += count;
    return out;
  }
  ascii(count) {
    const raw = this.bytes(count);
    require(raw.every(printable), `${this.label} contains a non-ASCII movie ID`);
    return String.fromCharCode(...raw);
  }
  done() {
    require(this.cursor === this.limit, `${this.label} has trailing bytes`);
  }
}

/** A growable byte sink; out.bytes() gives the Uint8Array. */
export class Writer {
  constructor() { this.parts = []; this.length = 0; }
  u8(value) { this.parts.push(value & 0xff); this.length += 1; return this; }
  i8(value) { return this.u8(value & 0xff); }
  u16(value) { return this.u8(value & 0xff).u8((value >> 8) & 0xff); }
  u32(value) {
    for (let shift = 0; shift < 32; shift += 8) this.u8((value >>> shift) & 0xff);
    return this;
  }
  raw(bytes) { for (const b of bytes) this.u8(b); return this; }
  ascii(text) { for (let i = 0; i < text.length; i++) this.u8(text.charCodeAt(i)); return this; }
  /** length byte then printable ASCII, as sized_ascii() in the C++ */
  sizedAscii(text, label) {
    requireU8(text.length, `${label} length`);
    for (let i = 0; i < text.length; i++)
      require(printable(text.charCodeAt(i)), `${label} must contain printable ASCII`);
    return this.u8(text.length).ascii(text);
  }
  /** length byte then the frames, as frame_vector() in the C++ */
  frameVector(frames, label) {
    requireU8(frames.length, `${label} frame count`);
    return this.u8(frames.length).raw(frames);
  }
  bytes() { return Uint8Array.from(this.parts); }
}

export function readWord(data, offset) {
  require(offset + 2 <= data.length, "word read is outside the data");
  return data[offset] | (data[offset + 1] << 8);
}

export function writeWord(data, offset, value) {
  require(offset + 2 <= data.length, "word write is outside the data");
  data[offset] = value & 0xff;
  data[offset + 1] = (value >> 8) & 0xff;
}

export function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** The first differing offset, or -1 when the two are byte identical. */
export function firstDifference(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return a.length === b.length ? -1 : n;
}

export const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
