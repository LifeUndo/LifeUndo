// ---------- i18n ----------
const STR = {
  en:{title:"License",subtitle:"Import a .lifelic file. Verification is offline (ECDSA P-256 / SHA-256).",
      select:"Select .lifelic",import:"Import",verify:"Verify",remove:"Remove",
      help1:"Click “Select .lifelic” and choose your license file",
      help2:"Press “Import” — license will be verified offline",
      help3:"Use “Verify” to re-check or “Remove” to delete it",
      importing:"Importing…",imported:"License installed ✅ (plan: vip)",
      removed:"License removed",nofile:"No file selected",noninstalled:"No license installed",
      sigValid:"Signature valid ✅",sigInvalid:"Signature invalid ❌",
      importErr:"Import error: ",verifyErr:"Verify error: "},
  ru:{title:"Лицензия",subtitle:"Импорт файла .lifelic. Проверка лицензии полностью офлайн (ECDSA P-256 / SHA-256).",
      select:"Выбрать .lifelic",import:"Импортировать",verify:"Проверить",remove:"Удалить",
      help1:"Нажмите «Выбрать .lifelic» и укажите файл лицензии",
      help2:"Нажмите «Импортировать» — проверка пройдёт офлайн",
      help3:"Кнопка «Проверить» — повторная проверка; «Удалить» — удалить лицензию",
      importing:"Импорт…",imported:"Лицензия установлена ✅ (plan: vip)",
      removed:"Лицензия удалена",nofile:"Файл не выбран",noninstalled:"Лицензия не установлена",
      sigValid:"Подпись корректна ✅",sigInvalid:"Подпись некорректна ❌",
      importErr:"Ошибка импорта: ",verifyErr:"Ошибка проверки: "}
};
function getLang(){const s=localStorage.getItem("lu_lang");if(s)return s;return (navigator.language||"en").toLowerCase().startsWith("ru")?"ru":"en"}
let L=STR[getLang()]; const t=k=>L[k]||k;

// ---------- DOM ----------
const $=id=>document.getElementById(id);
const fileInput=$("file"), fileName=$("fileName"), statusEl=$("status");
$("title").textContent=t("title"); $("subtitle").textContent=t("subtitle");
$("btnSelect").textContent=t("select"); $("btnImport").textContent=t("import");
$("btnVerify").textContent=t("verify"); $("btnRemove").textContent=t("remove");
$("helpList").innerHTML=`<li>${t("help1")}</li><li>${t("help2")}</li><li>${t("help3")}</li>`;

// ---------- helpers ----------
const enc=new TextEncoder();
function setStatus(txt,cls){statusEl.textContent=txt;statusEl.className=cls||""}
function normB64(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return s}
function b64ToBytes(b64){return Uint8Array.from(atob(normB64(b64)),c=>c.charCodeAt(0))}
function canonicalJSONStringify(o){
  if(o===null||typeof o!=="object")return JSON.stringify(o);
  if(Array.isArray(o))return"["+o.map(canonicalJSONStringify).join(",")+"]";
  const keys=Object.keys(o).sort();
  return "{"+keys.map(k=>JSON.stringify(k)+":"+canonicalJSONStringify(o[k])).join(",")+"}";
}
function canonicalJSONStringifyPretty(o){return JSON.stringify(JSON.parse(canonicalJSONStringify(o)),null,2)}
function rsToDer(rs){ // RAW r||s -> DER
  function trim(a){let i=0;while(i<a.length&&a[i]===0)i++;a=a.slice(i);if(a[0]&0x80)a=Uint8Array.from([0,...a]);return a}
  const r=trim(rs.slice(0,32)), s=trim(rs.slice(32));
  const R=Uint8Array.from([0x02,r.length,...r]), S=Uint8Array.from([0x02,s.length,...s]);
  return Uint8Array.from([0x30,R.length+S.length,...R,...S]);
}
async function importJwkVerify(jwk){
  return crypto.subtle.importKey("jwk",jwk,{name:"ECDSA",namedCurve:"P-256"},true,["verify"]);
}
function parseArmoredOrJson(text){
  const s=text.trim();
  if(s.startsWith("{")) return JSON.parse(s);
  // armored: -----BEGIN ...-----
  const payload = atob(s.split("\n").filter(l=>!/BEGIN|END/.test(l)).join(""));
  return JSON.parse(payload);
}

// ---------- FLEX verify (перебор всех форматов сообщения и подписи) ----------
async function verifyLicenseFlexible(lic, fallbackPubJwk=null){
  if(!lic?.license || !lic?.signature?.sig_b64) throw new Error("Bad .lifelic format");
  const jwk = (lic.signature.publicKeyJwk && lic.signature.publicKeyJwk.kty) ? lic.signature.publicKeyJwk : fallbackPubJwk;
  if(!jwk?.kty) throw new Error("No public key in license");
  const pub = await importJwkVerify(jwk);

  const sigRaw=b64ToBytes(lic.signature.sig_b64);
  const sigDer=(sigRaw[0]===0x30)?sigRaw:rsToDer(sigRaw);
  const sigs=[sigDer,sigRaw];

  const m1=JSON.stringify(lic.license);                 // minified
  const m2=JSON.stringify(lic.license,null,2);          // pretty
  const m3=canonicalJSONStringify(lic.license);         // canonical
  const m4=canonicalJSONStringifyPretty(lic.license);   // canonical pretty
  const base=[m1,m2,m3,m4];
  const msgs=[];
  for(const m of base){ msgs.push(m, m+"\n", m+"\r\n"); }

  for(const m of msgs){
    const data=enc.encode(m);
    for(const s of sigs){
      const ok=await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},pub,s,data);
      if(ok) return true;
    }
  }
  return false;
}

// ---------- UI ----------
$("btnSelect").onclick=()=>fileInput.click();
fileInput.onchange=()=>{fileName.textContent=fileInput.files?.[0]?.name||t("nofile")}

$("btnImport").onclick=async ()=>{
  const f=fileInput.files?.[0]; if(!f){fileInput.click();return}
  try{
    setStatus(t("importing"));
    const lic=parseArmoredOrJson(await f.text());

    // опциональный резервный ключ (если в файле нет publicKeyJwk)
    const FALLBACK=null; // или вставь JWK при необходимости
    const ok=await verifyLicenseFlexible(lic,FALLBACK);
    if(!ok) throw new Error("Signature invalid");

    await browser.storage.local.set({lu_plan:"vip",lu_license:lic});
    setStatus(t("imported"),"ok");
  }catch(e){ console.error(e); setStatus(t("importErr")+e.message,"err") }
  finally{ fileInput.value=""; fileName.textContent="" }
};

$("btnVerify").onclick=async ()=>{
  const {lu_license}=await browser.storage.local.get("lu_license");
  if(!lu_license) return setStatus(t("noninstalled"));
  try{
    const ok=await verifyLicenseFlexible(lu_license,null);
    setStatus(ok?t("sigValid"):t("sigInvalid"), ok?"ok":"err");
  }catch(e){ setStatus(t("verifyErr")+e.message,"err") }
};

$("btnRemove").onclick=async ()=>{
  await browser.storage.local.remove(["lu_plan","lu_license"]);
  setStatus(t("removed"));
};
