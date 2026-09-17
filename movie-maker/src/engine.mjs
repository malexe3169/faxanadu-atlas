// The Atlas Movie Engine: layout constants, the AME1 package, install into a
// ROM image with the dispatch patch, and the scheduler compatibility probe.
// A function by function port of eoe_core/src/fe/AtlasMovieLayout.h/.cpp,
// AtlasMovieCompatibility.cpp and AtlasMovieEngine.cpp, in the C++ order,
// with the C++ refusal text.
//
// The one thing the C++ has that this file does not: the engine's own
// executable bytes. AtlasMovieEngine.cpp includes AtlasMovieEngineData.inc,
// which util/generate_atlas_movie_runtime.py generates by assembling
// AtlasMovieRuntime.s into GENERATED_CORE (782 bytes, loaded at $A708) and
// GENERATED_TAIL (1235 bytes, loaded at $AD91). Those bytes are not embedded
// here; every function that needs them takes an `engineCode` argument of the
// shape { core: Uint8Array(782), tail: Uint8Array(1235) }. The page loads
// them from an AME1 file or from the assembled runtime and hands them in.
import { MovieError, require, equalBytes } from "./bytes.mjs";
import {
  layout as codecLayout, fileOffset, compileBundle, parseBundle, validatedPrefixSize,
} from "./bundle.mjs";
import { validateMovieOamBudget, rejectMovieSourceOverlaps } from "./assets.mjs";
import { SHARED_CORE_WORD_RELOCATIONS, SHARED_CORE_SPLIT_RELOCATIONS,
  SHARED_TAIL_WORD_RELOCATIONS, SHARED_TAIL_SPLIT_RELOCATIONS } from "./engine_relocations.mjs";

// ---- AtlasMovieLayout.h -----------------------------------------------------
// bundle.mjs carries the subset the codec needs; this is the whole namespace.
export const layout = Object.freeze({
  ...codecLayout,
  CORE_CPU: 0xa708,
  CORE_LIMIT: 0xaa83,
  TAIL_CPU: 0xad91,
});

// AtlasMovieLayout.cpp: file_offset lives in bundle.mjs; one definition
export { fileOffset };

const {
  HEADER_BYTES, PRG_BANK_BYTES, CORE_CPU, HANDLER_CPU, TAIL_CPU, BUNDLE_CPU,
  DISPATCH_HIGH_REF, DISPATCH_LOW_REF, CORE_BYTES, TAIL_BYTES, DISPATCH_ENTRIES, HANDLERS,
} = layout;

// ---- AtlasMovieCompatibility.cpp --------------------------------------------

/** Active scheduler roles continue while a movie is playing. */
export function hasAtlasResidentScheduler(rom) {
  const CURRENT_ATLAS_RESIDENT_SCHEDULER = [0x20, 0xce, 0xfc, 0xea, 0xea];
  const offset = fileOffset(15, 0xc9af);
  return offset <= rom.length
    && CURRENT_ATLAS_RESIDENT_SCHEDULER.length <= rom.length - offset
    && CURRENT_ATLAS_RESIDENT_SCHEDULER.every((b, i) => rom[offset + i] === b);
}

// ---- AtlasMovieEngine.cpp, the anonymous namespace --------------------------

/** the static_asserts of AtlasMovieEngine.cpp, for the bytes handed in */
export function requireEngineCode(engineCode) {
  require(engineCode && engineCode.core instanceof Uint8Array && engineCode.tail instanceof Uint8Array
    && engineCode.core.length === CORE_BYTES && engineCode.tail.length === TAIL_BYTES,
    `Atlas Movie Engine code must be ${CORE_BYTES} core bytes and ${TAIL_BYTES} tail bytes`);
  return engineCode;
}

function requireSpan(data, offset, size, label) {
  if (offset > data.length || size > data.length - offset)
    throw new MovieError(`Atlas Movie Engine truncated ${label}`);
}

function readWord(data, offset) {
  requireSpan(data, offset, 2, "word");
  return data[offset] | (data[offset + 1] << 8);
}

function writeWord(data, offset, value) {
  requireSpan(data, offset, 2, "ROM write");
  data[offset] = value & 0xff;
  data[offset + 1] = (value >> 8) & 0xff;
}

function writeBytes(rom, bank, cpu, bytes) {
  const offset = fileOffset(bank, cpu);
  requireSpan(rom, offset, bytes.length, "ROM write");
  rom.set(bytes, offset);
}

const FNV_OFFSET = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const U64 = 0xffffffffffffffffn;

/** 64-bit FNV-1a over a ROM span; -> BigInt */
export function fnv1a(rom, bank, cpu, size) {
  const offset = fileOffset(bank, cpu);
  requireSpan(rom, offset, size, "signature");
  let result = FNV_OFFSET;
  for (let i = 0; i < size; i++) {
    result ^= BigInt(rom[offset + i]);
    result = (result * FNV_PRIME) & U64;
  }
  return result;
}

function bytesEqual(rom, bank, cpu, expected) {
  const offset = fileOffset(bank, cpu);
  if (offset > rom.length || expected.length > rom.length - offset) return false;
  for (let i = 0; i < expected.length; i++) if (rom[offset + i] !== expected[i]) return false;
  return true;
}

function bytesAre(rom, bank, cpu, size, expected) {
  const offset = fileOffset(bank, cpu);
  if (offset > rom.length || size > rom.length - offset) return false;
  for (let i = 0; i < size; i++) if (rom[offset + i] !== expected) return false;
  return true;
}

// ---- the C++ literals install() and is_installed() carry ---------------------

/** the five FNV-1a signatures a clean USA Rev 0 ROM must carry before install */
export const VANILLA_SIGNATURES = Object.freeze([
  Object.freeze({ bank: 12, cpu: CORE_CPU, size: 0x037b, hash: 0x500777943fdb2d92n }),
  Object.freeze({ bank: 15, cpu: 0xfc9c, size: 2, hash: 0x0a341107b6a00e89n }),
  Object.freeze({ bank: 12, cpu: 0x82ae, size: 3, hash: 0xc3736d17ce7e651an }),
  Object.freeze({ bank: 12, cpu: 0xaa83, size: 17, hash: 0x4b9cac1c2c83a089n }),
  Object.freeze({ bank: 12, cpu: 0xaa9f, size: 120, hash: 0x423b9391916d3b2bn }),
]);

/** the vanilla words the two dispatch references hold before install */
export const VANILLA_DISPATCH_HIGH = 0x8293;
export const VANILLA_DISPATCH_LOW = 0x827b;

const TITLE_SITE = Object.freeze([0x20, 0x59, 0xf8, 0x0c, 0x07, 0xa7]);  // bank 15 $FC98
const ENDING_SITE = Object.freeze([0x20, 0x0c, 0xa7, 0x4c, 0x13, 0xc9]); // bank 12 $82AE
const ADAPTER = Object.freeze([0x20, 0xa4, 0x87, 0x4c, 0x13, 0xa7]);     // bank 12 HANDLER_CPU
const TITLE_HOOK = Object.freeze([0x07, 0xa7]);                          // bank 15 $FC9C
const ENDING_HOOK = Object.freeze([0x20, 0x0c, 0xa7]);                   // bank 12 $82AE

// ---- AtlasMovieEngine ---------------------------------------------------------

// ---- a floating tail --------------------------------------------------------
// The adapter, tail and bundle normally sit in the run right after the stock
// intro engine. A ROM whose own bank 12 data reaches into that run (FaxEdit's
// second script region starts at $AD9B) gets the same three pieces above its
// data, with the core's and tail's references to them moved by the tables in
// engine_relocations.mjs. The core itself never moves.

/** the shared layout with the adapter at `adapterCpu` (default: the stock run) */
export function sharedLayoutAt(adapterCpu = HANDLER_CPU) {
  const tail = (adapterCpu + (TAIL_CPU - HANDLER_CPU)) & 0xffff;
  return Object.freeze({ adapter: adapterCpu, tail, bundle: (tail + TAIL_BYTES) & 0xffff });
}

function moveWords(image, words, splits, delta) {
  for (const o of words) {
    const v = ((image[o] | (image[o + 1] << 8)) + delta) & 0xffff;
    image[o] = v & 0xff; image[o + 1] = v >> 8;
  }
  for (const [lo, hi] of splits) {
    const v = ((image[lo] | (image[hi] << 8)) + delta) & 0xffff;
    image[lo] = v & 0xff; image[hi] = v >> 8;
  }
}

/** copies of the engine's core and tail with every tail reference moved to `tailCpu` */
export function relocatedEngine(engineCode, tailCpu) {
  const { core, tail } = requireEngineCode(engineCode);
  const c = Uint8Array.from(core), t = Uint8Array.from(tail);
  const delta = tailCpu - TAIL_CPU;
  if (delta !== 0) {
    moveWords(c, SHARED_CORE_WORD_RELOCATIONS, SHARED_CORE_SPLIT_RELOCATIONS, delta);
    moveWords(t, SHARED_TAIL_WORD_RELOCATIONS, SHARED_TAIL_SPLIT_RELOCATIONS, delta);
  }
  return { core: c, tail: t };
}

/** The layout an installed ROM actually carries, read from its dispatch
 *  tables (the opcode adapter's entry is its address minus one, like every
 *  other entry), or null when the engine is not correctly installed. */
export function installedLayout(rom, engineCode) {
  requireEngineCode(engineCode);
  try {
    if (!bytesEqual(rom, 15, 0xfc98, TITLE_SITE) || !bytesEqual(rom, 12, 0x82ae, ENDING_SITE)) return null;
    const low = readWord(rom, fileOffset(12, DISPATCH_LOW_REF));
    const high = readWord(rom, fileOffset(12, DISPATCH_HIGH_REF));
    if (high < low + DISPATCH_ENTRIES || high + DISPATCH_ENTRIES > 0xc000) return null;
    const entry = rom[fileOffset(12, low) + DISPATCH_ENTRIES - 1]
      | (rom[fileOffset(12, high) + DISPATCH_ENTRIES - 1] << 8);
    const layout = sharedLayoutAt((entry + 1) & 0xffff);
    if (layout.adapter < HANDLER_CPU || layout.bundle >= low) return null;
    if (!bytesEqual(rom, 12, layout.adapter, ADAPTER)) return null;
    const { core, tail } = relocatedEngine(engineCode, layout.tail);
    if (!bytesEqual(rom, 12, CORE_CPU, core) || !bytesEqual(rom, 12, layout.tail, tail)) return null;

    const bundleOffset = fileOffset(12, layout.bundle);
    const bankEnd = fileOffset(12, 0xbfff) + 1;
    if (bundleOffset >= rom.length || bankEnd > rom.length) return null;
    const bundleBytes = validatedPrefixSize(rom.slice(bundleOffset, bankEnd));
    if (low < layout.bundle + bundleBytes) return null;   // tables may sit higher, after generated opcodes
    for (let i = 0; i < HANDLERS.length; i++) {
      const handler = i + 1 === HANDLERS.length ? (layout.adapter - 1) & 0xffff : HANDLERS[i];
      if (rom[fileOffset(12, low) + i] !== (handler & 0xff)
        || rom[fileOffset(12, high) + i] !== (handler >> 8)) return null;
    }
    return layout;
  } catch (e) {
    return null;
  }
}

/** AtlasMovieEngine::is_installed; any refusal along the way is `false` */
export function isInstalled(rom, engineCode) {
  return installedLayout(rom, engineCode) !== null;
}

/** AtlasMovieEngine::build_package: a complete AME1 from the engine and movie data */
export function buildPackage(bundle, engineCode) {
  const { core, tail } = requireEngineCode(engineCode);
  const fmb = compileBundle(bundle);
  if (fmb.length > 0xffff)
    throw new MovieError("Atlas Movie Engine bundle exceeds AME1 limits");
  const result = new Uint8Array(11 + CORE_BYTES + TAIL_BYTES + fmb.length);
  result.set([0x41, 0x4d, 0x45, 0x31, 1,
    CORE_BYTES & 0xff, CORE_BYTES >> 8,
    TAIL_BYTES & 0xff, TAIL_BYTES >> 8,
    fmb.length & 0xff, fmb.length >> 8]);
  result.set(core, 11);
  result.set(tail, 11 + CORE_BYTES);
  result.set(fmb, 11 + CORE_BYTES + TAIL_BYTES);
  validatePackage(result, engineCode);
  return result;
}

/** AtlasMovieEngine::validate_package: engine bytes and FMB */
export function validatePackage(pkg, engineCode) {
  const { core, tail } = requireEngineCode(engineCode);
  const AME_MAGIC = [0x41, 0x4d, 0x45, 0x31, 1];
  if (pkg.length < 11 || !AME_MAGIC.every((b, i) => pkg[i] === b))
    throw new MovieError("Invalid Atlas Movie Engine AME1 package");

  const coreSize = readWord(pkg, 5);
  const tailSize = readWord(pkg, 7);
  const bundleSize = readWord(pkg, 9);
  if (coreSize !== CORE_BYTES || tailSize !== TAIL_BYTES)
    throw new MovieError("Unsupported Atlas Movie Engine code version");
  if (11 + coreSize + tailSize + bundleSize !== pkg.length)
    throw new MovieError("Atlas Movie Engine package length is inconsistent");
  if (!equalBytes(core, pkg.subarray(11, 11 + coreSize))
    || !equalBytes(tail, pkg.subarray(11 + coreSize, 11 + coreSize + tailSize)))
    throw new MovieError(
      "Atlas Movie Engine executable bytes do not match supported AME1 version 1");
  const bundleOffset = 11 + coreSize + tailSize;
  parseBundle(pkg.slice(bundleOffset));
}

/** AtlasMovieEngine::script_data_start: first free iScript file offset after AME */
export function scriptDataStart(rom, engineCode) {
  if (!isInstalled(rom, engineCode))
    throw new MovieError("Atlas Movie Engine is not installed");
  const low = readWord(rom, fileOffset(12, DISPATCH_LOW_REF));
  const high = readWord(rom, fileOffset(12, DISPATCH_HIGH_REF));
  const endCpu = high + (high - low);
  if (endCpu > 0xc000)
    throw new MovieError("Installed Atlas Movie Engine overflows bank 12");
  return fileOffset(12, endCpu & 0xffff);
}

/** AtlasMovieEngine::install: writes the ROM in place;
 *  -> { bundle_bytes, reserved_file_end } (AtlasMovieInstallResult).
 *  `signatures` is the table of ROM spans and FNV-1a hashes the ROM must
 *  match; the default is the C++ USA Rev 0 table. */
export function install(rom, pkg, engineCode, signatures = VANILLA_SIGNATURES, adapterCpu = HANDLER_CPU) {
  if (adapterCpu < HANDLER_CPU) throw new MovieError("Atlas Movie Engine adapter cannot sit below the stock run");
  const at = sharedLayoutAt(adapterCpu);
  if (isInstalled(rom, engineCode))
    throw new MovieError("Atlas Movie Engine is already installed");
  if (rom.length !== HEADER_BYTES + 16 * PRG_BANK_BYTES)
    throw new MovieError("Atlas Movie Engine requires an unexpanded 256 KiB PRG ROM");
  validatePackage(pkg, engineCode);

  const coreSize = readWord(pkg, 5);
  const tailSize = readWord(pkg, 7);
  const bundleSize = readWord(pkg, 9);
  const bundleOffset = 11 + coreSize + tailSize;

  for (const s of signatures)
    if (fnv1a(rom, s.bank, s.cpu, s.size) !== s.hash)
      throw new MovieError(
        "ROM is not compatible USA Rev 0, or its cinematic machinery was already modified");

  const dispatchRefHi = fileOffset(12, DISPATCH_HIGH_REF);
  const dispatchRefLo = fileOffset(12, DISPATCH_LOW_REF);
  if (readWord(rom, dispatchRefHi) !== VANILLA_DISPATCH_HIGH
    || readWord(rom, dispatchRefLo) !== VANILLA_DISPATCH_LOW)
    throw new MovieError(
      "Install Atlas Movie Engine before adding other extended iScript opcodes");

  const dispatchLowSize = at.bundle + bundleSize;
  const dispatchHighSize = dispatchLowSize + DISPATCH_ENTRIES;
  const endCpuSize = dispatchHighSize + DISPATCH_ENTRIES;
  if (endCpuSize > 0xc000)
    throw new MovieError("Atlas Movie Engine package overflows bank 12");
  if (!bytesAre(rom, 12, at.adapter, endCpuSize - at.adapter, 0xff))
    throw new MovieError(
      "Atlas Movie Engine destination space is already used by another ROM patch");
  const dispatchLow = dispatchLowSize & 0xffff;
  const dispatchHigh = dispatchHighSize & 0xffff;
  const endCpu = endCpuSize & 0xffff;
  const fmb = pkg.slice(bundleOffset);
  const parsedBundle = parseBundle(fmb);
  validateMovieOamBudget(rom, parsedBundle);
  rejectMovieSourceOverlaps(rom, parsedBundle, [
    { offset: fileOffset(12, CORE_CPU), bytes: coreSize, label: "Shared core" },
    { offset: fileOffset(12, at.adapter), bytes: endCpuSize - at.adapter,
      label: "Shared adapter, tail, FMB, and dispatch" },
    { offset: dispatchRefHi, bytes: 2, label: "Shared high dispatch reference" },
    { offset: dispatchRefLo, bytes: 2, label: "Shared low dispatch reference" },
    { offset: fileOffset(15, 0xfc9c), bytes: 2, label: "Shared title hook" },
    { offset: fileOffset(12, 0x82ae), bytes: 3, label: "Shared ending hook" },
  ], "Atlas Movie Engine Shared install");

  // the package carries the engine at its stock addresses; move its references
  const { core, tail } = relocatedEngine(
    { core: pkg.subarray(11, 11 + coreSize), tail: pkg.subarray(11 + coreSize, 11 + coreSize + tailSize) },
    at.tail);
  const bundleData = pkg.subarray(bundleOffset, bundleOffset + bundleSize);
  writeBytes(rom, 12, CORE_CPU, core);
  writeBytes(rom, 12, at.adapter, Uint8Array.from(ADAPTER));
  writeBytes(rom, 12, at.tail, tail);
  writeBytes(rom, 12, at.bundle, bundleData);

  const low = new Uint8Array(HANDLERS.length), high = new Uint8Array(HANDLERS.length);
  for (let i = 0; i < HANDLERS.length; i++) {
    const handler = i + 1 === HANDLERS.length ? (at.adapter - 1) & 0xffff : HANDLERS[i];
    low[i] = handler & 0xff;
    high[i] = handler >> 8;
  }
  writeBytes(rom, 12, dispatchLow, low);
  writeBytes(rom, 12, dispatchHigh, high);
  writeWord(rom, dispatchRefHi, dispatchHigh);
  writeWord(rom, dispatchRefLo, dispatchLow);
  writeBytes(rom, 15, 0xfc9c, Uint8Array.from(TITLE_HOOK));
  writeBytes(rom, 12, 0x82ae, Uint8Array.from(ENDING_HOOK));

  return {
    bundle_bytes: bundleSize,
    reserved_file_end: fileOffset(12, endCpu),
    layout: at,
  };
}

/** the `engine` argument bundle.mjs's AME and installed-ROM helpers take,
 *  bound to one set of engine bytes */
export function engineFor(engineCode) {
  requireEngineCode(engineCode);
  return Object.freeze({
    installedLayout: (rom) => installedLayout(rom, engineCode),
    isInstalled: (rom) => isInstalled(rom, engineCode),
    validatePackage: (pkg) => validatePackage(pkg, engineCode),
  });
}
