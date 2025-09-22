const api = (typeof browser!=='undefined') ? browser : chrome;
const $ = s => document.querySelector(s);
const flash = (m, ok=false)=>{ const el=$('#flash'); if(el){ el.textContent=m; el.className='flash '+(ok?'ok':'err'); } };

// ---------- i18n (ручное переключение RU/EN) ----------
let uiLocale='en', i18n={};
async function loadMessages(loc){
  const url = api.runtime.getURL(`_locales/${loc}/messages.json`);
  const res = await fetch(url); i18n = await res.json(); uiLocale = loc;
  await api.storage.local.set({ uiLocale: loc });
}
function t(key){ return i18n?.[key]?.message || key; }
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n'); el.textContent = t(k);
  });
}
async function initLocale(){
  const { uiLocale: saved } = await api.storage.local.get('uiLocale');
  const loc = saved || ((api.i18n?.getUILanguage?.()||'en').startsWith('ru')?'ru':'en');
  await loadMessages(loc); applyI18n();
}
$('#btnRU')?.addEventListener('click', async()=>{ await loadMessages('ru'); applyI18n(); });
$('#btnEN')?.addEventListener('click', async()=>{ await loadMessages('en'); applyI18n(); });

// ---------- крипто-утилиты ----------
function canonicalStringify(v){ if(Array.isArray(v)) return '['+v.map(canonicalStringify).join(',')+']';
  if(v && typeof v==='object') return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonicalStringify(v[k])).join(',')+'}';
  return JSON.stringify(v); }
function b64ToBytes(b64){ b64=b64.replace(/-/g,'+').replace(/_/g,'/'); const pad=b64.length%4; if(pad) b64+='='.repeat(4-pad);
  const bin=atob(b64); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u; }
function derToRaw(der){ let i=0; if(der[i++]!==0x30) throw 0; if(der[i]&0x80){ i+=der[i]-0x80+1; } else { i++; }
  if(der[i++]!==0x02) throw 0; let rl=der[i++]; while(der[i]===0x00){i++; rl--;} const r=der.slice(i,i+rl); i+=rl;
  if(der[i++]!==0x02) throw 0; let sl=der[i++]; while(der[i]===0x00){i++; sl--;} const s=der.slice(i,i+sl);
  const out=new Uint8Array(64); out.set(r,32-r.length); out.set(s,64-s.length); return out; }
async function importJwk(jwk){ return crypto.subtle.importKey('jwk', jwk, {name:'ECDSA', namedCurve:'P-256'}, false, ['verify']); }
const LICENSE_PUB_KEY_JWK = { "kty":"EC","crv":"P-256","alg":"ES256","ext":true,"key_ops":["verify"],
  "x":"DKcbUAWx-zLJDi8KHeQW8AjwHmkYW2-cCxdWUj9SgUg","y":"yetNtsQHQ8hK5gSmZTfalZmxRmDhEol33XOG76s-JUQ" };

async function verifyLicenseSignature(obj){
  if(!obj?.license || !obj?.signature?.sig_b64) throw new Error('Invalid license object');
  const jwk = obj.signature.publicKeyJwk || LICENSE_PUB_KEY_JWK;
  const key = await importJwk(jwk);
  const data = new TextEncoder().encode(canonicalStringify(obj.license));
  const raw  = b64ToBytes(obj.signature.sig_b64);
  const candidates = [raw]; try{ candidates.push(derToRaw(raw)); }catch(_){}
  for(const sig of candidates){ try{
      const ok = await crypto.subtle.verify({name:'ECDSA', hash:'SHA-256'}, key, sig, data);
      if(ok) return true;
  }catch(_){}} return false;
}
async function parseLifelicFile(file){
  const txt=(await file.text()).trim();
  if(txt.startsWith('{')) return JSON.parse(txt);
  const m=txt.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if(!m) throw new Error('Unknown .lifelic format');
  return JSON.parse(atob(m[1].replace(/[^A-Za-z0-9+/_=-]/g,'')));
}

// ---------- VIP import ----------
async function doVipImport(file){
  const btn=$('#btnVip'); btn?.classList.add('loading'); flash(t('status_importing')||'Importing…', true);
  try{
    const obj = await parseLifelicFile(file);
    const ok  = await verifyLicenseSignature(obj);
    if(!ok) throw new Error('Signature invalid');
    await api.storage.local.set({ license: obj.license, signature: obj.signature, tier: 'vip' });
    flash(t('status_vip_ok')||'VIP activated ✅', true);
    await api.runtime.sendMessage({type:'license-updated'});
    await render();
  }catch(e){ console.error('[VIP] import failed:', e); flash((t('status_vip_err')||'Import error')+': '+(e.message||e), false); }
  finally{ btn?.classList.remove('loading'); }
}

// ---------- VIP UI функции ----------
function setVipUiOn(){
  const planEl = document.querySelector('#planLabel'); 
  if(planEl) planEl.textContent = t('popup_vip') || 'VIP';
  
  // скрываем PRO бейджи
  document.querySelectorAll('.pro-badge').forEach(el => el.style.display = 'none');
  
  // обновляем кнопку VIP
  const vipBtn = $('#btnVip');
  if(vipBtn) {
    vipBtn.textContent = t('popup_vip_active') || 'VIP active';
    vipBtn.classList.add('is-disabled');
    vipBtn.disabled = true;
  }
  
  // скрываем кнопку Pro
  const proBtn = $('#btnPro');
  if(proBtn) proBtn.style.display = 'none';
}

function setVipUiOff(){
  const planEl = document.querySelector('#planLabel'); 
  if(planEl) planEl.textContent = t('popup_free') || 'Free Version';
  
  // показываем PRO бейджи
  document.querySelectorAll('.pro-badge').forEach(el => el.style.display = '');
  
  // обновляем кнопку VIP
  const vipBtn = $('#btnVip');
  if(vipBtn) {
    vipBtn.textContent = t('popup_activate_vip') || 'Activate VIP';
    vipBtn.classList.remove('is-disabled');
    vipBtn.disabled = false;
  }
  
  // показываем кнопку Pro
  const proBtn = $('#btnPro');
  if(proBtn) proBtn.style.display = '';
}

async function refreshVipUi(){
  const { license } = await api.storage.local.get('license');
  const isVip = !!(license && license.plan==='vip' && (!license.expiry || new Date(license.expiry)>=new Date()));
  
  if(isVip) {
    setVipUiOn();
  } else {
    setVipUiOff();
  }
}

// ---------- рендер ----------
async function render(){
  await refreshVipUi();
}

// ---------- события ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  await initLocale();           // сначала подгружаем локализацию
  $('#btnVip')?.addEventListener('click', ()=> $('#vipFile')?.click());
  $('#vipFile')?.addEventListener('change', e=>{ const f=e.target.files?.[0]; if(f) doVipImport(f); });
  
  // ссылки в футере
  $('#linkWebsite')?.addEventListener('click', e=>{ e.preventDefault(); window.open('https://lifeundo.ru', '_blank'); });
  $('#linkPrivacy')?.addEventListener('click', e=>{ e.preventDefault(); window.open('https://lifeundo.ru/privacy/', '_blank'); });
  $('#linkSupport')?.addEventListener('click', e=>{ e.preventDefault(); window.open('https://t.me/lifeundo', '_blank'); });
  $('#linkSettings')?.addEventListener('click', e=>{ e.preventDefault(); api.runtime.openOptionsPage(); });
  
  $('#btnPro')?.addEventListener('click', e=>{ e.preventDefault(); api.tabs.create({url:'https://lifeundo.github.io/LifeUndo/#pricing'}); });
  await render();
});

// слушаем изменения стораджа (импорт/удаление лицензии из опций или попапа)
api.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.license) refreshVipUi();
});

api.runtime.onMessage.addListener(msg=>{ if(msg?.type==='license-updated') render(); });