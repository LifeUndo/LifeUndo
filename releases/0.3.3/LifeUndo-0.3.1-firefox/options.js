const enc = new TextEncoder();

// те же утилиты
function normB64(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4)s+="="; return s; }
function b64ToBytes(b64){ return Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0)); }
function canonicalJSONStringify(o){
  if(o===null||typeof o!=="object")return JSON.stringify(o);
  if(Array.isArray(o))return"["+o.map(canonicalJSONStringify).join(",")+"]";
  const k=Object.keys(o).sort();
  return "{"+k.map(x=>JSON.stringify(x)+":"+canonicalJSONStringify(o[x])).join(",")+"}";
}
function rsToDer(rs){
  function t(a){let i=0;while(i<a.length&&a[i]===0)i++;a=a.slice(i);if(a[0]&0x80)a=Uint8Array.from([0,...a]);return a;}
  const r=t(rs.slice(0,32)), s=t(rs.slice(32));
  const R=Uint8Array.from([0x02,r.length,...r]), S=Uint8Array.from([0x02,s.length,...s]);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}
async function importJwkVerify(jwk){
  return crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]);
}
async function verifyLicense(lic){
  const jwk = lic?.signature?.publicKeyJwk;
  if(!jwk) throw new Error("No public key in license");
  const pub = await importJwkVerify(jwk);
  const msg = canonicalJSONStringify(lic.license);                  // << канонический JSON
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const sigDer = sigRaw[0]===0x30 ? sigRaw : rsToDer(sigRaw);
  return crypto.subtle.verify({name:"ECDSA", hash:"SHA-256"}, pub, sigDer, enc.encode(msg));
}

// минимальный UI-хэндлер
const btnImport = document.getElementById("btnImport");
const btnVerify = document.getElementById("btnVerify");
const btnRemove = document.getElementById("btnRemove");
const file      = document.getElementById("vipFile");
const statusEl  = document.getElementById("status");
function status(t,cls){ statusEl.textContent=t; statusEl.className=cls||""; }

btnImport.onclick=()=>file.click();
file.onchange = async (e)=>{
  const f = e.target.files?.[0]; if(!f) return;
  try{
    status("Importing…");
    const txt = await f.text();
    const payload = txt.trim().startsWith("{") ? txt
      : atob(txt.split("\n").filter(l=>!/BEGIN|END/.test(l)).join(""));
    const lic = JSON.parse(payload);
    const ok = await verifyLicense(lic);
    if(!ok) throw new Error("Signature invalid");
    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    status("VIP activated ✅","ok");
  }catch(err){
    console.error(err);
    status("Import error: "+err.message,"err");
  }finally{
    e.target.value="";
  }
};

btnVerify.onclick = async ()=>{
  const {lu_license}=await browser.storage.local.get("lu_license");
  if(!lu_license) return status("No license installed");
  try{
    const ok = await verifyLicense(lu_license);
    status(ok?"Signature valid ✅":"Signature invalid ❌", ok?"ok":"err");
  }catch(e){ status("Verify error: "+e.message,"err"); }
};
btnRemove.onclick = async ()=>{ await browser.storage.local.remove(["lu_plan","lu_license"]); status("License removed"); };
