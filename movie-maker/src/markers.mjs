// The script marker: a modder writes a message that reads "@MOVIE:name" in
// FaxEdit and shows it from an iScript; this module finds those messages in
// the built ROM and rewrites the message opcode in place to the play movie
// opcode the installed engine answers to. Nothing in FaxEdit changes. If the
// page never ran, the player sees the marker text instead of the movie.
//
// Facts this leans on, all from the USA game and FaxEdit's own config:
// - iScript entries are a split pointer table in bank 12; the game reads it
//   with `LDA lo,X` at $824C and `LDA hi,X` at $8251 (file $3025C/$30261;
//   FaxEdit's iscript_ptr_hi_ref_offset is the second operand, $30262).
//   FaxEdit keeps the low table where it is and may move the high one, so
//   both are read from those two operands, never assumed.
// - every entry starts with an entity id byte, then opcodes; the 24 vanilla
//   opcodes and their operand widths are tools/fax_script.py's, re-derived
//   from the handlers. Opcodes past $17 belong to FaxEdit's opcode library
//   and their widths are not in the ROM, so a walk stops there.
// - messages are $FF terminated records from bank 13 $8300 (file $34310);
//   the loader at $F3F5 skips id-1 records, so message ids count from 1.
//   $FD is a space in a message.
// - the installed shared engine answers opcode $18 with one operand, the
//   zero based index of the movie in the runtime bundle (intro 0, ending 1,
//   then the extra movies in project order); the opcode ends the script.
import { MovieError } from "./bytes.mjs";
import { fileOffset } from "./engine.mjs";
import { runtimeBundle } from "./bundle.mjs";

export const MARKER = /^@MOVIE:([A-Za-z0-9_.-]+)$/i;
export const PLAY_MOVIE_OPCODE = 0x18;
const MESSAGE_OPCODES = new Set([0x01, 0x03]);   // ShowUnskippableMessage, ShowMessage
const SCRIPT_BANK = 12, TEXT_BANK = 13;
const TEXT_START_CPU = 0x8300, TEXT_END_CPU = 0xc000;
const LO_REF_FILE = 0x3025c, HI_REF_FILE = 0x30261;

// operand widths of the vanilla opcodes; `target` marks the last two operand
// bytes as a jump target the walk follows
const VANILLA = {
  0x00: { name: "EndScript", width: 0, ends: true },
  0x01: { name: "ShowUnskippableMessage", width: 1 },
  0x02: { name: "ShowQuestionMessage", width: 1 },
  0x03: { name: "ShowMessage", width: 1 },
  0x04: { name: "CheckUpdatePlayerTitle", width: 2, target: true },
  0x05: { name: "SpendGold", width: 2 },
  0x06: { name: "SetSpawnPoint", width: 1 },
  0x07: { name: "AddInventoryItem", width: 1 },
  0x08: { name: "OpenShop", width: 2 },
  0x09: { name: "AddGold", width: 2 },
  0x0a: { name: "AddMP", width: 1 },
  0x0b: { name: "IfQuestCompleted", width: 3, target: true },
  0x0c: { name: "IfPlayerHasTitle", width: 3, target: true },
  0x0d: { name: "IfPlayerHasGold", width: 2, target: true },
  0x0e: { name: "SetQuestComplete", width: 1 },
  0x0f: { name: "ShowBuySellMenu", width: 2, target: true },
  0x10: { name: "ConsumeItem", width: 1 },
  0x11: { name: "ShowSellMenu", width: 2 },   // a shop table pointer, not a jump: 16 vanilla scripts prove it
  0x12: { name: "IfPlayerHasItem", width: 3, target: true },
  0x13: { name: "AddHP", width: 1 },
  0x14: { name: "ShowPassword", width: 0 },
  0x15: { name: "FinishGame", width: 0, ends: true },
  0x16: { name: "ShowQuestionMessageCheckIfDismissed", width: 3, target: true },
  0x17: { name: "Jump", width: 2, target: true, ends: true },
};

/** the iScript pointer table as the game reads it: { lo, hi, count, entries } */
export function scriptTable(rom) {
  if (rom[LO_REF_FILE] !== 0xbd || rom[HI_REF_FILE] !== 0xbd)
    throw new MovieError("the iScript pointer table reads are not where the USA game keeps them");
  const lo = rom[LO_REF_FILE + 1] | (rom[LO_REF_FILE + 2] << 8);
  const hi = rom[HI_REF_FILE + 1] | (rom[HI_REF_FILE + 2] << 8);
  if (!(hi > lo && hi - lo <= 255)) throw new MovieError("the iScript pointer tables are not laid out as a split table");
  const count = hi - lo;
  const entries = [];
  for (let i = 0; i < count; i++) {
    const cpu = rom[fileOffset(SCRIPT_BANK, lo + i)] | (rom[fileOffset(SCRIPT_BANK, hi + i)] << 8);
    entries.push(cpu);
  }
  return { lo, hi, count, entries };
}

/** the message records of bank 13, decoded to text, ids counting from 1 */
export function messages(rom) {
  const out = [];
  let text = "";
  for (let cpu = TEXT_START_CPU; cpu < TEXT_END_CPU; cpu++) {
    const c = rom[fileOffset(TEXT_BANK, cpu)];
    if (c === 0xff) { out.push(text); text = ""; continue; }
    if (c === 0xfd) text += " ";
    else if (c === 0xfe) text += "\n";
    else if (c >= 0x20 && c < 0x7f) text += String.fromCharCode(c);
    else text += `<${c.toString(16).padStart(2, "0")}>`;
  }
  while (out.length && out[out.length - 1] === "") out.pop();   // the $FF fill after the last record
  return out;   // out[id - 1] is message id
}

/** every message opcode in every reachable script whose message is a
 *  marker, plus how far the walk could see: { markers, scripts, stopped } */
export function findMarkers(rom) {
  const table = scriptTable(rom);
  const texts = messages(rom);
  const markers = [];
  const visited = new Set();
  let stopped = 0;
  const walk = (cpu, script) => {
    for (;;) {
      if (visited.has(cpu)) return;
      if (cpu < 0x8000 || cpu >= 0xc000) { stopped++; return; }
      visited.add(cpu);
      const op = rom[fileOffset(SCRIPT_BANK, cpu)];
      const def = VANILLA[op];
      if (!def) { stopped++; return; }   // an extended opcode: width unknown
      const operands = [];
      for (let i = 1; i <= def.width; i++) operands.push(rom[fileOffset(SCRIPT_BANK, cpu + i)]);
      if (MESSAGE_OPCODES.has(op)) {
        const id = operands[0];
        const text = id >= 1 ? texts[id - 1] : undefined;
        const m = text !== undefined ? MARKER.exec(text.trim()) : null;
        if (m) markers.push({ script, cpu, opcode: op, messageId: id, name: m[1] });
      }
      if (def.target) {
        const t = operands[def.width - 2] | (operands[def.width - 1] << 8);
        walk(t, script);
      }
      if (def.ends) return;
      cpu += 1 + def.width;
    }
  };
  table.entries.forEach((entry, i) => walk(entry + 1, i));   // +1: the entity id byte
  return { markers, scripts: table.count, stopped };
}

/** the zero based runtime index a marker names, or -1 */
export function resolveMarker(bundle, name) {
  const included = runtimeBundle(bundle).movies;
  if (/^\d+$/.test(name)) { const n = +name; return n < included.length ? n : -1; }
  return included.findIndex((m) => m.id.toLowerCase() === name.toLowerCase());
}

/** what assess shows: every marker with its resolution, and the errors that
 *  would leave a marker on screen */
export function markerReport(rom, bundle) {
  const found = findMarkers(rom);
  const rows = found.markers.map((m) => ({ ...m, index: resolveMarker(bundle, m.name) }));
  const errors = rows.filter((r) => r.index < 0).map((r) =>
    `script ${r.script} at $${r.cpu.toString(16).toUpperCase()} names movie "${r.name}", which is not in the project`);
  return { rows, errors, scripts: found.scripts, stopped: found.stopped };
}

/** rewrite every resolved marker in place: `01 nn` or `03 nn` becomes
 *  `18 index`. Refuses when a marker names no movie. Returns the rows. */
export function rewriteMarkers(rom, bundle) {
  const report = markerReport(rom, bundle);
  if (report.errors.length) throw new MovieError(report.errors.join("; "));
  for (const r of report.rows) {
    rom[fileOffset(SCRIPT_BANK, r.cpu)] = PLAY_MOVIE_OPCODE;
    rom[fileOffset(SCRIPT_BANK, r.cpu + 1)] = r.index;
  }
  return report.rows;
}
