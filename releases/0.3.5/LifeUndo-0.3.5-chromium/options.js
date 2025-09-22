// LifeUndo Options Page - License Import & Management
import { verifyLicenseSignature } from './verifyLicense.js';

const api = (typeof browser !== 'undefined') ? browser : chrome;
const $ = s => document.querySelector(s);
const file = $('#vipFile'), st = $('#status');
const ok = m => { st.textContent = m; st.className = 'ok'; };
const err = m => { st.textContent = m; st.className = 'err'; };
const info = m => { st.textContent = m; st.className = 'muted'; };

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

function parseLifelic(txt) {
  const t = txt.trim();
  if (t.startsWith('{')) return JSON.parse(t); // JSON
  const m = t.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if (!m) throw new Error('Unknown license format');
  const b64 = m[1].replace(/[^A-Za-z0-9+/=]/g, '');
  return JSON.parse(atob(b64)); // armored -> JSON
}

async function loadSaved() {
  const { license, signature } = await api.storage.local.get(['license', 'signature']);
  if (license && signature) {
    const L = i18n[currentLang];
    ok(`${L.licenseInstalled} (plan: ${license.plan})`);
  } else {
    const L = i18n[currentLang];
    info(L.noLicense);
  }
}

async function handleFile(f) {
  try {
    const obj = parseLifelic(await f.text());
    const passed = await verifyLicenseSignature(obj);
    if (!passed) throw new Error('Signature check failed. Verify public key and format.');
    
    await api.storage.local.set({ 
      license: obj.license, 
      signature: obj.signature,
      lu_plan: obj.license.plan,
      lu_license: obj.license
    });
    
    const L = i18n[currentLang];
    ok(`${L.licenseInstalled} (plan: ${obj.license.plan})`);
    
    try { 
      await api.runtime.sendMessage({ type: 'license-updated' }); 
    } catch {}
  } catch (e) { 
    err(e.message); 
  }
}

function bind() {
  // Кнопка выбора файла
  $('#btnChoose').addEventListener('click', () => file.click());
  
  // Обработка выбранного файла
  file.addEventListener('change', () => {
    if (file.files[0]) handleFile(file.files[0]);
  });
  
  // Кнопка проверки
  $('#btnVerify').addEventListener('click', async () => {
    const obj = await api.storage.local.get(['license', 'signature']);
    if (!obj.license) {
      const L = i18n[currentLang];
      return err('No license found');
    }
    const L = i18n[currentLang];
    const isValid = await verifyLicenseSignature(obj);
    ok(isValid ? L.signatureValid : L.signatureInvalid);
  });
  
  // Кнопка удаления
  $('#btnRemove').addEventListener('click', async () => {
    await api.storage.local.remove(['license', 'signature', 'lu_plan', 'lu_license']);
    const L = i18n[currentLang];
    info(L.licenseRemoved);
    try { 
      await api.runtime.sendMessage({ type: 'license-updated' }); 
    } catch {}
  });
  
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

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', bind) : bind();

