// The standalone player, the config override XML, and the Shared install
// checks. A function by function port of eoe_core/src/fe/AtlasMovieRuntime.cpp
// in the C++ order, with the C++ refusal text. Every refusal here carries the
// "AtlasDevPlayMovie: " prefix the C++ require() adds.
//
// Two things the C++ reaches for that this port takes as arguments:
//   - fe::Config in install_standalone becomes { region, hack_movie_data }.
//   - AtlasMovieEngine::is_installed in resolve_opcode_info comes through an
//     `engine` argument ({ isInstalled(rom) }), the way bundle.mjs takes it,
//     because engine.mjs is a separate module of the port.

import { MovieError } from "./bytes.mjs";
import { parseBundle } from "./bundle.mjs";
import { romOffset, validateMovieOamBudget, rejectMovieSourceOverlaps } from "./assets.mjs";
import {
  STANDALONE_PLAYER, GENERATED_ABSOLUTE_RELOCATIONS, GENERATED_SPLIT_RELOCATIONS,
} from "./runtime_player.mjs";
import {
  ArgType, ArgDomain, Flow, makeOpcode, argumentsEqual, cloneScriptOpcodeInfo, sortedOpcodes,
  argTypeName, argDomainName, flowName,
} from "./runtime_opcode.mjs";

export * from "./runtime_opcode.mjs";
export { STANDALONE_PLAYER } from "./runtime_player.mjs";

export const STANDALONE_PLAYER_BYTES = 1998;
export const SHARED_ADAPTER_BYTES = 6;

const LINK_BASE = 0x8000;

function require(condition, message) {
  if (!condition) throw new MovieError("AtlasDevPlayMovie: " + message);
}

function relocateWord(code, offset, delta) {
  require(offset + 1 < code.length, "internal relocation is outside the player");
  let value = code[offset] | (code[offset + 1] << 8);
  value = (value + delta) & 0xffff;
  code[offset] = value & 0xff;
  code[offset + 1] = value >> 8;
}

const named = (opcode, name) => opcode.name.toLowerCase() === name.toLowerCase();

function xmlEscape(text) {
  let result = "";
  for (const ch of text) {
    switch (ch) {
    case "&": result += "&amp;"; break;
    case "<": result += "&lt;"; break;
    case ">": result += "&gt;"; break;
    case "\"": result += "&quot;"; break;
    case "'": result += "&apos;"; break;
    default: result += ch; break;
    }
  }
  return result;
}

function explicitDefinition(opcode) {
  let result = "Mnemonic=" + opcode.name;
  if (opcode.args.length) {
    result += ",Args=";
    for (let i = 0; i < opcode.args.length; i++) {
      if (i) result += "+";
      result += argTypeName(opcode.args[i].type);
      if (opcode.args[i].domain !== ArgDomain.None)
        result += ":" + argDomainName(opcode.args[i].domain);
    }
  }
  if (opcode.flow !== Flow.Continue) result += ",Flow=" + flowName(opcode.flow);
  if (opcode.ends_stream) result += ",Terminal=true";
  return result;
}

function canonicalSharedOpcode(opcode) {
  return argumentsEqual(opcode.args, [{ type: ArgType.Byte, domain: ArgDomain.None }])
    && opcode.flow === Flow.End && opcode.ends_stream;
}

const hex2 = (b) => b.toString(16).padStart(2, "0");

/** build_standalone: the relocated player followed by FMB */
export function buildStandalone(fmb, cpuAddr) {
  require(cpuAddr >= 0x8000, "player starts below bank 12's CPU window");
  const bundle = parseBundle(fmb);
  for (const movie of bundle.movies)
    require(movie.imports.length === 0,
      "standalone mode currently supports ROM-owned assets only; use Shared mode for imported graphics");

  const code = Uint8Array.from(STANDALONE_PLAYER);
  const delta = cpuAddr - LINK_BASE;
  for (const offset of GENERATED_ABSOLUTE_RELOCATIONS) relocateWord(code, offset, delta);

  for (const [low, high] of GENERATED_SPLIT_RELOCATIONS) {
    require(low < code.length && high < code.length,
      "internal split relocation is outside the player");
    let value = code[low] | (code[high] << 8);
    value = (value + delta) & 0xffff;
    code[low] = value & 0xff;
    code[high] = value >> 8;
  }

  const endCpu = cpuAddr + code.length + fmb.length;
  require(endCpu <= 0xc000, "player and FMB escape bank 12");
  validateStandaloneSources(fmb, cpuAddr, endCpu & 0xffff);
  const result = new Uint8Array(code.length + fmb.length);
  result.set(code);
  result.set(fmb, code.length);
  return result;
}

/** install_standalone: writes the ROM in place and returns the first free CPU
 *  address. `config` stands in for fe::Config as { region, hack_movie_data }. */
export function installStandalone(config, rom, cpuAddr) {
  require(config.region === "us", "the standalone runtime is deliberately pinned to USA Rev 0");
  const code = buildStandalone(config.hack_movie_data, cpuAddr);
  validateStandaloneSources(config.hack_movie_data, rom, cpuAddr, (cpuAddr + code.length) & 0xffff);
  // klib::Asm6502::apply_bytes(rom, code, 12, cpuAddr)
  const offset = romOffset(12, cpuAddr);
  require(offset + code.length <= rom.length, "standalone player extends beyond the ROM");
  rom.set(code, offset);
  return (cpuAddr + code.length) & 0xffff;
}

/** validate_standalone_sources, both overloads: (fmb, begin, end) checks the
 *  FMB's own bank-12 sources; (fmb, rom, begin, end) also checks the OAM
 *  budget and every ROM-owned source span against the allocation. */
export function validateStandaloneSources(fmb, a, b, c) {
  if (a instanceof Uint8Array) return validateStandaloneSourcesInRom(fmb, a, b, c);
  return validateStandaloneSourcesInBundle(fmb, a, b);
}

function validateStandaloneSourcesInRom(fmb, rom, cpuBegin, cpuEnd) {
  validateStandaloneSourcesInBundle(fmb, cpuBegin, cpuEnd);
  const bundle = parseBundle(fmb);
  validateMovieOamBudget(rom, bundle);
  rejectMovieSourceOverlaps(rom, bundle, [
    { offset: romOffset(12, cpuBegin), bytes: cpuEnd - cpuBegin, label: "Standalone allocation" },
  ], "AtlasDevPlayMovie Standalone allocation");
}

function validateStandaloneSourcesInBundle(fmb, cpuBegin, cpuEnd) {
  require(cpuBegin >= 0x8000 && cpuEnd >= cpuBegin && cpuEnd <= 0xc000,
    "standalone allocation escapes bank 12");
  const bundle = parseBundle(fmb);
  for (const movie of bundle.movies) {
    for (const asset of movie.assets) {
      if (asset.bank !== 12) continue;
      const assetEnd = asset.cpu + asset.bytes;
      require(assetEnd <= cpuBegin || asset.cpu >= cpuEnd,
        "standalone player overwrites a bank-12 movie asset source");
    }
    for (const pointer of [movie.metasprite_pointer_lo, movie.metasprite_pointer_hi]) {
      const pointerEnd = pointer + movie.metasprite_count;
      require(pointerEnd <= cpuBegin || pointer >= cpuEnd,
        "standalone player overwrites a bank-12 metasprite pointer table");
    }
  }
}

const requireIsInstalled = (engine) => {
  require(engine && typeof engine.isInstalled === "function",
    "Atlas Movie Engine is required to read an installed ROM");
  return engine.isInstalled;
};

/** resolve_opcode_info: add AME's preinstalled $18 opcode and reject mixed
 *  modes. Returns a new ScriptOpcodeInfo; the input is not changed. */
export function resolveOpcodeInfo(info, rom, engine = {}) {
  info = cloneScriptOpcodeInfo(info);
  const sharedInstalled = requireIsInstalled(engine)(rom);
  let hasStandalone = false, hasShared = false;
  let sharedByte = null;
  for (const [opcodeByte, opcode] of sortedOpcodes(info.opcodes)) {
    hasStandalone ||= named(opcode, "AtlasDevPlayMovie");
    if (named(opcode, "AtlasDevPlayMovieShared")) {
      hasShared = true;
      sharedByte = opcodeByte;
    }
  }

  require(!(hasStandalone && (hasShared || sharedInstalled)),
    "Standalone and Shared movie modes are mutually exclusive");
  require(!hasShared || sharedInstalled,
    "AtlasDevPlayMovieShared requires an installed Atlas Movie Engine");
  if (!sharedInstalled) return info;
  if (hasShared) {
    require(sharedByte === 0x18,
      "AtlasDevPlayMovieShared must remain the preinstalled opcode at $18");
    require(canonicalSharedOpcode(info.opcodes.get(sharedByte)),
      "AtlasDevPlayMovieShared must use one Byte argument and terminal End flow");
    return info;
  }
  require(info.opcodes.size === 0x18 && info.required_impls.length === 0,
    "AME must be installed before generated extended iScript opcodes");
  if (!info.opcodes.has(0x18))
    info.opcodes.set(0x18, makeOpcode("AtlasDevPlayMovieShared",
      [[ArgType.Byte, ArgDomain.None]], Flow.End, true));
  info.base_opcode_count = 0x19;
  return info;
}

/** validate_shared_install */
export function validateSharedInstall(info) {
  for (const [, opcode] of sortedOpcodes(info.opcodes)) {
    require(!named(opcode, "AtlasDevPlayMovie") && !named(opcode, "AtlasDevPlayMovieShared"),
      "remove the existing movie opcode configuration before installing Shared mode");
  }
  require(info.opcodes.size === 0x18 && info.required_impls.length === 0,
    "install Shared mode before configuring generated extended iScript opcodes");
}

/** standalone_config_override: the eoe_config_override.xml text with the
 *  opcode map, the Standalone Impl, and the FMB as $xx values */
export function standaloneConfigOverride(info, fmb) {
  buildStandalone(fmb, LINK_BASE);
  require(info.opcodes.size >= info.required_impls.length,
    "opcode implementation metadata is inconsistent");
  for (const [, opcode] of sortedOpcodes(info.opcodes)) {
    require(!named(opcode, "AtlasDevPlayMovieShared"), "Shared mode cannot be exported as Standalone");
  }

  const copy = cloneScriptOpcodeInfo(info);
  const opcodes = copy.opcodes;
  const implementations = copy.required_impls;
  let existingByte = null;
  for (const [opcodeByte, opcode] of sortedOpcodes(opcodes)) {
    if (named(opcode, "AtlasDevPlayMovie")) existingByte = opcodeByte;
  }
  if (existingByte !== null) {
    require(existingByte >= info.base_opcode_count,
      "AtlasDevPlayMovie exists as a preinstalled opcode instead of a generated Impl");
    const implIndex = existingByte - info.base_opcode_count;
    require(implIndex < implementations.length
      && implementations[implIndex].toLowerCase() === "atlasdevplaymovie",
      "AtlasDevPlayMovie opcode metadata does not select its generated Impl");
  } else {
    require(opcodes.size < 256, "no free iScript opcode byte remains");
    const next = opcodes.size & 0xff;
    // std::map::emplace leaves an existing key alone
    if (!opcodes.has(next))
      opcodes.set(next, makeOpcode("AtlasDevPlayMovie", [[ArgType.Byte, ArgDomain.None]], Flow.End, true));
    implementations.push("AtlasDevPlayMovie");
  }
  const baseCount = opcodes.size - implementations.length;

  let xml = "<!-- Generated by Atlas Movie Creator. Use as eoe_config_override.xml,\n"
    + "     or merge these sections into an existing override. Standalone mode\n"
    + "     does not replace Faxanadu's internal cinematic engine. -->\n"
    + "<eoe_config>\n\t<sets>\n\t\t<set name=\"hack_movie_data\" region=\"us\" values=\"";
  for (let i = 0; i < fmb.length; i++) {
    if (i) xml += ",";
    xml += "$" + hex2(fmb[i]);
  }
  xml += "\" />\n\t</sets>\n\t<byte_to_string_maps>\n"
    + "\t\t<byte_to_string_map name=\"iscript_opcodes\">\n";
  for (const [opcodeByte, opcode] of sortedOpcodes(opcodes)) {
    let definition;
    if (opcodeByte >= baseCount) {
      const implementation = implementations[opcodeByte - baseCount];
      require(implementation !== undefined, "opcode implementation metadata is inconsistent");
      definition = "Impl=" + implementation;
      if (!named(opcode, implementation)) definition += ",Mnemonic=" + opcode.name;
    } else definition = explicitDefinition(opcode);
    xml += `\t\t\t<entry byte="$${hex2(opcodeByte)}" str="${xmlEscape(definition)}" />\n`;
  }
  xml += "\t\t</byte_to_string_map>\n\t</byte_to_string_maps>\n</eoe_config>\n";
  return xml;
}
