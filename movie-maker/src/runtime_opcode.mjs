// The slice of eoe_core/src/fi/Opcode.h the runtime needs: the three enums
// with the names magic_enum gives them, an Opcode record, ScriptOpcodeInfo,
// and load_vanilla_opcodes. A ScriptOpcodeInfo is
//   { opcodes: Map<byte, Opcode>, required_impls: string[], base_opcode_count }
// and, because the C++ map is ordered by key, every walk over it goes through
// sortedOpcodes().

export const ArgType = Object.freeze({ None: 0, Byte: 1, Short: 2 });
export const Flow = Object.freeze({ Continue: 0, Jump: 1, Read: 2, End: 3 });
export const ArgDomain = Object.freeze({
  None: 0, Item: 1, Quest: 2, Rank: 3, TextBox: 4, TextString: 5, ButtonMask: 6,
  PlayerPackedYX: 7,
});

const nameOf = (table) => {
  const names = new Map(Object.entries(table).map(([name, value]) => [value, name]));
  return (value) => {
    const name = names.get(value);
    if (name === undefined) throw new Error(`Invalid enum value: ${value}`);
    return name;
  };
};
/** klib::str::enum_to_string for the three enums */
export const argTypeName = nameOf(ArgType);
export const flowName = nameOf(Flow);
export const argDomainName = nameOf(ArgDomain);

/** fi::Argument */
export function makeArgument(type = ArgType.Byte, domain = ArgDomain.None) {
  return { type, domain };
}

/** fi::Opcode(name, args, flow, ends_stream); args is [[type, domain], ...] or Argument objects */
export function makeOpcode(name, args = [], flow = Flow.Continue, ends_stream = false) {
  return {
    name, flow, ends_stream,
    args: args.map((a) => (Array.isArray(a) ? makeArgument(a[0], a[1]) : makeArgument(a.type, a.domain))),
  };
}

export function argumentsEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x.type === b[i].type && x.domain === b[i].domain);
}

/** fi::ScriptOpcodeInfo */
export function makeScriptOpcodeInfo(over = {}) {
  return { opcodes: new Map(), required_impls: [], base_opcode_count: 0, ...over };
}

/** a deep copy, the way the C++ passes ScriptOpcodeInfo by value */
export function cloneScriptOpcodeInfo(info) {
  return {
    opcodes: new Map(Array.from(info.opcodes, ([b, op]) => [b, makeOpcode(op.name, op.args, op.flow, op.ends_stream)])),
    required_impls: [...info.required_impls],
    base_opcode_count: info.base_opcode_count,
  };
}

/** [byte, opcode] pairs in std::map order (ascending byte) */
export function sortedOpcodes(opcodes) {
  return Array.from(opcodes).sort((a, b) => a[0] - b[0]);
}

const B = ArgType.Byte, S = ArgType.Short, D = ArgDomain;

/** fi::load_vanilla_opcodes: the 24 vanilla iScript opcodes */
export function loadVanillaOpcodes() {
  const opcodes = new Map([
    [0x00, makeOpcode("End", [], Flow.End, true)],
    [0x01, makeOpcode("MsgNoskip", [[B, D.TextString]], Flow.Continue, false)],
    [0x02, makeOpcode("MsgPrompt", [[B, D.TextString]], Flow.Continue, false)],
    [0x03, makeOpcode("Msg", [[B, D.TextString]], Flow.Continue, false)],
    [0x04, makeOpcode("IfTitleChange", [], Flow.Jump, false)],
    [0x05, makeOpcode("LoseGold", [[S, D.None]], Flow.Continue, false)],
    [0x06, makeOpcode("SetSpawn", [[B, D.None]], Flow.Continue, false)],
    [0x07, makeOpcode("GetItem", [[B, D.Item]], Flow.Continue, false)],
    [0x08, makeOpcode("OpenShopBuy", [], Flow.Read, false)],
    [0x09, makeOpcode("GetGold", [[S, D.None]], Flow.Continue, false)],
    [0x0a, makeOpcode("GetMana", [[B, D.None]], Flow.Continue, false)],
    [0x0b, makeOpcode("IfQuest", [[B, D.Quest]], Flow.Jump, false)],
    [0x0c, makeOpcode("IfRank", [[B, D.Rank]], Flow.Jump, false)],
    [0x0d, makeOpcode("IfGold", [], Flow.Jump, false)],
    [0x0e, makeOpcode("SetQuest", [[B, D.Quest]], Flow.Continue, false)],
    [0x0f, makeOpcode("IfBuy", [], Flow.Jump, false)],
    [0x10, makeOpcode("LoseItem", [[B, D.Item]], Flow.Continue, false)],
    [0x11, makeOpcode("OpenShopSell", [], Flow.Read, false)],
    [0x12, makeOpcode("IfItem", [[B, D.Item]], Flow.Jump, false)],
    [0x13, makeOpcode("GetHealth", [[B, D.None]], Flow.Continue, false)],
    [0x14, makeOpcode("ShowMantra", [], Flow.Continue, false)],
    [0x15, makeOpcode("EndGame", [], Flow.End, true)],
    [0x16, makeOpcode("IfMsgPrompt", [[B, D.TextString]], Flow.Jump, false)],
    [0x17, makeOpcode("Jump", [], Flow.Jump, true)],
  ]);
  return makeScriptOpcodeInfo({ opcodes, base_opcode_count: opcodes.size });
}
