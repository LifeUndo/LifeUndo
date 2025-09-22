// те же универсальные утилиты, что в попапе
const enc = new TextEncoder();
const EMBEDDED_PUB = {
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
function parseLifelicText(txt){
  if (txt.trim().startsWith("{")) return JSON.parse(txt);
  const b64 = txt.split("\n").filter(l=>!/BEGIN|END/.test(l)).join("");
  return JSON.parse(atob(b64));
}
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
  const msgs = [ JSON.stringify(lic.license), JSON.stringify(lic.license,null,2), canonicalJSONStringify(lic.license) ];
  for (const m of msgs){
    const bytes = enc.encode(m);
    if (await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"}, pub, sigDer, bytes)) return true;
    if (await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"}, pub, sigRaw, bytes)) return true;
  }
  return false;
}

// UI
const elChoose = document.getElementById("optChoose");
const elImport = document.getElementById("optImport");
const elVerify = document.getElementById("optVerify");
const elRemove = document.getElementById("optRemove");
const elFile   = document.getElementById("optFile");
const statusEl = document.getElementById("status");
function status(t, cls){ statusEl.textContent=t; statusEl.className=cls||""; }

// события
elChoose.onclick = ()=> elFile.click();

elImport.onclick = async ()=>{
  const f = elFile.files?.[0];
  if(!f) return status("Сначала выберите .lifelic", "err");
  try{
    status("Импорт…");
    const txt = await f.text();
    const lic = parseLifelicText(txt);
    const ok  = await verifyLicenseFlexible(lic, EMBEDDED_PUB);
    if(!ok) throw new Error("Signature invalid");
    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    status("Лицензия установлена ✅ (plan: vip)", "ok");
  }catch(e){ console.error(e); status("Ошибка импорта: "+e.message, "err"); }
  finally{ elFile.value=""; }
};

elVerify.onclick = async ()=>{
  const {lu_license}=await browser.storage.local.get("lu_license");
  if(!lu_license) return status("Лицензия не установлена");
  try{
    const ok = await verifyLicenseFlexible(lu_license, EMBEDDED_PUB);
    status(ok?"Подпись корректна ✅":"Подпись не прошла ❌", ok?"ok":"err");
  }catch(e){ status("Ошибка проверки: "+e.message,"err"); }
};

elRemove.onclick = async ()=>{
  await browser.storage.local.remove(["lu_plan","lu_license"]);
  status("Лицензия удалена");
};

// при открытии
(async ()=>{
  const {lu_plan}=await browser.storage.local.get("lu_plan");
  if(lu_plan==="vip") status("Лицензия установлена ✅ (plan: vip)","ok");
})();
