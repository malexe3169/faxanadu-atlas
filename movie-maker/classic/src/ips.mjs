// IPS patches, so the page hands back a diff rather than a ROM. The format is
// the classic one: "PATCH", records of a 3 byte offset, a 2 byte length and
// the bytes (or length 0, a 2 byte run length and one byte for an RLE run),
// then "EOF". Offsets are file offsets, header included, which is how every
// patcher applies them. A run of unchanged bytes shorter than a record header
// is folded into its neighbours, as patchers expect.
import { MovieError } from "./bytes.mjs";

const HEAD = [0x50, 0x41, 0x54, 0x43, 0x48];   // PATCH
const TAIL = [0x45, 0x4f, 0x46];               // EOF
const MAX_RECORD = 0xffff;

/** the IPS that turns `before` into `after` (same length) */
export function makeIps(before, after) {
  if (before.length !== after.length) throw new MovieError("IPS needs two files of the same length");
  if (after.length > 0xffffff) throw new MovieError("IPS offsets are 24 bits; the file is too long");
  const out = [...HEAD];
  let i = 0;
  while (i < after.length) {
    if (before[i] === after[i]) { i++; continue; }
    let j = i;
    // extend the record over differing bytes, and over unchanged gaps shorter
    // than a record header (5 bytes), which cost more to split than to keep
    while (j < after.length && j - i < MAX_RECORD) {
      if (before[j] !== after[j]) { j++; continue; }
      let k = j;
      while (k < after.length && before[k] === after[k] && k - j < 5) k++;
      if (k < after.length && before[k] !== after[k] && k - j < 5 && k - i < MAX_RECORD) { j = k; continue; }
      break;
    }
    const len = j - i;
    // an EOF-looking offset (0x454f46) is the one value the format cannot
    // express; split the record one byte earlier so it never starts there
    if (i === 0x454f46) { out.push(...record(i - 1, after.subarray(i - 1, j))); }
    else out.push(...record(i, after.subarray(i, j)));
    i = j;
  }
  out.push(...TAIL);
  return Uint8Array.from(out);
}

function record(offset, bytes) {
  const rec = [(offset >> 16) & 0xff, (offset >> 8) & 0xff, offset & 0xff, (bytes.length >> 8) & 0xff, bytes.length & 0xff];
  for (const b of bytes) rec.push(b);
  return rec;
}

/** apply an IPS to a copy of `rom`; refuses a malformed patch */
export function applyIps(rom, ips) {
  const out = Uint8Array.from(rom);
  if (ips.length < 8 || HEAD.some((b, i) => ips[i] !== b)) throw new MovieError("not an IPS patch");
  let p = 5;
  for (;;) {
    if (p + 3 > ips.length) throw new MovieError("IPS patch ends before EOF");
    if (ips[p] === TAIL[0] && ips[p + 1] === TAIL[1] && ips[p + 2] === TAIL[2] && p + 3 === ips.length) return out;
    const offset = (ips[p] << 16) | (ips[p + 1] << 8) | ips[p + 2];
    const size = (ips[p + 3] << 8) | ips[p + 4];
    p += 5;
    if (size === 0) {                          // RLE run
      const run = (ips[p] << 8) | ips[p + 1], value = ips[p + 2];
      p += 3;
      if (offset + run > out.length) throw new MovieError("IPS run writes past the end of the file");
      out.fill(value, offset, offset + run);
    } else {
      if (p + size > ips.length) throw new MovieError("IPS record is truncated");
      if (offset + size > out.length) throw new MovieError("IPS record writes past the end of the file");
      out.set(ips.subarray(p, p + size), offset);
      p += size;
    }
  }
}
