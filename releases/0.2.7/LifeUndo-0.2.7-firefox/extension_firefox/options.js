// LifeUndo Options Page - Firefox v0.2.5
const api = (typeof browser !== 'undefined') ? browser : chrome;

const $ = s => document.querySelector(s);
const file = $('#lifelic'), st = $('#status');
const ok  = m => { st.textContent = m; st.className = 'ok';    };
const err = m => { st.textContent = m; st.className = 'err';   };
const info= m => { st.textContent = m; st.className = 'muted'; };

function parseLifelic(txt){
  const t = txt.trim();
  if (t.startsWith('{')) return JSON.parse(t); // JSON
  const m = t.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if (!m) throw new Error('Unknown license format');
  const b64 = m[1].replace(/[^A-Za-z0-9+/=]/g,'');
  return JSON.parse(atob(b64));                // armored -> JSON
}

async function handleFile(f){
  try{
    const obj = parseLifelic(await f.text());
    
    // ИСПРАВЛЕНО: используем только verifyLicenseSignature, НЕ License.verifyToken
    const passed = await verifyLicenseSignature(obj);
    if (!passed) throw new Error('Signature check failed');
    
    await api.storage.local.set({ license: obj.license, signature: obj.signature });
    ok(`License installed ✅ (plan: ${obj.license.plan})`);
    try { api.runtime.sendMessage({ type:'license-updated' }); } catch {}
  }catch(e){ err(e.message); }
}

async function verifySaved(){
  const o = await api.storage.local.get(['license','signature']);
  if (!o.license || !o.signature) return info('No license found');
  ok((await verifyLicenseSignature(o)) ? 'Signature valid ✅' : 'Signature invalid ❌');
}

async function clearSaved(){
  await api.storage.local.remove(['license','signature']);
  info('License removed');
}

function bind(){
  // Локализация
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  
  // Привязываем кнопки
  $('#btnImport').addEventListener('click', ()=> file.click());
  file.addEventListener('change', ()=> file.files[0] && handleFile(file.files[0]));
  $('#btnVerify').addEventListener('click', verifySaved);
  $('#btnClear').addEventListener('click', clearSaved);
  loadSaved();
}

async function loadSaved(){
  const o = await api.storage.local.get(['license','signature']);
  if (o.license && o.signature) ok(`Found license (plan: ${o.license.plan}, exp: ${o.license.expiry || '—'})`);
  else info('No license installed');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', bind) : bind();