// The editor helpers, ported function by function from
// eoe_core/src/fe/AtlasMovieEditor.cpp: the starter project, default tracks,
// painted paths, waypoints, paste, and phase estimates. Points painted on the
// canvas are [x, y] pairs (std::array<byte, 2> in the C++); waypoints stored
// on a track are { x, y } objects (AtlasMovieWaypoint).
//
// Two neighbours are used and not owned here: advanceTrack from preview.mjs
// (the fixed point simulator) and validate from bundle.mjs (the codec's
// checks, which the starter project and paste run before returning).
import { MovieError } from "./bytes.mjs";
import {
  TrackKind, Coordinate, Comparison, Condition, EnterAction, ImportKind,
  AssetKind, Destination, Exit, ProjectRole, ACTOR_COLORS,
  makeTrack, makePhase, makeMovie, makeBundle, makeKeyframe,
} from "./types.mjs";
import { advanceTrack, makePreviewTrack } from "./preview.mjs";
import { validate } from "./bundle.mjs";

// ---------------------------------------------------------------- default_track

export function defaultTrack(kind, frame = 0) {
  const result = makeTrack();
  result.kind = kind;
  result.x = 128; result.y = 120;
  result.integrator_shift = 7;
  result.dwell_frames = 16;
  if (kind === TrackKind.Path) {
    result.keyframes = [makeKeyframe({ threshold: 200, velocity_x: 0, velocity_y: 0 })];
    result.stage_frames = [[frame], [frame]];
  } else if (kind === TrackKind.Cyclic) {
    result.visible_frames = [frame];
    result.reset_at_pose = 2;
  } else {
    result.counter_mask = 1;
    result.toggle_frames = [frame, frame];
  }
  return result;
}

// --------------------------------------------------------- make_starter_project

export function makeStarterProject() {
  const makeStarterMovie = (id, role, exit_mode, nametable, palette, music, x) => {
    const movie = makeMovie();
    movie.id = id;
    movie.project_role = role;
    movie.exit_mode = exit_mode;
    movie.entry_music = music;
    movie.metasprite_bank = 12;
    movie.metasprite_pointer_lo = 0xab17;
    movie.metasprite_pointer_hi = 0xab37;
    movie.metasprite_count = 32;
    movie.assets = [
      { kind: AssetKind.SpriteChr, bank: 10, cpu: 0x9ba0,
        destination_space: Destination.Ppu, destination: 0x0000, bytes: 0x0900 },
      { kind: AssetKind.BackgroundChr, bank: 10, cpu: 0xa4a0,
        destination_space: Destination.Ppu, destination: 0x1800, bytes: 0x0800 },
      { kind: AssetKind.Nametable, bank: 10, cpu: nametable,
        destination_space: Destination.Ppu, destination: 0x2000, bytes: 0x0400 },
      { kind: AssetKind.Palette, bank: 12, cpu: palette,
        destination_space: Destination.Ram, destination: 0x0293, bytes: 0x0020 },
    ];
    const actor = defaultTrack(TrackKind.Path, 0);
    actor.x = x;
    actor.editor_name = "Actor";
    actor.editor_color = ACTOR_COLORS[0];
    movie.tracks.push(actor);
    const phase = makePhase();
    phase.condition_value = 120;
    movie.phases.push(phase);
    return movie;
  };

  const result = makeBundle();
  result.movies.push(makeStarterMovie("intro",
    ProjectRole.OfficialIntro, Exit.NewGame, 0xaca0, 0xa6c8, 0xfe, 64));
  result.movies.push(makeStarterMovie("ending",
    ProjectRole.OfficialEnding, Exit.TitleReset, 0xb0a0, 0xa6e8, 12, 160));
  result.movies.push(makeStarterMovie("scene-1",
    ProjectRole.Normal, Exit.ReloadScreen, 0xb0a0, 0xa6e8, 0xff, 96));
  validate(result);
  return result;
}

// -------------------------------------------------------------- remove_mask_bit

export function removeMaskBit(mask, index) {
  const lowMask = index === 0 ? 0 : (1 << index) - 1;
  const low = mask & lowMask;
  const high = (mask >> (index + 1)) << index;
  return (low | high) & 0xff;
}

// ------------------------------------------------------------- ensure_unique_id

export function ensureUniqueId(bundle, movie) {
  const base = movie.id === "" ? "movie" : movie.id;
  const ids = new Set();
  for (const other of bundle.movies) if (other !== movie) ids.add(other.id);
  if (!ids.has(movie.id)) return;
  for (let suffix = 2; ; ++suffix) {
    const candidate = `${base}-${suffix}`;
    if (!ids.has(candidate)) { movie.id = candidate; return; }
  }
}

// ------------------------------------------------------- painted path helpers

/** std::lround: halves round away from zero, unlike Math.round */
const lround = (v) => Math.sign(v) * Math.round(Math.abs(v));
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const samePoint = (a, b) => a[0] === b[0] && a[1] === b[1];

function paintedVelocity(from, to, speed) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const scale = Math.max(Math.abs(dx), Math.abs(dy));
  if (!scale) return [0, 0];
  return [
    clamp(lround(dx * speed / scale), -127, 127),
    clamp(lround(dy * speed / scale), -127, 127),
  ];
}

function paintedFacingFrames(movie, vx, vy, fallback, animation = null) {
  if (!vx && !vy)
    return animation && animation.idle.length
      ? animation.idle.slice() : fallback.length ? fallback.slice() : [0];
  if (animation && animation.automatic_facing) {
    let semantic;
    if (Math.abs(vx) >= Math.abs(vy)) semantic = vx >= 0 ? animation.right : animation.left;
    else semantic = vy >= 0 ? animation.toward : animation.away;
    if (semantic && semantic.length) return semantic.slice();
  }
  const stockCinematic = movie.imports.length === 0 && movie.metasprite_count >= 24;
  if (stockCinematic)
    return vx - vy >= 0 ? [0, 1, 2, 1] : [21, 22, 23, 22];
  const bidirectionalImport = movie.metasprite_count >= 6
    && movie.imports.some((imported) => imported.kind === ImportKind.MetaspriteLibrary
      && imported.label.includes("bidirectional"));
  if (bidirectionalImport)
    return vx >= 0 ? [0, 1, 2, 1] : [3, 4, 5, 4];
  return fallback.length ? fallback.slice() : [0];
}

function pointSegmentDistanceSquared(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (!dx && !dy) {
    const px = point[0] - start[0];
    const py = point[1] - start[1];
    return px * px + py * py;
  }
  const t = clamp(((point[0] - start[0]) * dx + (point[1] - start[1]) * dy)
    / (dx * dx + dy * dy), 0.0, 1.0);
  const px = start[0] + t * dx - point[0];
  const py = start[1] + t * dy - point[1];
  return px * px + py * py;
}

function markSimplifiedPoints(points, first, last, toleranceSquared, keep) {
  let farthestDistance = 0;
  let farthestIndex = 0;
  for (let i = first + 1; i < last; ++i) {
    const distance = pointSegmentDistanceSquared(points[i], points[first], points[last]);
    if (distance > farthestDistance) { farthestDistance = distance; farthestIndex = i; }
  }
  if (farthestDistance <= toleranceSquared) return;
  keep[farthestIndex] = true;
  markSimplifiedPoints(points, first, farthestIndex, toleranceSquared, keep);
  markSimplifiedPoints(points, farthestIndex, last, toleranceSquared, keep);
}

function simplifyPaintedPoints(points, snap) {
  if (points.length < 3) return points.map((p) => [p[0], p[1]]);
  const tolerance = snap ? Math.max(3.0, snap * 0.4) : 3.0;
  const keep = new Array(points.length).fill(false);
  keep[0] = keep[points.length - 1] = true;
  markSimplifiedPoints(points, 0, points.length - 1, tolerance * tolerance, keep);
  const result = [];
  for (let i = 0; i < points.length; ++i) {
    if (!keep[i]) continue;
    const point = [points[i][0], points[i][1]];
    if (snap) {
      point[0] = clamp(Math.trunc((point[0] + Math.trunc(snap / 2)) / snap) * snap,
        0, Math.trunc(255 / snap) * snap) & 0xff;
      point[1] = clamp(Math.trunc((point[1] + Math.trunc(snap / 2)) / snap) * snap,
        0, Math.trunc(239 / snap) * snap) & 0xff;
    }
    if (!result.length || !samePoint(point, result[result.length - 1])) result.push(point);
  }
  return result;
}

// ----------------------------------------------------------- apply_painted_path

/**
 * Rebuilds `track` in place as a Path following the painted `points`
 * ([x, y] pairs). Returns true when the path turned back on its dominant axis
 * and was cut at the reversal, as the C++ does.
 */
export function applyPaintedPath(movie, track, points, speed, snap) {
  if (points.length < 2) throw new MovieError("Draw a longer actor path");
  let simplified = simplifyPaintedPoints(points, snap);
  while (simplified.length > 16) {
    const reduced = [simplified[0]];
    for (let i = 2; i < simplified.length; i += 2) reduced.push(simplified[i]);
    if (!samePoint(reduced[reduced.length - 1], simplified[simplified.length - 1]))
      reduced.push(simplified[simplified.length - 1]);
    simplified = reduced;
  }
  if (simplified.length < 2) throw new MovieError("Draw a longer actor path");
  const xs = simplified.map((p) => p[0]);
  const ys = simplified.map((p) => p[1]);
  const gateX = Math.max(...xs) - Math.min(...xs) >= Math.max(...ys) - Math.min(...ys);
  const coordinate = (point) => point[gateX ? 0 : 1];
  let direction = 0;
  for (let i = 1; i < simplified.length && !direction; ++i) {
    const delta = coordinate(simplified[i]) - coordinate(simplified[i - 1]);
    if (Math.abs(delta) >= 2) direction = delta > 0 ? 1 : -1;
  }
  if (!direction) throw new MovieError("Painted path needs movement along its dominant axis");

  const fallback = track.kind === TrackKind.Path && track.stage_frames.length
    ? track.stage_frames[0].slice() : [0];
  const editor_name = track.editor_name;
  const editor_color = track.editor_color;
  const editor_group = track.editor_group;
  const editor_animation = track.editor_animation;
  // p_track = {} : reset every field to its default, then restore the editor ones
  const fresh = makeTrack();
  for (const key of Object.keys(track)) delete track[key];
  Object.assign(track, fresh);
  track.editor_name = editor_name; track.editor_color = editor_color;
  track.editor_group = editor_group;
  track.editor_animation = editor_animation;
  for (const point of simplified) track.editor_waypoints.push({ x: point[0], y: point[1] });
  track.kind = TrackKind.Path;
  track.x = simplified[0][0]; track.y = simplified[0][1];
  track.integrator_shift = 7;
  track.coordinate = gateX ? Coordinate.X : Coordinate.Y;
  track.comparison = direction > 0 ? Comparison.GreaterEqual : Comparison.LessThan;
  track.dwell_frames = 8;
  const initial = paintedVelocity(simplified[0], simplified[1], speed);
  track.velocity_x = initial[0]; track.velocity_y = initial[1];
  track.stage_frames.push(paintedFacingFrames(movie,
    initial[0], initial[1], fallback, track.editor_animation));
  let turned = false;
  for (let segment = 0; segment + 1 < simplified.length; ++segment) {
    const endpoint = simplified[segment + 1];
    let nextVelocity = [0, 0];
    if (segment + 2 < simplified.length)
      nextVelocity = paintedVelocity(endpoint, simplified[segment + 2], speed);
    const rawNextAxis = segment + 2 < simplified.length
      ? coordinate(simplified[segment + 2]) - coordinate(endpoint) : 0;
    const reversal = Math.abs(rawNextAxis) >= 3 && ((rawNextAxis > 0) !== (direction > 0));
    track.keyframes.push(makeKeyframe({
      threshold: coordinate(endpoint), velocity_x: nextVelocity[0], velocity_y: nextVelocity[1],
    }));
    track.stage_frames.push(paintedFacingFrames(movie,
      nextVelocity[0], nextVelocity[1], track.stage_frames[track.stage_frames.length - 1],
      track.editor_animation));
    if (reversal) { turned = true; break; }
  }
  return turned;
}

// ------------------------------------------------------------- simulated_path

/** A PreviewTrack seeded from a track, as the C++ does before simulating. */
function previewStateFor(track) {
  return makePreviewTrack({
    x: track.x, xf: track.x_fraction, y: track.y, yf: track.y_fraction,
    vx: track.velocity_x & 0xff, vy: track.velocity_y & 0xff,
  });
}

/** The route the runtime would draw, as [x, y] pairs, thinned for display. */
export function simulatedPath(track) {
  if (track.kind !== TrackKind.Path || !track.stage_frames.length) return [];
  const state = previewStateFor(track);
  state.frame = track.stage_frames[0][0];
  const result = [[state.x, state.y]];
  let settledFrames = 0;
  for (let frame = 0; frame < 4096; ++frame) {
    const oldX = state.x, oldY = state.y;
    advanceTrack(track, state, (frame + 1) & 0xff);
    const dx = state.x - oldX;
    const dy = state.y - oldY;
    if (Math.abs(dx) > 32 || Math.abs(dy) > 32) break;
    const point = [state.x, state.y];
    if (!samePoint(point, result[result.length - 1])
      && (frame % 2 === 0 || state.stage >= track.keyframes.length))
      result.push(point);
    if (state.stage >= track.keyframes.length && !state.vx && !state.vy) {
      if (++settledFrames >= 2) break;
    } else settledFrames = 0;
  }
  return result;
}

// ----------------------------------------------------------- runtime_waypoints

/** Where each keyframe gate actually fires, as { x, y } waypoints. */
export function runtimeWaypoints(track) {
  if (track.kind !== TrackKind.Path || !track.stage_frames.length) return [];
  const state = previewStateFor(track);
  const result = [{ x: state.x, y: state.y }];
  let priorStage = 0;
  for (let frame = 0; frame < 4096 && state.stage < track.keyframes.length; ++frame) {
    const oldX = state.x, oldY = state.y;
    advanceTrack(track, state, (frame + 1) & 0xff);
    if (Math.abs(state.x - oldX) > 32 || Math.abs(state.y - oldY) > 32) break;
    if (state.stage !== priorStage) {
      result.push({ x: state.x, y: state.y }); priorStage = state.stage;
    }
  }
  return result;
}

// --------------------------------------------------- invalid_waypoint_segments

/** One boolean per segment between consecutive { x, y } waypoints. */
export function invalidWaypointSegments(points) {
  const invalid = new Array(points.length > 1 ? points.length - 1 : 0).fill(false);
  if (points.length < 2) return invalid;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const gateX = Math.max(...xs) - Math.min(...xs) >= Math.max(...ys) - Math.min(...ys);
  const axis = (point) => (gateX ? point.x : point.y);
  let direction = 0, reversed = false;
  for (let i = 0; i + 1 < points.length; ++i) {
    const delta = axis(points[i + 1]) - axis(points[i]);
    if (!delta) { invalid[i] = true; continue; }
    const segmentDirection = delta > 0 ? 1 : -1;
    if (!direction) direction = segmentDirection;
    else if (segmentDirection !== direction) {
      if (reversed || i + 2 < points.length) invalid[i] = true;
      else reversed = true;
    }
  }
  return invalid;
}

// ------------------------------------------------------------- translate_actor

export function translateActor(track, dx, dy) {
  let minX = track.x, maxX = track.x;
  let minY = track.y, maxY = track.y;
  for (const point of track.editor_waypoints) {
    minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
  }
  let minDx = -minX, maxDx = 255 - maxX;
  let minDy = -minY, maxDy = 239 - maxY;
  if (track.kind === TrackKind.Path) {
    for (const keyframe of track.keyframes) {
      if (track.coordinate === Coordinate.X) {
        minDx = Math.max(minDx, -keyframe.threshold);
        maxDx = Math.min(maxDx, 255 - keyframe.threshold);
      } else {
        minDy = Math.max(minDy, -keyframe.threshold);
        maxDy = Math.min(maxDy, 255 - keyframe.threshold);
      }
    }
  }
  dx = minDx <= maxDx ? clamp(dx, minDx, maxDx) : 0;
  dy = minDy <= maxDy ? clamp(dy, minDy, maxDy) : 0;
  track.x = (track.x + dx) & 0xff;
  track.y = (track.y + dy) & 0xff;
  for (const point of track.editor_waypoints) {
    point.x = (point.x + dx) & 0xff;
    point.y = (point.y + dy) & 0xff;
  }
  if (track.kind === TrackKind.Path) {
    const delta = track.coordinate === Coordinate.X ? dx : dy;
    for (const keyframe of track.keyframes)
      keyframe.threshold = (keyframe.threshold + delta) & 0xff;
  }
}

// ---------------------------------------------------------------- paste_actors

/**
 * Pastes copies of the clipboard tracks into a movie, each offset by (8, 8),
 * named uniquely, and enabled in one phase's masks. The bundle is only
 * touched once the pasted candidate validates. Returns the new track indices.
 */
export function pasteActors(bundle, movieIndex, clipboard, phaseIndex) {
  if (movieIndex >= bundle.movies.length)
    throw new MovieError("movie clipboard destination is missing");
  if (!clipboard.length) throw new MovieError("movie actor clipboard is empty");
  const candidate = structuredClone(bundle);
  const movie = candidate.movies[movieIndex];
  if (movie.tracks.length + clipboard.length > 8)
    throw new MovieError("pasted actors exceed the eight-track limit");
  if (!movie.phases.length)
    throw new MovieError("movie clipboard destination has no phases");
  phaseIndex = Math.min(phaseIndex, movie.phases.length - 1);
  const uniqueName = (base) => {
    if (base === "") base = "Actor";
    const exists = (name) => movie.tracks.some((actor) => actor.editor_name === name);
    if (!exists(base)) return base;
    for (let suffix = 2; ; ++suffix) {
      const candidateName = `${base} ${suffix}`;
      if (!exists(candidateName)) return candidateName;
    }
  };
  const pasted = [];
  for (const source of clipboard) {
    const actor = structuredClone(source);
    const index = movie.tracks.length;
    actor.editor_name = uniqueName(actor.editor_name + " Copy");
    translateActor(actor, 8, 8);
    movie.tracks.push(actor);
    movie.phases[phaseIndex].update_mask |= (1 << index) & 0xff;
    movie.phases[phaseIndex].draw_mask |= (1 << index) & 0xff;
    pasted.push(index);
  }
  validate(candidate);
  // assign into the existing movie object, as the C++ move-assignment does,
  // so a caller's reference to the movie stays valid
  Object.assign(bundle.movies[movieIndex], candidate.movies[movieIndex]);
  return pasted;
}

// ------------------------------------------------------ estimated_phase_frames

export function estimatedPhaseFrames(phase) {
  switch (phase.condition) {
    case Condition.Frames:
      return Math.max(1, phase.condition_value);
    case Condition.FrameCounterZero:
      return phase.enter_action === EnterAction.SetFrameCounter
        ? Math.max(1, 256 - phase.enter_value) : 256;
    case Condition.MusicZero: return 240;
    case Condition.EffectCalls:
      return Math.max(1, phase.condition_value) * Math.max(1, phase.effect_period);
    case Condition.TrackYGte: return 120;
  }
  return 120;
}
