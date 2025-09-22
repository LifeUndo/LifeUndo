// === helpers ===
const enc = new TextEncoder();
function normB64(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return s; }
function b64ToBytes(b64){ return Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0)); }
function canonicalJSONStringify(o){
  if (o===null || typeof o!=="object") return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const keys = Object.keys(o).sort();
  return "{"+keys.map(k=>JSON.stringify(k)+":"+canonicalJSONStringify(o[k])).join(",")+"}";
}
function rsToDer(rs){
  function trimZero(a){ let i=0; while(i<a.length&&a[i]===0)i++; return a.slice(i); }
  function derInt(a){ a=trimZero(a); if(a[0]&0x80)a=Uint8Array.from([0,...a]); return Uint8Array.from([0x02,a.length,...a]); }
  const r=rs.slice(0,32), s=rs.slice(32);
  const R=derInt(r), S=derInt(s);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}
async function importJwkVerify(jwk){
  return crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]);
}
async function verifyLicenseFlexible(lic){
  if(!lic || !lic.license || !lic.signature || !lic.signature.sig_b64) throw new Error("Bad .lifelic format");
  const jwk = (lic.signature.publicKeyJwk && lic.signature.publicKeyJwk.kty) ? lic.signature.publicKeyJwk : null;
  if(!jwk) throw new Error("No public key in license");
  const pub = await importJwkVerify(jwk);

  const msg = canonicalJSONStringify(lic.license);               // << КРИТИЧЕСКИ: канонический JSON БЕЗ \n
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const sigDer = sigRaw[0]===0x30 ? sigRaw : rsToDer(sigRaw);     // DER для WebCrypto

  const ok = await crypto.subtle.verify({name:"ECDSA", hash:"SHA-256"}, pub, sigDer, enc.encode(msg));
  return !!ok;
}

// === UI ===
const $ = s => document.querySelector(s);
const vipFile = $("#vipFile");
const btnVip  = $("#btnVip");
const flashEl = $("#flash");
const planEl  = $("#planLabel");
const btnPro  = $("#btnPro");

function flash(t, cls){ flashEl.textContent=t; flashEl.className=cls||""; if(t) setTimeout(()=>{flashEl.textContent="";flashEl.className=""}, 5000); }
function setVipUi(){ planEl.textContent="VIP"; document.querySelectorAll(".pro").forEach(e=>e.style.display="none"); if(btnPro) btnPro.style.display="none"; }

(async()=>{ const {lu_plan}=await browser.storage.local.get("lu_plan"); if(lu_plan==="vip") setVipUi(); })();

btnVip.addEventListener("click", ()=> vipFile.click());

vipFile.addEventListener("change", async (ev)=>{
  const f = ev.target.files?.[0];
  if(!f) return;
  try{
    flash("Importing…");
    const txt = await f.text();
    const payload = txt.trim().startsWith("{") ? txt
      : atob(txt.split("\n").filter(l=>!/BEGIN|END/.test(l)).join("")); // support armored
    const lic = JSON.parse(payload);

    const ok = await verifyLicenseFlexible(lic);
    if(!ok) throw new Error("Signature invalid");

    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    setVipUi();
    flash("VIP activated ✅","ok");
  }catch(e){
    console.error("VIP import error:", e);
    flash("Import error: "+e.message, "err");
  }finally{
    ev.target.value="";
  }
});

// заглушка на Pro
if(btnPro){ btnPro.onclick = ()=> window.open("https://lifeundo.ru/#pricing","_blank"); }

// простой переключатель языка (не влияет на проверку)
const btnEN = $("#btnEN"), btnRU = $("#btnRU");
function setLang(l){ localStorage.setItem("lu_lang", l); btnVip.textContent = (l==="ru")?"Активировать VIP":"Activate VIP"; btnPro.textContent = (l==="ru")?"Перейти на Pro":"Upgrade to Pro"; }
(function(){ const l=localStorage.getItem("lu_lang")||"en"; setLang(l); if(btnEN) btnEN.onclick=()=>setLang("en"); if(btnRU) btnRU.onclick=()=>setLang("ru"); })();
