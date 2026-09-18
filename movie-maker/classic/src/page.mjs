// The movie maker page's model: everything index.html does that is not the
// DOM. A ROM comes in as bytes and stays in the browser; a project is the
// same .amp the desktop creator reads; the canvas is painted from render.mjs;
// the exports are the project, a config override for a FaxEdit project, and
// the ROM with the engine and movies installed, as a .nes and as an IPS.
// Nothing here touches a window, so test/page.test.mjs can drive it all.
import { MovieError, equalBytes } from "./bytes.mjs";
import { parseProject, writeProject, compileBundle, validate, detailedBudget } from "./bundle.mjs";
import { makeStarterProject, applyPaintedPath, simulatedPath, translateActor, defaultTrack, pasteActors, removeMaskBit, ensureUniqueId } from "./editor.mjs";
import { preview } from "./preview.mjs";
import { decodeChr, decodeMovieFrames, resolvedAssetBytes, movieSpriteTiles, findAsset, findImport, replaceImport, encodeMetaspriteLibrary, encodeChr } from "./assets.mjs";
import { importBackground, importFigure, BACKGROUND_TILES } from "./art.mjs";
import { AssetKind, Coordinate, Comparison, ProjectRole, TrackKind, ACTOR_COLORS, ImportKind, makeImport, Condition, Effect, Exit, makePhase } from "./types.mjs";
import { rasterCaption } from "./font.mjs";
import { buildPackage, install, installedLayout, layout } from "./engine.mjs";
import { ENGINE_CODE } from "./engine_code.mjs";
import { bank12Extent, plan } from "./space.mjs";
import { makeIps } from "./ips.mjs";
import { markerReport, rewriteMarkers } from "./markers.mjs";
import { stockAvailable, stockBundle, stockLadder, ladderRow, stockIntro, stockOutro } from "./stock.mjs";
import { makeSurface, drawNametable, drawFrame, frameThumbnail } from "./render.mjs";
import { loadVanillaOpcodes, resolveOpcodeInfo, standaloneConfigOverride } from "./runtime.mjs";

export const VERSION = "1";

// the four retail dumps, by the hash of the PRG with the header removed
export const BODIES = Object.freeze({
  "5b05c8859f356013d37f0545f5de5fa1693da5da": { key: "usa", en: "USA", fr: "USA" },
  "d0c6af83c44f2dc90bcb0792a69c93f8d167f988": { key: "usa-rev1", en: "USA Rev 1", fr: "USA Rev 1" },
  "0711bc8d0bf42a0829391c2320393a0d3df2dd1f": { key: "europe", en: "Europe", fr: "Europe" },
  "6501f61fd717ae603c2265d0df074ac2a4dcb8c7": { key: "japan", en: "Japan", fr: "Japon" },
});

// ---- SHA-1, small and synchronous, so node and the browser agree -----------
export function sha1(bytes) {
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const len = bytes.length, total = ((len + 8) >> 6) + 1;
  const words = new Uint32Array(total * 16);
  for (let i = 0; i < len; i++) words[i >> 2] |= bytes[i] << (24 - (i & 3) * 8);
  words[len >> 2] |= 0x80 << (24 - (len & 3) * 8);
  words[total * 16 - 1] = len * 8;
  const w = new Uint32Array(80);
  const rotl = (x, n) => (x << n) | (x >>> (32 - n));
  for (let b = 0; b < total; b++) {
    for (let i = 0; i < 16; i++) w[i] = words[b * 16 + i];
    for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    let [a, bb, c, d, e] = h;
    for (let i = 0; i < 80; i++) {
      const f = i < 20 ? ((bb & c) | (~bb & d)) + 0x5a827999
        : i < 40 ? (bb ^ c ^ d) + 0x6ed9eba1
        : i < 60 ? ((bb & c) | (bb & d) | (c & d)) + 0x8f1bbcdc
        : (bb ^ c ^ d) + 0xca62c1d6;
      const t = (rotl(a, 5) + f + e + w[i]) >>> 0;
      e = d; d = c; c = rotl(bb, 30) >>> 0; bb = a; a = t;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + bb) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0; h[4] = (h[4] + e) >>> 0;
  }
  return h.map((x) => x.toString(16).padStart(8, "0")).join("");
}

// ---- the ROM ----------------------------------------------------------------
/** what the page knows about a dropped file */
export function loadRom(bytes) {
  const rom = Uint8Array.from(bytes);
  const size = layout.HEADER_BYTES + 16 * layout.PRG_BANK_BYTES;
  const shaped = rom.length === size && rom[0] === 0x4e && rom[1] === 0x45 && rom[2] === 0x53 && rom[3] === 0x1a;
  const bodySha1 = shaped ? sha1(rom.subarray(16)) : null;
  const region = shaped ? (BODIES[bodySha1] || null) : null;
  const info = {
    rom, bytes: rom.length, shaped,
    fileSha1: sha1(rom), bodySha1,
    region: region ? region.key : (shaped ? "modified" : "not a rom"),
    regionName: region || null,
    usable: shaped && bodySha1 !== null && (region === null || region.key === "usa" || true) && bodySha1 !== BODIES_JAPAN,
    extent: shaped ? bank12Extent(rom) : null,
    installed: shaped ? installedLayout(rom, ENGINE_CODE) : null,
    stock: shaped && stockAvailable(rom),   // the game's own intro and ending can be read as movies
  };
  // the engine is pinned to the USA game's code: a stock USA dump, or a mod
  // built from one (install checks the five signature spans itself)
  info.usable = shaped && (info.region === "usa" || info.region === "modified");
  return info;
}
const BODIES_JAPAN = "6501f61fd717ae603c2265d0df074ac2a4dcb8c7";

// ---- the project --------------------------------------------------------------
/** the desktop creator's starter, with its actor walking: the C++ starter
 *  stands still for 120 frames, which reads as a frozen screen in the game
 *  (the owner's first play: "only a screen, no animation") */
export function newProject() {
  const project = makeStarterProject();
  for (const movie of project.movies) {
    const actor = movie.tracks[0];
    actor.velocity_x = 48; actor.integrator_shift = 7; actor.dwell_frames = 8;      // 3/8 px a frame, the painted path speed
    actor.coordinate = Coordinate.X; actor.comparison = Comparison.GreaterEqual;              // the default track gates on Y
    actor.keyframes = [{ threshold: Math.min(actor.x + 96, 240), velocity_x: 0, velocity_y: 0 }];
    actor.stage_frames = [[0, 1, 2, 1], [0, 0, 0, 0]];                              // the stock walk cycle, then standing (rows share a slot count)
    movie.phases[0].condition_value = 300;
  }
  validate(project);
  return project;
}
export function openProject(bytes) { return parseProject(Uint8Array.from(bytes)); }

/** the ROM's own intro and ending as the project, with the starter's extra
 *  scene kept so a script marker has something to point at */
export function stockProject(romInfo) {
  if (!romInfo || !romInfo.stock) throw new MovieError("this ROM does not carry the game's own intro engine");
  const project = stockBundle(romInfo.rom);
  const extra = newProject().movies.find((m) => m.project_role === ProjectRole.Normal);
  if (extra) project.movies.push(extra);
  validate(project);
  return project;
}
export function saveProject(bundle) { return writeProject(bundle); }

/** validation, budget, and the bank 12 plan for this ROM, in one call */
export function assess(romInfo, bundle) {
  const out = { errors: [], warnings: [], report: null, budget: null, plan: null, markers: null };
  try {
    out.report = validate(bundle);
    out.warnings = out.report.warnings.slice();
    out.budget = detailedBudget(bundle);
  } catch (e) {
    out.errors.push(e.message);
    return out;
  }
  if (romInfo && romInfo.usable) {
    try { out.plan = plan(romInfo.rom, bundle); }
    catch (e) { out.errors.push(e.message); }
    // the script markers the mod's iScripts carry, and whether each names a movie
    try { out.markers = markerReport(romInfo.rom, bundle); out.errors.push(...out.markers.errors); }
    catch (e) { out.errors.push(e.message); }
  }
  return out;
}

// ---- the picture --------------------------------------------------------------
/** the tiles of one CHR asset placed where the PPU sees them: a pattern table
 *  is 256 tiles, and an asset written to $1800 fills its second half, so the
 *  nametable names those tiles as 128 and up. Missing slots stay undefined. */
export function tilesInPatternTable(rom, movie, kind) {
  const asset = movie.assets.find((a) => a.kind === kind);
  const decoded = decodeChr(resolvedAssetBytes(rom, movie, kind));
  const base = asset ? (asset.destination & 0x0fff) >> 4 : 0;
  const table = new Array(256);
  decoded.forEach((tile, i) => { if (base + i < 256) table[base + i] = tile; });
  return table;
}

/** the movie at `frameIndex`, painted: { rgba, state, actors } */
export function renderFrame(romInfo, movie, frameIndex) {
  const rgba = makeSurface();
  if (!romInfo || !romInfo.usable) return { rgba, state: null, actors: [], note: "no rom" };
  const rom = romInfo.rom;
  const palette = resolvedAssetBytes(rom, movie, AssetKind.Palette);
  const nametable = resolvedAssetBytes(rom, movie, AssetKind.Nametable);
  drawNametable(rgba, nametable, tilesInPatternTable(rom, movie, AssetKind.BackgroundChr), palette);
  const state = preview(movie, frameIndex);
  const frames = decodeMovieFrames(rom, movie);
  const spriteTiles = movieSpriteTiles(rom, movie);
  const actors = [];
  const phase = movie.phases[Math.min(state.phase, movie.phases.length - 1)];
  state.tracks.forEach((ts, i) => {
    const drawn = phase ? ((phase.draw_mask >> i) & 1) === 1 : true;
    const frame = frames[ts.frame];
    const visible = drawn && ts.visible && !!frame;
    if (visible) drawFrame(rgba, frame, ts.x, ts.y, spriteTiles, palette.subarray(16, 32));
    // the box the page draws and hit tests: the frame's cells, or one tile
    const w = frame && frame.tilemap.length ? frame.tilemap[0].length * 8 : 8;
    const h = frame && frame.tilemap.length ? frame.tilemap.length * 8 : 8;
    actors.push({ index: i, x: ts.x, y: ts.y, frame: ts.frame, visible, name: movie.tracks[i].editor_name,
                  color: movie.tracks[i].editor_color,
                  box: { x: ts.x + (frame ? frame.offset_x : 0), y: ts.y + (frame ? frame.offset_y : 0), w, h } });
  });
  return { rgba, state, actors };
}

// ---- the canvas as a tool ----------------------------------------------------
/** the actor under (x, y) in picture pixels, topmost last drawn first; -1 if none */
export function hitActor(actors, x, y) {
  for (let i = actors.length - 1; i >= 0; i--) {
    const b = actors[i].box;
    if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) return actors[i].index;
  }
  return -1;
}

/** move one actor and everything tied to it (waypoints, keyframe thresholds) */
export function dragActor(movie, trackIndex, dx, dy) {
  translateActor(movie.tracks[trackIndex], dx | 0, dy | 0);
}

/** the desktop creator's path speed, and no grid unless asked */
export const PAINT_SPEED = 48;

/** turn painted [x, y] points into the actor's path; the movie is left
 *  untouched when the stroke is refused, and the error is thrown */
export function paintPath(bundle, movieIndex, trackIndex, points, speed = PAINT_SPEED, snap = 0, depth = null) {
  const movie = bundle.movies[movieIndex];
  const track = movie.tracks[trackIndex];
  const backup = structuredClone(track);
  try {
    const turned = applyPaintedPath(movie, track, points, speed, snap);
    if (depth && depth.usesStockTable(movie)) applyDepth(track, depth);
    validate(bundle);
    return turned;
  } catch (e) {
    for (const key of Object.keys(track)) delete track[key];
    Object.assign(track, backup);
    throw e;
  }
}

/** perspective the way the game does it: each stage of a painted path gets
 *  the ladder row for where that segment is on the screen and which way it
 *  goes, so a figure walking up the road shrinks and one coming down grows.
 *  Off for a flat scene, the C++ facing frames stay. */
export function applyDepth(track, ladder) {
  const wp = track.editor_waypoints;
  if (wp.length < 2) return;
  const rows = [];
  for (let stage = 0; stage < track.stage_frames.length; stage++) {
    const a = wp[Math.min(stage, wp.length - 1)], b = wp[Math.min(stage + 1, wp.length - 1)];
    const last = stage + 1 >= wp.length;   // standing at the end: face the way he arrived
    const from = last ? wp[wp.length - 2] : a, to = last ? wp[wp.length - 1] : b;
    rows.push(ladderRow(ladder, Math.round((a.y + b.y) / 2), to.y - from.y));
  }
  track.stage_frames = rows;
}
export { stockLadder };

// ---- the pieces ---------------------------------------------------------------
/** every figure the movie can draw, as thumbnails: the frames of its
 *  metasprite table (the game's own 32 for the stock scenes) */
export function pieces(romInfo, movie) {
  if (!romInfo || !romInfo.usable) return [];
  const rom = romInfo.rom;
  const palette = resolvedAssetBytes(rom, movie, AssetKind.Palette).subarray(16, 32);
  const tiles = movieSpriteTiles(rom, movie);
  return decodeMovieFrames(rom, movie).map((frame, index) => ({ index, ...frameThumbnail(frame, tiles, palette) }));
}

/** a new actor standing on `frame` at (x, y), drawn and updated in every
 *  phase; the movie's eight track limit is the validator's to refuse */
export function addPiece(bundle, movieIndex, frameIndex, x = 128, y = 160) {
  const movie = bundle.movies[movieIndex];
  if (movie.tracks.length >= 8) throw new MovieError("a movie draws at most 8 actors");
  const track = defaultTrack(TrackKind.Path, frameIndex);
  track.x = x; track.y = y;
  track.editor_name = `Piece ${frameIndex}`; track.editor_color = ACTOR_COLORS[movie.tracks.length % ACTOR_COLORS.length];
  movie.tracks.push(track);
  const bit = 1 << (movie.tracks.length - 1);
  for (const phase of movie.phases) { phase.update_mask |= bit; phase.draw_mask |= bit; }
  return movie.tracks.length - 1;
}

/** the selected actor now wears `frame` in every pose */
export function setPose(movie, trackIndex, frameIndex) {
  const track = movie.tracks[trackIndex];
  if (track.kind === TrackKind.Path) track.stage_frames = track.stage_frames.map((row) => row.map(() => frameIndex));
  else if (track.kind === TrackKind.Cyclic) track.visible_frames = track.visible_frames.map(() => frameIndex);
  else track.toggle_frames = track.toggle_frames.map(() => frameIndex);
  if (track.kind === TrackKind.Path && !track.stage_frames.length) track.stage_frames = [[frameIndex]];
}

// ---- art from images -----------------------------------------------------------
/** the movie's background becomes this 256x240 picture: tiles, nametable and
 *  the 16 background colours as imports; the sprite colours are kept */
export function setBackgroundArt(romInfo, movie, rgba, w, h) {
  if (!romInfo || !romInfo.usable) throw new MovieError("load a ROM first");
  const art = importBackground(rgba, w, h);
  const palette = Uint8Array.from(resolvedAssetBytes(romInfo.rom, movie, AssetKind.Palette));
  palette.set(art.palette, 0);
  replaceImport(movie, makeImport({ kind: ImportKind.BackgroundChr, label: "art background", destination: 0x1800, data: art.chr }));
  replaceImport(movie, makeImport({ kind: ImportKind.Nametable, label: "art background", destination: 0x2000, data: art.nametable }));
  replaceImport(movie, makeImport({ kind: ImportKind.Palette, label: "art palette", destination: 0x0293, data: palette }));
  return art;
}

const ART_LABEL = /^art figures over (\d+)$/;
/** how many frames the movie's table had before any art figure */
export function stockFrameCount(movie) {
  const lib = findImport(movie, ImportKind.MetaspriteLibrary);
  const m = lib ? ART_LABEL.exec(lib.label) : null;
  return m ? +m[1] : movie.metasprite_count;
}

/** a figure from an image joins the movie: its tiles after the movie's own
 *  in the sprite pattern table, its frame after the movie's own in the
 *  table, its three colours in a sprite sub palette (3, 2, 1 in turn, the
 *  hero's 0 kept), and a new actor standing on it. Returns the track index. */
export function addFigureArt(bundle, movieIndex, romInfo, rgba, w, h, name = "Figure") {
  if (!romInfo || !romInfo.usable) throw new MovieError("load a ROM first");
  const movie = bundle.movies[movieIndex], rom = romInfo.rom;
  if (movie.tracks.length >= 8) throw new MovieError("a movie draws at most 8 actors");
  const base = findAsset(movie, AssetKind.SpriteChr);
  if (!base) throw new MovieError("the movie has no sprite CHR");
  const prior = findImport(movie, ImportKind.SpriteChr);
  const priorData = prior ? prior.data : new Uint8Array(0);
  const firstTile = base.bytes / 16 + priorData.length / 16;
  const frames = decodeMovieFrames(rom, movie);
  const stock = stockFrameCount(movie);
  const figureIndex = frames.length - stock;
  const slot = 3 - (figureIndex % 3);
  const art = importFigure(rgba, w, h, firstTile, slot);
  // the tiles
  const data = new Uint8Array(priorData.length + art.tiles.length * 16);
  data.set(priorData, 0); data.set(encodeChr(art.tiles), priorData.length);
  replaceImport(movie, makeImport({ kind: ImportKind.SpriteChr, label: "art figures", destination: base.bytes, data }));
  // the frame, after every frame the movie already draws
  frames.push(art.frame);
  replaceImport(movie, makeImport({ kind: ImportKind.MetaspriteLibrary, label: `art figures over ${stock}`, destination: 0, aux: frames.length, data: encodeMetaspriteLibrary(frames) }));
  movie.metasprite_count = frames.length;
  // the colours
  const palette = Uint8Array.from(resolvedAssetBytes(rom, movie, AssetKind.Palette));
  for (let k = 0; k < 3; k++) palette[16 + slot * 4 + 1 + k] = art.colours[k];
  replaceImport(movie, makeImport({ kind: ImportKind.Palette, label: "art palette", destination: 0x0293, data: palette }));
  const track = addPiece(bundle, movieIndex, frames.length - 1);
  movie.tracks[track].editor_name = name;
  return track;
}

/** what to draw over the picture for the selected actor: the route the
 *  runtime takes and the painted waypoints */
export function pathOverlay(movie, trackIndex) {
  const track = movie.tracks[trackIndex];
  if (!track) return { route: [], waypoints: [] };
  return { route: simulatedPath(track), waypoints: track.editor_waypoints.map((p) => [p.x, p.y]) };
}

// ---- the exports --------------------------------------------------------------
/** the ROM with the engine and this project's movies installed where the plan
 *  says, and the IPS that gets there from the file the user dropped */
export function exportInstalled(romInfo, bundle) {
  if (!romInfo || !romInfo.usable) throw new MovieError("load a USA game or a mod built from one first");
  if (romInfo.installed) throw new MovieError("this ROM already carries the engine; drop the ROM you built from");
  const p = plan(romInfo.rom, bundle);
  if (p.mode !== "shared") throw new MovieError(p.messages.join("; "));
  const patched = Uint8Array.from(romInfo.rom);
  const pkg = buildPackage(bundle, ENGINE_CODE);
  const result = install(patched, pkg, ENGINE_CODE, undefined, p.shared.adapter);
  // with opcode $18 now answered, the script markers become play movie calls
  const markers = rewriteMarkers(patched, bundle);
  return { nes: patched, ips: makeIps(romInfo.rom, patched), layout: result.layout, plan: p, markers };
}

/** eoe_config_override.xml for a FaxEdit project: the standalone opcode map
 *  and the movies as hex. The player still has to reach the ROM; the page
 *  says so beside this export. */
export function exportOverride(romInfo, bundle) {
  const info = loadVanillaOpcodes();
  const resolved = romInfo && romInfo.usable
    ? resolveOpcodeInfo(info, romInfo.rom, { isInstalled: (rom) => installedLayout(rom, ENGINE_CODE) !== null })
    : info;
  return standaloneConfigOverride(resolved, compileBundle(bundle));
}

/** a file name for a download */
export function downloadName(romInfo, kind) {
  const base = romInfo && romInfo.name ? romInfo.name.replace(/\.nes$/i, "") : "faxanadu";
  return { amp: "atlas-movie-project.amp", xml: "eoe_config_override.xml",
           nes: `${base}-movies.nes`, ips: `${base}-movies.ips` }[kind];
}

// ---- undo and redo ----------------------------------------------------------------
/** snapshots of the project, taken before each edit; plain objects clone
 *  cheaply, so this is the whole mechanism */
export function makeHistory(limit = 100) {
  let past = [], future = [];
  return {
    push(project) { past.push(structuredClone(project)); if (past.length > limit) past.shift(); future = []; },
    undo(current) { if (!past.length) return null; future.push(structuredClone(current)); return past.pop(); },
    redo(current) { if (!future.length) return null; past.push(structuredClone(current)); return future.pop(); },
    canUndo() { return past.length > 0; },
    canRedo() { return future.length > 0; },
    clear() { past = []; future = []; },
  };
}

// ---- words -------------------------------------------------------------------
export const T = {
  en: {
    title: "Atlas Movie Maker", langname: "Français",
    intro: "Make the intro and the ending of Faxanadu, or a movie a script starts, in the browser. Drop your ROM: it stays on your machine. What you make opens in the desktop Atlas Movie Creator too.",
    rom: "ROM", drop: "Drop a Faxanadu ROM here, or choose a file", choose: "Choose a ROM",
    romInfo: (n, r, b) => `${n}: ${r}, ${b} bytes`, notrom: "That is not a .nes file the page can read.",
    region: { usa: "USA", "usa-rev1": "USA Rev 1", europe: "Europe", japan: "Japan", modified: "a mod (built from the USA game)", "not a rom": "not a rom" },
    unusable: "The engine is written for the USA game. Load a USA dump or a mod built from one.",
    already: "This ROM already has the movie engine in it, at",
    extent: (end, free) => `Bank 12 data ends at $${end.toString(16).toUpperCase()}; ${free} bytes free above it.`,
    project: "Project", newp: "New", open: "Open .amp", save: "Save .amp", fromRom: "This ROM's intro and ending",
    stockLoaded: "The project is this ROM's own intro and ending, read from the game, plus an extra scene.",
    noStock: "This ROM has lost the game's own intro engine, so its intro and ending cannot be read.",
    movies: "Movies", addMovie: "Add movie", removeMovie: "Remove", enabled: "enabled",
    role: "Role", roles: { 0: "extra movie", 1: "intro", 2: "ending" },
    exit: "Exit", exits: { 1: "new game", 2: "title", 3: "reload screen" }, music: "Music ($FF keeps)",
    actors: "Actors", addActor: "Add actor", removeActor: "Remove", kind: "Kind",
    kinds: { 1: "path", 2: "cyclic", 3: "counter toggle" },
    x: "X", y: "Y", vx: "Velocity X", vy: "Velocity Y", shift: "Integrator shift", dwell: "Dwell frames",
    keyframes: "Keyframes (threshold, vx, vy)", stages: "Stage frames (pose ids per stage)", name: "Name",
    phases: "Phases", addPhase: "Add phase", removePhase: "Remove", condition: "Ends when",
    conditions: { 1: "effect calls reach", 2: "track Y reaches", 3: "music stops", 4: "frame counter is zero", 5: "frames elapse" },
    value: "Value", track: "Track", drawMask: "Draw mask", updateMask: "Update mask",
    preview: "Preview", frame: "Frame", play: "Play", pause: "Pause",
    art: "Art", artBackground: "Background from an image…", artFigure: "Figure from an image…",
    artHint: "Any picture becomes the background (scaled to 256x240, 4 palettes of 3 colours, 128 tiles). A PNG with transparency becomes a figure and a new actor.",
    artDone: (n, w) => `Background imported: ${n} tiles.${w.length ? " " + w.join(" ") : ""}`,
    artFigureDone: (name, tiles) => `${name} imported: ${tiles} tiles, standing on the road.`,
    pieces: "Pieces", pieceAdd: "click: add as a new actor", pieceSet: "click: dress the selected actor", pieceHint: "Every figure this movie can draw. Add one, then drag it and draw its path.",
    draw: "Draw a path", drawing: "Drawing…", advanced: "Advanced", depth: "Depth: shrink when walking up, grow coming down",
    canvasHint: "Drag an actor to move it. Draw a path: press the button, then draw on the picture with the actor selected.",
    drawHint: "Draw the route on the picture; release to apply it. The cyan line is the exact route the game will take.",
    pathApplied: "Path applied; cyan is the exact route the game takes.",
    pathTurned: "Path applied up to where it turned back; a path runs one way along its main axis.",
    check: "Checks", budget: (u, c) => `${u} of ${c} bytes of movies`, sizes: "Sizes",
    exports: "Export", expAmp: "Project (.amp)", expXml: "FaxEdit override (.xml)", expNes: "Patched ROM (.nes)", expIps: "Patch (.ips)",
    xmlNote: "For a FaxEdit project: put this beside eoe_config.xml. The player must be in the ROM too, which FaxEdit does not do yet; the patched ROM export installs both.",
    ipsNote: "Share the IPS, not the ROM. Apply it to a clean copy of the same file you dropped here.",
    noRom: "Load a ROM to see the picture and to export a patched ROM.",
    errors: "Problems", none: "None.",
    playBtn: "Play", stopBtn: "Stop", exportBtn: "Export", checks: "Checks", more: "more", undo: "Undo", redo: "Redo",
    romChip: (n) => n ? n : "Drop a ROM", romRemembered: "ROM remembered from last time",
    movieAdd: "New scene…", template: "Start from", blank: "Blank scene",
    length: "Scene length", lengthFrames: "frames", lengthHeroY: "until the hero reaches Y", lengthOther: (n) => `${n} phases (see more)`,
    speed: "Speed", pose: "Pose", walkCycle: "Walk cycle", deleteActor: "Delete", duplicate: "Duplicate",
    caption: "Caption", captionRow: "Row", captionApply: "Write it", captionDone: (n) => `Caption written: ${n} tiles.`,
    playHint: "Arrows move · Z/X are A/B · Enter is START · Esc stops",
    playBlocked: (why) => `Play is off: ${why}`,
    guide: "How it works",
    guideSteps: ["Build your mod in FaxEdit. Where a scene should play, show a message that reads MOVIE-name.", "Drop that ROM here. Make your scenes: drag, draw, Play.", "Export the IPS and share it. Never share the ROM."],
    keys: "Keys: Delete removes the actor, Ctrl-D duplicates, Ctrl-Z undoes, Esc deselects; hold Shift and drag from an actor to draw its path.",
    toastSaved: "Saved in this browser.", newConfirm: "Start over? The current project is forgotten here (save it first if you want it).",
    markers: (n) => n === 1 ? "1 script marker will start a movie." : `${n} script markers will start movies.`,
    markerRow: (r) => `script ${r.script} at $${r.cpu.toString(16).toUpperCase()}: MOVIE-${r.name} → movie ${r.index}`,
    markerStopped: (n) => `${n} script${n === 1 ? "" : "s"} use extended opcodes the page cannot read past; a marker after one is not seen.`,
    noMarkers: "No script markers. In FaxEdit, show a message that reads MOVIE-name from an iScript, and the export turns it into the movie.",
  },
  fr: {
    title: "Atlas Movie Maker", langname: "English",
    intro: "Faites l'intro et la fin de Faxanadu, ou un film qu'un script démarre, dans le navigateur. Déposez votre ROM : elle reste sur votre machine. Ce que vous faites s'ouvre aussi dans l'Atlas Movie Creator de bureau.",
    rom: "ROM", drop: "Déposez une ROM de Faxanadu ici, ou choisissez un fichier", choose: "Choisir une ROM",
    romInfo: (n, r, b) => `${n} : ${r}, ${b} octets`, notrom: "Ce n'est pas un fichier .nes que la page peut lire.",
    region: { usa: "USA", "usa-rev1": "USA Rev 1", europe: "Europe", japan: "Japon", modified: "un mod (bâti sur le jeu USA)", "not a rom": "pas une rom" },
    unusable: "Le moteur est écrit pour le jeu USA. Chargez une copie USA ou un mod bâti dessus.",
    already: "Cette ROM contient déjà le moteur de films, à",
    extent: (end, free) => `Les données de la banque 12 finissent à $${end.toString(16).toUpperCase()}; ${free} octets libres au-dessus.`,
    project: "Projet", newp: "Nouveau", open: "Ouvrir .amp", save: "Enregistrer .amp", fromRom: "L'intro et la fin de cette ROM",
    stockLoaded: "Le projet est l'intro et la fin de cette ROM, lues dans le jeu, plus une scène en extra.",
    noStock: "Cette ROM a perdu le moteur d'intro du jeu, donc son intro et sa fin ne peuvent pas être lues.",
    movies: "Films", addMovie: "Ajouter un film", removeMovie: "Retirer", enabled: "actif",
    role: "Rôle", roles: { 0: "film supplémentaire", 1: "intro", 2: "fin" },
    exit: "Sortie", exits: { 1: "nouvelle partie", 2: "titre", 3: "recharger l'écran" }, music: "Musique ($FF garde)",
    actors: "Acteurs", addActor: "Ajouter un acteur", removeActor: "Retirer", kind: "Type",
    kinds: { 1: "trajet", 2: "cyclique", 3: "bascule de compteur" },
    x: "X", y: "Y", vx: "Vitesse X", vy: "Vitesse Y", shift: "Décalage de l'intégrateur", dwell: "Images d'attente",
    keyframes: "Images clés (seuil, vx, vy)", stages: "Poses par étape", name: "Nom",
    phases: "Phases", addPhase: "Ajouter une phase", removePhase: "Retirer", condition: "Finit quand",
    conditions: { 1: "les effets atteignent", 2: "le Y de l'acteur atteint", 3: "la musique s'arrête", 4: "le compteur d'images est à zéro", 5: "des images passent" },
    value: "Valeur", track: "Acteur", drawMask: "Masque de dessin", updateMask: "Masque de mise à jour",
    preview: "Aperçu", frame: "Image", play: "Jouer", pause: "Pause",
    art: "Art", artBackground: "Fond depuis une image…", artFigure: "Figure depuis une image…",
    artHint: "Toute image devient le fond (mise à 256x240, 4 palettes de 3 couleurs, 128 tuiles). Un PNG avec transparence devient une figure et un nouvel acteur.",
    artDone: (n, w) => `Fond importé : ${n} tuiles.${w.length ? " " + w.join(" ") : ""}`,
    artFigureDone: (name, tiles) => `${name} importée : ${tiles} tuiles, debout sur la route.`,
    pieces: "Pièces", pieceAdd: "clic : ajouter comme nouvel acteur", pieceSet: "clic : habiller l'acteur sélectionné", pieceHint: "Toutes les figures que ce film peut dessiner. Ajoutez-en une, puis glissez-la et tracez son trajet.",
    draw: "Tracer un trajet", drawing: "Tracé…", advanced: "Avancé", depth: "Profondeur : rapetisse en montant, grandit en descendant",
    canvasHint: "Glissez un acteur pour le déplacer. Tracer un trajet : appuyez sur le bouton, puis dessinez sur l'image avec l'acteur sélectionné.",
    drawHint: "Dessinez la route sur l'image; relâchez pour l'appliquer. La ligne cyan est la route exacte que le jeu suivra.",
    pathApplied: "Trajet appliqué; le cyan est la route exacte que le jeu suit.",
    pathTurned: "Trajet appliqué jusqu'au demi-tour; un trajet va dans un seul sens sur son axe principal.",
    check: "Vérifications", budget: (u, c) => `${u} de ${c} octets de films`, sizes: "Tailles",
    exports: "Exporter", expAmp: "Projet (.amp)", expXml: "Surcharge FaxEdit (.xml)", expNes: "ROM patchée (.nes)", expIps: "Patch (.ips)",
    xmlNote: "Pour un projet FaxEdit : mettez ce fichier à côté de eoe_config.xml. Le lecteur doit aussi être dans la ROM, ce que FaxEdit ne fait pas encore; l'export de ROM patchée installe les deux.",
    ipsNote: "Partagez l'IPS, pas la ROM. Appliquez-le sur une copie propre du même fichier que vous avez déposé ici.",
    noRom: "Chargez une ROM pour voir l'image et exporter une ROM patchée.",
    errors: "Problèmes", none: "Aucun.",
    playBtn: "Jouer", stopBtn: "Arrêter", exportBtn: "Exporter", checks: "Vérifications", more: "plus", undo: "Annuler", redo: "Rétablir",
    romChip: (n) => n ? n : "Déposez une ROM", romRemembered: "ROM retenue de la dernière fois",
    movieAdd: "Nouvelle scène…", template: "Partir de", blank: "Scène vide",
    length: "Durée de la scène", lengthFrames: "images", lengthHeroY: "jusqu'à ce que le héros atteigne Y", lengthOther: (n) => `${n} phases (voir plus)`,
    speed: "Vitesse", pose: "Pose", walkCycle: "Cycle de marche", deleteActor: "Supprimer", duplicate: "Dupliquer",
    caption: "Légende", captionRow: "Ligne", captionApply: "L'écrire", captionDone: (n) => `Légende écrite : ${n} tuiles.`,
    playHint: "Flèches pour bouger · Z/X pour A/B · Entrée pour START · Échap arrête",
    playBlocked: (why) => `Jouer est désactivé : ${why}`,
    guide: "Comment ça marche",
    guideSteps: ["Faites votre mod dans FaxEdit. Là où une scène doit jouer, affichez un message qui dit MOVIE-nom.", "Déposez cette ROM ici. Faites vos scènes : glissez, tracez, Jouer.", "Exportez l'IPS et partagez-le. Ne partagez jamais la ROM."],
    keys: "Touches : Suppr retire l'acteur, Ctrl-D duplique, Ctrl-Z annule, Échap désélectionne ; Maj enfoncée et glissez depuis un acteur pour tracer son trajet.",
    toastSaved: "Enregistré dans ce navigateur.", newConfirm: "Repartir de zéro ? Le projet actuel est oublié ici (enregistrez-le d'abord si vous y tenez).",
    markers: (n) => n === 1 ? "1 marqueur de script démarrera un film." : `${n} marqueurs de script démarreront des films.`,
    markerRow: (r) => `script ${r.script} à $${r.cpu.toString(16).toUpperCase()} : MOVIE-${r.name} → film ${r.index}`,
    markerStopped: (n) => `${n} script${n === 1 ? "" : "s"} utilise${n === 1 ? "" : "nt"} des opcodes étendus que la page ne sait pas lire; un marqueur placé après n'est pas vu.`,
    noMarkers: "Aucun marqueur de script. Dans FaxEdit, affichez un message qui dit MOVIE-nom depuis un iScript, et l'export le transforme en film.",
  },
};

// ---- the drawer's edits ------------------------------------------------------------
export function removeActor(bundle, movieIndex, trackIndex) {
  const movie = bundle.movies[movieIndex];
  if (movie.tracks.length <= 1) throw new MovieError("a movie keeps its last actor");
  movie.tracks.splice(trackIndex, 1);
  for (const phase of movie.phases) {
    phase.update_mask = removeMaskBit(phase.update_mask, trackIndex);
    phase.draw_mask = removeMaskBit(phase.draw_mask, trackIndex);
    if (phase.condition_track !== 0xff && phase.condition_track > trackIndex) phase.condition_track--;
    else if (phase.condition_track === trackIndex) phase.condition_track = 0xff;
    if (phase.effect_track !== 0xff && phase.effect_track > trackIndex) phase.effect_track--;
    else if (phase.effect_track === trackIndex) phase.effect_track = 0xff;
  }
  movie.sfx = movie.sfx.filter((s) => s.track !== trackIndex).map((s) => ({ ...s, track: s.track > trackIndex ? s.track - 1 : s.track }));
}

export function duplicateActor(bundle, movieIndex, trackIndex) {
  const movie = bundle.movies[movieIndex];
  const added = pasteActors(bundle, movieIndex, [structuredClone(movie.tracks[trackIndex])], 0);
  return added[0];
}

/** pixels a frame from an 8 bit velocity at a shift: |v| / 2^shift */
export function speedOf(track) {
  const v = Math.hypot(track.velocity_x, track.velocity_y);
  return v / (1 << track.integrator_shift);
}

/** the same direction at `pxPerFrame` (0.25 to 8): the shift that keeps the
 *  velocity in a byte, then the byte */
export function setSpeed(track, pxPerFrame) {
  const px = Math.min(8, Math.max(0.25, pxPerFrame));
  let dx = track.velocity_x, dy = track.velocity_y;
  if (!dx && !dy) { dx = 1; dy = 0; }
  const len = Math.hypot(dx, dy);
  let shift = 7;
  while (shift > 0 && px * (1 << shift) > 127) shift--;
  const scale = px * (1 << shift) / len;
  track.integrator_shift = shift;
  track.velocity_x = Math.max(-127, Math.min(127, Math.round(dx * scale)));
  track.velocity_y = Math.max(-127, Math.min(127, Math.round(dy * scale)));
  return track;
}

/** the movie chip's "scene length" for a one phase movie */
export function sceneLength(movie) {
  if (movie.phases.length !== 1) return { kind: "other", value: 0, phases: movie.phases.length };
  const ph = movie.phases[0];
  if (ph.condition === Condition.Frames) return { kind: "frames", value: ph.condition_value, phases: 1 };
  if (ph.condition === Condition.TrackYGte && ph.condition_track === 0) return { kind: "heroY", value: ph.condition_value, phases: 1 };
  return { kind: "other", value: ph.condition_value, phases: 1 };
}
export function setSceneLength(movie, kind, value) {
  if (movie.phases.length !== 1) throw new MovieError("this movie has several phases; edit them under more");
  const ph = movie.phases[0];
  if (kind === "frames") { ph.condition = Condition.Frames; ph.condition_track = 0xff; ph.condition_value = Math.max(1, value | 0); }
  else if (kind === "heroY") { ph.condition = Condition.TrackYGte; ph.condition_track = 0; ph.condition_value = Math.max(0, Math.min(255, value | 0)); }
  else throw new MovieError("a scene ends after some frames or when the hero reaches a height");
}

// ---- templates -------------------------------------------------------------------
export function templates() {
  return [
    { key: "walk-in", en: "Walk in: the hero climbs the road and the picture fades", fr: "Entrée : le héros monte la route et l'image s'assombrit" },
    { key: "meet", en: "Meet: the hero walks up to a figure and they stand together", fr: "Rencontre : le héros marche vers une figure et ils restent ensemble" },
    { key: "walk-off", en: "Walk off: the hero leaves while the others keep moving", fr: "Départ : le héros s'en va pendant que les autres bougent" },
    { key: "still", en: "Still: one picture, one figure, three seconds", fr: "Image fixe : une image, une figure, trois secondes" },
  ];
}

/** a playable extra scene built on the ROM's own pieces; returns its index */
export function addTemplate(romInfo, bundle, key) {
  if (!romInfo || !romInfo.stock) throw new MovieError("templates need a ROM with the game's own intro engine");
  const rom = romInfo.rom;
  let movie;
  if (key === "walk-in") {
    movie = stockIntro(rom);
    movie.phases[0].condition_value = 0x20;                                   // the stock fade, about 5 s
  } else if (key === "meet") {
    movie = stockIntro(rom);
    const hero = movie.tracks[0];
    hero.x = 40; hero.y = 200; hero.coordinate = Coordinate.X; hero.comparison = Comparison.GreaterEqual;
    hero.velocity_x = 48; hero.velocity_y = 0; hero.integrator_shift = 7; hero.dwell_frames = 8;
    hero.keyframes = [{ threshold: 120, velocity_x: 0, velocity_y: 0 }];
    const ladder = stockLadder(rom);
    hero.stage_frames = [ladderRow(ladder, 200, 0), ladderRow(ladder, 200, 0).map(() => 0)];
    movie.sfx = [];
    movie.phases = [makePhase({ update_mask: 0b11, draw_mask: 0b11, condition: Condition.Frames, condition_value: 360 })];
    const other = defaultTrack(TrackKind.Path, 21);                          // the big toward facing hero as the other figure
    other.x = 150; other.y = 200; other.editor_name = "Figure"; other.editor_color = ACTOR_COLORS[1];
    movie.tracks.push(other);
  } else if (key === "walk-off") {
    movie = stockOutro(rom);
  } else if (key === "still") {
    movie = stockIntro(rom);
    const hero = movie.tracks[0];
    hero.velocity_x = 0; hero.velocity_y = 0; hero.keyframes = [{ threshold: 0, velocity_x: 0, velocity_y: 0 }];
    hero.stage_frames = [[0, 0, 0, 0], [0, 0, 0, 0]]; hero.x = 128; hero.y = 200;
    movie.sfx = [];
    movie.phases = [makePhase({ update_mask: 1, draw_mask: 1, condition: Condition.Frames, condition_value: 180 })];
  } else throw new MovieError(`no template named "${key}"`);
  movie.id = key; movie.project_role = ProjectRole.Normal; movie.exit_mode = Exit.ReloadScreen; movie.enabled = true;
  movie.entry_music = 0xff;
  ensureUniqueId(bundle, movie);
  bundle.movies.push(movie);
  validate(bundle);
  return bundle.movies.length - 1;
}

// ---- captions -----------------------------------------------------------------
/** the reserved background CHR fills all 128 slots, but a picture usually
 *  draws fewer of them, so this rebuilds the BackgroundChr import with only
 *  the tiles its own nametable names (ascending, renumbered from `first`),
 *  freeing the rest for whatever gets appended after them */
export function compactBackground(movie) {
  const chr = findImport(movie, ImportKind.BackgroundChr), nt = findImport(movie, ImportKind.Nametable);
  const first = (chr.destination & 0x0fff) >> 4;
  const before = chr.data.length / 16;
  const used = [...new Set(Array.from(nt.data.subarray(0, 960)).filter((id) => id >= first))].sort((a, b) => a - b);
  const remap = new Map(used.map((id, i) => [id, first + i]));
  const compact = new Uint8Array(used.length * 16);
  used.forEach((id, i) => compact.set(chr.data.subarray((id - first) * 16, (id - first) * 16 + 16), i * 16));
  const names = Uint8Array.from(nt.data);
  for (let i = 0; i < 960; i++) if (remap.has(names[i])) names[i] = remap.get(names[i]);
  chr.data = compact;
  nt.data = names;
  return { before, after: used.length };
}

/** a line of the game's own font baked into the background at `row` */
export function caption(romInfo, movie, text, row) {
  if (!romInfo || !romInfo.usable) throw new MovieError("load a ROM first");
  const rom = romInfo.rom;
  const r = rasterCaption(rom, text);
  // the background as imports, so the page owns the bytes it is about to change
  if (!findImport(movie, ImportKind.BackgroundChr)) {
    const bgAsset = findAsset(movie, AssetKind.BackgroundChr);
    replaceImport(movie, makeImport({ kind: ImportKind.BackgroundChr, label: "background", destination: bgAsset.destination, data: Uint8Array.from(resolvedAssetBytes(rom, movie, AssetKind.BackgroundChr)) }));
    replaceImport(movie, makeImport({ kind: ImportKind.Nametable, label: "background", destination: 0x2000, data: Uint8Array.from(resolvedAssetBytes(rom, movie, AssetKind.Nametable)) }));
    replaceImport(movie, makeImport({ kind: ImportKind.Palette, label: "palette", destination: 0x0293, data: Uint8Array.from(resolvedAssetBytes(rom, movie, AssetKind.Palette)) }));
    compactBackground(movie);
  }
  const chr = findImport(movie, ImportKind.BackgroundChr), nt = findImport(movie, ImportKind.Nametable);
  const have = chr.data.length / 16, first = (chr.destination & 0x0fff) >> 4;
  if (first + have + r.tiles.length > 256 || have + r.tiles.length > BACKGROUND_TILES)
    throw new MovieError(`the caption needs ${r.tiles.length} tiles and the picture has ${BACKGROUND_TILES - have} left`);
  const data = new Uint8Array(chr.data.length + r.tiles.length * 16);
  data.set(chr.data, 0); r.tiles.forEach((tile, i) => data.set(tile.toBytes(), chr.data.length + i * 16));
  chr.data = data;
  const from = first + have;
  const names = Uint8Array.from(nt.data);
  const col0 = Math.floor((32 - r.names.length) / 2);
  r.names.forEach((id, i) => { if (id !== null) names[row * 32 + col0 + i] = from + id; });
  // the attribute grid is 16x16, so a caption starting on an odd column also
  // recolours the cell before it, and the one after; the game cannot do otherwise
  for (let bx = col0 >> 1; bx <= (col0 + r.names.length - 1) >> 1; bx++) {
    const by = row >> 1, shift = ((by & 1) << 2) | ((bx & 1) << 1), at = 0x3c0 + (by >> 1) * 8 + (bx >> 1);
    names[at] &= ~(3 << shift);
  }
  nt.data = names;
  return { tiles: r.tiles.length, from };
}

// ---- play ------------------------------------------------------------------------
/** the ROM as Export makes it, but with the selected movie in the slot START
 *  starts, so any scene plays from the title in the page */
export function playRom(romInfo, bundle, movieIndex) {
  if (!bundle.movies[movieIndex]) throw new MovieError("pick a movie to play");
  const play = structuredClone(bundle);
  const chosen = play.movies[movieIndex];
  chosen.enabled = true;
  const intro = play.movies.find((m) => m.project_role === ProjectRole.OfficialIntro && m.enabled);
  if (chosen !== intro && intro) {
    if (chosen.project_role === ProjectRole.OfficialEnding) { chosen.project_role = ProjectRole.OfficialIntro; intro.project_role = ProjectRole.OfficialEnding; }
    else { chosen.project_role = ProjectRole.OfficialIntro; chosen.exit_mode = Exit.NewGame; intro.project_role = ProjectRole.Normal; intro.enabled = false; }
  }
  return exportInstalled(romInfo, play).nes;
}
