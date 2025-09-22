// ===== helpers =====
const enc = new TextEncoder();
const $ = s => document.querySelector(s);

function normB64(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return s; }
function b64ToBytes(b64){ return Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0)); }
function canonicalJSONStringify(o){
  if (o===null || typeof o!=="object") return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const keys = Object.keys(o).sort();
  return "{"+keys.map(k=>JSON.stringify(k)+":"+canonicalJSONStringify(o[k])).join(",")+"}";
}
function rsToDer(rs){
  function trim(a){ let i=0; while(i<a.length && a[i]===0)i++; a=a.slice(i); if(a[0]&0x80) a=Uint8Array.from([0,...a]); return a; }
  const r=trim(rs.slice(0,32)), s=trim(rs.slice(32));
  const R=Uint8Array.from([0x02,r.length,...r]), S=Uint8Array.from([0x02,s.length,...s]);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}
async function importJwkVerify(jwk){
  return crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]);
}
async function verifyLicense(lic){
  if(!lic?.license || !lic?.signature?.sig_b64) throw new Error("Bad .lifelic format");
  const jwk = lic.signature.publicKeyJwk;
  if(!jwk?.kty) throw new Error("No public key in license");
  const pub = await importJwkVerify(jwk);

  // КРИТИЧЕСКИ: канонический JSON БЕЗ переводов строк
  const msg = canonicalJSONStringify(lic.license);
  const raw = b64ToBytes(lic.signature.sig_b64);
  const sig = raw[0]===0x30 ? raw : rsToDer(raw); // DER
  return crypto.subtle.verify({name:"ECDSA", hash:"SHA-256"}, pub, sig, enc.encode(msg));
}

function flash(t, cls){ const f=$("#flash"); f.textContent=t; f.className=cls||""; if(t) setTimeout(()=>{f.textContent=""; f.className=""}, 4000); }
function setVipUi(){ $("#planLabel").textContent="VIP"; document.querySelectorAll(".pro").forEach(e=>e.style.display="none"); const p=$("#btnPro"); if(p) p.style.display="none"; }

// авто-подхват статуса
(async()=>{ const {lu_plan}=await browser.storage.local.get("lu_plan"); if(lu_plan==="vip") setVipUi(); })();

// VIP импорт
$("#btnVip").addEventListener("click", ()=> $("#vipFile").click());
$("#vipFile").addEventListener("change", async (e)=>{
  const f = e.target.files?.[0]; if(!f) return;
  try{
    flash("Importing…");
    const txt = await f.text();
    const json = txt.trim().startsWith("{") ? txt
      : atob(txt.split("\n").filter(l=>!/BEGIN|END/.test(l)).join("")); // поддержка armored
    const lic = JSON.parse(json);

    const ok = await verifyLicense(lic);
    if(!ok) throw new Error("Signature invalid");

    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    setVipUi();
    flash("VIP activated ✅","ok");
  }catch(err){
    console.error("VIP import error:", err);
    flash("Import error: "+err.message, "err");
  }finally{
    e.target.value = "";
  }
});

// кнопки
$("#btnPro").onclick = ()=> window.open("https://lifeundo.ru/#pricing", "_blank");
$("#btnEN")?.addEventListener("click",()=>{ localStorage.setItem("lu_lang","en"); $("#btnVip").textContent="Activate VIP"; $("#btnPro").textContent="Upgrade to Pro"; });
$("#btnRU")?.addEventListener("click",()=>{ localStorage.setItem("lu_lang","ru"); $("#btnVip").textContent="Активировать VIP"; $("#btnPro").textContent="Перейти на Pro"; });
$("#linkSettings").onclick = ()=> browser.runtime.openOptionsPage();
