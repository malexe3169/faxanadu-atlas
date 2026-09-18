// Where the movies can go in this ROM, measured before anything is written.
//
// The shared engine has a fixed home in bank 12: the core replaces the stock
// intro engine at $A708, and the adapter, tail, movies and dispatch tables
// take the run from $AD8B up to $C000. In the stock game that run is empty
// (bank 12's data ends at $AD89), which is why "no new space". But FaxEdit's
// second script region starts at $AD9B and grows upward, so a mod with many
// scripts has already filled part of that run: the FaxOptions showcase ends
// at $AF90, 512 bytes into the tail. engine.install() refuses such a ROM
// ("destination space is already used") rather than corrupt the scripts.
//
// This module measures the collision and plans around it: shared when the run
// is free, otherwise the relocatable standalone player above the ROM's data,
// otherwise a refusal that says exactly how many bytes are short. Nothing here
// writes; install() and installStandalone() keep their own checks.
import { layout, fileOffset, sharedLayoutAt } from "./engine.mjs";
import { compileBundle } from "./bundle.mjs";
import { STANDALONE_PLAYER_BYTES } from "./runtime.mjs";

const { HANDLER_CPU, BUNDLE_CPU, DISPATCH_ENTRIES, HEADER_BYTES, PRG_BANK_BYTES, TAIL_BYTES } = layout;
const ADAPTER_BYTES = 6;
const BANK_END = 0xc000;
const DISPATCH_TABLES = 2 * DISPATCH_ENTRIES;          // low table then high table
export const SHARED_BUDGET = BANK_END - BUNDLE_CPU - DISPATCH_TABLES;   // 3434
export const FAXEDIT_SCRIPT_REGION_2 = 0xad9b;          // iscript_data_rg2_start

const hex = (v) => "$" + v.toString(16).toUpperCase().padStart(4, "0");

/** The last used byte of bank 12 and the free run above it. */
export function bank12Extent(rom) {
  if (rom.length !== HEADER_BYTES + 16 * PRG_BANK_BYTES)
    throw new Error("bank12Extent needs an unexpanded 256 KiB PRG ROM");
  const start = fileOffset(12, 0x8000);
  let n = 0;
  while (n < PRG_BANK_BYTES && rom[start + PRG_BANK_BYTES - 1 - n] === 0xff) n++;
  const dataEndCpu = 0x8000 + PRG_BANK_BYTES - 1 - n;   // 0x7fff when the bank is empty
  return { dataEndCpu, freeTail: n, firstFreeCpu: dataEndCpu + 1 };
}

/** Where the shared engine goes: its stock run when that is free, otherwise
 *  floated above the ROM's data (the core's and tail's references move with
 *  it). `adapter` is the address install() takes; `floated` says it moved. */
export function sharedPlan(rom, fmbBytes) {
  const ext = bank12Extent(rom);
  const adapter = ext.dataEndCpu >= HANDLER_CPU ? ext.firstFreeCpu : HANDLER_CPU;
  const at = sharedLayoutAt(adapter);
  const budget = BANK_END - at.bundle - DISPATCH_TABLES;
  const out = { mode: "shared", fits: true, adapter, floated: adapter !== HANDLER_CPU, layout: at,
                budget, fmbBytes, messages: [] };
  if (out.floated) {
    out.occupied = ext.dataEndCpu - HANDLER_CPU + 1;
    out.messages.push(
      `the ROM's data reaches ${hex(ext.dataEndCpu)}, ${out.occupied} bytes into the stock run from `
      + `${hex(HANDLER_CPU)}`
      + (ext.dataEndCpu >= FAXEDIT_SCRIPT_REGION_2
        ? ` (FaxEdit's second script region starts at ${hex(FAXEDIT_SCRIPT_REGION_2)}; this looks like script data)`
        : "")
      + `, so the engine's tail and movies go above it: tail at ${hex(at.tail)}, movies at ${hex(at.bundle)}`);
  }
  if (budget < 0 || fmbBytes > budget) {
    out.fits = false;
    out.over = fmbBytes - Math.max(0, budget);
    out.messages.push(budget < 0
      ? `no room above ${hex(ext.dataEndCpu)} for the engine's tail (${TAIL_BYTES + ADAPTER_BYTES + DISPATCH_TABLES} bytes)`
      : `the movies are ${fmbBytes} bytes, ${fmbBytes - budget} over the ${budget} that fit above the ROM's data`);
  }
  return out;
}

/** Can the relocatable player carry the movies above the ROM's data instead? */
export function standalonePlan(rom, fmbBytes, hasImports) {
  const ext = bank12Extent(rom);
  const origin = ext.firstFreeCpu;
  const need = STANDALONE_PLAYER_BYTES + fmbBytes;
  const out = { mode: "standalone", fits: true, origin, budget: Math.max(0, ext.freeTail - STANDALONE_PLAYER_BYTES),
                fmbBytes, messages: [] };
  if (hasImports) {
    out.fits = false;
    out.messages.push("standalone mode carries ROM owned assets only; a movie with imported art needs the shared engine");
  }
  if (need > ext.freeTail) {
    out.fits = false;
    out.over = need - ext.freeTail;
    out.messages.push(`the player (${STANDALONE_PLAYER_BYTES}) and the movies (${fmbBytes}) need ${need} bytes above `
      + `${hex(ext.dataEndCpu)}; ${ext.freeTail} are free, ${need - ext.freeTail} short`);
  }
  if (out.fits)
    out.messages.push(`the player goes at ${hex(origin)} with the movies after it; movies are started by a script `
      + `(AtlasDevPlayMovie n), and the stock intro and ending stay as they are`);
  return out;
}

/** The plan for this ROM and this bundle: which mode, where, and why. */
export function plan(rom, bundle) {
  const fmb = compileBundle(bundle);
  const hasImports = bundle.movies.some((m) => m.enabled && m.imports.length > 0);
  const ext = bank12Extent(rom);
  const shared = sharedPlan(rom, fmb.length);
  const standalone = standalonePlan(rom, fmb.length, hasImports);
  const result = { extent: ext, fmbBytes: fmb.length, hasImports, shared, standalone, messages: [] };
  if (shared.fits) {
    result.mode = "shared";
    result.messages.push(...shared.messages,
      `the shared engine fits${shared.floated ? " above the ROM's data" : ""}: ${fmb.length} of ${shared.budget} bytes `
      + `of movies, ${shared.budget - fmb.length} left, and the intro and ending are replaced`);
  } else if (standalone.fits) {
    result.mode = "standalone";
    result.messages.push(...shared.messages, "so the intro cannot be replaced in this ROM", ...standalone.messages);
  } else {
    result.mode = "none";
    result.messages.push(...shared.messages, ...standalone.messages,
      `to fit the shared engine, free ${shared.over || 0} bytes at the top of bank 12 (fewer or shorter scripts, or smaller movies)`
      + (standalone.over ? `; to fit the standalone player, free ${standalone.over}` : ""));
  }
  return result;
}
