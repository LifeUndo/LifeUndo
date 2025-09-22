// ===== helpers (универсальная офлайн-проверка) ==============================
const enc = new TextEncoder();
const EMBEDDED_PUB = { // запасной JWK
  kty:"EC", crv:"P-256", alg:"ES256", ext:true, key_ops:["verify"],
  x:"DKcbUAWx-zLJDi8KHeQW8AjwHmkYW2-cCxdWUj9SgUg",
  y:"yetNtsQHQ8hK5gSmZTfalZmxRmDhEol33XOG76s-JUQ",
};
const normB64 = s => { s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4)s+="="; return s; };
const b64ToBytes = b64 => Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0));
function rsToDer(rs){ const tz=a=>{let i=0;while(i<a.length&&a[i]===0)i++;return a.slice(i)};
  const derInt=a=>{a=tz(a); if(a[0]&0x80)a=Uint8Array.from([0,...a]); return Uint8Array.from([0x02,a.length,...a])};
  const r=rs.slice(0,32), s=rs.slice(32), R=derInt(r), S=derInt(s); return Uint8Array.from([0x30,R.length+S.length,...R,...S]); }
const ensureDer = sig => sig[0]===0x30 ? sig : rsToDer(sig);
const canonicalJSONStringify = o => {
  if (o===null || typeof o!=="object") return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const keys=Object.keys(o).sort();
  return "{"+keys.map(k=>JSON.stringify(k)+":"+canonicalJSONStringify(o[k])).join(",")+"}";
};
async function importJwkVerify(jwk){ return crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]); }
function parseDateFlexible(s){
  if(!s) return null; s=String(s).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s+"T00:00:00Z");
  const m=s.replace(/\s+/g,"").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if(m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`);
  return null;
}
async function verifyLicenseFlexible(lic, fallbackJwk){
  if(!lic || !lic.license || !lic.signature || !lic.signature.sig_b64) throw new Error("Bad .lifelic");
  const exp = parseDateFlexible(lic.license.expiry);
  if (exp && exp < new Date()) throw new Error("License expired");
  const jwk = (lic.signature.publicKeyJwk && lic.signature.publicKeyJwk.kty) ? lic.signature.publicKeyJwk : fallbackJwk;
  const pub = await importJwkVerify(jwk);
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const sigDer = ensureDer(sigRaw);
  const msgs = [
    JSON.stringify(lic.license),
    JSON.stringify(lic.license,null,2),
    canonicalJSONStringify(lic.license),
  ];
  for (const m of msgs){
    const bytes = enc.encode(m);
    if (await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"}, pub, sigDer, bytes)) return true;
    if (await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"}, pub, sigRaw, bytes)) return true;
  }
  return false;
}
function parseLifelicText(txt){
  if (txt.trim().startsWith("{")) return JSON.parse(txt);
  const b64 = txt.split("\n").filter(l=>!/BEGIN|END/.test(l)).join("");
  return JSON.parse(atob(b64));
}
// ===== i18n =====
const M = {
  en:{free:"Free",act:"Activate VIP",active:"VIP active",pro:"Upgrade to Pro",
      recent:"Latest text inputs",closed:"Recently closed tabs",clip:"Clipboard history",
      site:"Website",priv:"Privacy",supp:"Support",lic:"License",
      importing:"Importing…",ok:"VIP activated ✅",err:"Import error: "},
  ru:{free:"бесплатная",act:"Активировать VIP",active:"VIP активен",pro:"Перейти на Pro",
      recent:"Недавние вводы текста",closed:"Недавно закрытые вкладки",clip:"История буфера",
      site:"Сайт",priv:"Приватность",supp:"Поддержка",lic:"Лицензия",
      importing:"Импорт…",ok:"VIP активирован ✅",err:"Ошибка импорта: "}
};
function getLang(){ return localStorage.getItem("lu_lang") || "ru"; }
function flash(msg, cls){ const el=document.getElementById("flash"); el.textContent=msg||""; el.className=cls||""; }
// ===== UI =====
let isVip=false;
function setLang(l){
  localStorage.setItem("lu_lang", l);
  btnEN.classList.toggle("active", l==="en");
  btnRU.classList.toggle("active", l==="ru");
  const t=M[l];
  document.getElementById("t1").textContent=t.recent;
  document.getElementById("t2").textContent=t.closed;
  document.getElementById("t3").textContent=t.clip;
  document.getElementById("btnVip").textContent = isVip ? t.active : t.act;
  document.getElementById("btnPro").textContent = t.pro;
  document.getElementById("lnkWebsite").textContent=t.site;
  document.getElementById("lnkPrivacy").textContent=t.priv;
  document.getElementById("lnkSupport").textContent=t.supp;
  document.getElementById("lnkLicense").textContent=t.lic;
  document.getElementById("planBadge").textContent = isVip ? "VIP" : t.free;
}
function applyVipUI(vip){
  isVip = vip;
  const plan=document.getElementById("planBadge");
  plan.classList.toggle("vip", vip);
  plan.textContent = vip ? "VIP" : M[getLang()].free;
  document.querySelectorAll(".pro").forEach(e=>e.style.display = vip ? "none" : "");
  const btnVip=document.getElementById("btnVip");
  if (vip){ btnVip.textContent=M[getLang()].active; btnVip.classList.add("is-disabled"); btnVip.disabled=true; document.getElementById("btnPro").style.display="none"; }
  else { btnVip.textContent=M[getLang()].act; btnVip.classList.remove("is-disabled"); btnVip.disabled=false; document.getElementById("btnPro").style.display=""; }
}
// элементы
const btnEN=document.getElementById("btnEN");
const btnRU=document.getElementById("btnRU");
btnEN.addEventListener("click",()=>setLang("en"));
btnRU.addEventListener("click",()=>setLang("ru"));
document.getElementById("btnPro").addEventListener("click", ()=> window.open("https://lifeundo.ru/#pricing","_blank"));
document.getElementById("lnkWebsite").addEventListener("click",e=>{e.preventDefault();window.open("https://lifeundo.ru/","_blank")});
document.getElementById("lnkPrivacy").addEventListener("click",e=>{e.preventDefault();window.open("https://lifeundo.ru/privacy/","_blank")});
document.getElementById("lnkSupport").addEventListener("click",e=>{e.preventDefault();window.open("https://t.me/lifeundo","_blank")});
document.getElementById("lnkLicense").addEventListener("click",e=>{e.preventDefault();browser.runtime.openOptionsPage()});

const vipFile = document.getElementById("vipFile");
document.getElementById("btnVip").addEventListener("click", ()=>{
  if (isVip) return;
  vipFile.click();
});
vipFile.addEventListener("change", async ev=>{
  const f = ev.target.files?.[0]; ev.target.value="";
  if(!f) return;
  const t=M[getLang()];
  try{
    flash(t.importing);
    const txt = await f.text();
    const lic = parseLifelicText(txt);
    const ok  = await verifyLicenseFlexible(lic, EMBEDDED_PUB);
    if(!ok) throw new Error("Signature invalid");
    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    flash(t.ok,"ok");
  }catch(e){ console.error(e); flash(t.err + e.message, "err"); }
});
// начальная загрузка
(async ()=>{
  const st = await browser.storage.local.get(["lu_plan"]);
  applyVipUI(st.lu_plan==="vip");
  setLang(getLang());
})();
browser.storage.onChanged.addListener((ch,area)=>{
  if(area!=="local")return;
  if(ch.lu_plan){ applyVipUI(ch.lu_plan.newValue==="vip"); flash(M[getLang()].ok,"ok"); }
});
