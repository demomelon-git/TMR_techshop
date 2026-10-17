/* TMR ui-lib: интерфейс на DOM (вместо canvas-рендера): шапка, вкладки, каталог, интеграции, идеи, наборы, плагины */
const CSS=`:root,[data-theme="dark"]{--bg:#0a1020;--glow:#17284b;--pa:#131f36;--pb:#10192b;--p2:#17243d;--line:#2a3b5c;--soft:#24324a;--text:#edf3ff;--muted:#9fb0ce;--ac:#7c9cff;--ink:#081126;--green:#53e0ae;--orange:#ffca75;--red:#ff7d91;--field:#0c1527;--act:#263a67;--addbg:#22365c;--note:#2a2419;--notet:#f3d8a7;--head:#0b1222d9;--wal:#12301f;--walL:#2c7a58;color-scheme:dark}
[data-theme="light"]{--bg:#eef2fa;--glow:#fff;--pa:#fff;--pb:#f8faff;--p2:#eef2fb;--line:#d3dbec;--soft:#e3e9f5;--text:#14203a;--muted:#5a6a88;--ac:#3b5bdb;--ink:#fff;--green:#0b8a60;--orange:#b86e00;--red:#d6385a;--field:#f3f6fc;--act:#dfe7ff;--addbg:#e6edff;--note:#fff4dc;--notet:#7a4a00;--head:#ffffffe6;--wal:#e5f7ee;--walL:#8fd3b6;color-scheme:light}
[data-theme="amoled"]{--bg:#000;--glow:#000;--pa:#000;--pb:#000;--p2:#0d0d0d;--line:#222a3a;--soft:#161b26;--text:#f2f5ff;--muted:#8d97ad;--ac:#7c9cff;--ink:#000;--green:#53e0ae;--orange:#ffca75;--red:#ff7d91;--field:#080808;--act:#16224a;--addbg:#0f1a33;--note:#14110a;--notet:#f3d8a7;--head:#000000e6;--wal:#04140c;--walL:#1f5a47;color-scheme:dark}
[data-theme="sunset"]{--bg:#2a1226;--glow:#5a2340;--pa:#3a1a34;--pb:#321530;--p2:#46203d;--line:#6b3558;--soft:#552a49;--text:#fff0ea;--muted:#d9aebb;--ac:#ff8a5c;--ink:#2a1226;--green:#ffd479;--orange:#ffb36b;--red:#ff7d91;--field:#2a1226;--act:#6b2f4d;--addbg:#5a2a48;--note:#3d2430;--notet:#ffd9b5;--head:#2a1226d9;--wal:#3e2a1c;--walL:#a8683a;color-scheme:dark}
*{box-sizing:border-box}
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;background:var(--bg) radial-gradient(ellipse at top,var(--glow) 0,var(--bg) 55%) fixed;color:var(--text);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
header{padding:16px clamp(14px,4vw,44px);border-bottom:1px solid var(--line);background:var(--head);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px}.logo{width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,var(--ac),var(--green));display:grid;place-items:center;font-size:24px}
h1{font-size:clamp(20px,3vw,28px);margin:0}header p{margin:3px 0 0;color:var(--muted);font-size:13px}
.hr{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.wallet{display:flex;flex-direction:column;align-items:flex-end;background:var(--wal);border:1px solid var(--walL);border-radius:12px;padding:6px 14px}.wallet span{font-size:11px;color:var(--muted)}.wallet b{font-size:21px;color:var(--green)}
.clock{display:flex;flex-direction:column;gap:5px;min-width:100px;font-size:13px;font-weight:700}.clock i{display:block;height:5px;border-radius:4px;background:var(--line);overflow:hidden}.clock b{display:block;height:100%;width:0;background:var(--ac);transition:width 1s linear}
.ts{display:flex;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--field)}.ts button{border:0;background:0;color:var(--muted);padding:8px 10px;cursor:pointer;font:inherit;font-size:13px;font-weight:650}.ts button+button{border-left:1px solid var(--line)}.ts button.on{background:var(--ac);color:var(--ink)}
main{max-width:1250px;margin:auto;padding:20px clamp(12px,3vw,32px) 50px}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center}
.btn{border:1px solid var(--line);background:var(--p2);color:var(--text);padding:9px 13px;border-radius:10px;cursor:pointer;font:inherit;font-weight:650}.btn:hover{border-color:var(--ac)}.btn.pri{background:var(--ac);border-color:var(--ac);color:var(--ink)}.btn.warn{border-color:var(--red);color:var(--red)}.btn:disabled{opacity:.45;cursor:not-allowed}
.status{font-size:12px;color:var(--muted);margin-left:auto}
.tabs{display:flex;gap:6px;margin-bottom:16px;border-bottom:1px solid var(--line);overflow-x:auto}.tab{background:0;border:0;border-bottom:3px solid transparent;color:var(--muted);padding:10px 14px;font:inherit;font-weight:700;cursor:pointer;white-space:nowrap}.tab.on{color:var(--text);border-bottom-color:var(--ac)}
.layout{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(270px,.85fr);gap:16px;align-items:start}
.panel{background:linear-gradient(180deg,var(--pa),var(--pb));border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:16px}.ph{padding:14px 16px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:10px;align-items:center}.ph h2{font-size:17px;margin:0}.pb{padding:16px}
.muted{color:var(--muted)}.chip{font-size:12px;border:1px solid var(--line);color:var(--muted);padding:3px 9px;border-radius:999px;white-space:nowrap}
.cats{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.cat{background:var(--field);border:1px solid var(--line);padding:7px 11px;border-radius:9px;color:var(--muted);cursor:pointer;font:inherit}.cat.on{background:var(--act);border-color:var(--ac);color:var(--text)}
.inp{width:100%;background:var(--field);border:1px solid var(--line);border-radius:10px;padding:10px;color:var(--text);font:inherit;margin:6px 0 12px}
.items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.item,.func{background:var(--field);border:1px solid var(--line);border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:7px;min-width:0}
.item h3,.func h3{margin:0;font-size:15px;overflow-wrap:anywhere}.item .sp,.func p{color:var(--muted);font-size:12.5px;margin:0;flex:1}.ib{display:flex;align-items:center;justify-content:space-between;gap:8px}.price{font-size:17px;font-weight:800;color:var(--green)}.add{background:var(--addbg);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:7px 10px;cursor:pointer;font:inherit;font-weight:700}.add:disabled{opacity:.45;cursor:not-allowed}
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.row{display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--soft);font-size:14px}.row:last-child{border:0}
.sg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px}.stat{background:var(--field);border:1px solid var(--line);border-radius:10px;padding:10px}.stat span{display:block;color:var(--muted);font-size:11px}.stat b{font-size:16px}
.note{border-left:3px solid var(--orange);padding:10px 12px;background:var(--note);border-radius:0 8px 8px 0;color:var(--notet);font-size:13px;margin-top:10px}
.empty{padding:22px 10px;text-align:center;color:var(--muted)}.log{margin:0;padding:0;list-style:none;font-size:13px}.log li{padding:7px 0;border-bottom:1px solid var(--soft)}
.badge{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid var(--green);color:var(--green);font-weight:700}
.foot{font-size:12px;color:var(--muted);text-align:center;margin-top:22px}
@media(max-width:800px){.layout{grid-template-columns:1fr}.hr{width:100%;justify-content:space-between}}
@media(max-width:440px){.items{grid-template-columns:1fr}.ts{width:100%}.ts button{flex:1;padding:8px 2px;font-size:12px}}
.ts{flex-wrap:wrap}h3{font-size:15px;margin:14px 0 4px}`;
const HTML=`<header>
<div class="brand"><div class="logo">🛒</div><div><h1 id="shopName">Мой магазин</h1><p>Покупай технику у компаний и продавай покупателям</p></div></div>
<div class="hr"><div class="clock"><span id="dayLabel">День 1</span><i><b id="dayBar"></b></i></div><div class="wallet"><span>На счету</span><b id="wallet">2 500 ₡</b></div>
<div class="ts" id="ts"><button data-a="theme" data-v="light">☀️ Светлая</button><button data-a="theme" data-v="dark">🌙 Чёрная</button><button data-a="theme" data-v="amoled">⚫ AMOLED</button><button data-a="theme" data-v="sunset">🌇 Закат</button></div></div>
</header>
<main>
<div class="toolbar">
<button class="btn pri" data-a="save">💾 Сохранить игру</button><button class="btn" data-a="load">📂 Загрузить игру</button>
<button class="btn" data-a="mods">🧩 Загрузить моды</button><button class="btn warn" data-a="clrmods">🗑 Убрать моды</button>
<button class="btn" data-a="folder">📁 Подключить папку (save)</button><button class="btn" data-a="loadplug">🔌 Загрузить плагин</button><button class="btn" data-a="export">📦 Экспорт каталога</button><button class="btn warn" data-a="new">🔄 Новая игра</button>
<span id="pbtns" style="display:contents"></span><span class="status" id="msg">Сохранение — в cookies после вашего согласия</span>
<input type="file" id="fSave" accept=".json" hidden><input type="file" id="fMods" accept=".json" multiple hidden><input type="file" id="fPlug" accept=".json" multiple hidden>
</div>
<div class="tabs"><button class="tab" data-a="tab" data-v="cat">🛒 Каталог</button><button class="tab" data-a="tab" data-v="int">🔌 Интеграции</button><button class="tab" data-a="tab" data-v="idea">💡 Идеи</button><button class="tab" data-a="tab" data-v="bun" hidden>🎁 Наборы</button><button class="tab" data-a="tab" data-v="plug">🧩 Плагины и моды</button><button class="tab" data-a="tab" data-v="shop">🏪 Магазин</button></div>
<div id="view"></div>
<div class="foot">Магазин техники • офлайн-игра • компании, цены и характеристики вымышленные</div>
</main>`;
const $=id=>document.getElementById(id),money=n=>Math.round(n).toLocaleString("ru-RU")+" ₡",esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let V={tab:"cat",co:"appel",cat:"Все",q:""},sure=0;
const st=m=>{$("msg").textContent=m};
function head(){$("shopName").textContent=S.name;document.title=S.name;$("wallet").textContent=money(S.money);$("dayLabel").textContent="День "+S.day+(S.paused?" ⏸":"");$("dayBar").style.width=Math.min(100,el/S.dayLen*100)+"%";
 const th=themes();if(!th.some(t=>t[0]===S.theme))S.theme="dark";$("ts").innerHTML=th.map(t=>`<button data-a="theme" data-v="${esc(t[0])}" class="${t[0]===S.theme?"on":""}">${esc(t[1])}</button>`).join("");$("ptheme").textContent=themeCss();document.documentElement.dataset.theme=S.theme;
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.v===V.tab));
 document.querySelector(".tab[data-v=idea]").hidden=!hasF("ideas");document.querySelector(".tab[data-v=bun]").hidden=!hasF("bundles");
 $("pbtns").innerHTML=S.plugins.filter(p=>p.on).flatMap(p=>p.buttons.map((b,i)=>`<button class="btn" data-a="pbtn" data-v="${esc(p.id)}:${i}">${esc(b.label)}</button>`)).join("")}
function list(){let l=all().filter(x=>x.co===V.co);if(V.cat!=="All"&&V.cat!=="Все")l=l.filter(x=>x.cat===V.cat);const q=V.q.toLowerCase();return q?l.filter(x=>(x.name+x.spec).toLowerCase().includes(q)):l}
function itemsHtml(){const l=list();return l.length?l.map(x=>`<div class="item"><h3>${esc(x.name)}</h3><div class="sp">${esc(x.spec)}</div><div class="muted" style="font-size:12px">Продажа: ${money(sell(x))} • на полке: ${S.stock[x.id]||0}</div><div class="ib"><span class="price">${money(cost(x))}</span><button class="add" data-a="buy" data-v="${esc(x.id)}"${S.money<cost(x)?" disabled":""}>Купить</button></div></div>`).join(""):'<div class="empty">Ничего не найдено</div>'}
function shelfHtml(){const e=Object.entries(S.stock).filter(([id])=>find(id));return e.length?e.map(([id,q])=>{const x=find(id);return `<div class="row"><span>${esc(x.name)} × ${q}</span><b class="price" style="font-size:14px">${money(sell(x))}</b></div>`}).join(""):'<div class="empty">Полки пусты. Купи технику в каталоге.</div>'}
function render(){if(V.tab==="idea"&&!hasF("ideas"))V.tab="cat";if(V.tab==="bun"&&!hasF("bundles"))V.tab="cat";head();const v=$("view");
 if(V.tab==="cat"){const cats=["Все",...new Set(all().filter(x=>x.co===V.co).map(x=>x.cat))],n=Object.values(S.stock).reduce((a,b)=>a+b,0);
  v.innerHTML=`<div class="layout"><section><div class="panel"><div class="ph"><h2>🛒 Каталог компаний</h2><span class="chip">${all().filter(x=>x.co===V.co).length} моделей</span></div><div class="pb"><div class="cats">${CO.map(c=>`<button class="cat${c.id===V.co?" on":""}" data-a="co" data-v="${c.id}">${c.e} ${c.name}</button>`).join("")}</div><div class="cats">${cats.map(c=>`<button class="cat${c===V.cat?" on":""}" data-a="cat" data-v="${c}">${c}</button>`).join("")}</div><input class="inp" id="q" placeholder="Поиск по каталогу ${coOf(V.co).name}..." value="${esc(V.q)}"><div class="items" id="items">${itemsHtml()}</div></div></div></section>
  <aside><div class="panel"><div class="ph"><h2>🛒 Полки магазина</h2><span class="chip">${n} шт.</span></div><div class="pb" id="shelf">${shelfHtml()}<div class="note">Каждый игровой день приходят покупатели. Наценку, рекламу и вывеску настраивай во вкладке «Магазин».</div></div></div></aside></div>`;
  $("q").oninput=e=>{V.q=e.target.value;$("items").innerHTML=itemsHtml()}}
 else if(V.tab==="int"){v.innerHTML=`<div class="panel"><div class="ph"><h2>🔌 Интеграции с компаниями</h2><span class="chip">${Object.keys(S.integ).length} из ${INTEG.length}</span></div><div class="pb"><div class="fgrid">${INTEG.map(i=>{const own=S.integ[i.id];return `<div class="func"><h3>${i.name}</h3><p>${i.desc}</p>${own?'<span class="badge">✅ Куплено</span>':`<button class="btn pri" data-a="integ" data-v="${i.id}"${S.money<i.price?" disabled":""}>Купить · ${money(i.price)}</button>`}</div>`}).join("")}</div></div></div>`}
 else if(V.tab==="idea"){const sel=n=>`<label class="muted" style="font-size:12px">${n}<select class="inp" id="o-${n}" style="margin:4px 0 0">${IDEAOPT[n].map((o,i)=>`<option value="${i}">${o}</option>`).join("")}</select></label>`;
  v.innerHTML=`<div class="panel"><div class="ph"><h2>💡 Новая идея — свой модифицированный смартфон</h2></div><div class="pb"><input class="inp" id="iname" placeholder="Название модели" maxlength="30" style="margin-top:0"><label class="muted" style="font-size:12px">Базовая компания<select class="inp" id="ico" style="margin:4px 0 12px">${CO.map(c=>`<option value="${c.id}">${c.e} ${c.name}</option>`).join("")}</select></label><div class="fgrid">${Object.keys(IDEAOPT).map(sel).join("")}</div><p class="muted" id="iprice"></p><button class="btn pri" data-a="idea">Создать идею</button><div class="note">Идея сразу попадает в каталог выбранной компании в категорию «Идеи». Чем круче детали, тем дороже закупка и разработка.</div></div></div>
  <div class="panel"><div class="ph"><h2>Мои идеи</h2><span class="chip">${S.ideas.length}</span></div><div class="pb">${S.ideas.length?S.ideas.map(x=>`<div class="row"><span>${esc(x.name)}<br><small class="muted">${esc(x.spec)}</small></span><b class="price" style="font-size:14px">${money(x.price)}</b></div>`).join(""):'<div class="empty">Идей пока нет.</div>'}</div></div>`;
  document.querySelectorAll("#view select").forEach(s=>s.onchange=ideaPrice);ideaPrice()}
 else if(V.tab==="plug")plugView();else if(V.tab==="bun")bunView();else{const live=Object.values(S.stock).reduce((a,b)=>a+b,0);
  v.innerHTML=`<div class="panel"><div class="ph"><h2>✏️ Название магазина</h2></div><div class="pb"><input class="inp" id="nm" maxlength="24" value="${esc(S.name)}" style="margin-top:0"><button class="btn pri" data-a="rename">Переименовать</button></div></div>
  <div class="panel"><div class="ph"><h2>⚙️ Управление</h2><span class="chip">День ${S.day}</span></div><div class="pb"><div class="fgrid">
  <div class="func"><h3>💰 Наценка</h3><p>Выше наценка — больше прибыль, но меньше покупателей.</p><select class="inp" id="mk" style="margin:0">${[10,20,30,40,50,70].map(v=>`<option value="${v}"${v===S.markup?" selected":""}>${v}%</option>`).join("")}</select></div>
  <div class="func"><h3>🕒 Длина дня</h3><p>Реальные секунды в одном игровом дне.</p><select class="inp" id="dl" style="margin:0">${[10,15,30,60].map(v=>`<option value="${v}"${v===S.dayLen?" selected":""}>${v} сек</option>`).join("")}</select></div>
  <div class="func"><h3>${S.paused?"▶️":"⏸"} Время</h3><p>Пауза и перемотка дня.</p><button class="btn" data-a="pause">${S.paused?"Продолжить":"Пауза"}</button><button class="btn" data-a="skip">⏭ Следующий день</button></div>
  <div class="func"><h3>📢 Реклама</h3><p>+40% покупателей на 7 дней. ${S.ads?"Осталось дней: "+S.ads:""}</p><button class="btn pri" data-a="ads"${S.money<150?" disabled":""}>Запустить · ${money(150)}</button></div>
  <div class="func"><h3>🏪 Вывеска</h3><p>Навсегда +15% покупателей.</p>${S.sign?'<span class="badge">✅ Куплено</span>':`<button class="btn pri" data-a="sign"${S.money<500?" disabled":""}>Купить · ${money(500)}</button>`}</div></div></div></div>
  <div class="panel"><div class="ph"><h2>📊 Статистика</h2></div><div class="pb"><div class="sg"><div class="stat"><span>Продано</span><b>${S.sold} шт.</b></div><div class="stat"><span>Заработано</span><b>${money(S.earned)}</b></div><div class="stat"><span>На полках</span><b>${live} шт.</b></div></div>${S.log.length?'<ul class="log">'+S.log.map(t=>"<li>"+t+"</li>").join("")+"</ul>":'<div class="empty">Продаж пока не было.</div>'}</div></div>`;
  $("mk").onchange=e=>{S.markup=+e.target.value;persist()};$("dl").onchange=e=>{S.dayLen=+e.target.value;el=Math.min(el,S.dayLen-1);persist()}}}
function ideaOf(){const lv=Object.keys(IDEAOPT).map(n=>+$("o-"+n).value),sum=lv.reduce((a,b)=>a+b,0),c=coOf($("ico").value);return{lv,sum,c,unit:Math.round(c.base*.4*(1+.25*sum)/5)*5,fee:100+sum*60}}
function ideaPrice(){const i=ideaOf();$("iprice").textContent=`Закупка 1 шт.: ${money(i.unit)} • разработка: ${money(i.fee)}`}
function clock(){$("dayLabel").textContent="День "+S.day+(S.paused?" ⏸":"");$("dayBar").style.width=Math.min(100,el/S.dayLen*100)+"%"}
function plugView(){const pk={};S.mods.forEach(m=>{const k=m.pack||"JSON";pk[k]=(pk[k]||0)+1});const lib=PLUGLIB.filter(l=>!S.plugins.some(p=>p.id===l.id));
 $("view").innerHTML=`<div class="panel"><div class="ph"><h2>🧩 Плагины</h2><span class="chip">${S.plugins.length}</span></div><div class="pb"><p class="muted" style="margin-top:0">Плагины добавляют функции игры: создание своих телефонов, кнопки и темы. Моды — только новые товары для покупки.</p>${S.plugins.map(p=>`<div class="row"><span><b>${esc(p.name)}</b> ${p.on?'<span class="badge">вкл</span>':""}<br><small class="muted">${esc(p.description)}${p.features.includes("ideas")?" • создание телефонов":""}${p.features.includes("bundles")?" • наборы техники":""}${p.themes.length?" • тем: "+p.themes.length:""}${p.buttons.length?" • кнопок: "+p.buttons.length:""}</small></span><span><button class="btn" data-a="ptog" data-v="${esc(p.id)}">${p.on?"Выключить":"Включить"}</button> <button class="btn warn" data-a="pdel" data-v="${esc(p.id)}">Удалить</button></span></div>`).join("")||'<div class="empty">Плагинов нет</div>'}${lib.length?"<h3>Библиотека плагинов</h3>"+lib.map(l=>`<div class="row"><span><b>${esc(l.name)}</b><br><small class="muted">${esc(l.description)}</small></span><button class="btn pri" data-a="pins" data-v="${l.id}">Установить</button></div>`).join(""):""}<div class="toolbar" style="margin:14px 0 0"><button class="btn" data-a="loadplug">📥 Загрузить плагин (JSON)</button><button class="btn" data-a="exPlug">Пример плагина</button></div></div></div>
 <div class="panel"><div class="ph"><h2>📦 Моды</h2><span class="chip">${S.mods.length} шт.</span></div><div class="pb"><p class="muted" style="margin-top:0">Мод — JSON-файл, который только добавляет товары в каталог. В поле company укажи: ${CO.map(c=>c.id).join(", ")}.</p>${Object.entries(pk).map(([k,n])=>`<div class="row"><span>${esc(k)} • ${n} шт.</span><button class="btn warn" data-a="pdelmod" data-v="${esc(k)}">Убрать</button></div>`).join("")||'<div class="empty">Модов нет</div>'}<div class="toolbar" style="margin:14px 0 0"><button class="btn" data-a="mods">📥 Загрузить моды</button><button class="btn" data-a="exMod">Пример мода</button></div></div></div>`}
function bunView(){const sel=V.sel||(V.sel=[]),d=V.bd||10,pr=bunPrice(sel,d),cnt={};sel.forEach(i=>cnt[i]=(cnt[i]||0)+1);
 const left=Object.entries(S.stock).filter(([id])=>find(id)).map(([id,q])=>[id,q-(cnt[id]||0)]).filter(e=>e[1]>0);
 $("view").innerHTML=`<div class="layout"><section><div class="panel"><div class="ph"><h2>🎁 Товары на полке</h2><span class="chip">${left.length} поз.</span></div><div class="pb"><p class="muted" style="margin-top:0">Выбери до 4 товаров и собери набор со скидкой. Набор с модульным аккумулятором (мод «Модульный аккумулятор») получает +15% к цене и продаётся охотнее.</p>${left.map(([id,q])=>{const x=find(id);return `<div class="row"><span>${x.tag==="battery"?"🔋 ":""}${esc(x.name)} × ${q}<br><small class="muted">${money(sell(x))}</small></span><button class="add" data-a="badd" data-v="${esc(id)}"${sel.length>=4?" disabled":""}>＋ В набор</button></div>`}).join("")||'<div class="empty">Нет свободных товаров. Купи технику в каталоге.</div>'}</div></div></section>
 <aside><div class="panel"><div class="ph"><h2>🧰 Новый набор</h2></div><div class="pb">${sel.map((id,i)=>`<div class="row"><span>${esc(find(id).name)}</span><button class="remove btn warn" data-a="bdel" data-v="${i}">×</button></div>`).join("")||'<div class="empty">Набор пуст</div>'}<input class="inp" id="bn" maxlength="30" placeholder="Название набора" value="${esc(V.bn||"")}"><select class="inp" id="bd" style="margin-top:0">${[5,10,15,20].map(v=>`<option value="${v}"${v===d?" selected":""}>Скидка ${v}%</option>`).join("")}</select><div class="row"><span>Цена набора</span><b class="price">${money(pr.price)}</b></div>${pr.bat?'<span class="badge">🔋 модульный бонус +15%</span>':""}<div style="margin-top:12px"><button class="btn pri" data-a="bmake"${sel.length<2?" disabled":""}>Собрать набор</button></div></div></div>
 <div class="panel"><div class="ph"><h2>📦 Наборы в продаже</h2><span class="chip">${S.bundles.length}</span></div><div class="pb">${S.bundles.map(b=>`<div class="row"><span><b>${esc(b.name)}</b> ${b.bat?"🔋":""}<br><small class="muted">${b.items.map(i=>esc((find(i)||{name:"?"}).name)).join(", ")}</small></span><span><b class="price" style="font-size:14px">${money(b.price)}</b><br><button class="btn" data-a="bun" data-v="${esc(b.id)}">Разобрать</button></span></div>`).join("")||'<div class="empty">Наборов нет</div>'}</div></div></aside></div>`;
 $("bn").oninput=e=>{V.bn=e.target.value};$("bd").onchange=e=>{V.bd=+e.target.value;render()}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,v=b.dataset.v;
 if(a!=="new")sure=0;
 if(a==="theme"){S.theme=v;persist();head()}
 else if(a==="tab"){V.tab=v;render()}
 else if(a==="co"){V.co=v;V.cat="Все";V.q="";render()}
 else if(a==="cat"){V.cat=v;render()}
 else if(a==="buy"){const x=find(v);if(x&&S.money>=cost(x)){S.money-=cost(x);S.stock[v]=(S.stock[v]||0)+1;persist();head();$("shelf").firstElementChild&&($("shelf").innerHTML=shelfHtml()+'<div class="note">Каждый игровой день приходят покупатели.</div>');$("items").innerHTML=itemsHtml()}}
 else if(a==="integ"){const i=INTEG.find(x=>x.id===v);if(i&&S.money>=i.price&&!S.integ[v]){S.money-=i.price;S.integ[v]=1;persist();render();st("Куплено: "+i.name)}}
 else if(a==="idea"){const i=ideaOf(),name=$("iname").value.trim();if(!name){st("Введи название модели");return}if(S.money<i.fee){st("Не хватает денег на разработку: "+money(i.fee));return}
  const o=Object.keys(IDEAOPT).map((n,k)=>IDEAOPT[n][i.lv[k]]);S.money-=i.fee;S.ideas.push({id:"idea-"+Date.now(),co:i.c.id,name:i.c.name+" "+name,cat:"Идеи",spec:"Идея • "+o.join(" • "),price:i.unit});persist();render();st("Идея создана и добавлена в каталог "+i.c.name)}
 else if(a==="rename"){const n=$("nm").value.trim();if(n){S.name=n.slice(0,24);persist();head();st("Магазин переименован")}}
 else if(a==="ads"&&S.money>=150){S.money-=150;S.ads=Math.min(30,S.ads+7);persist();render()}
 else if(a==="sign"&&S.money>=500&&!S.sign){S.money-=500;S.sign=true;persist();render()}
 else if(a==="pause"){S.paused=!S.paused;persist();render()}
 else if(a==="skip"){el=0;advance()}
 else if(a==="save"){persist();if(R.save.folder)st("Сохранено в папку "+R.save.folder.name+"/save");else{dl("phone-shop-save.json",JSON.stringify(S,null,2));st("Папка не подключена — сохранение скачано файлом")}}
 else if(a==="load")$("fSave").click();
 else if(a==="mods")$("fMods").click();
 else if(a==="clrmods"){const n=S.mods.length;S.mods=[];persist();render();st(n?"Моды убраны: "+n:"Модов нет")}
 else if(a==="export")dl("phone-shop-catalog.json",JSON.stringify({game:"Tech Shop",catalog:all()},null,2));
 else if(a==="badd"){const c=(V.sel||[]).filter(i=>i===v).length;if((S.stock[v]||0)>c&&(V.sel||(V.sel=[])).length<4){V.sel.push(v);render()}}
 else if(a==="bdel"){V.sel.splice(+v,1);render()}
 else if(a==="bmake"){const sel=V.sel||[];if(sel.length>=2&&sel.every(i=>(S.stock[i]||0)>0)){const p=bunPrice(sel,V.bd||10);sel.forEach(i=>{S.stock[i]--;if(!S.stock[i])delete S.stock[i]});S.bundles.push({id:"b"+Date.now(),name:(V.bn||"").trim()||"Набор №"+(S.bundles.length+1),items:sel.slice(),price:p.price,bat:p.bat});V.sel=[];V.bn="";persist();render();st("Набор собран и выставлен: "+money(p.price))}}
 else if(a==="bun"){const b=S.bundles.find(x=>x.id===v);if(b){b.items.forEach(i=>S.stock[i]=(S.stock[i]||0)+1);S.bundles=S.bundles.filter(x=>x!==b);persist();render()}}
 else if(a==="folder")pickFolder();
 else if(a==="loadplug")$("fPlug").click();
 else if(a==="ptog"){const p=S.plugins.find(x=>x.id===v);if(p){p.on=!p.on;persist();render()}}
 else if(a==="pdel"){S.plugins=S.plugins.filter(x=>x.id!==v);persist();render()}
 else if(a==="pins"){const l=PLUGLIB.find(x=>x.id===v);if(l){S.plugins.push(normPlugin(l));persist();render()}}
 else if(a==="pdelmod"){S.mods=S.mods.filter(m=>(m.pack||"JSON")!==v);persist();render()}
 else if(a==="exPlug")dl("example-plugin.json",JSON.stringify(Object.assign({type:"plugin"},PLUGLIB[1]),null,2));
 else if(a==="exMod")dl("example-mod.json",JSON.stringify({type:"mod",catalog:[{name:"Appel Phone Retro+",company:"appel",category:"Моды",spec:"Мод • ретро-дизайн",price:300}]},null,2));
 else if(a==="pbtn"){const[pi,bi]=v.split(":"),b=((S.plugins.find(p=>p.id===pi)||{}).buttons||[])[bi];if(b){const n=Number(b.value)||0;if(b.action==="skip"){el=0;advance();return}if(b.action==="money")S.money+=n;else if(b.action==="pause")S.paused=!S.paused;else if(b.action==="ads")S.ads=Math.min(30,S.ads+(n||7));persist();render();st(b.message||b.label)}}
 else if(a==="new"){if(!sure){sure=1;st("Нажми «Новая игра» ещё раз для подтверждения");return}sure=0;const t=S.theme;S=DEF();S.theme=t;persist();render();st("Новая игра: на счёте "+money(START))}});
function bindDom(){
$("fPlug").onchange=async e=>{let n=0;for(const f of e.target.files){try{const d=JSON.parse(await f.text());(Array.isArray(d)?d:[d]).forEach(x=>{const p=normPlugin(x);if(p){S.plugins=S.plugins.filter(q=>q.id!==p.id);S.plugins.push(p);n++}})}catch(x){}}persist();render();st("Плагинов загружено: "+n);e.target.value=""};
$("fSave").onchange=async e=>{try{const d=JSON.parse(await e.target.files[0].text());if(!Number.isFinite(d.money))throw 0;S=Object.assign(DEF(),d);persist();render();st("Сохранение загружено")}catch(x){st("Не удалось прочитать файл сохранения")}e.target.value=""};
$("fMods").onchange=async e=>{let n=0;for(const f of e.target.files){try{const d=JSON.parse(await f.text()),a=Array.isArray(d)?d:(d.catalog||d.items);if(d.type==="plugin")throw 0;a.forEach((x,i)=>{if(!x.name||!Number.isFinite(+x.price))return;const co=CO.some(c=>c.id===(x.company||x.co))?(x.company||x.co):"appel",id=x.id||"mod-"+f.name.replace(/\W/g,"-")+"-"+i;if(!find(id)){S.mods.push({id,co,name:String(x.name),cat:String(x.category||x.cat||"Моды"),spec:String(x.spec||"Добавлено модом"),price:+x.price,pack:f.name,tag:x.tag?String(x.tag).slice(0,20):""});n++}})}catch(x){}}
 persist();render();st("Загружено товаров из модов: "+n+" (поле company: "+CO.map(c=>c.id).join(", ")+")");e.target.value=""};
}
function dl(n,d){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([d],{type:"application/json"}));a.href=u;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
async function pickFolder(){
  const sv=R.save;
  if(!sv.supported){st("Этот браузер не поддерживает выбор папки. Открой игру в Chrome или Edge через http://localhost.");return}
  const mine=JSON.parse(JSON.stringify(S));
  try{
    const n=await sv.connectFolder(),f=sv.get("state",null);
    if(f&&Number.isFinite(f.money)&&(f.saved||0)>(mine.saved||0)){S=Object.assign(DEF(),f);render();st("Загружено более свежее сохранение из "+n+"/save")}
    else{persist();st("Папка подключена: всё сохраняется в "+n+"/save")}
  }catch(e){st(e.name==="AbortError"?"Подключение отменено":"Не удалось подключить папку: "+e.message)}
}
window.TMRLibs.ui={
  requires:["shop","save"],
  init(r){
    const st0=document.createElement("style");st0.textContent=CSS;document.head.appendChild(st0);
    const pt=document.createElement("style");pt.id="ptheme";document.head.appendChild(pt);
    document.getElementById("tmr-root").innerHTML=HTML;
    // Игра управляется мышью и пальцем: не отдаём клавиши ядру (иначе оно блокирует пробел и стрелки в интерфейсе)
    ["keydown","keyup"].forEach(t=>window.addEventListener(t,e=>e.stopPropagation(),true));
    bindDom();render();
  },
  // каждый кадр: обновляем только таймер дня
  render(r){const k=S.day+"|"+el+"|"+S.paused;if(k!==this.k){this.k=k;clock()}}
};