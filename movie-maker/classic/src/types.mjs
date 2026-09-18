// The movie data model, mirroring eoe_core/src/fe/AtlasMovieBundle.h field for
// field, with the same defaults. Every module in this port builds and reads
// these plain objects; the byte formats live in bundle.mjs.

export const Exit = Object.freeze({ NewGame: 1, TitleReset: 2, ReloadScreen: 3 });
export const AssetKind = Object.freeze({ SpriteChr: 1, BackgroundChr: 2, Nametable: 3, Palette: 4 });
export const Destination = Object.freeze({ Ppu: 0, Ram: 1 });
export const TrackKind = Object.freeze({ Path: 1, Cyclic: 2, CounterToggle: 3 });
export const Coordinate = Object.freeze({ X: 1, Y: 2 });
export const Comparison = Object.freeze({ LessThan: 1, GreaterEqual: 2 });
export const EnterAction = Object.freeze({ None: 0, SetFrameCounter: 1 });
export const Effect = Object.freeze({ None: 0, PaletteFade: 1 });
export const Condition = Object.freeze({
  EffectCalls: 1, TrackYGte: 2, MusicZero: 3, FrameCounterZero: 4, Frames: 5,
});
export const ImportKind = Object.freeze({
  SpriteChr: 1, MetaspriteLibrary: 2, BackgroundChr: 3, Nametable: 4, Palette: 5,
});
export const ProjectRole = Object.freeze({ Normal: 0, OfficialIntro: 1, OfficialEnding: 2 });

export const FORMAT_VERSION = 2;   // FMB1 / FMV1
export const IMPORT_VERSION = 1;   // ATI1
export const PROJECT_VERSION = 2;  // AMP1
export const METADATA_VERSION = 1; // APM1

// the eight editor colours the C++ hands out, ARGB as it stores them
export const ACTOR_COLORS = Object.freeze([
  0xff46beff, 0xffffd250, 0xff825aff, 0xff82ff78,
  0xffff82c8, 0xff78aaff, 0xff78f5ff, 0xff4696ff,
]);

export function makeAsset(over = {}) {
  return { kind: AssetKind.SpriteChr, bank: 12, cpu: 0x8000, destination_space: Destination.Ppu,
           destination: 0, bytes: 1, ...over };
}

export function makeKeyframe(over = {}) {
  return { threshold: 0, velocity_x: 0, velocity_y: 0, ...over };
}

export function makeAnimationSet(over = {}) {
  return { automatic_facing: false, idle: [], left: [], right: [], toward: [], away: [],
           attack: [], hurt: [], ...over };
}

export function makeTrack(over = {}) {
  return {
    kind: TrackKind.Path,
    x: 0, x_fraction: 0, y: 0, y_fraction: 0,
    velocity_x: 0, velocity_y: 0,
    integrator_shift: 7,
    coordinate: Coordinate.Y,
    comparison: Comparison.GreaterEqual,
    keyframes: [],
    dwell_frames: 16,
    stage_frames: [],
    reset_at_pose: 1,
    visible_frames: [],
    counter_address: 0x001a,
    counter_mask: 1,
    toggle_frames: [0, 0],
    editor_name: "",
    editor_color: 0,
    editor_group: "",
    editor_waypoints: [],
    editor_animation: makeAnimationSet(),
    ...over,
  };
}

export function makeSfx(over = {}) {
  return { track: 0, sound: 0, stage_lt: 0xff, tick_mask: 0, tick_value: 0, slot_mask: 0,
           slot_value: 0, ...over };
}

export function makePhase(over = {}) {
  return {
    update_mask: 1, draw_mask: 1,
    enter_action: EnterAction.None, enter_value: 0,
    effect: Effect.None, effect_track: 0xff, effect_stage: 0, effect_period: 0,
    effect_subtract: 0, effect_floor: 0,
    condition: Condition.Frames, condition_track: 0xff, condition_value: 1,
    ...over,
  };
}

export function makeImport(over = {}) {
  return { kind: ImportKind.SpriteChr, label: "", destination: 0, aux: 0, data: new Uint8Array(0),
           ...over };
}

export function makeMovie(over = {}) {
  return {
    id: "movie",
    enabled: true,
    project_role: ProjectRole.Normal,
    exit_mode: Exit.ReloadScreen,
    entry_music: 0xff,
    metasprite_bank: 12,
    metasprite_pointer_lo: 0xaa53,
    metasprite_pointer_hi: 0xaa6b,
    metasprite_count: 24,
    assets: [], tracks: [], sfx: [], phases: [], imports: [],
    ...over,
  };
}

export function makeBundle(over = {}) {
  return { movies: [], ...over };
}
