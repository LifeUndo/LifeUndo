// ==== compat ====
const api = window.browser || window.chrome;

// ==== helpers (как в Settings) ====
const enc = new TextEncoder();
const normB64 = s => { s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4) s+='='; return s; };
const b64ToBytes = b64 => Uint8Array.from(atob(normB64(b64)), c=>c.charCodeAt(0));
function canonicalJSONStringify(o){
  if (o===null || typeof o!=='object') return JSON.stringify(o);
  if (Array.isArray(o)) return "["+o.map(canonicalJSONStringify).join(",")+"]";
  const k=Object.keys(o).sort(); return "{"+k.map(x=>JSON.stringify(x)+":"+canonicalJSONStringify(o[x])).join(",")+"}";
}
function rsToDer(rs){
  const tz=a=>{let i=0;while(i<a.length&&a[i]===0)i++;return a.slice(i)};
  const derInt=a=>{a=tz(a); if(a[0]&0x80)a=Uint8Array.from([0,...a]); return Uint8Array.from([0x02,a.length,...a])};
  const r=rs.slice(0,32), s=rs.slice(32), R=derInt(r), S=derInt(s);
  return Uint8Array.from([0x30, R.length+S.length, ...R, ...S]);
}
const ensureDer = sig => sig[0]===0x30 ? sig : rsToDer(sig);
const importJwkVerify = jwk => crypto.subtle.importKey("jwk", jwk, {name:"ECDSA", namedCurve:"P-256"}, true, ["verify"]);
function parseDateFlexible(s){
  if(!s) return null; s=String(s).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s+"T00:00:00Z");
  const m=s.replace(/\s+/g,"").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`);
  return null;
}
async function verifyLicenseFlexible(lic, embeddedPubJwk){
  if (!lic?.license || !lic?.signature?.sig_b64) throw new Error("Bad .lifelic format");
  const exp=parseDateFlexible(lic.license.expiry); if (exp && exp < new Date()) throw new Error("License expired");
  const jwk = lic.signature.publicKeyJwk?.kty ? lic.signature.publicKeyJwk : embeddedPubJwk;
  const pub = await importJwkVerify(jwk);
  const sigRaw = b64ToBytes(lic.signature.sig_b64);
  const sigDer = ensureDer(sigRaw);
  const msgs = [
    JSON.stringify(lic.license),
    JSON.stringify(lic.license, null, 2),
    canonicalJSONStringify(lic.license),
    JSON.stringify(JSON.parse(canonicalJSONStringify(lic.license)), null, 2),
  ];
  for (const m of msgs){
    for (const s of [sigDer, sigRaw]){
      for (const payload of [m, m+"\n", m+"\r\n"]){
        const ok = await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"}, pub, s, enc.encode(payload));
        if (ok) return true;
      }
    }
  }
  return false;
}

// ==== DOM ====
const btnVip  = document.getElementById('btnVip');
const vipFile = document.getElementById('vipFile');
const flashEl = document.getElementById('flash');
const planTag = document.getElementById('planLabel');
const whatsNewBtn = document.getElementById('whatsNewBtn');
const wnModal = document.getElementById('whatsNewModal');
const wnClose = document.getElementById('wnClose');
const versionTag = document.getElementById('versionTag');

// версия в модалке
try {
  const v = (api.runtime && api.runtime.getManifest && api.runtime.getManifest().version) || "";
  if (versionTag) versionTag.textContent = v ? `(v${v})` : "";
} catch{}

// короткий статус
function flash(t, cls){ if(!flashEl) return; flashEl.textContent=t||""; flashEl.className = cls ? "flash "+cls : "flash"; }

// apply plan → подменяем тексты/бейджи/кнопки
async function applyPlanFromStorage(){
  const { lu_plan } = await api.storage.local.get("lu_plan");
  const isRu = document.documentElement.lang === 'ru';
  const isVip = lu_plan === 'vip';

  if (planTag) planTag.textContent = isVip ? 'VIP' : (isRu ? 'Бесплатная версия' : 'Free Version');

  document.querySelectorAll('.pro').forEach(el => el.style.display = isVip ? 'none' : '');
  const btnPro = document.getElementById('btnPro');
  if (btnPro) btnPro.style.display = isVip ? 'none' : '';

  if (btnVip){
    btnVip.disabled = isVip;
    btnVip.classList.toggle('is-disabled', isVip);
    btnVip.textContent = isVip ? (isRu ? 'VIP активен' : 'VIP active')
                               : (isRu ? 'Активировать VIP' : 'Activate VIP');
  }
}
(api.storage?.onChanged)?.addListener(ch => {
  if (ch.lu_plan || ch.lu_license) applyPlanFromStorage();
});
applyPlanFromStorage();

// кнопка попапа → выбор файла
btnVip?.addEventListener('click', () => {
  if (btnVip.disabled) return;
  vipFile?.click();
});

// импорт VIP из попапа
vipFile?.addEventListener('change', async (ev)=>{
  const f = ev.target.files?.[0];
  if (!f) return;
  const isRu = document.documentElement.lang === 'ru';
  try{
    flash(isRu ? 'Импорт…' : 'Importing…');
    const txt = await f.text();
    const json = txt.trim().startsWith('{')
      ? txt
      : atob(txt.split('\n').filter(l=>!/BEGIN|END/.test(l)).join(''));
    const lic = JSON.parse(json);

    const EMBEDDED_PUB = null; // ключ берём из lic.signature.publicKeyJwk
    const ok = await verifyLicenseFlexible(lic, EMBEDDED_PUB);
    if (!ok) throw new Error('Signature invalid');

    await api.storage.local.set({ lu_plan: 'vip', lu_license: lic });
    flash(isRu ? 'VIP активирован ✅' : 'VIP activated ✅','ok');
  }catch(e){
    console.error('VIP import error:', e);
    flash((isRu?'Ошибка импорта: ':'Import error: ')+e.message,'err');
  }finally{ ev.target.value = ''; }
});

// "Что нового" — модалка
function openWN(){ wnModal?.removeAttribute('hidden'); }
function closeWN(){ wnModal?.setAttribute('hidden',''); }
whatsNewBtn?.addEventListener('click', openWN);
wnClose?.addEventListener('click', closeWN);
wnModal?.addEventListener('click', (e)=>{ if(e.target === wnModal) closeWN(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeWN(); });

// ссылка "License" в футере → открыть options.html
document.getElementById('linkSettings')?.addEventListener('click', (e)=>{
  e.preventDefault();
  if (api.runtime?.openOptionsPage) api.runtime.openOptionsPage();
});

// ссылки в футере
document.getElementById('linkWebsite')?.addEventListener('click', e=>{ e.preventDefault(); window.open('https://lifeundo.ru', '_blank'); });
document.getElementById('linkPrivacy')?.addEventListener('click', e=>{ e.preventDefault(); window.open('https://lifeundo.ru/privacy/', '_blank'); });
document.getElementById('linkSupport')?.addEventListener('click', e=>{ e.preventDefault(); window.open('https://t.me/lifeundo', '_blank'); });