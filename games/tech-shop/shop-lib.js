/* TMR shop-lib: модель магазина — каталог, цены, дни, наборы, плагины. Данные берёт из games/phone-shop.json */
const G=window.TMR.game,{CO,TIERS,MODN,IDEAOPT,BTH,PLUGLIB}=G.data,START=G.start;
const BASE=[];
CO.forEach(c=>{c.lines.forEach((l,i)=>TIERS.forEach(([t,m,r,s,mp],j)=>BASE.push({id:`${c.id}-${i}-${j}`,co:c.id,name:`${c.name} ${l}${t?" "+t:""}`,cat:"Телефоны",spec:`${r} ГБ ОЗУ • ${s} ГБ • ${mp} Мп`,price:Math.round(c.base*(.7+i*.08)*m/5)*5})));
 (G.data.TYPES||[]).forEach(T=>T.lines.forEach((l,i)=>TIERS.forEach(([t,m],j)=>BASE.push({id:`${c.id}-${T.k}${i}-${j}`,co:c.id,name:`${c.name} ${l}${t?" "+t:""}`,cat:T.cat,spec:T.specs[j],price:Math.round(c.base*T.mult*(1+i*.12)*m/5)*5}))));
 MODN.forEach(([n,d],i)=>BASE.push({id:`${c.id}-m${i}`,co:c.id,name:`${c.name} ${c.lines[0]} ${n}`,cat:"Моды",spec:"Мод • "+d,price:Math.round(c.base*(1.1+i*.1)/5)*5}))});
const INTEG=CO.flatMap(c=>[{id:c.id+"p",co:c.id,name:`${c.e} Партнёрство с ${c.name}`,desc:`−15% к закупке всей техники ${c.name}.`,price:c.base*3},{id:c.id+"x",co:c.id,name:`${c.e} Эксклюзив ${c.name}`,desc:`Покупатели чаще берут ${c.name} и платят на 10% больше.`,price:c.base*6}]);
const DEF=()=>({bundles:[],plugins:[normPlugin(PLUGLIB[0])],money:START,name:"Мой магазин",day:1,stock:{},integ:{},ideas:[],mods:[],ads:0,sign:false,markup:30,sold:0,earned:0,log:[],dayLen:15,paused:false,theme:"dark"});
let S=DEF(),el=0,acc=0;
const all=()=>BASE.concat(S.mods,S.ideas),find=id=>all().find(x=>x.id===id),coOf=id=>CO.find(c=>c.id===id)||CO[0];
const cost=it=>Math.round(it.price*(S.integ[it.co+"p"]?.85:1)),sell=it=>Math.round(it.price*(1+S.markup/100)*(S.integ[it.co+"x"]?1.1:1));
function advance(){S.day++;if(S.ads>0)S.ads--;
 const mult=1+(S.ads>0?.4:0)+(S.sign?.15:0),n=Math.round((2+Math.random()*3+S.day*.12)*mult);
 const flat=Object.entries(S.stock).flatMap(([id,q])=>Array(q).fill(id));let inc=0,cnt=0;
 for(let k=0;k<n&&flat.length;k++){const i=Math.floor(Math.random()*flat.length),id=flat[i],x=find(id);if(!x){flat.splice(i,1);continue}
  const ch=Math.min(.95,Math.max(.1,1.05-S.markup/100*1.2+(S.integ[x.co+"x"]?.2:0)));
  if(Math.random()<ch){inc+=sell(x);cnt++;S.stock[id]--;if(!S.stock[id])delete S.stock[id];flat.splice(i,1)}}
 if(hasF("bundles"))S.bundles=S.bundles.filter(b=>{const ch=Math.min(.9,.3+(b.bat?.2:0)+(S.ads>0?.1:0)+(S.sign?.05:0));if(Math.random()<ch){inc+=b.price;cnt++;return false}return true});
 S.money+=inc;S.sold+=cnt;S.earned+=inc;S.log.unshift("День "+S.day+": "+(cnt?"продано "+cnt+" шт., +"+money(inc):"покупателей не было"));S.log=S.log.slice(0,12);
 persist();render();st("День "+S.day+": "+(cnt?"+"+money(inc):"продаж не было"))}
function hasF(f){return S.plugins.some(p=>p.on&&p.features.includes(f))}
function themes(){return BTH.concat(S.plugins.filter(p=>p.on).flatMap(p=>p.themes.map(t=>[t.id,t.name])))}
function themeCss(){return S.plugins.filter(p=>p.on).flatMap(p=>p.themes).map(t=>`[data-theme="${t.id}"]{${Object.entries(t.vars).map(([k,v])=>k+":"+v).join(";")}}`).join("")}
function normPlugin(d){if(!d||d.type==="mod"||d.catalog||!(d.id||d.name))return null;const id=String(d.id||d.name).replace(/[^\w-]/g,"-").slice(0,30),clean=x=>String(x).replace(/[;{}<>]/g,"");
 return{id,name:String(d.name||id).slice(0,40),description:String(d.description||"").slice(0,200),on:true,features:(d.features||[]).filter(f=>["ideas","bundles"].includes(f)),
 themes:(d.themes||[]).filter(t=>t&&/^[\w-]+$/.test(t.id||"")&&!BTH.some(b=>b[0]===t.id)).map(t=>({id:t.id,name:String(t.name||t.id).slice(0,24),vars:Object.fromEntries(Object.entries(t.vars||{}).filter(([k])=>/^--[\w-]+$/.test(k)).map(([k,v])=>[k,clean(v)]))})),
 buttons:(d.buttons||[]).filter(b=>b&&b.label&&["skip","pause","ads","money"].includes(b.action)).map(b=>({label:String(b.label).slice(0,28),action:b.action,value:b.value,message:b.message?String(b.message).slice(0,80):""}))}}
function bunPrice(ids,d){const x=ids.map(find).filter(Boolean),bat=x.some(i=>i.tag==="battery");return{bat,price:Math.round(x.reduce((a,b)=>a+sell(b),0)*(1-d/100)*(bat?1.15:1))}}
let R=null;
// Состояние хранит save-lib движка: r.save.set("state", S) -> localStorage (+ папка save, если подключена)
function persist(){S.saved=Date.now();if(R&&R.save)R.save.set("state",S)}
window.TMRLibs.shop={
  requires:["save"],
  init(r){
    R=r;
    let d=r.save.get("state",null);
    if(d&&Number.isFinite(d.money))S=Object.assign(DEF(),d);
    // r.state занят состоянием движка (playing/paused), поэтому наше состояние лежит в глобальном S
  },
  // update вызывается движком с фиксированным шагом 1/60 с (только в состоянии playing)
  update(r,dt){if(S.paused)return;acc+=dt;while(acc>=1){acc-=1;el++;if(el>=S.dayLen){el=0;advance()}}}
};
