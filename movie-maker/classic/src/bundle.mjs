// FMV1 / FMB1 / ATI1 / APM1 / AMP1: parse and compile, validation, budgets.
// A function by function port of eoe_core/src/fe/AtlasMovieBundle.cpp, in the
// C++ order, with the C++ refusal text. The rule of the port: the same project
// compiles to the same bytes here and there.
//
// The four AME / installed-ROM helpers at the end call AtlasMovieEngine in the
// C++ (validate_package, is_installed). That engine lives in engine.mjs, so
// here they take those two functions through an `engine` argument.
import { MovieError, Reader, Writer, require, requireU8, readWord, writeWord, equalBytes }
  from "./bytes.mjs";
import {
  AssetKind, Destination, TrackKind, ImportKind, ProjectRole, Effect, Condition,
  FORMAT_VERSION, IMPORT_VERSION, PROJECT_VERSION, ACTOR_COLORS,
  makeMovie, makeTrack, makeAsset, makePhase, makeSfx, makeImport, makeBundle,
} from "./types.mjs";

// ---- the pieces of AtlasMovieLayout this file leans on ----------------------
// (engine.mjs owns the full layout; these are the constants the codec needs)
export const layout = Object.freeze({
  BANK: 12,
  HEADER_BYTES: 16,
  PRG_BANK_BYTES: 0x4000,
  HANDLER_CPU: 0xad8b,
  BUNDLE_CPU: 0xb264,
  DISPATCH_HIGH_REF: 0x8273, // fh::ROM::IScripts_JumpTable_Ref_U
  DISPATCH_LOW_REF: 0x8277,  // fh::ROM::IScripts_JumpTable_Ref_L
  CORE_BYTES: 782,
  TAIL_BYTES: 1235,
  DISPATCH_ENTRIES: 25,
  DISPATCH_BYTES: 50,
  HANDLERS: Object.freeze([
    0x82b3, 0x82c4, 0x82ee, 0x82d8, 0x8725, 0x835a,
    0x8390, 0x839e, 0x83d7, 0x8524, 0x857f, 0x85d0,
    0x85f5, 0x861e, 0x85e5, 0x862f, 0x8656, 0x865f,
    0x8717, 0x85ae, 0x8736, 0x82ad, 0x8307, 0x82aa,
    0xad8b - 1,
  ]),
});

/** atlas_movie::layout::file_offset: MMC1 can map bank 15 into either window */
export function fileOffset(bank, cpu) {
  if (bank >= 16 || cpu < 0x8000 || (bank !== 15 && cpu >= 0xc000))
    throw new MovieError("Atlas movie address is outside PRG ROM");
  const window = bank === 15 && cpu >= 0xc000 ? 0xc000 : 0x8000;
  return layout.HEADER_BYTES + bank * layout.PRG_BANK_BYTES + (cpu - window);
}

const { BUNDLE_CPU, DISPATCH_BYTES, DISPATCH_HIGH_REF, DISPATCH_LOW_REF, HANDLERS } = layout;
const VANILLA_HANDLER_COUNT = layout.DISPATCH_ENTRIES;
export const METASPRITE_MAX_WIDTH = 16;
export const METASPRITE_MAX_HEIGHT = 30;

const printable = (c) => c >= 0x20 && c <= 0x7e;
const allPrintable = (s) => { for (let i = 0; i < s.length; i++) if (!printable(s.charCodeAt(i))) return false; return true; };
const magicIs = (raw, text) => raw.length === text.length && String.fromCharCode(...raw) === text;
const clone = (value) => structuredClone(value);

// ---- APM1 editor metadata ---------------------------------------------------

export function ensureEditorDefaults(movie) {
  movie.tracks.forEach((track, i) => {
    if (!track.editor_name) track.editor_name = `Actor ${i + 1}`;
    if (!track.editor_color) track.editor_color = ACTOR_COLORS[i % ACTOR_COLORS.length];
  });
  return movie;
}

export function compileEditorMetadata(movie) {
  const normalized = ensureEditorDefaults(clone(movie));
  const out = new Writer().ascii("APM1").u8(1).u8(normalized.tracks.length);
  for (const track of normalized.tracks) {
    out.sizedAscii(track.editor_name, "actor name");
    out.u32(track.editor_color);
    out.sizedAscii(track.editor_group, "actor group");
    requireU8(track.editor_waypoints.length, "actor waypoint count");
    out.u8(track.editor_waypoints.length);
    for (const point of track.editor_waypoints) out.u8(point.x).u8(point.y);
    const anim = track.editor_animation;
    out.u8(anim.automatic_facing ? 1 : 0);
    out.frameVector(anim.idle, "idle animation");
    out.frameVector(anim.left, "left animation");
    out.frameVector(anim.right, "right animation");
    out.frameVector(anim.toward, "toward animation");
    out.frameVector(anim.away, "away animation");
    out.frameVector(anim.attack, "attack animation");
    out.frameVector(anim.hurt, "hurt animation");
  }
  return out.bytes();
}

export function parseEditorMetadata(movie, data) {
  const r = new Reader(data, "APM1 editor metadata");
  require(magicIs(r.bytes(4), "APM1"), "bad APM1 magic");
  require(r.u8() === 1, "unsupported APM1 version");
  require(r.u8() === movie.tracks.length, "APM1 track count does not match movie");
  for (const track of movie.tracks) {
    track.editor_name = r.ascii(r.u8());
    track.editor_color = r.u32();
    track.editor_group = r.ascii(r.u8());
    const waypoints = r.u8();
    for (let i = 0; i < waypoints; i++) {
      const x = r.u8(), y = r.u8();
      track.editor_waypoints.push({ x, y });
    }
    const automatic = r.u8();
    require(automatic <= 1, "APM1 automatic-facing flag is invalid");
    const anim = track.editor_animation;
    anim.automatic_facing = automatic !== 0;
    const frames = () => r.bytes(r.u8());
    anim.idle = frames();
    anim.left = frames();
    anim.right = frames();
    anim.toward = frames();
    anim.away = frames();
    anim.attack = frames();
    anim.hurt = frames();
  }
  r.done();
  ensureEditorDefaults(movie);
  return movie;
}

/** the movies the runtime sees: enabled intro, enabled ending, then enabled normals */
export function runtimeBundle(bundle) {
  const result = makeBundle();
  for (const role of [ProjectRole.OfficialIntro, ProjectRole.OfficialEnding])
    for (const movie of bundle.movies)
      if (movie.enabled && movie.project_role === role) result.movies.push(movie);
  for (const movie of bundle.movies)
    if (movie.enabled && movie.project_role === ProjectRole.Normal) result.movies.push(movie);
  return result;
}

// ---- ATI1 metasprite libraries ----------------------------------------------

export function metaspriteRecordOffsets(data, count) {
  require(count > 0 && data.length >= count * 2, "imported metasprite library is truncated");
  const result = [];
  let cursor = count * 2;
  for (let frame = 0; frame < count; frame++) {
    result.push(cursor);
    require(cursor + 4 <= data.length, "imported metasprite header is truncated");
    const width = data[cursor + 2], height = data[cursor + 3];
    require(width > 0 && height > 0 && width <= METASPRITE_MAX_WIDTH && height <= METASPRITE_MAX_HEIGHT,
      "imported metasprite dimensions are outside 1..16 by 1..30");
    cursor += 4;
    let visibleCells = 0;
    for (let cell = 0; cell < width * height; cell++) {
      require(cursor < data.length, "imported metasprite cells are truncated");
      if (data[cursor] === 0xff) cursor += 1;
      else { cursor += 2; visibleCells++; }
      require(cursor <= data.length, "imported metasprite attribute is truncated");
    }
    require(visibleCells <= 64, "imported metasprite frame exceeds the NES 64-sprite OAM limit");
  }
  require(cursor === data.length, "imported metasprite library has trailing bytes");
  return result;
}

function importAssetKind(kind) {
  switch (kind) {
    case ImportKind.SpriteChr: return AssetKind.SpriteChr;
    case ImportKind.BackgroundChr: return AssetKind.BackgroundChr;
    case ImportKind.Nametable: return AssetKind.Nametable;
    case ImportKind.Palette: return AssetKind.Palette;
    default: throw new MovieError("ATI1 import has no asset binding");
  }
}

function validateImportBinding(movie, imported, dataCpu, dataSize) {
  if (imported.kind === ImportKind.MetaspriteLibrary) {
    require(imported.destination === 0, "ATI1 metasprite destination must be zero");
    require(imported.aux === movie.metasprite_count, "ATI1 metasprite count does not match FMV1");
    require(movie.metasprite_bank === 12 && movie.metasprite_pointer_lo === dataCpu
      && movie.metasprite_pointer_hi === ((dataCpu + imported.aux) & 0xffff),
      "ATI1 metasprite payload is not bound to the FMV1 pointer tables");
    require(equalBytes(imported.data, relocateMetasprites(imported, dataCpu)),
      "ATI1 metasprite record pointers are not canonical");
    return;
  }

  require(imported.aux === 0, "ATI1 non-metasprite aux byte must be zero");
  const kind = importAssetKind(imported.kind);
  const destinationSpace = kind === AssetKind.Palette ? Destination.Ram : Destination.Ppu;
  const exact = (asset) => asset.kind === kind && asset.bank === 12 && asset.cpu === dataCpu
    && asset.destination_space === destinationSpace
    && asset.destination === imported.destination && asset.bytes === dataSize;

  if (imported.kind === ImportKind.SpriteChr) {
    const found = movie.assets.findIndex(exact);
    require(found >= 0, "ATI1 sprite CHR binding does not exactly match FMV1");
    movie.assets.splice(found, 1);
    return;
  }

  const found = movie.assets.find((asset) => asset.kind === kind);
  require(found !== undefined && exact(found), "ATI1 replacement binding does not exactly match FMV1");
}

export function relocateMetasprites(imported, dataCpu) {
  const result = Uint8Array.from(imported.data);
  const offsets = metaspriteRecordOffsets(result, imported.aux);
  for (let i = 0; i < offsets.length; i++) {
    const address = dataCpu + offsets[i];
    require(address < 0xc000, "imported metasprite record crosses bank 12");
    result[i] = address & 0xff;
    result[imported.aux + i] = (address >> 8) & 0xff;
  }
  return result;
}

function checkedEnum(value, min, max, label) {
  require(value >= min && value <= max, `${label} enum is invalid`);
  return value;
}

// ---- FMV1 / FMB1 parse ------------------------------------------------------

export function parseTrack(record) {
  const r = new Reader(record, "track record");
  const track = makeTrack();
  track.kind = checkedEnum(r.u8(), 1, 3, "track kind");
  if (track.kind === TrackKind.Path || track.kind === TrackKind.Cyclic) {
    track.x = r.u8(); track.x_fraction = r.u8();
    track.y = r.u8(); track.y_fraction = r.u8();
    track.velocity_x = r.i8();
    track.velocity_y = r.i8();
    track.integrator_shift = r.u8();
  }
  if (track.kind === TrackKind.Path) {
    track.coordinate = checkedEnum(r.u8(), 1, 2, "path coordinate");
    track.comparison = checkedEnum(r.u8(), 1, 2, "path comparison");
    const keyframeCount = r.u8();
    for (let i = 0; i < keyframeCount; i++) {
      const threshold = r.u8(), velocity_x = r.i8(), velocity_y = r.i8();
      track.keyframes.push({ threshold, velocity_x, velocity_y });
    }
    track.dwell_frames = r.u8();
    const stages = r.u8(), slots = r.u8();
    for (let stage = 0; stage < stages; stage++) track.stage_frames.push(r.bytes(slots));
  } else if (track.kind === TrackKind.Cyclic) {
    track.dwell_frames = r.u8();
    const visible = r.u8();
    track.reset_at_pose = r.u8();
    track.visible_frames = r.bytes(visible);
  } else {
    track.x = r.u8(); track.y = r.u8();
    track.counter_address = r.u16();
    track.counter_mask = r.u8();
    track.toggle_frames = r.bytes(r.u8());
  }
  r.done();
  return track;
}

export function parseMovie(payload) {
  const r = new Reader(payload, "FMV1 movie");
  require(magicIs(r.bytes(4), "FMV1"), "bad FMV1 magic");
  require(r.u8() === FORMAT_VERSION, "unsupported FMV1 version");
  const movie = makeMovie();
  movie.exit_mode = checkedEnum(r.u8(), 1, 3, "exit mode");
  movie.entry_music = r.u8();
  const assets = r.u8(), tracks = r.u8(), phases = r.u8(), sfx = r.u8();
  movie.metasprite_bank = r.u8();
  movie.metasprite_pointer_lo = r.u16();
  movie.metasprite_pointer_hi = r.u16();
  movie.metasprite_count = r.u8();
  movie.id = r.ascii(r.u8());
  for (let i = 0; i < assets; i++) {
    const asset = makeAsset();
    asset.kind = checkedEnum(r.u8(), 1, 4, "asset kind");
    asset.bank = r.u8(); asset.cpu = r.u16();
    asset.destination_space = checkedEnum(r.u8(), 0, 1, "asset destination");
    asset.destination = r.u16(); asset.bytes = r.u16();
    movie.assets.push(asset);
  }
  for (let i = 0; i < tracks; i++) movie.tracks.push(parseTrack(r.bytes(r.u16())));
  for (let i = 0; i < sfx; i++) {
    const event = makeSfx();
    event.track = r.u8(); event.sound = r.u8(); event.stage_lt = r.u8();
    event.tick_mask = r.u8(); event.tick_value = r.u8();
    event.slot_mask = r.u8(); event.slot_value = r.u8();
    movie.sfx.push(event);
  }
  for (let i = 0; i < phases; i++) {
    const phase = makePhase();
    phase.update_mask = r.u8(); phase.draw_mask = r.u8();
    phase.enter_action = checkedEnum(r.u8(), 0, 1, "phase enter action");
    phase.enter_value = r.u8();
    phase.effect = checkedEnum(r.u8(), 0, 1, "phase effect");
    phase.effect_track = r.u8(); phase.effect_stage = r.u8(); phase.effect_period = r.u8();
    phase.effect_subtract = r.u8(); phase.effect_floor = r.u8();
    phase.condition = checkedEnum(r.u8(), 1, 5, "phase condition");
    phase.condition_track = r.u8(); phase.condition_value = r.u16();
    movie.phases.push(phase);
  }
  r.done();
  ensureEditorDefaults(movie);
  return movie;
}

/** the FMB1 movie records; -> { bundle, consumed } */
export function parsePrefix(data) {
  const r = new Reader(data, "FMB1 bundle");
  require(magicIs(r.bytes(4), "FMB1"), "bad FMB1 magic");
  require(r.u8() === FORMAT_VERSION, "unsupported FMB1 version");
  const count = r.u8();
  require(count > 0, "bundle has no movies");
  const bundle = makeBundle();
  for (let i = 0; i < count; i++) bundle.movies.push(parseMovie(r.bytes(r.u16())));
  if (bundle.movies.length > 0) bundle.movies[0].project_role = ProjectRole.OfficialIntro;
  if (bundle.movies.length > 1) bundle.movies[1].project_role = ProjectRole.OfficialEnding;
  return { bundle, consumed: r.cursor };
}

/** FMB1 records plus an optional ATI1 trailer, unvalidated; -> { bundle, consumed } */
export function parseBundleRecords(data) {
  const prefix = parsePrefix(data);
  const { bundle } = prefix;
  let { consumed } = prefix;
  if (consumed + 4 > data.length || !magicIs(data.subarray(consumed, consumed + 4), "ATI1"))
    return { bundle, consumed };
  const r = new Reader(data, "ATI1 imports", consumed, data.length - consumed);
  require(magicIs(r.bytes(4), "ATI1"), "bad ATI1 magic");
  require(r.u8() === IMPORT_VERSION, "unsupported ATI1 version");
  const importCount = r.u16();
  for (let i = 0; i < importCount; i++) {
    const movieIndex = r.u8();
    require(movieIndex < bundle.movies.length, "ATI1 import references a missing movie");
    const imported = makeImport();
    imported.kind = checkedEnum(r.u8(), 1, 5, "import kind");
    imported.destination = r.u16(); imported.aux = r.u8();
    imported.label = r.ascii(r.u8());
    const dataSize = r.u16();
    const dataCpuSize = BUNDLE_CPU + r.cursor;
    require(dataCpuSize <= 0xffff, "ATI1 import address exceeds CPU space");
    const dataCpu = dataCpuSize;
    imported.data = r.bytes(dataSize);
    const movie = bundle.movies[movieIndex];
    validateImportBinding(movie, imported, dataCpu, dataSize);
    movie.imports.push(imported);
  }
  return { bundle, consumed: r.cursor };
}

// ---- compile ----------------------------------------------------------------

export function compileTrack(track) {
  const out = new Writer().u8(track.kind);
  if (track.kind === TrackKind.Path || track.kind === TrackKind.Cyclic) {
    out.u8(track.x).u8(track.x_fraction).u8(track.y).u8(track.y_fraction)
      .i8(track.velocity_x).i8(track.velocity_y).u8(track.integrator_shift);
  }
  if (track.kind === TrackKind.Path) {
    out.u8(track.coordinate).u8(track.comparison).u8(track.keyframes.length);
    for (const keyframe of track.keyframes)
      out.u8(keyframe.threshold).i8(keyframe.velocity_x).i8(keyframe.velocity_y);
    // the C++ reads stage_frames.front() unguarded; validate() has already
    // required at least two stages by the time any caller reaches here
    const slots = track.stage_frames.length ? track.stage_frames[0].length : 0;
    out.u8(track.dwell_frames).u8(track.stage_frames.length).u8(slots);
    for (const row of track.stage_frames) out.raw(row);
  } else if (track.kind === TrackKind.Cyclic) {
    out.u8(track.dwell_frames).u8(track.visible_frames.length).u8(track.reset_at_pose);
    out.raw(track.visible_frames);
  } else {
    out.u8(track.x).u8(track.y);
    out.u16(track.counter_address);
    out.u8(track.counter_mask).u8(track.toggle_frames.length);
    out.raw(track.toggle_frames);
  }
  return out.bytes();
}

export function compileMovie(movie) {
  const out = new Writer().ascii("FMV1").u8(FORMAT_VERSION)
    .u8(movie.exit_mode).u8(movie.entry_music)
    .u8(movie.assets.length).u8(movie.tracks.length)
    .u8(movie.phases.length).u8(movie.sfx.length)
    .u8(movie.metasprite_bank);
  out.u16(movie.metasprite_pointer_lo);
  out.u16(movie.metasprite_pointer_hi);
  out.u8(movie.metasprite_count).u8(movie.id.length).ascii(movie.id);
  for (const asset of movie.assets) {
    out.u8(asset.kind).u8(asset.bank);
    out.u16(asset.cpu);
    out.u8(asset.destination_space);
    out.u16(asset.destination); out.u16(asset.bytes);
  }
  for (const track of movie.tracks) {
    const record = compileTrack(track);
    out.u16(record.length);
    out.raw(record);
  }
  for (const event of movie.sfx)
    out.u8(event.track).u8(event.sound).u8(event.stage_lt).u8(event.tick_mask)
      .u8(event.tick_value).u8(event.slot_mask).u8(event.slot_value);
  for (const phase of movie.phases) {
    out.u8(phase.update_mask).u8(phase.draw_mask)
      .u8(phase.enter_action).u8(phase.enter_value)
      .u8(phase.effect).u8(phase.effect_track).u8(phase.effect_stage)
      .u8(phase.effect_period).u8(phase.effect_subtract).u8(phase.effect_floor)
      .u8(phase.condition).u8(phase.condition_track);
    out.u16(phase.condition_value);
  }
  return out.bytes();
}

function compileMoviesPrefix(bundle) {
  const out = new Writer().ascii("FMB1").u8(FORMAT_VERSION).u8(bundle.movies.length);
  for (const movie of bundle.movies) {
    const payload = compileMovie(movie);
    require(payload.length <= 0xffff, "compiled movie exceeds 65535 bytes");
    out.u16(payload.length);
    out.raw(payload);
  }
  return out.bytes();
}

function compileBundleUnchecked(bundle) {
  let importCount = 0;
  for (const movie of bundle.movies) importCount += movie.imports.length;
  if (importCount === 0) return compileMoviesPrefix(bundle);

  const prepared = clone(bundle);
  const bindings = [];
  prepared.movies.forEach((movie, movieIndex) => {
    movie.imports.forEach((imported, importIndex) => {
      let assetIndex;
      if (imported.kind === ImportKind.MetaspriteLibrary) {
        movie.metasprite_bank = 12; movie.metasprite_count = imported.aux;
        movie.metasprite_pointer_lo = movie.metasprite_pointer_hi = BUNDLE_CPU;
      } else {
        const assetKind = imported.kind === 1 ? 1 : imported.kind - 1;
        if (imported.kind === ImportKind.SpriteChr) {
          movie.assets.push(makeAsset({ kind: assetKind, bank: 12, cpu: BUNDLE_CPU,
            destination_space: Destination.Ppu, destination: imported.destination,
            bytes: imported.data.length & 0xffff }));
          assetIndex = movie.assets.length - 1;
        } else {
          const found = movie.assets.findIndex((asset) => asset.kind === assetKind);
          require(found >= 0, "import replaces a missing movie asset kind");
          assetIndex = found;
          const asset = movie.assets[found];
          asset.bank = 12; asset.cpu = BUNDLE_CPU;
          asset.bytes = imported.data.length & 0xffff;
          asset.destination = imported.destination;
        }
      }
      bindings.push({ movie: movieIndex, import: importIndex, asset: assetIndex });
    });
  });

  const placeholderPrefix = compileMoviesPrefix(prepared);
  const trailer = new Writer().ascii("ATI1").u8(IMPORT_VERSION);
  trailer.u16(importCount);
  for (const binding of bindings) {
    const movie = prepared.movies[binding.movie];
    const imported = movie.imports[binding.import];
    trailer.u8(binding.movie).u8(imported.kind);
    trailer.u16(imported.destination);
    trailer.u8(imported.aux).u8(imported.label.length).ascii(imported.label);
    trailer.u16(imported.data.length);
    const dataCpuSize = BUNDLE_CPU + placeholderPrefix.length + trailer.length;
    require(dataCpuSize <= 0xffff, "import address exceeds CPU space");
    const dataCpu = dataCpuSize;
    if (imported.kind === ImportKind.MetaspriteLibrary) {
      movie.metasprite_pointer_lo = dataCpu;
      movie.metasprite_pointer_hi = (dataCpu + imported.aux) & 0xffff;
      trailer.raw(relocateMetasprites(imported, dataCpu));
    } else {
      movie.assets[binding.asset].cpu = dataCpu;
      trailer.raw(imported.data);
    }
  }
  const prefix = compileMoviesPrefix(prepared);
  require(prefix.length === placeholderPrefix.length, "import relocation changed movie record size");
  return new Writer().raw(prefix).raw(trailer.bytes()).bytes();
}

function requireCanonicalEncoding(bundle, data, consumed) {
  const canonical = compileBundleUnchecked(bundle);
  require(canonical.length === consumed && equalBytes(canonical, data.subarray(0, consumed)),
    "FMB1/ATI1 encoding is not canonical");
}

// ---- AtlasMovieBundleCodec ---------------------------------------------------

/** AtlasMovieBundleCodec::parse: one whole, validated, canonical FMB */
export function parseBundle(fmb) {
  const { bundle, consumed } = parseBundleRecords(fmb);
  require(consumed === fmb.length, "FMB1 bundle has trailing bytes");
  validate(bundle);
  requireCanonicalEncoding(bundle, fmb, consumed);
  return bundle;
}

/** validate one FMB at offset zero while allowing a containing bank tail */
export function validatedPrefixSize(data) {
  const { bundle, consumed } = parseBundleRecords(data);
  validate(bundle);
  requireCanonicalEncoding(bundle, data, consumed);
  return consumed;
}

/** -> { bytes, reserved_cpu_end, warnings } */
export function validate(bundle) {
  require(bundle.movies.length > 0, "bundle needs at least one movie");
  require(bundle.movies.length <= 0xffff, "project movie count exceeds 65535");
  let officialIntro = 0, officialEnding = 0;
  let introEnabled = false, endingEnabled = false;
  for (const movie of bundle.movies) {
    require(movie.project_role >= 0 && movie.project_role <= 2, "movie project role is invalid");
    if (movie.project_role === ProjectRole.OfficialIntro) { officialIntro++; introEnabled = movie.enabled; }
    if (movie.project_role === ProjectRole.OfficialEnding) { officialEnding++; endingEnabled = movie.enabled; }
  }
  require(officialIntro === 1 && officialEnding === 1 && introEnabled && endingEnabled,
    "project needs exactly one enabled official intro and one enabled official ending");
  const included = runtimeBundle(bundle);
  require(included.movies.length >= 2, "project must include official intro and ending movies");
  requireU8(included.movies.length, "included movie count");
  const ids = new Set();
  let totalImports = 0;
  for (const movie of bundle.movies) {
    require(movie.id.length > 0 && movie.id.length <= 255, "movie ID must contain 1..255 characters");
    require(allPrintable(movie.id), "movie ID must be printable ASCII");
    require(!ids.has(movie.id), "movie IDs must be unique");
    ids.add(movie.id);
    require(movie.exit_mode >= 1 && movie.exit_mode <= 3, "movie exit mode is invalid");
    require(movie.entry_music <= 16 || movie.entry_music === 0xfe || movie.entry_music === 0xff,
      "entry music must be stock ID 0..16, $FE stop, or $FF keep");
    require(movie.assets.length === 4, "each movie must upload four assets");
    require(movie.tracks.length > 0 && movie.tracks.length <= 8, "movie needs 1..8 tracks");
    require(movie.phases.length > 0 && movie.phases.length <= 255, "movie needs 1..255 phases");
    requireU8(movie.sfx.length, "SFX count");
    require(movie.metasprite_bank === 12 && movie.metasprite_count > 0,
      "metasprite library must be a nonempty bank-12 table");
    for (const pointer of [movie.metasprite_pointer_lo, movie.metasprite_pointer_hi])
      require(pointer >= 0x8000 && pointer + movie.metasprite_count <= 0xc000,
        "metasprite pointer table crosses bank 12");
    const assetKinds = new Set();
    for (const asset of movie.assets) {
      require(asset.kind >= 1 && asset.kind <= 4, "asset kind is invalid");
      require(!assetKinds.has(asset.kind), "asset kinds must be unique");
      assetKinds.add(asset.kind);
    }
    const singletonImports = new Set();
    const effectiveAssets = movie.assets.map((asset) => ({ ...asset }));
    for (const imported of movie.imports) {
      totalImports++;
      const kind = imported.kind;
      require(kind >= 1 && kind <= 5, "import kind is invalid");
      require(imported.label.length <= 255 && allPrintable(imported.label),
        "import label must be printable ASCII and at most 255 characters");
      require(imported.data.length > 0 && imported.data.length <= 0xffff,
        "import payload must contain 1..65535 bytes");
      if (imported.kind === ImportKind.MetaspriteLibrary) {
        require(!singletonImports.has(kind), "movie has multiple imported metasprite libraries");
        singletonImports.add(kind);
        require(imported.destination === 0, "imported metasprite destination must be zero");
        require(imported.aux === movie.metasprite_count,
          "imported metasprite count must match the movie frame count");
        metaspriteRecordOffsets(imported.data, imported.aux);
      } else if (imported.kind === ImportKind.SpriteChr) {
        require(imported.aux === 0, "non-metasprite import aux byte must be zero");
        effectiveAssets.push(makeAsset({ kind: AssetKind.SpriteChr, bank: 12, cpu: BUNDLE_CPU,
          destination_space: Destination.Ppu, destination: imported.destination,
          bytes: imported.data.length & 0xffff }));
      } else {
        require(imported.aux === 0, "non-metasprite import aux byte must be zero");
        require(!singletonImports.has(kind), "movie has multiple imports replacing the same asset kind");
        singletonImports.add(kind);
        const assetKind = kind - 1;
        const found = effectiveAssets.find((asset) => asset.kind === assetKind);
        require(found !== undefined, "import replaces a missing movie asset kind");
        found.bank = 12;
        found.cpu = BUNDLE_CPU;
        found.destination = imported.destination;
        found.bytes = imported.data.length & 0xffff;
      }
    }

    let paletteAssets = 0;
    const ppuRanges = [];
    for (const asset of effectiveAssets) {
      require(asset.kind >= 1 && asset.kind <= 4, "asset kind is invalid");
      require(asset.bank < 16 && asset.cpu >= 0x8000 && asset.cpu < 0xc000,
        "asset source is outside a switchable bank");
      require(asset.bytes > 0 && asset.cpu + asset.bytes <= 0xc000, "asset crosses its bank boundary");
      const destination = asset.destination + asset.bytes;
      if (asset.destination_space === Destination.Ppu) {
        require(asset.kind !== AssetKind.Palette && asset.bytes <= 4096 && asset.bytes % 16 === 0,
          "PPU assets must contain 1..4096 complete 16-byte blocks");
        if (asset.kind === AssetKind.SpriteChr || asset.kind === AssetKind.BackgroundChr)
          require(asset.destination % 16 === 0, "CHR destination must be aligned to a 16-byte tile");
        if (asset.kind === AssetKind.SpriteChr)
          require(destination <= 0x1000, "sprite CHR crosses pattern table $0FFF");
        else if (asset.kind === AssetKind.BackgroundChr)
          require(asset.destination >= 0x1000 && destination <= 0x2000,
            "background CHR must stay in pattern table $1000-$1FFF");
        else if (asset.kind === AssetKind.Nametable)
          require(asset.destination === 0x2000 && asset.bytes === 0x0400,
            "nametable must be exactly 1024 bytes at $2000");
        for (const [start, end] of ppuRanges)
          require(asset.destination >= end || destination <= start, "PPU asset destinations overlap");
        ppuRanges.push([asset.destination, destination]);
      } else {
        require(asset.destination_space === Destination.Ram && asset.kind === AssetKind.Palette
          && asset.bank === 12 && asset.destination === 0x0293 && asset.bytes === 32,
          "RAM asset must be the 32-byte bank-12 palette copied to $0293");
        paletteAssets++;
      }
    }
    require(paletteAssets === 1, "movie needs exactly one RAM palette asset");
    for (const track of movie.tracks) {
      require(track.editor_name.length <= 63, "actor name exceeds 63 characters");
      require(track.editor_group.length <= 63, "actor group exceeds 63 characters");
      require(track.editor_waypoints.length <= 16, "actor path exceeds sixteen editable waypoints");
      const validateEditorFrames = (frames, label) => {
        for (const frame of frames)
          require(frame < movie.metasprite_count, `${label} references a missing metasprite frame`);
      };
      const anim = track.editor_animation;
      validateEditorFrames(anim.idle, "idle animation");
      validateEditorFrames(anim.left, "left animation");
      validateEditorFrames(anim.right, "right animation");
      validateEditorFrames(anim.toward, "toward animation");
      validateEditorFrames(anim.away, "away animation");
      validateEditorFrames(anim.attack, "attack animation");
      validateEditorFrames(anim.hurt, "hurt animation");
      require(track.kind >= 1 && track.kind <= 3, "track kind is invalid");
      if (track.kind === TrackKind.Path || track.kind === TrackKind.Cyclic)
        require(track.integrator_shift >= 1 && track.integrator_shift <= 8, "integrator shift must be 1..8");
      if (track.kind === TrackKind.Path) {
        require(track.coordinate >= 1 && track.coordinate <= 2
          && track.comparison >= 1 && track.comparison <= 2,
          "path gate coordinate/comparison is invalid");
        require(track.keyframes.length > 0 && track.keyframes.length <= 15, "path needs 1..15 keyframes");
        require(track.stage_frames.length === track.keyframes.length + 1,
          "path frame stages must equal keyframes + 1");
        require(track.dwell_frames > 0, "path dwell cannot be zero");
        const slots = track.stage_frames[0].length;
        require(slots > 0 && slots <= 255, "path stages need 1..255 animation slots");
        for (const row of track.stage_frames) {
          require(row.length === slots, "path animation rows must have equal slot counts");
          for (const frame of row)
            require(frame < movie.metasprite_count, "path references a missing metasprite frame");
        }
      } else if (track.kind === TrackKind.Cyclic) {
        require(track.dwell_frames > 0, "cyclic dwell cannot be zero");
        require(track.visible_frames.length > 0 && track.visible_frames.length < track.reset_at_pose,
          "cyclic visible frames must end before reset pose");
        for (const frame of track.visible_frames)
          require(frame < movie.metasprite_count, "cyclic track references a missing metasprite frame");
      } else {
        require(track.counter_mask > 0 && track.toggle_frames.length === 2,
          "counter toggle needs a mask and exactly two frames");
        require(track.counter_address <= 0x07ff, "counter toggle address must be internal RAM $0000-$07FF");
        for (const frame of track.toggle_frames)
          require(frame < movie.metasprite_count, "counter toggle references a missing metasprite frame");
      }
      require(compileTrack(track).length <= 255,
        "track record exceeds the movie player's 255-byte indexing limit");
    }
    const allowedMask = (1 << movie.tracks.length) - 1;
    for (const phase of movie.phases) {
      require(phase.enter_action >= 0 && phase.enter_action <= 1, "phase enter action is invalid");
      require(phase.effect >= 0 && phase.effect <= 1, "phase effect is invalid");
      require(phase.condition >= 1 && phase.condition <= 5, "phase condition is invalid");
      require(((phase.update_mask | phase.draw_mask) & ~allowedMask & 0xff) === 0,
        "phase masks reference missing tracks");
      if (phase.effect === Effect.PaletteFade)
        require(phase.effect_track < movie.tracks.length && phase.effect_period > 0,
          "palette fade needs a valid track and nonzero period");
      if (phase.condition === Condition.TrackYGte)
        require(phase.condition_track < movie.tracks.length && phase.condition_value <= 0xff,
          "track-Y phase condition needs a valid track and an 8-bit threshold");
    }
    for (const event of movie.sfx) {
      require(event.track < movie.tracks.length, "SFX references a missing track");
      require(movie.tracks[event.track].kind === TrackKind.Path, "SFX triggers require a path track");
      require((event.tick_value & ~event.tick_mask) === 0 && (event.slot_value & ~event.slot_mask) === 0,
        "SFX trigger value escapes its mask");
    }
  }
  require(totalImports <= 0xffff, "ATI1 import count exceeds 65535");
  const bytes = compileBundleUnchecked(included).length;
  const end = BUNDLE_CPU + bytes + DISPATCH_BYTES;
  if (end > 0xc000) {
    const capacity = 0xc000 - BUNDLE_CPU;
    const used = bytes + DISPATCH_BYTES;
    throw new MovieError(`bank 12 overflow by ${used - capacity} bytes (${used} used / ${capacity} available, including ${DISPATCH_BYTES} dispatch bytes)`);
  }
  return { bytes, reserved_cpu_end: end & 0xffff,
    warnings: ["Sprite/OAM budgets require validation against the selected ROM metasprite library."] };
}

/** AtlasMovieBundleCodec::compile: the runtime FMB (enabled movies, intro and ending first) */
export function compileBundle(bundle) {
  validate(bundle);
  return compileBundleUnchecked(runtimeBundle(bundle));
}

/** -> { bundle_header_bytes, import_header_bytes, movies, tracks, assets, imports, phases, events, suggestions } */
export function detailedBudget(bundle) {
  validate(bundle);
  const included = runtimeBundle(bundle);
  const result = { bundle_header_bytes: 0, import_header_bytes: 0, movies: [], tracks: [], assets: [],
    imports: [], phases: [], events: [], suggestions: [] };
  result.bundle_header_bytes = 6 + included.movies.length * 2;
  let importCount = 0;
  for (const movie of included.movies) importCount += movie.imports.length;
  result.import_header_bytes = importCount ? 7 : 0;
  for (const movie of included.movies) {
    let movieBytes = compileMovie(movie).length;
    for (const imported of movie.imports) if (imported.kind === ImportKind.SpriteChr) movieBytes += 10;
    result.movies.push({ label: movie.id, bytes: movieBytes + 2 });
    movie.tracks.forEach((track, i) => {
      result.tracks.push({ label: `${movie.id} / ${track.editor_name ? track.editor_name : `Actor ${i + 1}`}`,
        bytes: compileTrack(track).length + 2 });
    });
    movie.assets.forEach((_, i) => result.assets.push({ label: `${movie.id} / asset ${i}`, bytes: 9 }));
    for (const imported of movie.imports) {
      result.imports.push({ label: `${movie.id} / ${imported.label}`,
        bytes: 8 + imported.label.length + imported.data.length });
      if (imported.kind === ImportKind.SpriteChr)
        result.assets.push({ label: `${movie.id} / ${imported.label} CHR descriptor`, bytes: 9 });
    }
    movie.phases.forEach((_, i) => result.phases.push({ label: `${movie.id} / phase ${i}`, bytes: 14 }));
    movie.sfx.forEach((_, i) => result.events.push({ label: `${movie.id} / SFX ${i}`, bytes: 7 }));
  }
  const movies = included.movies;
  for (let movieA = 0; movieA < movies.length; movieA++)
    for (let importA = 0; importA < movies[movieA].imports.length; importA++)
      for (let movieB = movieA; movieB < movies.length; movieB++)
        for (let importB = movieB === movieA ? importA + 1 : 0; importB < movies[movieB].imports.length; importB++) {
          const a = movies[movieA].imports[importA];
          const b = movies[movieB].imports[importB];
          if (a.kind === b.kind && equalBytes(a.data, b.data))
            result.suggestions.push(`Duplicate ${a.data.length}-byte import: ${movies[movieA].id}/${a.label} and ${movies[movieB].id}/${b.label}; reuse one ROM-owned asset or shared import`);
        }
  if (result.imports.length)
    result.suggestions.push("Imported graphics dominate quickly; prefer existing ROM CHR/nametables when the scene permits it.");
  return result;
}

/** the one-movie FMB1 (+ATI1) blob an AMP1 file stores for a movie, unvalidated */
export function compileMovieBlob(movie) {
  const stored = clone(movie); stored.enabled = true;
  return compileBundleUnchecked(makeBundle({ movies: [stored] }));
}

/** AtlasMovieBundleCodec::compile_project: the AMP1 file */
export function compileProject(bundle) {
  validate(bundle);
  const result = new Writer().ascii("AMP1").u8(PROJECT_VERSION);
  result.u16(bundle.movies.length);
  for (const movie of bundle.movies) {
    const fmb = compileMovieBlob(movie);
    require(fmb.length <= 0xffffffff, "project movie blob exceeds 4 GiB");
    result.u8(movie.enabled ? 1 : 0);
    result.u8(movie.project_role);
    result.u32(fmb.length);
    result.raw(fmb);
    const editor = compileEditorMetadata(movie);
    result.u32(editor.length);
    result.raw(editor);
  }
  return result.bytes();
}
export const writeProject = compileProject;

/** AtlasMovieBundleCodec::parse_project: AMP1 version 1 or 2 -> bundle */
export function parseProject(amp) {
  const r = new Reader(amp, "AMP1 project");
  require(magicIs(r.bytes(4), "AMP1"), "bad AMP1 magic");
  const projectVersion = r.u8();
  require(projectVersion >= 1 && projectVersion <= PROJECT_VERSION, "unsupported AMP1 version");
  const count = r.u16();
  const result = makeBundle();
  for (let i = 0; i < count; i++) {
    const enabled = r.u8();
    require(enabled <= 1, "AMP1 enabled flag is invalid");
    const role = checkedEnum(r.u8(), 0, 2, "AMP1 project role");
    const bytes = r.u32();
    const blob = r.bytes(bytes);
    const { bundle: single, consumed } = parseBundleRecords(blob);
    require(consumed === blob.length, "AMP1 movie blob has trailing bytes");
    require(single.movies.length === 1, "AMP1 entry must contain exactly one movie");
    requireCanonicalEncoding(single, blob, consumed);
    const movie = single.movies[0];
    movie.enabled = enabled !== 0;
    movie.project_role = role;
    if (projectVersion >= 2) parseEditorMetadata(movie, r.bytes(r.u32()));
    else ensureEditorDefaults(movie);
    result.movies.push(movie);
  }
  r.done();
  validate(result);
  return result;
}

// ---- AME1 packages and installed ROMs ---------------------------------------
// `engine` carries { validatePackage(ame), isInstalled(rom) } from engine.mjs.
// Without validatePackage the AME helpers fall back to the header and length
// checks of AtlasMovieEngine::validate_package and parse the FMB; they cannot
// compare the executable bytes. isInstalled has no fallback.

function structuralValidatePackage(ame) {
  if (ame.length < 11 || !magicIs(ame.subarray(0, 5), "AME1\x01"))
    throw new MovieError("Invalid Atlas Movie Engine AME1 package");
  const coreSize = readWord(ame, 5), tailSize = readWord(ame, 7), bundleSize = readWord(ame, 9);
  if (coreSize !== layout.CORE_BYTES || tailSize !== layout.TAIL_BYTES)
    throw new MovieError("Unsupported Atlas Movie Engine code version");
  if (11 + coreSize + tailSize + bundleSize !== ame.length)
    throw new MovieError("Atlas Movie Engine package length is inconsistent");
  parseBundle(ame.subarray(11 + coreSize + tailSize));
}

const requireIsInstalled = (engine) => {
  require(engine && typeof engine.isInstalled === "function",
    "Atlas Movie Engine is required to read an installed ROM");
  return engine.isInstalled;
};

export function extractFromAme(ame, engine = {}) {
  (engine.validatePackage || structuralValidatePackage)(ame);
  const core = readWord(ame, 5), tail = readWord(ame, 7);
  readWord(ame, 9);
  return ame.slice(11 + core + tail);
}

export function replaceInAme(ame, bundle, engine = {}) {
  extractFromAme(ame, engine);
  validate(bundle);
  const fmb = compileBundle(bundle);
  const core = readWord(ame, 5), tail = readWord(ame, 7);
  const result = new Uint8Array(11 + core + tail + fmb.length);
  result.set(ame.subarray(0, 11 + core + tail));
  writeWord(result, 9, fmb.length & 0xffff);
  result.set(fmb, 11 + core + tail);
  return result;
}

function installedBundleCpu(rom, engine) {
  // the engine says where the bundle is: at its stock address, or above the
  // ROM's own data when the tail was floated (engine.installedLayout)
  if (typeof engine.installedLayout === "function") {
    const layout = engine.installedLayout(rom);
    require(layout !== null, "Atlas Movie Engine is not installed");
    return layout;
  }
  require(requireIsInstalled(engine)(rom), "Atlas Movie Engine is not installed");
  return { adapter: layout.HANDLER_CPU, bundle: BUNDLE_CPU };
}

export function extractFromInstalledRom(rom, engine = {}) {
  const layout = installedBundleCpu(rom, engine);
  const start = fileOffset(12, layout.bundle);
  require(start < rom.length, "installed bundle address is outside ROM");
  const bankTail = rom.slice(start, Math.min(rom.length, fileOffset(12, 0xbfff) + 1));
  const { bundle, consumed } = parseBundleRecords(bankTail);
  validate(bundle);
  requireCanonicalEncoding(bundle, bankTail, consumed);
  return bankTail.slice(0, consumed);
}

/** writes the ROM in place; -> the validate() report */
export function replaceInInstalledRom(rom, bundle, engine = {}) {
  const layout = installedBundleCpu(rom, engine);
  const oldFmb = extractFromInstalledRom(rom, engine);
  const handlerAt = (i) => i + 1 === HANDLERS.length ? (layout.adapter - 1) & 0xffff : HANDLERS[i];
  const oldLow = (layout.bundle + oldFmb.length) & 0xffff;
  const oldHigh = (oldLow + VANILLA_HANDLER_COUNT) & 0xffff;
  require(readWord(rom, fileOffset(12, DISPATCH_LOW_REF)) === oldLow
    && readWord(rom, fileOffset(12, DISPATCH_HIGH_REF)) === oldHigh,
    "active dispatch tables were relocated; export an AME before adding generated opcodes");
  for (let i = 0; i < HANDLERS.length; i++) {
    require(rom[fileOffset(12, oldLow) + i] === (handlerAt(i) & 0xff)
      && rom[fileOffset(12, oldHigh) + i] === (handlerAt(i) >> 8),
      "active opcode tables are not the plain Atlas layout");
  }

  const report = validate(bundle);
  const fmb = compileBundle(bundle);
  const newLow = (layout.bundle + fmb.length) & 0xffff;
  const newHigh = (newLow + VANILLA_HANDLER_COUNT) & 0xffff;
  const oldEnd = (oldHigh + VANILLA_HANDLER_COUNT) & 0xffff;
  const newEnd = (newHigh + VANILLA_HANDLER_COUNT) & 0xffff;
  rom.fill(0xff, fileOffset(12, layout.bundle), fileOffset(12, Math.max(oldEnd, newEnd)));
  rom.set(fmb, fileOffset(12, layout.bundle));
  for (let i = 0; i < HANDLERS.length; i++) {
    rom[fileOffset(12, newLow) + i] = handlerAt(i) & 0xff;
    rom[fileOffset(12, newHigh) + i] = handlerAt(i) >> 8;
  }
  writeWord(rom, fileOffset(12, DISPATCH_LOW_REF), newLow);
  writeWord(rom, fileOffset(12, DISPATCH_HIGH_REF), newHigh);
  return report;
}
