/* TMR save: хранилище в localStorage + (необязательно) папка на диске через File System Access API (Chrome/Edge). */
(() => {
  window.TMRLibs = window.TMRLibs || {};
  const idb = () => new Promise((res, rej) => {
    const q = indexedDB.open("tmr", 1);
    q.onupgradeneeded = () => q.result.createObjectStore("kv");
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  });
  const idbGet = async k => { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); };
  const idbSet = async (k, v) => { const db = await idb(); return new Promise((res, rej) => { const t = db.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }); };

  window.TMRLibs.save = {
    data: {}, folder: null, pending: null, supported: !!window.showDirectoryPicker,
    init(r) {
      this.r = r; r.save = this;
      this.key = "tmr:" + (r.game.id || r.game.title || "game");
      this.file = this.key.replace(/[^\w.-]+/g, "_") + ".json";
      try { this.data = JSON.parse(localStorage.getItem(this.key) || "{}") || {}; } catch (e) { this.data = {}; }
      window.addEventListener("pagehide", () => this.saveLocal());
      this.restoreFolder().catch(() => {});
    },
    get(k, def) { const v = this.data[k]; return v === undefined ? def : v; },
    set(k, v) { this.data[k] = v; this.queue(); },
    remove(k) { delete this.data[k]; this.queue(); },
    export() { return JSON.stringify({ game: this.key, data: this.data }, null, 2); },
    import(json) { const o = JSON.parse(json); this.data = o.data || o; this.queue(); },
    queue() { clearTimeout(this._t); this._t = setTimeout(() => this.flush(), 300); },
    saveLocal() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* хранилище недоступно */ } },
    async flush() {
      this.saveLocal();
      if (this.folder) { try { await this.writeFolder(); } catch (e) { console.warn("[TMR] запись в папку не удалась:", e.message); } }
    },
    async dir() { return this.folder.getDirectoryHandle("save", { create: true }); },
    async writeFolder() {
      const fh = await (await this.dir()).getFileHandle(this.file, { create: true });
      const w = await fh.createWritable(); await w.write(JSON.stringify(this.data, null, 2)); await w.close();
    },
    async readFolder() {
      try { const fh = await (await this.dir()).getFileHandle(this.file); return JSON.parse(await (await fh.getFile()).text()); }
      catch (e) { return null; }
    },
    async useFolder(handle) {
      this.folder = handle; this.pending = null;
      const existing = await this.readFolder();
      if (existing) this.data = { ...this.data, ...existing };
      await this.flush();
      this.r.emit("save:folder", handle.name);
    },
    async restoreFolder() {
      if (!this.supported) return;
      const h = await idbGet("folder:" + this.key);
      if (!h) return;
      if ((await h.queryPermission({ mode: "readwrite" })) === "granted") await this.useFolder(h); else this.pending = h;
    },
    // Вызывать из клика по кнопке (нужен жест пользователя).
    async connectFolder() {
      if (!this.supported) throw new Error("Выбор папки поддерживают Chrome и Edge");
      let h = this.pending;
      if (!(h && (await h.requestPermission({ mode: "readwrite" })) === "granted")) {
        h = await window.showDirectoryPicker({ mode: "readwrite", id: "tmr-save" });
        await idbSet("folder:" + this.key, h);
      }
      await this.useFolder(h);
      return h.name;
    }
  };
})();
