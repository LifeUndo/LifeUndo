// LifeUndo Options - v0.3.7
// Unified license core, UTF-8 support, RU/EN localization

const api = window.browser || window.chrome;

// ==== DOM Elements ====
const vipFile = document.getElementById('vipFile');
const btnChoose = document.getElementById('btnChoose');
const btnImport = document.getElementById('btnImport');
const btnVerify = document.getElementById('btnVerify');
const btnRemove = document.getElementById('btnRemove');
const statusEl = document.getElementById('status');
const hintsEl = document.getElementById('hints');

// ==== I18n ====
let currentLang = 'en';
const i18n = {
  en: {
    options_title: "LifeUndo Settings",
    opt_choose: "Choose .lifelic",
    opt_import: "Import",
    opt_verify: "Verify",
    opt_remove: "Remove",
    opt_hint1: "Download .lifelic file from website after purchase",
    opt_hint2: "Click 'Choose .lifelic' and select the file",
    opt_hint3: "Click 'Import' to activate the license",
    status_no_license: "No license installed",
    status_license_installed: "License installed ✅",
    status_signature_valid: "Signature valid ✅",
    status_signature_invalid: "Signature invalid ❌",
    status_license_removed: "License removed",
    status_importing: "Importing...",
    status_verifying: "Verifying..."
  },
  ru: {
    options_title: "Настройки LifeUndo",
    opt_choose: "Выбрать .lifelic",
    opt_import: "Импортировать",
    opt_verify: "Проверить",
    opt_remove: "Удалить",
    opt_hint1: "Скачайте файл .lifelic с сайта после покупки",
    opt_hint2: "Нажмите 'Выбрать .lifelic' и выберите файл",
    opt_hint3: "Нажмите 'Импортировать' для активации лицензии",
    status_no_license: "Лицензия не установлена",
    status_license_installed: "Лицензия установлена ✅",
    status_signature_valid: "Подпись корректна ✅",
    status_signature_invalid: "Подпись некорректна ❌",
    status_license_removed: "Лицензия удалена",
    status_importing: "Импорт...",
    status_verifying: "Проверка..."
  }
};

// ==== Functions ====

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyLang() {
  // Update title
  document.title = t('options_title');
  
  // Update buttons
  if (btnChoose) btnChoose.textContent = t('opt_choose');
  if (btnImport) btnImport.textContent = t('opt_import');
  if (btnVerify) btnVerify.textContent = t('opt_verify');
  if (btnRemove) btnRemove.textContent = t('opt_remove');
  
  // Update hints
  if (hintsEl) {
    hintsEl.innerHTML = `
      <li>${t('opt_hint1')}</li>
      <li>${t('opt_hint2')}</li>
      <li>${t('opt_hint3')}</li>
    `;
  }
  
  // Update status
  updateStatus();
}

function updateStatus() {
  // Check current license status and update UI
  api.storage.local.get(['lu_plan', 'license']).then(({ lu_plan, license }) => {
    if (lu_plan === 'vip' && license) {
      if (statusEl) statusEl.textContent = `${t('status_license_installed')} (plan: ${license.plan || 'vip'})`;
    } else {
      if (statusEl) statusEl.textContent = t('status_no_license');
    }
  });
}

function setStatus(message, type = '') {
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = type ? `status ${type}` : 'status';
  }
}

async function handleFile(file) {
  if (!file) return;
  
  try {
    setStatus(t('status_importing'));
    const lic = await LicenseCore.importFromFile(file, null);
    setStatus(`${t('status_license_installed')} (plan: ${lic.license.plan})`, 'success');
    
    // Notify popup about license update
    try {
      await api.runtime.sendMessage({ type: 'license-updated' });
    } catch (e) {
      // Popup might not be open, ignore
    }
  } catch (e) {
    console.error('License import error:', e);
    setStatus(t('status_signature_invalid') + ': ' + e.message, 'error');
  }
}

async function verifyCurrentLicense() {
  try {
    setStatus(t('status_verifying'));
    const { lu_license } = await api.storage.local.get('lu_license');
    
    if (!lu_license) {
      setStatus(t('status_no_license'));
      return;
    }
    
    const isValid = await LicenseCore.verifyLicenseFlexible(lu_license, null);
    if (isValid) {
      setStatus(t('status_signature_valid'));
    } else {
      setStatus(t('status_signature_invalid'));
    }
  } catch (e) {
    console.error('License verification error:', e);
    setStatus(t('status_signature_invalid') + ': ' + e.message, 'error');
  }
}

async function removeLicense() {
  await api.storage.local.remove(['lu_plan', 'lu_license', 'license', 'signature']);
  setStatus(t('status_license_removed'));
  
  // Notify popup about license removal
  try {
    await api.runtime.sendMessage({ type: 'license-updated' });
  } catch (e) {
    // Popup might not be open, ignore
  }
}

// ==== Event Listeners ====

// Choose file button
btnChoose?.addEventListener('click', () => {
  vipFile?.click();
});

// File input change
vipFile?.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  await handleFile(file);
  ev.target.value = ''; // Reset input
});

// Import button
btnImport?.addEventListener('click', async () => {
  const file = vipFile?.files?.[0];
  await handleFile(file);
});

// Verify button
btnVerify?.addEventListener('click', verifyCurrentLicense);

// Remove button
btnRemove?.addEventListener('click', removeLicense);

// Language switching (Ctrl+L)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    currentLang = currentLang === 'en' ? 'ru' : 'en';
    localStorage.setItem('lu_lang', currentLang);
    applyLang();
  }
});

// ==== Initialize ====
// Load saved language
currentLang = localStorage.getItem('lu_lang') || 'en';

// Initialize UI
applyLang();
updateStatus();