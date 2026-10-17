/* TMR Engine 0.2.0 — ядро: загрузка, цикл с фиксированным шагом, события, ресурсы, ввод, запуск библиотек. */
(async () => {
  "use strict";
  const VERSION = "0.2.0";
  const statusEl = document.getElementById("status");
  const titleEl = document.getElementById("title");
  const setStatus = t => { if (statusEl && statusEl.textContent !== t) statusEl.textContent = t; };

  // ---------- Утилиты ----------
  const util = {
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    rand: (a = 0, b = 1) => a + Math.random() * (b - a),
    dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    clone: o => (typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o)))
  };
  // Путь должен быть относительным и лежать внутри проекта (защита от подгрузки чужого кода по ссылке).
  const isLocal = p => typeof p === "string" && p !== "" && !/^([a-z][a-z0-9+.-]*:|\/\/|\\)/i.test(p) && !p.split("/").includes("..");

  class Emitter {
    constructor() { this._h = new Map(); }
    on(ev, fn) { (this._h.get(ev) || this._h.set(ev, []).get(ev)).push(fn); return () => this.off(ev, fn); }
    once(ev, fn) { const off = this.on(ev, (...a) => { off(); fn(...a); }); return off; }
    off(ev, fn) { const l = this._h.get(ev); if (l) { const i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); } }
    emit(ev, ...a) {
      const l = this._h.get(ev);
      if (l) for (const fn of [...l]) { try { fn(...a); } catch (e) { console.error(`[TMR] ошибка в обработчике «${ev}»`, e); } }
    }
  }

  class Assets {
    constructor() { this.images = new Map(); }
    image(path) {
      if (!path) return null;
      let rec = this.images.get(path);
      if (!rec) {
        const img = new Image();
        rec = { img, ok: false, done: false };
        rec.promise = new Promise(res => {
          img.onload = () => { rec.ok = true; rec.done = true; res(rec); };
          img.onerror = () => { rec.done = true; res(rec); };
        });
        img.src = path;
        this.images.set(path, rec);
      }
      return rec;
    }
    getImage(path) { const r = this.image(path); return r && r.ok ? r.img : null; }
    async json(path) {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} для ${path}`);
      return res.json();
    }
    async text(path) {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} для ${path}`);
      return res.text();
    }
  }

  async function loadJSON(path) {
    let res;
    try { res = await fetch(path, { cache: "no-cache" }); }
    catch (e) { throw new Error(`Не удалось загрузить ${path}. Запускайте через веб-сервер (python start.py), а не через file://`); }
    if (!res.ok) throw new Error(`Не удалось загрузить ${path}: HTTP ${res.status}`);
    try { return await res.json(); } catch (e) { throw new Error(`Ошибка JSON в ${path}: ${e.message}`); }
  }

  function loadScript(path) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = path; s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Не удалось загрузить библиотеку ${path}`));
      document.head.appendChild(s);
    });
  }

  // Раскладка-независимое имя клавиши: KeyW → "w" даже при русской раскладке.
  function keyName(e) {
    if (/^Key[A-Z]$/.test(e.code)) return e.code[3].toLowerCase();
    if (/^Digit\d$/.test(e.code)) return e.code[5];
    const k = e.key.toLowerCase();
    return k === " " ? "space" : k;
  }

  const Libs = (window.TMRLibs = window.TMRLibs || {});
  const TMR = (window.TMR = window.TMR || {});
  Object.assign(TMR, { version: VERSION, libs: Libs, util, Emitter, runtime: null });

  window.addEventListener("error", e => setStatus(`Ошибка: ${e.message}`));
  window.addEventListener("unhandledrejection", e => setStatus(`Ошибка: ${e.reason && e.reason.message || e.reason}`));

  try {
    if (location.protocol === "file:") {
      throw new Error("Открыто через file://. Запустите «python start.py» и откройте http://localhost:8000/TMR.html");
    }
    const config = await loadJSON("engine.json");
    const gameParam = new URLSearchParams(location.search).get("game");
    const gamePath = gameParam && isLocal(gameParam) ? gameParam : config.game;
    const game = await loadJSON(gamePath);

    const cc = config.canvas || {};
    const canvas = document.getElementById(cc.element || "tmr-canvas");
    if (!canvas) throw new Error(`Canvas #${cc.element} не найден`);
    const W = cc.width || (game.world && game.world.width) || 960;
    const H = cc.height || (game.world && game.world.height) || 540;
    titleEl.textContent = `${game.title || (config.engine && config.engine.name) || "TMR"} — ${VERSION}`;
    document.title = game.title || "TMR Engine";
    if (cc.pixelArt) canvas.style.imageRendering = "pixelated";

    // ---------- Runtime ----------
    const events = new Emitter();
    const runtime = {
      version: VERSION, config, game, canvas, ctx: canvas.getContext("2d"), status: statusEl,
      util, events, assets: new Assets(),
      on: (ev, fn) => events.on(ev, fn), once: (ev, fn) => events.once(ev, fn),
      off: (ev, fn) => events.off(ev, fn), emit: (ev, ...a) => events.emit(ev, ...a),
      setStatus,
      keys: new Set(), pressed: new Set(),
      view: { width: W, height: H, dpr: 1 },
      world: null, camera: { x: 0, y: 0, zoom: 1, shake: 0 },
      hud: new Map(),
      state: "loading", stateSince: 0,
      elapsed: 0,   // игровое время (стоит на паузе и после конца игры)
      clock: 0,     // реальное время для анимаций
      dt: 0, frame: 0, fps: 60, debug: !!config.debug,
      player: null, entities: [], score: 0, lives: 3, libList: [], _nextId: 0
    };
    TMR.runtime = runtime; TMR.config = config; TMR.game = game;

    // r.won работает как в 0.1, но теперь это состояние.
    Object.defineProperty(runtime, "won", {
      get() { return this.state === "won"; },
      set(v) { if (v) this.setState("won"); else if (this.state === "won") this.setState("playing"); }
    });

    Object.assign(runtime, {
      setState(s) {
        const prev = this.state;
        if (prev === s) return;
        this.state = s; this.stateSince = performance.now();
        events.emit("state", s, prev);
        if (s === "won") events.emit("win"); else if (s === "lost") events.emit("lose");
      },
      pause() { if (this.state === "playing") this.setState("paused"); },
      resume() { if (this.state === "paused") this.setState("playing"); },
      togglePause() { this.state === "paused" ? this.resume() : this.pause(); },
      restart() { this.populate(); this.state = "playing"; this.stateSince = performance.now(); events.emit("state", "playing", "restart"); events.emit("reset"); },
      toggleFullscreen() {
        const p = document.fullscreenElement ? document.exitFullscreen() : canvas.requestFullscreen && canvas.requestFullscreen();
        if (p && p.catch) p.catch(() => {});
      },
      populate() {
        const g = util.clone(game);
        this.world = { width: W, height: H, background: "#172033", gravity: 0, ...g.world };
        this.player = { radius: 16, speed: 200, ...g.player, vx: 0, vy: 0 };
        this.player.spawn = { x: this.player.x, y: this.player.y };
        this.entities = []; this._nextId = 0;
        for (const e of g.entities || []) this.add(e, true);
        this.score = 0; this.lives = this.player.lives ?? 3;
        this.elapsed = 0; this.hud.clear();
      },
      add(e, silent) {
        const ent = { id: this._nextId++, ...e, active: true };
        this.entities.push(ent);
        if (!silent) events.emit("spawn", ent);
        return ent;
      },
      remove(e) { e.active = false; e.dead = true; this._dirty = true; events.emit("despawn", e); },
      find(type) { return this.entities.filter(e => e.type === type); },
      count(type, active = true) { let n = 0; for (const e of this.entities) if (e.type === type && (!active || e.active)) n++; return n; },
      // Вектор движения из клавиатуры + стик/геймпад (input-lib), длина ≤ 1.
      axis() {
        const k = this.keys;
        let x = (k.has("arrowright") || k.has("d") ? 1 : 0) - (k.has("arrowleft") || k.has("a") ? 1 : 0);
        let y = (k.has("arrowdown") || k.has("s") ? 1 : 0) - (k.has("arrowup") || k.has("w") ? 1 : 0);
        const a = this.input && this.input.axis;
        if (a) { x += a.x; y += a.y; }
        x = util.clamp(x, -1, 1); y = util.clamp(y, -1, 1);
        const len = Math.hypot(x, y);
        if (len > 1) { x /= len; y /= len; }
        return { x, y };
      },
      screenToWorld(sx, sy) { const c = this.camera; return { x: sx / c.zoom + c.x, y: sy / c.zoom + c.y }; }
    });
    runtime.populate();

    // ---------- Размер холста ----------
    function applySize() {
      const m = cc.pixelRatio;
      const dpr = m === "auto" ? Math.min(window.devicePixelRatio || 1, 2) : (+m || 1);
      runtime.view.dpr = dpr;
      const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    }
    applySize();
    window.addEventListener("resize", applySize);

    // ---------- Библиотеки ----------
    const norm = e => (typeof e === "string" ? { path: e, required: true } : { required: true, ...e });
    const libCfg = [...(config.libraries || []), ...(game.libraries || [])].map(norm);
    const entries = [];
    const warnings = [];
    for (const cfg of libCfg) {
      try {
        if (!isLocal(cfg.path)) throw new Error(`Недопустимый путь библиотеки: ${cfg.path}`);
        const before = new Map(Object.entries(Libs));
        await loadScript(cfg.path);
        let found = 0;
        for (const [name, lib] of Object.entries(Libs)) {
          if (before.get(name) === lib) continue;
          found++;
          const entry = { name, lib, path: cfg.path, off: new Set() };
          const i = entries.findIndex(x => x.name === name);
          if (i >= 0) entries[i] = entry; else entries.push(entry);
        }
        if (!found) throw new Error(`Библиотека ${cfg.path} не зарегистрировалась в window.TMRLibs`);
      } catch (err) {
        if (cfg.required) throw err;
        warnings.push(err.message); console.warn("[TMR]", err.message);
      }
    }
    for (const en of entries) for (const dep of en.lib.requires || []) {
      if (!Libs[dep]) { const m = `Библиотеке «${en.name}» нужна «${dep}», её нет`; warnings.push(m); console.warn("[TMR]", m); }
    }
    runtime.libList = entries;

    const faults = new Map();
    function each(hook, ...args) {
      for (const en of entries) {
        const fn = en.lib[hook];
        if (typeof fn !== "function" || en.off.has(hook)) continue;
        try { fn.apply(en.lib, args); }
        catch (err) {
          const key = `${en.name}.${hook}`, n = (faults.get(key) || 0) + 1;
          faults.set(key, n);
          if (n === 1) { console.error(`[TMR] ${key}:`, err); setStatus(`Ошибка в ${key}: ${err.message}`); }
          if (n >= 10) { en.off.add(hook); console.error(`[TMR] ${key} отключён после 10 ошибок`); }
        }
      }
    }

    // Предзагрузка текстур (недостающие файлы не мешают запуску).
    if (config.preload !== false) {
      const tex = new Set([runtime.player.texture, ...(game.entities || []).map(e => e.texture), ...(game.preload || [])].filter(Boolean));
      if (tex.size) {
        setStatus("Загрузка ресурсов…");
        const recs = [...tex].map(p => runtime.assets.image(p).promise);
        await Promise.race([Promise.all(recs), new Promise(r => setTimeout(r, 4000))]);
      }
    }

    each("init", runtime);
    runtime.state = "playing"; runtime.stateSince = performance.now();
    events.emit("reset");
    events.emit("ready");
    setStatus(warnings.length ? `Запущен, предупреждений: ${warnings.length} (см. консоль)` : "Движок запущен");

    // ---------- Ввод и горячие клавиши ----------
    const PREVENT = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", "space", "f3"]);
    const typing = t => t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    function hotkey(k) {
      const s = runtime.state;
      if (k === "p" || k === "escape") runtime.togglePause();
      else if (k === "r") runtime.restart();
      else if ((k === "enter" || k === "space") && (s === "won" || s === "lost")) runtime.restart();
      else if (k === "f") runtime.toggleFullscreen();
      else if (k === "f3") runtime.debug = !runtime.debug;
    }
    window.addEventListener("keydown", e => {
      if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
      const k = keyName(e);
      if (PREVENT.has(k)) e.preventDefault();
      runtime.keys.add(k);
      if (e.repeat) return;
      runtime.pressed.add(k);
      events.emit("keydown", k, e);
      if (config.hotkeys !== false) hotkey(k);
    });
    window.addEventListener("keyup", e => { const k = keyName(e); runtime.keys.delete(k); events.emit("keyup", k); });
    const lostFocus = () => { runtime.keys.clear(); if (config.pauseOnBlur !== false) runtime.pause(); };
    window.addEventListener("blur", lostFocus);
    document.addEventListener("visibilitychange", () => { if (document.hidden) lostFocus(); });
    canvas.addEventListener("pointerdown", () => {
      if (runtime.state === "paused") runtime.resume();
      else if ((runtime.state === "won" || runtime.state === "lost") && performance.now() - runtime.stateSince > 600) runtime.restart();
    });

    // ---------- Цикл: фиксированный шаг физики, отрисовка на каждом кадре ----------
    const STEP = 1 / ((config.loop && config.loop.fps) || 60);
    const MAX_FRAME = (config.loop && config.loop.maxFrame) || 0.1;
    const MAX_STEPS = 6;
    let acc = 0, last = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!last) last = ts;
      const raw = (ts - last) / 1000; last = ts;
      const dt = Math.min(Math.max(raw, 0), MAX_FRAME);
      if (raw > 0) runtime.fps += (1 / raw - runtime.fps) * 0.1;
      runtime.dt = dt; runtime.clock += dt; runtime.frame++;
      each("tick", runtime, dt);

      let stepped = false;
      if (runtime.state === "playing") {
        acc += dt;
        let n = 0;
        while (acc >= STEP && n < MAX_STEPS && runtime.state === "playing") {
          runtime.elapsed += STEP;
          each("update", runtime, STEP);
          if (runtime._dirty) {
            for (let i = runtime.entities.length - 1; i >= 0; i--) if (runtime.entities[i].dead) runtime.entities.splice(i, 1);
            runtime._dirty = false;
          }
          acc -= STEP; n++; stepped = true;
        }
        if (n >= MAX_STEPS) acc = 0;
      } else acc = 0;

      runtime.ctx.setTransform(runtime.view.dpr, 0, 0, runtime.view.dpr, 0, 0);
      runtime.ctx.imageSmoothingEnabled = !cc.pixelArt;
      each("render", runtime, acc / STEP);

      if (stepped || runtime.state !== "playing") { runtime.pressed.clear(); each("endFrame", runtime); }
    }
    requestAnimationFrame(frame);
  } catch (err) {
    titleEl.textContent = "Ошибка TMR";
    setStatus(err.message);
    console.error(err);
  }
})();
