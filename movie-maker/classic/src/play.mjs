// movie-maker/src/play.mjs
// The game in the page: jsnes driven one frame at a time. START is pressed
// for the player at the title; after that the keys are theirs. DOM free: the
// jsnes constructor and the two sinks are passed in, so node can run it.
export const PRESS_AT = 150, PRESS_FRAMES = 6;
export const KEYS = Object.freeze({ ArrowUp: 4, ArrowDown: 5, ArrowLeft: 6, ArrowRight: 7, KeyZ: 0, KeyX: 1, Enter: 3, ShiftLeft: 2, ShiftRight: 2 });

export function createPlayer({ NES, rom, onFrame, onAudio, sampleRate = 48000 }) {
  const u32 = new Uint32Array(256 * 240);
  const nes = new NES({
    emulateSound: true, sampleRate,
    onFrame: (buffer) => { for (let i = 0; i < u32.length; i++) u32[i] = 0xff000000 | buffer[i]; onFrame(u32); },
    onAudioSample: (l, r) => onAudio(l, r),
  });
  let binary = ""; for (let i = 0; i < rom.length; i += 0x8000) binary += String.fromCharCode.apply(null, rom.subarray(i, i + 0x8000));
  nes.loadROM(binary);
  const player = {
    frame: 0, held: new Set(),
    step() {
      if (this.frame === PRESS_AT) nes.buttonDown(1, 3);
      if (this.frame === PRESS_AT + PRESS_FRAMES) nes.buttonUp(1, 3);
      nes.frame(); this.frame++;
    },
    press(b) { if (!this.held.has(b)) { this.held.add(b); nes.buttonDown(1, b); } },
    release(b) { if (this.held.has(b)) { this.held.delete(b); nes.buttonUp(1, b); } },
    stop() { for (const b of [...this.held]) this.release(b); },
  };
  return player;
}
