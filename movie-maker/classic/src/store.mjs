// What the page remembers between visits: the ROM (its name and bytes) and
// the project as .amp bytes. The backend is whatever gives get/set/del with
// promises: IndexedDB in the page, a Map here and in the tests.
export function mapBackend() {
  const m = new Map();
  return { get: async (k) => (m.has(k) ? m.get(k) : undefined), set: async (k, v) => { m.set(k, v); }, del: async (k) => { m.delete(k); } };
}

export function makeStore(backend) {
  return {
    async saveRom(name, bytes) { await backend.set("rom", { name, bytes: Uint8Array.from(bytes) }); },
    async loadRom() { const v = await backend.get("rom"); return v ? { name: v.name, bytes: Uint8Array.from(v.bytes) } : null; },
    async saveProject(amp) { await backend.set("project", Uint8Array.from(amp)); },
    async loadProject() { const v = await backend.get("project"); return v ? Uint8Array.from(v) : null; },
    async clear() { await backend.del("rom"); await backend.del("project"); },
  };
}
