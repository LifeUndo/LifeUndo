const api = (typeof browser!=='undefined') ? browser : chrome;
const $ = s => document.querySelector(s);
const flash = (m, ok=false)=>{ const el=$('#flash'); if(!el) return; el.textContent=m; el.className='flash ' + (ok?'ok':'err'); };

// Встроенный верификатор лицензий (без динамических импортов!)
function canonicalStringify(v){
  if (Array.isArray(v)) return '['+v.map(canonicalStringify).join(',')+']';
  if (v && typeof v==='object') return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonicalStringify(v[k])).join(',')+'}';
  return JSON.stringify(v);
}

function b64ToBytes(b64){ 
  b64=b64.replace(/-/g,'+').replace(/_/g,'/'); 
  const pad=b64.length%4; 
  if(pad) b64+='='.repeat(4-pad); 
  const bin=atob(b64); 
  const u=new Uint8Array(bin.length); 
  for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); 
  return u; 
}

function derToRaw(der){
  let i=0; 
  if(der[i++]!==0x30) throw 0; 
  const len=der[i]&0x80? (i+=der[i]-0x80, der[i++]): der[i++]; 
  if(der[i++]!==0x02) throw 0; 
  let rl=der[i++]; 
  while(der[i]===0x00){i++; rl--;} 
  const r=der.slice(i,i+rl); 
  i+=rl; 
  if(der[i++]!==0x02) throw 0; 
  let sl=der[i++]; 
  while(der[i]===0x00){i++; sl--;} 
  const s=der.slice(i,i+sl); 
  const out=new Uint8Array(64); 
  out.set(r,32-r.length); 
  out.set(s,64-s.length); 
  return out;
}

async function importJwk(jwk){ 
  return crypto.subtle.importKey('jwk', jwk, {name:'ECDSA', namedCurve:'P-256'}, false, ['verify']); 
}

// Встроенный запасной ключ
const LICENSE_PUB_KEY_JWK = {
  "kty":"EC","crv":"P-256","alg":"ES256","ext":true,"key_ops":["verify"],
  "x":"DKcbUAWx-zLJDi8KHeQW8AjwHmkYW2-cCxdWUj9SgUg",
  "y":"yetNtsQHQ8hK5gSmZTfalZmxRmDhEol33XOG76s-JUQ"
};

async function verifyLicenseSignature(obj){
  if (!obj?.license || !obj?.signature?.sig_b64) throw new Error('Invalid license object');
  const jwk = obj.signature.publicKeyJwk || LICENSE_PUB_KEY_JWK;
  const key = await importJwk(jwk);
  const data = new TextEncoder().encode(canonicalStringify(obj.license));
  const raw = b64ToBytes(obj.signature.sig_b64);
  const candidates = [raw];
  try{ candidates.push(derToRaw(raw)); } catch(_){}
  for (const sig of candidates){
    try{
      const ok = await crypto.subtle.verify({name:'ECDSA', hash:'SHA-256'}, key, sig, data);
      if (ok) return true;
    }catch(_){}
  }
  return false;
}

async function parseLifelicFile(file){
  const txt = (await file.text()).trim();
  if (txt.startsWith('{')) return JSON.parse(txt);
  const m = txt.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if (!m) throw new Error('Unknown .lifelic format');
  const b64 = m[1].replace(/[^A-Za-z0-9+/_=-]/g,'');
  return JSON.parse(atob(b64));
}

async function doVipImport(file){
  const btn=$('#btnVip'); 
  btn?.classList.add('loading'); 
  flash('Importing…', true);
  try{
    const obj = await parseLifelicFile(file);
    const ok  = await verifyLicenseSignature(obj);
    if (!ok) throw new Error('Signature invalid');
    await api.storage.local.set({ license: obj.license, signature: obj.signature, tier: 'vip' });
    flash('VIP activated ✅', true);
    await api.runtime.sendMessage({type:'license-updated'});
    await render();
  }catch(e){ 
    console.error('[VIP] import failed:', e); 
    flash('Import error: '+(e.message||e), false); 
  }
  finally{ 
    btn?.classList.remove('loading'); 
  }
}

// Инициализация локализации
let uiLocale = 'en';
async function initLocale() {
  const st = await api.storage.local.get(['uiLocale']);
  uiLocale = st.uiLocale || 'en';
  await loadLocale();
}

async function loadLocale() {
  try {
    const resp = await fetch(`_locales/${uiLocale}/messages.json`);
    const msgs = await resp.json();
    window.t = (key, subs) => {
      let msg = msgs[key]?.message || key;
      if (subs) Object.keys(subs).forEach(k => msg = msg.replace(`$${k}$`, subs[k]));
      return msg;
    };
    applyI18n();
  } catch (e) {
    console.error('[i18n] load failed:', e);
    window.t = k => k;
  }
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && window.t) el.textContent = window.t(key);
  });
}

// Обработчики событий
$('#btnVip')?.addEventListener('click', ()=> $('#vipFile').click());
$('#vipFile')?.addEventListener('change', e=>{ const f=e.target.files?.[0]; if (f) doVipImport(f); });

$('#btnPro')?.addEventListener('click', ()=> {
  $('#proStub').classList.remove('hidden');
});

$('#whatsnew')?.addEventListener('click', ()=> {
  $('#changelog').classList.remove('hidden');
});

$('#lang-en')?.addEventListener('click', async ()=> {
  uiLocale = 'en';
  await api.storage.local.set({uiLocale});
  await loadLocale();
});

$('#lang-ru')?.addEventListener('click', async ()=> {
  uiLocale = 'ru';
  await api.storage.local.set({uiLocale});
  await loadLocale();
});

// Модальные окна
$('#closeChangelog')?.addEventListener('click', ()=> $('#changelog').classList.add('hidden'));
$('#backdrop')?.addEventListener('click', ()=> $('#changelog').classList.add('hidden'));
$('#closeProStub')?.addEventListener('click', ()=> $('#proStub').classList.add('hidden'));
$('#proBackdrop')?.addEventListener('click', ()=> $('#proStub').classList.add('hidden'));
$('#closeProStubBtn')?.addEventListener('click', ()=> $('#proStub').classList.add('hidden'));

$('#openPricing')?.addEventListener('click', ()=> {
  window.open('https://lifeundo.com/pricing', '_blank');
});

// Ссылки
$('#lnk-website')?.addEventListener('click', ()=> window.open('https://lifeundo.com', '_blank'));
$('#lnk-privacy')?.addEventListener('click', ()=> window.open('https://lifeundo.com/privacy', '_blank'));
$('#lnk-support')?.addEventListener('click', ()=> window.open('https://t.me/lifeundo', '_blank'));
$('#lnk-settings')?.addEventListener('click', ()=> api.runtime.openOptionsPage());

// ESC для закрытия модалов
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $('#changelog').classList.add('hidden');
    $('#proStub').classList.add('hidden');
  }
});

// Обновление лицензии
api.runtime.onMessage.addListener(msg=>{ 
  if (msg?.type==='license-updated') render(); 
});

// Рендер попапа
async function render(){
  const st = await api.storage.local.get(['license', 'tier']);
  const lic = st.license;
  const tier = st.tier;
  const isVip = !!(lic && lic.plan==='vip' && (!lic.expiry || new Date(lic.expiry)>=new Date()));
  
  // Обновляем версию
  const manifest = await api.runtime.getManifest();
  const versionEl = $('#version');
  if (versionEl) versionEl.textContent = `v${manifest.version}`;
  
  // Обновляем триал
  const trialEl = $('#trial');
  if (trialEl) {
    if (isVip) {
      trialEl.innerHTML = '<div class="trial">VIP License Active</div>';
    } else if (tier === 'pro') {
      trialEl.innerHTML = '<div class="trial">Pro License Active</div>';
    } else if (tier === 'trial') {
      const daysLeft = 7; // TODO: calculate from license
      trialEl.innerHTML = `<div class="trial">Trial: ${daysLeft} days left</div>`;
    } else {
      trialEl.innerHTML = '<div class="trial">Free Version</div>';
    }
  }
  
  // Обновляем кнопки
  const proBtn = $('#btnPro'), vipBtn = $('#btnVip');
  
  // Скрыть/показать PRO-бейджи
  document.querySelectorAll('.badge').forEach(el=> el.style.display = isVip ? 'none' : '');
  
  if (isVip){
    if (proBtn) proBtn.style.display='none';
    if (vipBtn){ 
      vipBtn.disabled=true; 
      vipBtn.textContent='VIP Active'; 
    }
  } else {
    if (proBtn) proBtn.style.display='';
    if (vipBtn){ 
      vipBtn.disabled=false; 
      vipBtn.textContent='Activate VIP'; 
    }
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async ()=> {
  await initLocale();
  await render();
});