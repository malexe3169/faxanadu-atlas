// The game's own opening and ending, read out of the ROM as movies. This is
// tools/fax_movie.py's extractor (and the tables tools/fax_splash.py names),
// ported: the stock cinematic engine in bank 12 keeps its motion in small
// tables, and those tables are exactly what a Path, two Cyclic actors and a
// CounterToggle waterfall encode, so the stock scenes open as editable movies
// with the hero's real route. The compiled bytes are checked against the
// Python compiler's output in test/stock.test.mjs.
//
// Everything here is bank 12 code data of the USA game; a mod built by
// FaxEdit keeps it (FaxEdit never moves the intro engine), and a ROM that
// already carries our engine has lost it, which `available` reports.
import { MovieError } from "./bytes.mjs";
import { fileOffset } from "./engine.mjs";
import {
  makeMovie, makeTrack, makePhase, makeSfx, makeBundle, makeKeyframe, AssetKind, Destination,
  TrackKind, Coordinate, Comparison, Condition, Effect, EnterAction, Exit, ProjectRole, ACTOR_COLORS,
} from "./types.mjs";

const BANK = 12, ASSET_BANK = 10;
const STAGE_TABLE = 0xa859, STAGES = 4;
const FRAME_TABLE = { intro: 0xa8de, outro: 0xa8fb }, FRAME_STAGES = 5;
const NAMETABLE_PTR = [0xa728, 0xa72a], PALETTE_PTR = [0xa72c, 0xa72e];
const ACTOR_INIT = { x: 0xa994, y: 0xa996, vx: 0xa998, vy: 0xa99a }, ACTOR_METASPRITES = 0xaa18;
const PATH_INITIAL = {
  intro: { x: 0x18, y: 0xff, vx: 0x20, vy: 0xe0 },
  outro: { x: 0x70, y: 0xae, vx: 0xfd, vy: 0x01 },
};
// the immediates of the scene setup at $A730, the same five fax_splash pins
const SETUP_IMMEDIATES = [[0xa74d, 0xa9, 0xa0], [0xa751, 0xa9, 0xa4], [0xa75d, 0xa2, 0x0a], [0xa75f, 0xa0, 0x80], [0xa779, 0xa2, 0x0a]];

const s8 = (v) => (v >= 0x80 ? v - 0x100 : v);
const byte = (rom, cpu) => rom[fileOffset(BANK, cpu)];

/** true when the ROM still carries the stock cinematic engine's tables */
export function stockAvailable(rom) {
  return SETUP_IMMEDIATES.every(([cpu, op, imm]) => byte(rom, cpu) === op && byte(rom, cpu + 1) === imm);
}

// the six four byte tables from $A859: thresholds, then x and y velocities,
// intro then outro; every table but the first sits one byte further along
function stageTables(rom) {
  const names = ["intro_thresholds", "intro_vx", "intro_vy", "outro_thresholds", "outro_vx", "outro_vy"];
  const out = {};
  names.forEach((name, i) => {
    const base = STAGE_TABLE + i * STAGES + (i >= 1 ? 1 : 0);
    out[name] = Array.from({ length: STAGES }, (_, k) => byte(rom, base + k));
  });
  return out;
}

function heroTrack(rom, scene) {
  const tables = stageTables(rom), init = PATH_INITIAL[scene];
  const track = makeTrack({
    kind: TrackKind.Path, x: init.x, y: init.y, velocity_x: s8(init.vx), velocity_y: s8(init.vy),
    integrator_shift: 7, coordinate: Coordinate.Y,
    comparison: scene === "intro" ? Comparison.LessThan : Comparison.GreaterEqual,
    dwell_frames: 16, editor_name: "Hero", editor_color: ACTOR_COLORS[0],
  });
  for (let stage = 0; stage < STAGES; stage++)
    track.keyframes.push(makeKeyframe({ threshold: tables[`${scene}_thresholds`][stage],
      velocity_x: s8(tables[`${scene}_vx`][stage]), velocity_y: s8(tables[`${scene}_vy`][stage]) }));
  for (let stage = 0; stage < FRAME_STAGES; stage++)
    track.stage_frames.push(Array.from({ length: 4 }, (_, k) => byte(rom, FRAME_TABLE[scene] + stage * 4 + k)));
  return track;
}

function actorTracks(rom) {
  return [0, 1].map((i) => makeTrack({
    kind: TrackKind.Cyclic,
    x: byte(rom, ACTOR_INIT.x + i), y: byte(rom, ACTOR_INIT.y + i),
    velocity_x: s8(byte(rom, ACTOR_INIT.vx + i)), velocity_y: s8(byte(rom, ACTOR_INIT.vy + i)),
    integrator_shift: 1, dwell_frames: 8, reset_at_pose: 10,
    visible_frames: [0, 1, 2].map((p) => byte(rom, ACTOR_METASPRITES + i * 4 + p)),
    editor_name: `Actor ${i + 1}`, editor_color: ACTOR_COLORS[i + 1],
  }));
}

function waterfallTrack() {
  return makeTrack({ kind: TrackKind.CounterToggle, x: 0xe0, y: 0x78, counter_address: 0x001a, counter_mask: 0x10,
    toggle_frames: [0x18, 0x19], editor_name: "Waterfall", editor_color: ACTOR_COLORS[3] });
}

function assets(rom, index) {
  const ptr = ([lo, hi]) => byte(rom, lo + index) | (byte(rom, hi + index) << 8);
  return [
    { kind: AssetKind.SpriteChr, bank: ASSET_BANK, cpu: 0x9ba0, destination_space: Destination.Ppu, destination: 0x0000, bytes: 0x900 },
    { kind: AssetKind.BackgroundChr, bank: ASSET_BANK, cpu: 0xa4a0, destination_space: Destination.Ppu, destination: 0x1800, bytes: 0x800 },
    { kind: AssetKind.Nametable, bank: ASSET_BANK, cpu: ptr(NAMETABLE_PTR), destination_space: Destination.Ppu, destination: 0x2000, bytes: 0x400 },
    { kind: AssetKind.Palette, bank: BANK, cpu: ptr(PALETTE_PTR), destination_space: Destination.Ram, destination: 0x0293, bytes: 32 },
  ];
}

/** the opening: the hero walks in and the palette fades to black */
export function stockIntro(rom) {
  const movie = makeMovie({ id: "intro", project_role: ProjectRole.OfficialIntro, exit_mode: Exit.NewGame, entry_music: 0xfe,
    metasprite_bank: BANK, metasprite_pointer_lo: 0xab17, metasprite_pointer_hi: 0xab37, metasprite_count: 32 });
  movie.assets = assets(rom, 0);
  movie.tracks = [heroTrack(rom, "intro")];
  movie.sfx = [makeSfx({ track: 0, sound: 0x15, stage_lt: 3, tick_mask: 0x0f, tick_value: 0, slot_mask: 0x01, slot_value: 0 })];
  movie.phases = [makePhase({ update_mask: 1, draw_mask: 1, effect: Effect.PaletteFade, effect_track: 0, effect_stage: 4,
    effect_period: 8, effect_subtract: 0x10, effect_floor: 0x0f, condition: Condition.EffectCalls, condition_value: 0x20 })];
  return movie;
}

/** the ending: the hero walks off, two figures and the waterfall keep going
 *  until the music stops, then a four second hold */
export function stockOutro(rom) {
  const movie = makeMovie({ id: "outro", project_role: ProjectRole.OfficialEnding, exit_mode: Exit.TitleReset, entry_music: 0x0c,
    metasprite_bank: BANK, metasprite_pointer_lo: 0xab17, metasprite_pointer_hi: 0xab37, metasprite_count: 32 });
  movie.assets = assets(rom, 1);
  movie.tracks = [heroTrack(rom, "outro"), ...actorTracks(rom), waterfallTrack()];
  movie.phases = [
    makePhase({ update_mask: 0b0111, draw_mask: 0b1111, condition: Condition.TrackYGte, condition_track: 0, condition_value: 0xfa }),
    makePhase({ update_mask: 0b0110, draw_mask: 0b1110, condition: Condition.MusicZero, condition_value: 0 }),
    makePhase({ update_mask: 0b0110, draw_mask: 0b1110, enter_action: EnterAction.SetFrameCounter, enter_value: 0x10,
      condition: Condition.FrameCounterZero, condition_value: 0 }),
  ];
  return movie;
}

/** the game's own way of doing depth: the hero is not scaled (the NES cannot),
 *  he changes metasprite as he climbs, five sizes from 16x40 at the bottom of
 *  the road to 8x16 near the castle, one set walking away (the intro) and one
 *  walking toward (the ending). Read from the same tables: for each facing,
 *  rows of four poses with the lowest Y that row is drawn at, biggest first.
 *  A movie that uses the stock 32 frame table can use this ladder. */
export function stockLadder(rom) {
  if (!stockAvailable(rom)) return null;
  const tables = stageTables(rom);
  const rows = (scene, thresholds) => Array.from({ length: FRAME_STAGES }, (_, stage) => ({
    floor: stage < STAGES ? thresholds[stage] : 0,
    frames: Array.from({ length: 4 }, (_, k) => byte(rom, FRAME_TABLE[scene] + stage * 4 + k)),
  }));
  // the intro's stages run bottom to top (thresholds descend); the ending's
  // run top to bottom, so its rows are reversed to read biggest first
  const away = rows("intro", tables.intro_thresholds);
  const outro = rows("outro", tables.outro_thresholds);
  const toward = outro.map((row, i) => ({ floor: away[i].floor, frames: outro[FRAME_STAGES - 1 - i].frames }));
  return { away, toward, usesStockTable: (movie) => movie.metasprite_pointer_lo === 0xab17 && movie.metasprite_count === 32 };
}

/** the ladder row for a figure at `y` moving by `vy`: away when climbing
 *  (or still), toward when coming down */
export function ladderRow(ladder, y, vy) {
  const facing = vy > 0 ? ladder.toward : ladder.away;
  return (facing.find((row) => y >= row.floor) || facing[facing.length - 1]).frames.slice();
}

/** both stock movies as a project; throws when the ROM has lost the engine */
export function stockBundle(rom) {
  if (!stockAvailable(rom)) throw new MovieError("this ROM no longer carries the game's own intro engine, so its intro and ending cannot be read");
  const bundle = makeBundle();
  bundle.movies.push(stockIntro(rom), stockOutro(rom));
  return bundle;
}
