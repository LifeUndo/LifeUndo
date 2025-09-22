/* i18n */
const T = {
  en: {
    title: "License",
    sub: 'Import a <code>.lifelic</code> file. Verification is offline (ECDSA P-256 / SHA-256).',
    choose: "Choose .lifelic",
    import: "Import",
    verify: "Verify",
    remove: "Remove key",
    statusOk: "Signature valid ✅",
    statusSet: "License installed ✅ (plan: vip)",
    statusRemoved: "License removed",
    errPref: "Import error: ",
    help: [
      "Download a <code>.lifelic</code> after purchase.",
      "Click “Choose .lifelic” and select the file.",
      "Click “Import” — the signature will be verified offline.",
    ],
    links: "Links:", site: "Website", priv: "Privacy", supp: "Support",
  },
  ru: {
    title: "Лицензия",
    sub: 'Импорт файла <code>.lifelic</code>. Проверка лицензии полностью офлайн (ECDSA P-256 / SHA-256).',
    choose: "Выбрать .lifelic",
    import: "Импортировать",
    verify: "Проверить",
    remove: "Удалить ключ",
    statusOk: "Подпись корректна ✅",
    statusSet: "Лицензия установлена ✅ (plan: vip)",
    statusRemoved: "Лицензия удалена",
    errPref: "Ошибка импорта: ",
    help: [
      'Скачайте <code>.lifelic</code> после покупки на сайте.',
      'Нажмите «Выбрать .lifelic» и укажите файл.',
      'Нажмите «Импортировать» — подпись проверится офлайн.',
    ],
    links: "Ссылки:", site: "Сайт", priv: "Приватность", supp: "Поддержка",
  },
};
function getLang(){ return localStorage.getItem("lu_lang") || "en"; }
function setText(id, html){ document.getElementById(id).innerHTML = html; }
function setBtn(id, text){ document.getElementById(id).textContent = text; }

function applyI18n(){
  const l=getLang(), m=T[l];
  setText("ttl", m.title);
  setText("sub", m.sub);
  setBtn("btnChoose", m.choose);
  setBtn("btnImport", m.import);
  setBtn("btnVerify", m.verify);
  setBtn("btnRemove", m.remove);
  
  const ul=document.getElementById("helpList");
  ul.innerHTML=""; m.help.forEach(h=>{ const li=document.createElement("li"); li.innerHTML=h; ul.appendChild(li); });
  
  const linksLabel = document.getElementById("linksLabel");
  const site=document.getElementById("lnkSite");
  const priv=document.getElementById("lnkPriv");
  const supp=document.getElementById("lnkSupp");
  linksLabel.textContent = m.links;
  site.textContent = m.site; priv.textContent = m.priv; supp.textContent=m.supp;
}

/* crypt/verify */
const enc = new TextEncoder();
function normB64(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return s; }
function b64ToBytes(b64){ return Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0)); }
function rsToDer(rs){ function tz(a){let i=0;while(i<a.length&&a[i]===0)i++;return a.slice(i)} function derInt(a){a=tz(a);if(a[0]&0x80)a=Uint8Array.from([0,...a]);return Uint8Array.from([0x02,a.length,...a])} const r=rs.slice(0,32),s=rs.slice(32); const R=derInt(r),S=derInt(s); return Uint8Array.from([0x30,R.length+S.length+4,...R,...S]); }
function ensureDer(sig){ return sig[0]===0x30?sig:rsToDer(sig); }
async function importJwkVerify(jwk){ return crypto.subtle.importKey("jwk",jwk,{name:"ECDSA",namedCurve:"P-256"},true,["verify"]); }
function canonicalJSONStringify(o){ if(o===null||typeof o!=="object")return JSON.stringify(o); if(Array.isArray(o))return"["+o.map(canonicalJSONStringify).join(",")+"]"; const k=Object.keys(o).sort(); return"{"+k.map(x=>JSON.stringify(x)+":"+canonicalJSONStringify(o[x])).join(",")+"}"; }
function parseDateFlexible(s){
  if(!s) return null;
  s=String(s).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s+"T00:00:00Z");
  const m=s.replace(/\s+/g,"").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if(m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`);
  return null;
}
async function verifyLicenseFlexible(lic, embeddedPubJwk){
  if(!lic||!lic.license||!lic.signature||!lic.signature.sig_b64) throw new Error("Bad .lifelic format");
  const exp=parseDateFlexible(lic.license.expiry);
  if(exp && exp<new Date()) throw new Error("License expired");
  const jwk=(lic.signature.publicKeyJwk&&lic.signature.publicKeyJwk.kty)?lic.signature.publicKeyJwk:embeddedPubJwk;
  const pub=await importJwkVerify(jwk);
  const sigRaw=b64ToBytes(lic.signature.sig_b64);
  const sigDer=ensureDer(sigRaw);

  const plainMin=JSON.stringify(lic.license);
  const canonicalMin=canonicalJSONStringify(lic.license);
  const msgs=[plainMin,canonicalMin];
  const withLineEnds=[]; for(const m of msgs) withLineEnds.push(m,m+"\n");
  
  for(const m of withLineEnds){
    const bytes=enc.encode(m);
    if(await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},pub,sigDer,bytes)) return true;
    if(await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},pub,sigRaw,bytes)) return true;
  }
  return false;
}

const LICENSE_PUB_KEY_JWK = {
  alg:"ES256", crv:"P-256", ext:true, key_ops:["verify"], kty:"EC",
  x:"DKcbUAWx-zLJDi8KHeQW8AjwHmkYW2-cCxdWUj9SgUg",
  y:"yetNtsQHQ8hK5gSmZTfalZmxRmDhEol33XOG76s-JUQ",
};

/* UI */
const file = document.getElementById("file");
const btnChoose = document.getElementById("btnChoose");
const btnImport = document.getElementById("btnImport");
const btnVerify = document.getElementById("btnVerify");
const btnRemove = document.getElementById("btnRemove");
const statusEl = document.getElementById("status");

function status(t, cls){
  const l=getLang();
  statusEl.textContent=t;
  statusEl.className = cls||"";
}

applyI18n();

btnChoose.onclick = ()=> file.click();

file.onchange = ()=>{
  if(file.files?.[0]){
    btnImport.disabled = false;
    btnChoose.classList.remove("step-on");
    btnImport.classList.add("step-on");
  }else{
    btnImport.disabled = true;
    btnChoose.classList.add("step-on");
    btnImport.classList.remove("step-on");
  }
};

btnImport.onclick = async ()=>{
  const l=getLang(), m=T[l];
  const f=file.files?.[0]; if(!f) return;
  try{
    status(m.importing);
  }catch{}
  try{
    const txt = await f.text();
    const json = txt.trim().startsWith("{") ? txt
      : atob(txt.split("\n").filter(l=>!/BEGIN|END/.test(l)).join(""));
    const lic = JSON.parse(json);
    const ok = await verifyLicenseFlexible(lic, LICENSE_PUB_KEY_JWK);
    if(!ok) throw new Error("Signature invalid");

    await browser.storage.local.set({ lu_plan:"vip", lu_license: lic });
    status(m.statusSet, "ok");

    btnImport.classList.remove("step-on");
    btnVerify.disabled=false;
    btnVerify.classList.add("step-on");
  }catch(e){
    status(T[l].errPref + e.message, "err");
  }
};

btnVerify.onclick = async ()=>{
  const l=getLang(), m=T[l];
  try{
    const { lu_license } = await browser.storage.local.get("lu_license");
    if(!lu_license) return;
    const ok = await verifyLicenseFlexible(lu_license, LICENSE_PUB_KEY_JWK);
    status(ok ? m.statusOk : "Signature invalid", ok?"ok":"err");
  }catch(e){
    status(T[l].errPref + e.message, "err");
  }
};

btnRemove.onclick = async ()=>{
  const l=getLang(), m=T[l];
  await browser.storage.local.remove(["lu_plan","lu_license"]);
  btnVerify.disabled=true;
  btnChoose.classList.add("step-on");
  btnImport.classList.remove("step-on");
  btnImport.disabled=true;
  status(m.statusRemoved);
};