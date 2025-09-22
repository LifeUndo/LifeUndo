const api = typeof browser !== "undefined" ? browser : chrome;
const enc = new TextEncoder();

function normB64(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return s; }
function b64ToBytes(b64){ return Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0)); }
function canonicalJSONStringify(o){
  if (o===null || typeof o!=="object") return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const keys = Object.keys(o).sort();
  return "{"+keys.map(k => JSON.stringify(k)+":"+canonicalJSONStringify(o[k])).join(",")+"}";
}
function canonicalJSONStringifyPretty(o, indent=2){
  return JSON.stringify(JSON.parse(canonicalJSONStringify(o)), null, indent);
}
function rsToDer(rs){
  function trimZero(a){ let i=0; while(i<a.length&&a[i]===0) i++; return a.slice(i); }
  function derInt(a){ a=trimZero(a); if(a[0]&0x80) a=Uint8Array.from([0,...a]); return Uint8Array.from([0x02,a.length,...a]); }
  const r = rs.slice(0,32), s = rs.slice(32);
  const R = derInt(r), S = derInt(s);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}
function ensureDer(sig){ return sig[0]===0x30 ? sig : rsToDer(sig); }
async function importJwkVerify(jwk){ return crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]); }

async function verifyLicenseFlexible(lic, embeddedPubJwk){
  if (!lic || !lic.license || !lic.signature || !lic.signature.sig_b64) {
    throw new Error("Bad .lifelic format");
  }
  const exp = String(lic.license.expiry||"").trim();
  if (exp) {
    const d = /^\d{4}-\d{2}-\d{2}$/.test(exp) ? new Date(exp+"T00:00:00Z")
            : (exp.replace(/\s+/g,"").match(/^(\d{2})\.(\d{2})\.(\d{4})$/) ? new Date(RegExp.$3+"-"+RegExp.$2+"-"+RegExp.$1+"T00:00:00Z") : null);
    if (d && d < new Date()) throw new Error("License expired");
  }

  const jwk = (lic.signature.publicKeyJwk && lic.signature.publicKeyJwk.kty)
    ? lic.signature.publicKeyJwk
    : embeddedPubJwk;

  const pub = await importJwkVerify(jwk);
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const sigDer = ensureDer(sigRaw);

  const plainMin = JSON.stringify(lic.license);
  const plainPretty = JSON.stringify(lic.license, null, 2);
  const canonMin = canonicalJSONStringify(lic.license);
  const canonPretty = canonicalJSONStringifyPretty(lic.license, 2);

  const msgs = [plainMin, plainPretty, canonMin, canonPretty];
  const withEols = [];
  for (const m of msgs){ withEols.push(m, m+"\n", m+"\r\n"); }

  for (const m of withEols){
    const bytes = enc.encode(m);
    if (await crypto.subtle.verify({name:"ECDSA", hash:"SHA-256"}, pub, sigDer, bytes)) return true;
    if (await crypto.subtle.verify({name:"ECDSA", hash:"SHA-256"}, pub, sigRaw, bytes)) return true;
  }
  return false;
}

const EMBEDDED_PUB = {
  "kty":"EC","crv":"P-256","ext":true,"key_ops":["verify"],"alg":"ES256",
  "x":"DKcbUAWx-zLJDi8KHeQW8AjwHmkYW2-cCxdWUj9SgUg",
  "y":"yetNtsQHQ8hK5gSmZTfalZmxRmDhEol33XOG76s-JUQ"
};

const F = s => document.getElementById(s);
const file = F("vipFile");
const s   = F("status");

F("btnChoose").onclick = () => file.click();

F("btnImport").onclick = async () => {
  const f = file.files?.[0];
  if (!f) { s.textContent="Сначала выберите файл .lifelic"; s.className="err"; return; }
  try{
    s.textContent="Импорт…"; s.className="";
    const txt = await f.text();
    const json = txt.trim().startsWith("{")
      ? txt
      : atob(txt.split("\n").filter(l => !/BEGIN|END/.test(l)).join(""));
    const lic = JSON.parse(json);

    const ok = await verifyLicenseFlexible(lic, EMBEDDED_PUB);
    if (!ok) throw new Error("Signature invalid");

    await api.storage.local.set({ lu_plan:"vip", lu_license: lic });
    s.textContent="Лицензия установлена ✅ (plan: vip)"; s.className="ok";
  }catch(e){
    console.error(e);
    s.textContent="Ошибка импорта: " + e.message; s.className="err";
  }finally{
    file.value="";
  }
};

F("btnVerify").onclick = async () => {
  const { lu_license } = await api.storage.local.get("lu_license");
  if (!lu_license) { s.textContent="Лицензия не установлена"; s.className=""; return; }
  try{
    const ok = await verifyLicenseFlexible(lu_license, EMBEDDED_PUB);
    s.textContent = ok ? "Подпись корректна ✅" : "Signature invalid ❌";
    s.className = ok ? "ok" : "err";
  }catch(e){
    s.textContent = "Verify error: " + e.message; s.className = "err";
  }
};

F("btnRemove").onclick = async () => {
  await api.storage.local.remove(["lu_plan","lu_license"]);
  s.textContent="Лицензия удалена"; s.className="";
};
