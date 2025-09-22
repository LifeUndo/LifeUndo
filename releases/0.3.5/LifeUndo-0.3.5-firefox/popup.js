/* ---------- i18n ---------- */
const M = {
  en: {
    free: "Free Version",
    vip: "VIP",
    t1: "Latest text inputs",
    t2: "Recently closed tabs",
    t3: "Clipboard history",
    act: "Activate VIP",
    active: "VIP active",
    pro: "Upgrade to Pro",
    site: "Website", priv: "Privacy", sup: "Support", lic: "License",
    importing: "Importing…",
    ok: "VIP activated ✅",
    err: "Import error: ",
    wn: "What’s new"
  },
  ru: {
    free: "Бесплатная версия",
    vip: "VIP",
    t1: "Недавние вводы текста",
    t2: "Недавно закрытые вкладки",
    t3: "История буфера",
    act: "Активировать VIP",
    active: "VIP активен",
    pro: "Перейти на Pro",
    site: "Сайт", priv: "Приватность", sup: "Поддержка", lic: "Лицензия",
    importing: "Импорт…",
    ok: "VIP активирован ✅",
    err: "Ошибка импорта: ",
    wn: "Что нового"
  }
};
function getLang(){ return localStorage.getItem("lu_lang") || "ru"; }
function setLang(l){ localStorage.setItem("lu_lang", l); renderTexts(); }

/* ---------- helpers ---------- */
const enc = new TextEncoder();
function normB64(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return s; }
function b64ToBytes(b64){ return Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0)); }
function rsToDer(rs){                 // raw r||s -> DER
  function trimZero(a){ let i=0; while(i<a.length&&a[i]===0)i++; return a.slice(i); }
  function derInt(a){ a=trimZero(a); if(a[0]&0x80) a=Uint8Array.from([0,...a]); return Uint8Array.from([0x02,a.length,...a]); }
  const r=rs.slice(0,32), s=rs.slice(32);
  const R=derInt(r), S=derInt(s);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}
function ensureDer(sig){ return sig[0]===0x30?sig:rsToDer(sig); }
async function importJwkVerify(jwk){ return crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]); }
function canonicalJSONStringify(o){
  if (o===null || typeof o!=="object") return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const keys = Object.keys(o).sort();
  return "{"+keys.map(k => JSON.stringify(k)+":"+canonicalJSONStringify(o[k])).join(",")+"}";
}
function flash(txt, cls){ const f=document.getElementById("flash"); f.textContent=txt||""; f.className=cls||""; }

/* универсальный проверяльщик: plain/canonical × RAW/DER */
async function verifyLicenseFlexible(lic, fallbackJwk){
  if (!lic || !lic.license || !lic.signature || !lic.signature.sig_b64) throw new Error("Bad .lifelic format");

  const jwk = (lic.signature.publicKeyJwk && lic.signature.publicKeyJwk.kty)
    ? lic.signature.publicKeyJwk
    : fallbackJwk;

  const pub = await importJwkVerify(jwk);
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const candidates = [
    JSON.stringify(lic.license),
    canonicalJSONStringify(lic.license)
  ];
  const sigs = [ ensureDer(sigRaw), sigRaw ];

  for (const m of candidates){
    const bytes = enc.encode(m);
    for (const s of sigs){
      if (await crypto.subtle.verify({name:"ECDSA", hash:"SHA-256"}, pub, s, bytes))
        return true;
    }
  }
  return false;
}

/* ---------- UI elements ---------- */
const btnEN = document.getElementById("btnEN");
const btnRU = document.getElementById("btnRU");
const btnVip= document.getElementById("btnVip");
const btnPro= document.getElementById("btnPro");
const vipFile= document.getElementById("vipFile");
const planBadge=document.getElementById("planBadge");
const wnModal = document.getElementById("wnModal");
const wnClose = document.getElementById("wnClose");
document.getElementById("whatsNew").onclick=(e)=>{e.preventDefault(); wnModal.classList.add("on");};
wnClose.onclick=()=>wnModal.classList.remove("on");
wnModal.addEventListener("click", (e)=>{ if(e.target===wnModal) wnModal.classList.remove("on"); });

/* ---------- texts ---------- */
function renderTexts(){
  const L = M[getLang()];
  document.getElementById("subTitle").textContent = L.free;     // заменится на VIP в renderPlan()
  document.getElementById("t1").textContent = L.t1;
  document.getElementById("t2").textContent = L.t2;
  document.getElementById("t3").textContent = L.t3;
  btnVip.textContent = L.act;
  btnPro.textContent = L.pro;

  document.getElementById("whatsNew").textContent = L.wn;
  document.getElementById("lnkSite").textContent = L.site;
  document.getElementById("lnkPrivacy").textContent = L.priv;
  document.getElementById("lnkSupport").textContent = L.sup;
  document.getElementById("lnkLicense").textContent = L.lic;

  btnEN.classList.toggle("on", getLang()==="en");
  btnRU.classList.toggle("on", getLang()==="ru");
}

/* ---------- plan render ---------- */
async function renderPlan(){
  const L = M[getLang()];
  const {lu_plan} = await browser.storage.local.get("lu_plan");
  const isVip = lu_plan==="vip";

  // подзаголовок и бейдж
  document.getElementById("subTitle").textContent = isVip ? L.vip : L.free;
  planBadge.style.display = isVip ? "" : "none";

  // прятать/показывать PRO
  document.querySelectorAll(".pro").forEach(el => el.style.display = isVip ? "none" : "");

  // кнопки
  if (isVip){
    btnVip.textContent = L.active;
    btnVip.classList.add("is-disabled");
    btnVip.disabled = true;
    btnPro.style.display = "none";
  } else {
    btnVip.textContent = L.act;
    btnVip.classList.remove("is-disabled");
    btnVip.disabled = false;
    btnPro.style.display = "";
  }
}

/* ---------- events ---------- */
btnEN.onclick=()=>setLang("en");
btnRU.onclick=()=>setLang("ru");

btnPro.onclick = () => window.open("https://lifeundo.ru/#pricing","_blank");
document.getElementById("lnkSite").onclick    = () => window.open("https://lifeundo.ru","_blank");
document.getElementById("lnkPrivacy").onclick = () => window.open("https://lifeundo.ru/privacy/","_blank");
document.getElementById("lnkSupport").onclick = () => window.open("https://t.me/lifeundo","_blank");
document.getElementById("lnkLicense").onclick = (e)=>{ e.preventDefault(); browser.runtime.openOptionsPage(); };

btnVip.onclick = ()=> vipFile.click();

vipFile.onchange = async (e)=>{
  const f = e.target.files?.[0];
  if (!f) return;
  const L = M[getLang()];
  try{
    flash(L.importing);
    let text = await f.text();
    if (!text.trim().startsWith("{")){
      // armored: ----BEGIN ...---- / base64
      text = atob(text.split("\n").filter(l=>!/BEGIN|END/.test(l)).join(""));
    }
    const lic = JSON.parse(text);

    // fallback ключ (на случай, если в лицензии нет publicKeyJwk)
    const FALLBACK_JWK = {
      "kty":"EC","crv":"P-256","ext":true,"key_ops":["verify"],"alg":"ES256",
      "x":"SWSOsep9HCI3vkmYa9K_J1V9e_Nc4OPHYkAjyhua4HU",
      "y":"tSC4mGV8FrHdoZAiZyQYSwGCCombXsZpPLq3Y4TsH2k"
    };

    const ok = await verifyLicenseFlexible(lic, FALLBACK_JWK);
    if (!ok) throw new Error("Signature invalid");

    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    flash(L.ok, "ok");
    renderPlan();
  }catch(err){
    console.error("VIP import error:", err);
    flash(M[getLang()].err + err.message, "err");
  }finally{
    e.target.value="";
  }
};

/* следим за изменениями из options */
browser.storage.onChanged.addListener((changes, area)=>{
  if (area!=="local") return;
  if (changes.lu_plan) renderPlan();
});

/* ---------- boot ---------- */
(async function init(){
  renderTexts();
  renderPlan();

  // версия в заголовке «Что нового»: просто добавим (vX.Y.Z)
  const ver = browser.runtime.getManifest().version || "";
  const wn = document.getElementById("whatsNew");
  wn.textContent = (getLang()==="ru" ? "Что нового" : "What’s new") + (ver?` (v${ver})`:"");
})();
