// The fixed point simulator, ported from eoe_core/src/fe/AtlasMoviePreview.cpp
// function for function. Every field the C++ declares as `byte` is kept in
// 0..255 here with explicit `& 0xff` wraparound, because the page draws from
// these numbers and they must land where the runtime lands.

import { MovieError } from "./bytes.mjs";
import { TrackKind, Coordinate, Comparison, EnterAction, Effect, Condition } from "./types.mjs";

/** PreviewTrack in AtlasMoviePreview.h, with the same defaults. */
export function makePreviewTrack(over = {}) {
  return {
    x: 0, xf: 0, y: 0, yf: 0, vx: 0, vy: 0,
    tick: 0, stage: 0, pose: 0, frame: 0,
    visible: true,
    counter_resolved: true,
    ...over,
  };
}

/** PreviewState in AtlasMoviePreview.h, with the same defaults. */
export function makePreviewState(over = {}) {
  return { tracks: [], phase: 0, phase_frame: 0, effect_calls: 0, frame_counter: 0,
           finished: false, ...over };
}

// The C++ indexes with std::vector::at(), which throws std::out_of_range on an
// empty vector; a JS index would silently give undefined, so refuse instead.
function at(list, index, label) {
  if (!(index >= 0 && index < list.length)) throw new MovieError(`${label} is empty`);
  return list[index];
}

// integrate(): an arithmetic shift of the 8 bit velocity into a 16 bit
// (whole, fraction) delta, then a carrying add into the position.
function integrate(state, wholeKey, fractionKey, velocity, shift) {
  let hi = velocity & 0xff, lo = 0;
  for (let i = 0; i < shift; i++) {
    const sign = (hi >> 7) & 1;
    const shifted = hi & 1;
    hi = ((hi >> 1) | (sign << 7)) & 0xff;
    lo = ((lo >> 1) | (shifted << 7)) & 0xff;
  }
  const total = state[fractionKey] + lo;
  state[fractionKey] = total & 0xff;
  state[wholeKey] = (state[wholeKey] + hi + (total >> 8)) & 0xff;
}

function resetCyclic(track, state) {
  state.x = track.x; state.xf = track.x_fraction;
  state.y = track.y; state.yf = track.y_fraction;
  state.vx = track.velocity_x & 0xff;
  state.vy = track.velocity_y & 0xff;
  state.tick = 0; state.pose = 0;
}

/**
 * advance_track(): one update of one track. `frameCounter` is the byte the
 * runtime holds at $001A (or the resolved RAM counter for CounterToggle).
 */
export function advanceTrack(track, state, frameCounter) {
  if (track.kind === TrackKind.CounterToggle) {
    state.x = track.x; state.y = track.y;
    const index = (frameCounter & track.counter_mask) ? 1 : 0;
    state.frame = at(track.toggle_frames,
      Math.min(index, track.toggle_frames.length - 1), "toggle_frames");
    return;
  }
  integrate(state, "x", "xf", state.vx, track.integrator_shift);
  integrate(state, "y", "yf", state.vy, track.integrator_shift);
  if (track.kind === TrackKind.Path) {
    if (state.stage < track.keyframes.length) {
      const keyframe = track.keyframes[state.stage];
      const coordinate = track.coordinate === Coordinate.X ? state.x : state.y;
      const crossed = track.comparison === Comparison.LessThan
        ? coordinate < keyframe.threshold
        : coordinate >= keyframe.threshold;
      if (crossed) {
        state.stage = (state.stage + 1) & 0xff;
        state.vx = keyframe.velocity_x & 0xff;
        state.vy = keyframe.velocity_y & 0xff;
      }
    }
    state.tick = (state.tick + 1) & 0xff;
    const slots = at(track.stage_frames,
      Math.min(state.stage, track.stage_frames.length - 1), "stage_frames");
    if (track.dwell_frames === 0) throw new MovieError("dwell_frames is zero");
    state.frame = at(slots, Math.floor(state.tick / track.dwell_frames) % slots.length,
      "stage_frames slot list");
    state.visible = true;
  } else {
    state.tick = (state.tick + 1) & 0xff;
    if (state.tick === track.dwell_frames) {
      state.pose = (state.pose + 1) & 0xff; state.tick = 0;
      if (state.pose === track.reset_at_pose) resetCyclic(track, state);
    }
    state.visible = state.pose < track.visible_frames.length;
    if (state.visible) state.frame = track.visible_frames[state.pose];
  }
}

/**
 * preview(): the movie state after `targetFrame` frames. `counterReader`, when
 * given, is (address, elapsedFrames) => byte | undefined for CounterToggle
 * tracks that watch something other than $001A; only $001A exists offline.
 */
export function preview(movie, targetFrame, musicHold = 240, counterReader = null) {
  const state = makePreviewState();
  let elapsedFrames = 0;
  for (const track of movie.tracks) {
    const row = makePreviewTrack();
    row.x = track.x; row.xf = track.x_fraction;
    row.y = track.y; row.yf = track.y_fraction;
    row.vx = track.velocity_x & 0xff;
    row.vy = track.velocity_y & 0xff;
    if (track.kind === TrackKind.Path && track.stage_frames.length)
      row.frame = track.stage_frames[0][0];
    else if (track.kind === TrackKind.Cyclic && track.visible_frames.length)
      row.frame = track.visible_frames[0];
    else if (track.toggle_frames.length)
      row.frame = track.toggle_frames[0];
    state.tracks.push(row);
  }
  for (let frame = 0; frame < targetFrame && !state.finished; frame++) {
    elapsedFrames++;
    if (state.phase >= movie.phases.length) {
      state.finished = true; break;
    }
    const phase = movie.phases[state.phase];
    if (state.phase_frame === 0 && phase.enter_action === EnterAction.SetFrameCounter)
      state.frame_counter = phase.enter_value & 0xff;
    state.frame_counter = (state.frame_counter + 1) & 0xff;
    state.phase_frame++;
    for (let i = 0; i < movie.tracks.length; i++)
      if (phase.update_mask & (1 << i))
        advanceTrack(movie.tracks[i], state.tracks[i], state.frame_counter);
    if (phase.effect === Effect.PaletteFade
        && phase.effect_track < state.tracks.length
        && state.tracks[phase.effect_track].stage >= phase.effect_stage)
      state.effect_calls++;
    let done = false;
    switch (phase.condition) {
      case Condition.EffectCalls:
        done = state.effect_calls >= phase.condition_value; break;
      case Condition.TrackYGte:
        done = phase.condition_track < state.tracks.length
          && state.tracks[phase.condition_track].y >= phase.condition_value;
        break;
      case Condition.MusicZero:
        done = state.phase_frame >= musicHold; break;
      case Condition.FrameCounterZero:
        done = state.frame_counter === 0; break;
      case Condition.Frames:
        done = state.phase_frame >= phase.condition_value; break;
    }
    if (done) {
      state.phase++; state.phase_frame = 0; state.effect_calls = 0;
      if (state.phase >= movie.phases.length) state.finished = true;
    }
  }
  // only $001A exists in the offline preview, other counters need a reader
  for (let i = 0; i < movie.tracks.length; i++) {
    const track = movie.tracks[i];
    if (track.kind !== TrackKind.CounterToggle) continue;
    let counter;
    if (track.counter_address === 0x001a) counter = state.frame_counter;
    else if (counterReader) {
      const read = counterReader(track.counter_address, elapsedFrames);
      if (read !== undefined && read !== null) counter = read & 0xff;
    }
    state.tracks[i].counter_resolved = counter !== undefined;
    advanceTrack(track, state.tracks[i], counter === undefined ? 0 : counter);
  }
  return state;
}
