// LifeUndo Options Page - Firefox v0.3.5
const api = (typeof browser !== 'undefined') ? browser : chrome;

const $ = s => document.querySelector(s);
const file = $('#vipFile'), st = $('#status');
const ok  = m => { st.textContent = m; st.className = 'ok';    };
const err = m => { st.textContent = m; st.className = 'err';   };
const info= m => { st.textContent = m; st.className = 'muted'; };

// Локализация
const i18n = {
  en: {
    choose: "Choose .lifelic",
    import: "Import",
    verify: "Verify", 
    remove: "Remove",
    noLicense: "No license installed",
    licenseInstalled: "License installed ✅",
    signatureValid: "Signature valid ✅",
    signatureInvalid: "Signature invalid ❌",
    licenseRemoved: "License removed",
    hints: [
      "Download .lifelic file from website after purchase",
      "Click 'Choose .lifelic' and select the file",
      "Click 'Import' to activate the license"
    ]
  },
  ru: {
    choose: "Выбрать .lifelic",
    import: "Импортировать",
    verify: "Проверить",
    remove: "Удалить", 
    noLicense: "Лицензия не установлена",
    licenseInstalled: "Лицензия установлена ✅",
    signatureValid: "Подпись корректна ✅",
    signatureInvalid: "Подпись некорректна ❌",
    licenseRemoved: "Лицензия удалена",
    hints: [
      "Скачайте файл .lifelic с сайта после покупки",
      "Нажмите 'Выбрать .lifelic' и выберите файл", 
      "Нажмите 'Импортировать' для активации лицензии"
    ]
  }
};

let currentLang = 'ru';

function applyLang() {
  const L = i18n[currentLang];
  $('#btnChoose').textContent = L.choose;
  $('#btnImport').textContent = L.import;
  $('#btnVerify').textContent = L.verify;
  $('#btnRemove').textContent = L.remove;
  
  const hints = $('#hints');
  hints.innerHTML = L.hints.map(hint => `<li>${hint}</li>`).join('');
}

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
    
    await api.storage.local.set({ 
      license: obj.license, 
      signature: obj.signature,
      lu_plan: obj.license.plan,
      lu_license: obj.license
    });
    
    const L = i18n[currentLang];
    ok(`${L.licenseInstalled} (plan: ${obj.license.plan})`);
    
    try { 
      await api.runtime.sendMessage({ type:'license-updated' }); 
    } catch {}
  }catch(e){ 
    err(e.message); 
  }
}

async function verifySaved(){
  const o = await api.storage.local.get(['license','signature']);
  if (!o.license || !o.signature) {
    const L = i18n[currentLang];
    return info('No license found');
  }
  const L = i18n[currentLang];
  const isValid = await verifyLicenseSignature(o);
  ok(isValid ? L.signatureValid : L.signatureInvalid);
}

async function clearSaved(){
  await api.storage.local.remove(['license','signature','lu_plan','lu_license']);
  const L = i18n[currentLang];
  info(L.licenseRemoved);
  try { 
    await api.runtime.sendMessage({ type:'license-updated' }); 
  } catch {}
}

function bind(){
  // Локализация
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  
  // Привязываем кнопки
  $('#btnChoose').addEventListener('click', ()=> file.click());
  file.addEventListener('change', ()=> file.files[0] && handleFile(file.files[0]));
  $('#btnVerify').addEventListener('click', verifySaved);
  $('#btnRemove').addEventListener('click', clearSaved);
  
  // Переключение языка (простая реализация)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l') {
      currentLang = currentLang === 'ru' ? 'en' : 'ru';
      applyLang();
      loadSaved();
    }
  });
  
  applyLang();
  loadSaved();
}

async function loadSaved(){
  const o = await api.storage.local.get(['license','signature']);
  if (o.license && o.signature) {
    const L = i18n[currentLang];
    ok(`${L.licenseInstalled} (plan: ${o.license.plan})`);
  } else {
    const L = i18n[currentLang];
    info(L.noLicense);
  }
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', bind) : bind();