/* TMR Engine bootstrap: loads engine.json, game JSON and JS libraries.
   Библиотека = JS-файл, который кладёт систему в window.TMRLibs.<имя>
   с необязательными методами init(runtime), update(runtime, dt), render(runtime).
   Порядок систем задаётся в engine.json -> "systems". canvas необязателен ("canvas" в engine.json). */
(async () => {
  "use strict";
  const root = document.getElementById("tmr-root");

  async function loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Не удалось загрузить ${path}: HTTP ${response.status}`);
    return response.json();
  }

  try {
    const config = await loadJSON("engine.json");
    const game = await loadJSON(config.game);
    window.TMRGame = game;            // библиотеки читают данные игры при загрузке
    window.TMRLibs = window.TMRLibs || {};

    for (const path of config.libraries || []) {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Не удалось загрузить библиотеку ${path}`);
      const source = await response.text();
      // Код библиотек исполняется как обычный JavaScript. Загружайте только доверенные библиотеки.
      const script = document.createElement("script");
      script.textContent = source + `\n//# sourceURL=${path}`;
      document.head.appendChild(script);
    }

    const systems = (config.systems || Object.keys(window.TMRLibs)).map(name => {
      if (!window.TMRLibs[name]) throw new Error(`Библиотека «${name}» не зарегистрировалась`);
      return window.TMRLibs[name];
    });

    const canvas = config.canvas ? document.getElementById(config.canvas.element) : null;
    if (canvas) {
      canvas.width = config.canvas.width || game.world.width;
      canvas.height = config.canvas.height || game.world.height;
    }
    const runtime = {
      config, game, root, canvas,
      ctx: canvas ? canvas.getContext("2d") : null,
      keys: new Set(), state: null, elapsed: 0, lastTime: 0
    };
    document.title = `${game.title || config.engine.name}`;
    root.textContent = "";

    window.addEventListener("keydown", e => {
      runtime.keys.add(e.key.toLowerCase());
      // Блокируем прокрутку стрелками только в canvas-играх, иначе ломается ввод текста
      if (canvas && ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) e.preventDefault();
    });
    window.addEventListener("keyup", e => runtime.keys.delete(e.key.toLowerCase()));
    window.addEventListener("blur", () => runtime.keys.clear());

    for (const s of systems) if (s.init) s.init(runtime);

    function loop(timestamp) {
      const dt = Math.min((timestamp - (runtime.lastTime || timestamp)) / 1000, 0.05);
      runtime.lastTime = timestamp;
      runtime.elapsed += dt;
      for (const s of systems) if (s.update) s.update(runtime, dt);
      for (const s of systems) if (s.render) s.render(runtime);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    window.TMR = { config, game, runtime, libs: window.TMRLibs };
  } catch (err) {
    root.style.cssText = "padding:20px;font:15px system-ui;color:#c00";
    root.textContent = "Ошибка TMR: " + err.message + (location.protocol === "file:" ? " — запусти игру через локальный сервер (см. README.txt)." : "");
    console.error(err);
  }
})();
