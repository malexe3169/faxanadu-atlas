// the game's own HUD font, read from the gameplay background pattern table
// (4 KiB at file $F810: bank 3, CPU $B800): digits at $D6, letters at $E0,
// as tools/fax_text.py names them. a caption is those glyphs as background
// tiles, written into the movie's nametable; the engine draws nothing new.
import { MovieError } from "./bytes.mjs";
import { NesTile } from "./assets_tile.mjs";

export const FONT_FILE = 0xf810;
const DIGIT = 0xd6, LETTER = 0xe0;

export function glyphTile(rom, ch) {
  const c = ch.toUpperCase();
  if (c === " ") return null;
  let n;
  if (c >= "0" && c <= "9") n = DIGIT + (c.charCodeAt(0) - 48);
  else if (c >= "A" && c <= "Z") n = LETTER + (c.charCodeAt(0) - 65);
  else throw new MovieError(`the game's font has no "${ch}": letters, digits and spaces only`);
  return NesTile.fromBytes(rom, FONT_FILE + n * 16);
}

/** one line of text as deduplicated tiles and per character names */
export function rasterCaption(rom, text) {
  if (text.length > 32) throw new MovieError("a caption is at most 32 characters");
  const tiles = [], keys = new Map(), names = [];
  for (const ch of text) {
    const tile = glyphTile(rom, ch);
    if (tile === null) { names.push(null); continue; }
    const key = Array.from(tile.pixels).join();
    let id = keys.get(key);
    if (id === undefined) { id = tiles.length; keys.set(key, id); tiles.push(tile); }
    names.push(id);
  }
  return { tiles, names };
}
