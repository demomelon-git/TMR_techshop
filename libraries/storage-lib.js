/* TMR storage-lib: автосохранение в браузер + подключение папки игры (подпапка save) */
const SAVE_DIR=G.save.dir,SAVE_FILE=G.save.file;let dirH=null,pend=null,svT=null;
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open("phoneShop",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const idbGet=async k=>{const db=await idb();return new Promise((res,rej)=>{const q=db.transaction("kv").objectStore("kv").get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})};
const idbSet=async(k,v)=>{const db=await idb();return new Promise((res,rej)=>{const t=db.transaction("kv","readwrite");t.objectStore("kv").put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})};
async function writeF(){const d=await dirH.getDirectoryHandle(SAVE_DIR,{create:true}),f=await d.getFileHandle(SAVE_FILE,{create:true}),w=await f.createWritable();await w.write(JSON.stringify(S,null,2));await w.close()}
async function readF(){try{const d=await dirH.getDirectoryHandle(SAVE_DIR),f=await d.getFileHandle(SAVE_FILE);return JSON.parse(await(await f.getFile()).text())}catch(e){if(e.name==="NotFoundError")return null;throw e}}
async function pickFolder(){
 if(!window.showDirectoryPicker){st("Этот браузер не поддерживает выбор папки. Открой игру в Chrome или Edge через http://localhost.");return}
 try{let h=null;if(pend&&await pend.requestPermission({mode:"readwrite"})==="granted")h=pend;if(!h)h=await showDirectoryPicker({mode:"readwrite"});
  dirH=h;pend=null;try{await idbSet("dir",h)}catch(e){}
  const f=await readF();if(f&&Number.isFinite(f.money)&&f.saved>(S.saved||0)){S=Object.assign(DEF(),f);render();st("Загружено более свежее сохранение из "+h.name+"/"+SAVE_DIR)}else{await writeF();st("Папка подключена: всё сохраняется в "+h.name+"/"+SAVE_DIR+"/"+SAVE_FILE)}
 }catch(e){st(e.name==="AbortError"?"Подключение отменено":"Не удалось подключить папку: "+e.message)}}
function persist(){S.saved=Date.now();
 try { if(window.TMRCookieConsent && window.TMRCookieConsent.current()==="accepted") window.TMRCookieConsent.save(S); } catch(e) { console.warn("Cookie save failed",e); }
 if(dirH){clearTimeout(svT);svT=setTimeout(()=>writeF().catch(e=>st("Не удалось записать в папку: "+e.message)),400)}}
function dl(n,d){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([d],{type:"application/json"}));a.href=u;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
window.TMRLibs.storage={
  consentChanged(value){
    if(value === "accepted") { persist(); st("Согласие принято: сохранение через cookies включено"); }
    else { if(window.TMRCookieConsent) window.TMRCookieConsent.clear(); st("Cookies отключены. Используй «Сохранить игру» для экспорта файла"); }
  },
  init(r){
    try{const d=window.TMRCookieConsent?.load();if(d&&Number.isFinite(d.money))S=Object.assign(DEF(),d)}catch(e){}
    r.state=S;
    (async()=>{if(!window.showDirectoryPicker)return;try{const h=await idbGet("dir");if(!h)return;
     if(await h.queryPermission({mode:"readwrite"})==="granted"){dirH=h;const d=await readF();if(d&&d.saved>(S.saved||0)){S=Object.assign(DEF(),d);render()}st("Папка подключена: "+h.name+"/"+SAVE_DIR)}
     else{pend=h;st("Папка «"+h.name+"» запомнена — нажми «Подключить папку» и разреши доступ")}}catch(e){}})();
  }
};