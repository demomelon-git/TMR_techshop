/* TMR storage-lib (GitHub): сохранение в cookies только после согласия вместо localStorage.
   Подменяет хранилище save-lib: r.save.get/set работают как раньше, папка на диске остаётся.
   Имя "storage" нужно cookie-consent.js: он вызывает TMRLibs.storage.consentChanged(). */
(() => {
  window.TMRLibs = window.TMRLibs || {};
  const C = () => window.TMRCookieConsent;
  const say = m => { try { st(m); } catch (e) { /* интерфейс ещё не создан */ } };
  window.TMRLibs.storage = {
    requires: ["save"],
    init(r) {
      const sv = this.sv = r.save, c = C();
      let d = c && c.load();
      if (d && Number.isFinite(d.money)) d = { state: d };   // формат прежней версии: в cookies лежал сам объект игры
      sv.data = d && typeof d === "object" ? d : {};
      sv.saveLocal = () => this.writeCookies();               // save-lib вызывает это при каждой записи и на pagehide
    },
    writeCookies() {
      const c = C();
      if (!c || c.current() !== "accepted") return false;
      const ok = c.save(this.sv.data);
      if (!ok && !this.warned) { this.warned = true; say("Сохранение слишком большое для cookies — скачай его кнопкой «Сохранить игру»"); }
      else if (ok) this.warned = false;
      return ok;
    },
    consentChanged(value) {
      if (value === "accepted") { persist(); this.writeCookies(); say("Согласие принято: сохранение через cookies включено"); }
      else { if (C()) C().clear(); say("Cookies отключены. Используй «Сохранить игру» для экспорта файла"); }
    }
  };
})();
