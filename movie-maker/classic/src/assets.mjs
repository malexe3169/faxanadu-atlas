// ROM offsets, asset bytes, CHR decode and encode, metasprite frames and
// library, source spans, overlap and OAM checks. Ported function by function
// from eoe_core/src/fe/AtlasMovieAssets.cpp, in the C++ order, with the C++
// refusal messages verbatim.
//
// A ROM is a Uint8Array of the whole file, iNES header included, so offsets
// are file offsets (16 + bank * 0x4000 + window displacement).

import { MovieError, require } from "./bytes.mjs";
import { AssetKind, ImportKind, TrackKind } from "./types.mjs";
import { NesTile, TILE_BYTES } from "./assets_tile.mjs";
import { makeFrame, makeFrameTile, frameWidth, frameHeight } from "./assets_frame.mjs";

export { NesTile, TILE_BYTES } from "./assets_tile.mjs";
export * from "./assets_frame.mjs";

export const INES_HEADER_SIZE = 16;
export const PRG_BANK_SIZE = 0x4000;
// AtlasMovieBundleCodec::METASPRITE_MAX_WIDTH / METASPRITE_MAX_HEIGHT
export const METASPRITE_MAX_WIDTH = 16;
export const METASPRITE_MAX_HEIGHT = 30;

/** layout::file_offset (AtlasMovieLayout.cpp); lives here until engine.mjs lands */
export function fileOffset(bank, cpu) {
  if (bank >= 16 || cpu < 0x8000 || (bank !== 15 && cpu >= 0xc000))
    throw new MovieError("Atlas movie address is outside PRG ROM");
  // MMC1 can map bank 15 into either PRG window
  const window = bank === 15 && cpu >= 0xc000 ? 0xc000 : 0x8000;
  return INES_HEADER_SIZE + PRG_BANK_SIZE * bank + (cpu - window);
}

/** rom_offset */
export function romOffset(bank, cpu) {
  if (bank === 15 && cpu >= 0x8000 && cpu < 0xc000) cpu = (cpu + 0x4000) & 0xffff;
  return fileOffset(bank, cpu);
}

/** asset_bytes */
export function assetBytes(rom, asset) {
  const offset = romOffset(asset.bank, asset.cpu);
  if (offset > rom.length || asset.bytes > rom.length - offset)
    throw new MovieError("Movie asset extends beyond the ROM");
  return rom.slice(offset, offset + asset.bytes);
}

/** find_asset: the first asset of that kind, or null */
export function findAsset(movie, kind) {
  const found = movie.assets.find((asset) => asset.kind === kind);
  return found === undefined ? null : found;
}

/** find_import: the first import of that kind, or null */
export function findImport(movie, kind) {
  const found = movie.imports.find((imported) => imported.kind === kind);
  return found === undefined ? null : found;
}

/** replace_import: drop every prior import of the same kind, then append */
export function replaceImport(movie, imported) {
  movie.imports = movie.imports.filter((prior) => prior.kind !== imported.kind);
  movie.imports.push(imported);
}

/** decode_chr: every complete 16 byte tile, a trailing partial tile ignored */
export function decodeChr(bytes) {
  const result = [];
  for (let offset = 0; offset + TILE_BYTES <= bytes.length; offset += TILE_BYTES)
    result.push(NesTile.fromBytes(bytes, offset));
  return result;
}

/** encode_chr */
export function encodeChr(tiles) {
  const result = new Uint8Array(tiles.length * TILE_BYTES);
  tiles.forEach((tile, i) => result.set(tile.toBytes(), i * TILE_BYTES));
  return result;
}

// ---- anonymous namespace helpers --------------------------------------------

function assetKindName(kind) {
  switch (kind) {
  case AssetKind.SpriteChr: return "sprite CHR";
  case AssetKind.BackgroundChr: return "background CHR";
  case AssetKind.Nametable: return "nametable";
  case AssetKind.Palette: return "palette";
  }
  return "asset";
}

function importReplacesAsset(movie, kind) {
  let importedKind;
  switch (kind) {
  case AssetKind.BackgroundChr: importedKind = ImportKind.BackgroundChr; break;
  case AssetKind.Nametable: importedKind = ImportKind.Nametable; break;
  case AssetKind.Palette: importedKind = ImportKind.Palette; break;
  case AssetKind.SpriteChr: return false;
  default: return false;
  }
  return findImport(movie, importedKind) !== null;
}

const i8 = (v) => (v >= 0x80 ? v - 0x100 : v);

/** decode_metasprite_record: reads one movie record at cursor.cursor and
 *  advances it, the way the C++ takes std::size_t& p_cursor. */
function decodeMetaspriteRecord(data, cursor) {
  if (cursor.cursor + 4 > data.length) throw new MovieError("Metasprite header is truncated");
  const frame = makeFrame();
  frame.offset_x = i8(data[cursor.cursor++]);
  frame.offset_y = i8(data[cursor.cursor++]);
  const width = data[cursor.cursor++], height = data[cursor.cursor++];
  if (!width || !height || width > METASPRITE_MAX_WIDTH || height > METASPRITE_MAX_HEIGHT)
    throw new MovieError("Metasprite dimensions are invalid");
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (cursor.cursor >= data.length) throw new MovieError("Metasprite is truncated");
      const tile = data[cursor.cursor++];
      if (tile === 0xff) row.push(null);
      else {
        if (cursor.cursor >= data.length) throw new MovieError("Metasprite attribute is truncated");
        const attr = data[cursor.cursor++];
        row.push(makeFrameTile({
          index: tile, sub_palette: attr & 3,
          v_flip: (attr & 0x80) !== 0, h_flip: (attr & 0x40) !== 0,
        }));
      }
    }
    frame.tilemap.push(row);
  }
  return frame;
}

// ---- public API, continued ---------------------------------------------------

/** movie_rom_source_spans: every ROM-owned byte range the bundle reads, as
 *  { offset, bytes, label } */
export function movieRomSourceSpans(rom, bundle) {
  const result = [];
  const append = (offset, bytes, label) => {
    if (offset > rom.length || bytes > rom.length - offset)
      throw new MovieError(`${label} extends beyond the ROM`);
    result.push({ offset, bytes, label });
  };

  for (const movie of bundle.movies) {
    for (const asset of movie.assets) {
      // Replacement imports live inside FMB itself. Sprite imports are
      // additions, so the base sprite-CHR source remains ROM-owned.
      if (importReplacesAsset(movie, asset.kind)) continue;
      append(romOffset(asset.bank, asset.cpu), asset.bytes,
        `${movie.id} ${assetKindName(asset.kind)}`);
    }

    if (findImport(movie, ImportKind.MetaspriteLibrary)) continue;
    const loOffset = romOffset(movie.metasprite_bank, movie.metasprite_pointer_lo);
    const hiOffset = romOffset(movie.metasprite_bank, movie.metasprite_pointer_hi);
    append(loOffset, movie.metasprite_count, `${movie.id} metasprite low-pointer table`);
    append(hiOffset, movie.metasprite_count, `${movie.id} metasprite high-pointer table`);
    for (let frame = 0; frame < movie.metasprite_count; frame++) {
      const cpu = rom[loOffset + frame] | (rom[hiOffset + frame] << 8);
      const cursor = { cursor: romOffset(movie.metasprite_bank, cpu) };
      const start = cursor.cursor;
      decodeMetaspriteRecord(rom, cursor);
      append(start, cursor.cursor - start, `${movie.id} metasprite frame ${frame}`);
    }
  }
  return result;
}

/** reject_movie_source_overlaps: writes is an array of { offset, bytes } */
export function rejectMovieSourceOverlaps(rom, bundle, writes, owner) {
  const sources = movieRomSourceSpans(rom, bundle);
  for (const write of writes) {
    if (!write.bytes) continue;
    if (write.offset > rom.length || write.bytes > rom.length - write.offset)
      throw new MovieError(`${owner} write extends beyond the ROM`);
    for (const source of sources) {
      const overlap = write.offset < source.offset + source.bytes
        && source.offset < write.offset + write.bytes;
      if (overlap) throw new MovieError(`${owner} would overwrite ${source.label}`);
    }
  }
}

/** validate_movie_oam_budget */
export function validateMovieOamBudget(rom, bundle) {
  for (const movie of bundle.movies) {
    const frames = decodeMovieFrames(rom, movie);
    const frameCells = [];
    for (const frame of frames) {
      let cells = 0;
      for (const row of frame.tilemap) cells += row.filter((cell) => cell !== null).length;
      if (cells > 64)
        throw new MovieError(`Movie ${movie.id} contains a metasprite frame over the NES 64-sprite OAM limit`);
      frameCells.push(cells);
    }

    const trackMaximums = [];
    for (const track of movie.tracks) {
      let maximum = 0;
      const include = (frame) => {
        // frame_cells.at(frame) in the C++ throws std::out_of_range here
        require(frame < frameCells.length,
          `Movie ${movie.id} track references metasprite frame ${frame} beyond its ${frameCells.length} frames`);
        maximum = Math.max(maximum, frameCells[frame]);
      };
      if (track.kind === TrackKind.Path)
        for (const stage of track.stage_frames) for (const frame of stage) include(frame);
      else if (track.kind === TrackKind.Cyclic)
        for (const frame of track.visible_frames) include(frame);
      else
        for (const frame of track.toggle_frames) include(frame);
      trackMaximums.push(maximum);
    }

    for (let phaseIndex = 0; phaseIndex < movie.phases.length; phaseIndex++) {
      let cells = 0;
      for (let track = 0; track < trackMaximums.length; track++)
        if (movie.phases[phaseIndex].draw_mask & (1 << track)) cells += trackMaximums[track];
      if (cells > 64)
        throw new MovieError(`Movie ${movie.id} phase ${phaseIndex + 1} may draw ${cells} sprites, exceeding the NES 64-sprite OAM limit`);
    }
  }
}

/** movie_background_tile: the index into the background CHR asset that a
 *  nametable tile selects, or null (std::nullopt) when it falls outside it */
export function movieBackgroundTile(movie, nametableTile) {
  const asset = findAsset(movie, AssetKind.BackgroundChr);
  if (!asset || asset.destination < 0x1000 || asset.destination % 16 || asset.bytes % 16)
    return null;
  const first = (asset.destination - 0x1000) / 16;
  const count = asset.bytes / 16;
  if (nametableTile < first || nametableTile >= first + count) return null;
  return nametableTile - first;
}

/** decode_movie_frames */
export function decodeMovieFrames(rom, movie) {
  const result = [];
  const imported = findImport(movie, ImportKind.MetaspriteLibrary);
  if (imported) {
    const cursor = { cursor: imported.aux * 2 };
    for (let i = 0; i < imported.aux; i++)
      result.push(decodeMetaspriteRecord(imported.data, cursor));
    if (cursor.cursor !== imported.data.length)
      throw new MovieError("Imported metasprites have trailing bytes");
    return result;
  }
  const loOffset = romOffset(movie.metasprite_bank, movie.metasprite_pointer_lo);
  const hiOffset = romOffset(movie.metasprite_bank, movie.metasprite_pointer_hi);
  if (loOffset + movie.metasprite_count > rom.length
    || hiOffset + movie.metasprite_count > rom.length)
    throw new MovieError("Metasprite pointer table extends beyond the ROM");
  for (let i = 0; i < movie.metasprite_count; i++) {
    const cpu = rom[loOffset + i] | (rom[hiOffset + i] << 8);
    const cursor = { cursor: romOffset(movie.metasprite_bank, cpu) };
    result.push(decodeMetaspriteRecord(rom, cursor));
  }
  return result;
}

/** encode_metasprite_library: frames.length * 2 zero bytes, then the records */
export function encodeMetaspriteLibrary(frames) {
  if (frames.length === 0 || frames.length > 255)
    throw new MovieError("A movie needs 1..255 metasprite frames");
  const result = new Array(frames.length * 2).fill(0);
  for (const frame of frames) {
    const w = frameWidth(frame), h = frameHeight(frame);
    if (!w || !h || w > METASPRITE_MAX_WIDTH || h > METASPRITE_MAX_HEIGHT)
      throw new MovieError("Gameplay sprite has unsupported frame dimensions");
    result.push(frame.offset_x & 0xff, frame.offset_y & 0xff, w & 0xff, h & 0xff);
    let visibleCells = 0;
    for (const row of frame.tilemap)
      for (const cell of row) {
        if (!cell) result.push(0xff);
        else {
          visibleCells++;
          result.push(cell.index & 0xff,
            (cell.sub_palette & 3) | (cell.h_flip ? 0x40 : 0) | (cell.v_flip ? 0x80 : 0));
        }
      }
    if (visibleCells > 64)
      throw new MovieError("Gameplay sprite frame exceeds the NES 64-sprite OAM limit");
  }
  return Uint8Array.from(result);
}

/** resolved_asset_bytes: the import when one replaces the asset, else the ROM bytes */
export function resolvedAssetBytes(rom, movie, kind) {
  let importKind;
  switch (kind) {
  case AssetKind.BackgroundChr: importKind = ImportKind.BackgroundChr; break;
  case AssetKind.Nametable: importKind = ImportKind.Nametable; break;
  case AssetKind.Palette: importKind = ImportKind.Palette; break;
  default: {
    const asset = findAsset(movie, kind);
    if (!asset) throw new MovieError("Movie asset is missing");
    return assetBytes(rom, asset);
  }
  }
  const imported = findImport(movie, importKind);
  if (imported) return imported.data;
  const asset = findAsset(movie, kind);
  if (!asset) throw new MovieError("Movie asset is missing");
  return assetBytes(rom, asset);
}

/** movie_sprite_tiles: the 256 tile pattern table $0000-$0FFF, base sprite
 *  CHR then every sprite CHR import laid over it */
export function movieSpriteTiles(rom, movie) {
  const result = Array.from({ length: 256 }, () => new NesTile());
  const base = findAsset(movie, AssetKind.SpriteChr);
  if (!base) throw new MovieError("Movie sprite CHR is missing");
  const insert = (destination, bytes) => {
    const tiles = decodeChr(bytes);
    const start = Math.floor(destination / 16);
    if (start + tiles.length > result.length)
      throw new MovieError("Movie sprite CHR crosses $0FFF");
    tiles.forEach((tile, i) => { result[start + i] = tile; });
  };
  insert(base.destination, assetBytes(rom, base));
  for (const imported of movie.imports)
    if (imported.kind === ImportKind.SpriteChr) insert(imported.destination, imported.data);
  return result;
}

// convert_game_room is not ported: it walks the FaxEdit Game model (chunks,
// screens, metatiles, default tileset and palette lookups) which has no
// counterpart in this port.
