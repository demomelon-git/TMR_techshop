/* TMR TechShop: управление согласием и игровыми cookies. */
(() => {
  'use strict';
  const CONSENT = 'tmr_cookie_consent';
  const SAVE_PREFIX = 'tmr_game_save_';
  const read = name => {
    const item = document.cookie.split('; ').find(x => x.startsWith(name + '='));
    return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
  };
  const write = (name, value, days = 365) => {
    let cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${days * 86400}; SameSite=Lax`;
    if (location.protocol === 'https:') cookie += '; Secure';
    document.cookie = cookie;
  };
  const erase = name => {
    let cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    if (location.protocol === 'https:') cookie += '; Secure';
    document.cookie = cookie;
  };
  const removeSave = () => {
    document.cookie.split(';').map(x => x.trim().split('=')[0]).filter(n => n.startsWith(SAVE_PREFIX)).forEach(erase);
  };
  const toB64 = s => {
    let bin = '';
    new TextEncoder().encode(s).forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const fromB64 = s => {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  };
  const current = () => read(CONSENT);
  const save = data => {
    if (current() !== 'accepted') return false;
    // Cyrillic grows ~6x under URL-encoding, so the save is stored as base64url of UTF-8 (~2.7x) instead.
    // One cookie must stay under ~4 KB, and the total is capped: every request to the site carries these cookies.
    let enc;
    try { enc = toB64(JSON.stringify(data)); } catch (_) { return false; }
    if (enc.length > 7500) return false;
    const size = 3000;
    const chunks = [];
    for (let i = 0; i < enc.length; i += size) chunks.push(enc.slice(i, i + size));
    removeSave();
    chunks.forEach((chunk, i) => write(SAVE_PREFIX + i, chunk));
    write(SAVE_PREFIX + 'count', String(chunks.length));
    return true;
  };
  const load = () => {
    if (current() !== 'accepted') return null;
    const count = Number(read(SAVE_PREFIX + 'count'));
    if (!Number.isInteger(count) || count < 1 || count > 100) return null;
    try {
      let raw = '';
      for (let i = 0; i < count; i++) {
        const part = read(SAVE_PREFIX + i);
        if (part === null) return null;
        raw += part;
      }
      return JSON.parse(raw.startsWith('{') ? raw : fromB64(raw));   // '{' — сохранение прежнего формата
    } catch (_) { return null; }
  };
  const panel = document.createElement('section');
  panel.id = 'tmr-cookie-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Настройки cookies');
  panel.innerHTML = `<div class="tmr-cookie-card"><strong>🍪 Cookies в TMR TechShop</strong><p>Игра может сохранять игровой прогресс в cookies этого браузера. Вы можете согласиться или отказаться. При отказе сохранение через cookies отключено; используйте кнопку «Сохранить игру», чтобы скачать файл.</p><div class="tmr-cookie-actions"><button id="tmr-cookie-accept">Разрешить cookies</button><button id="tmr-cookie-reject">Отказаться</button><button id="tmr-cookie-settings">Настройки cookies</button></div></div>`;
  const style = document.createElement('style');
  style.textContent = `#tmr-cookie-panel{position:fixed;z-index:99999;inset:auto 12px 12px 12px;font:14px/1.45 system-ui,sans-serif;color:#edf3ff}#tmr-cookie-panel[hidden]{display:none}.tmr-cookie-card{max-width:760px;margin:auto;background:#10192b;border:1px solid #52658a;border-radius:16px;padding:16px;box-shadow:0 10px 40px #0008}.tmr-cookie-card p{margin:8px 0 12px;color:#d1dcf3}.tmr-cookie-actions{display:flex;gap:8px;flex-wrap:wrap}.tmr-cookie-actions button{border:1px solid #62759a;border-radius:9px;padding:9px 12px;background:#24365b;color:#fff;font:inherit;cursor:pointer}.tmr-cookie-actions button:first-child{background:#7c9cff;color:#081126;border-color:#7c9cff}#tmr-cookie-manage{position:fixed;z-index:9998;right:10px;bottom:10px;border:1px solid #62759a;border-radius:9px;padding:8px 10px;background:#10192b;color:#edf3ff;font:12px system-ui;cursor:pointer}`;
  document.head.appendChild(style);
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(panel);
    const manage = document.createElement('button');
    manage.id = 'tmr-cookie-manage'; manage.type = 'button'; manage.textContent = '🍪 Cookies';
    manage.addEventListener('click', () => { panel.hidden = false; });
    document.body.appendChild(manage);
    const setConsent = value => {
      write(CONSENT, value);
      if (value !== 'accepted') removeSave();
      panel.hidden = true;
      if (window.TMRLibs?.storage?.consentChanged) window.TMRLibs.storage.consentChanged(value);
    };
    panel.querySelector('#tmr-cookie-accept').addEventListener('click', () => setConsent('accepted'));
    panel.querySelector('#tmr-cookie-reject').addEventListener('click', () => setConsent('rejected'));
    panel.querySelector('#tmr-cookie-settings').addEventListener('click', () => {
      const choice = window.confirm('OK — разрешить cookies для сохранения игры. Отмена — отказаться от cookies.');
      setConsent(choice ? 'accepted' : 'rejected');
    });
    panel.hidden = current() === 'accepted' || current() === 'rejected';
  });
  window.TMRCookieConsent = { current, save, load, clear: removeSave };
})();
