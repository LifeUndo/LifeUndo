// LifeUndo Popup - v0.3.7.17
// Firefox free mode enabled, enhanced content script, fixed data collection

const api = window.browser || window.chrome;

// ==== DOM Elements ====
const btnVip = document.getElementById('btnVip');
const btnPro = document.getElementById('btnPro');
const vipFile = document.getElementById('vipFile');
const flashEl = document.getElementById('flash');
const planTag = document.getElementById('planLabel');
const whatsNewBtn = document.getElementById('whatsNewBtn');
const wnModal = document.getElementById('wnModal');
const wnClose = document.getElementById('wnClose');
const versionTag = document.getElementById('versionTag');

// ==== I18n ====
let currentLang = 'en';
const i18n = {
  en: {
    badge_free: "Free Version",
    badge_vip: "VIP",
    btn_activate_vip: "Activate VIP",
    btn_vip_active: "VIP active",
    btn_upgrade_pro: "Upgrade to Pro",
    footer_website: "Website",
    footer_privacy: "Privacy", 
    footer_support: "Support",
    footer_license: "License",
    whats_new: "What's new",
    whats_new_title: "What's new (v0.3.7)",
    whats_new_points: [
      "One-click VIP activation from popup",
      "Unified license verification core",
      "Stable RU/EN switching and UI polish"
    ],
    status_importing: "Importing...",
    status_vip_ok: "VIP activated ✅",
    status_import_err: "Import error: "
  },
  ru: {
    badge_free: "Бесплатная версия",
    badge_vip: "VIP",
    btn_activate_vip: "Активировать VIP",
    btn_vip_active: "VIP активен",
    btn_upgrade_pro: "Перейти на Pro",
    footer_website: "Сайт",
    footer_privacy: "Приватность",
    footer_support: "Поддержка", 
    footer_license: "Лицензия",
    whats_new: "Что нового",
    whats_new_title: "Что нового (v0.3.7)",
    whats_new_points: [
      "Активация VIP одним кликом из попапа",
      "Единое ядро проверки лицензий",
      "Стабильное переключение RU/EN и полировка UI"
    ],
    status_importing: "Импорт...",
    status_vip_ok: "VIP активирован ✅",
    status_import_err: "Ошибка импорта: "
  }
};

// ==== Functions ====

async function isFirefox() {
  try {
    const info = await (api.runtime.getBrowserInfo?.() || Promise.resolve(null));
    return !!info && /firefox|gecko/i.test(`${info.name} ${info.vendor || ''}`);
  } catch { 
    return /firefox/i.test(navigator.userAgent); 
  }
}

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyLang() {
  // Update UI texts
  if (planTag) planTag.textContent = t('badge_free');
  if (btnVip) btnVip.textContent = t('btn_activate_vip');
  if (btnPro) btnPro.textContent = t('btn_upgrade_pro');
  if (whatsNewBtn) whatsNewBtn.textContent = t('whats_new');
  
  // Update footer links
  const linkWebsite = document.getElementById('linkWebsite');
  const linkPrivacy = document.getElementById('linkPrivacy');
  const linkSupport = document.getElementById('linkSupport');
  const linkSettings = document.getElementById('linkSettings');
  
  if (linkWebsite) linkWebsite.textContent = t('footer_website');
  if (linkPrivacy) linkPrivacy.textContent = t('footer_privacy');
  if (linkSupport) linkSupport.textContent = t('footer_support');
  if (linkSettings) linkSettings.textContent = t('footer_license');
  
  // Update What's New modal
  const wnTitle = document.getElementById('wnTitle');
  const wnList = document.getElementById('wnList');
  if (wnTitle) wnTitle.textContent = t('whats_new_title');
  if (wnList) {
    wnList.innerHTML = t('whats_new_points').map(point => `<li>${point}</li>`).join('');
  }
  
  // Refresh VIP UI after language change
  refreshVipUi();
}

function flash(message, type = '') {
  if (!flashEl) return;
  flashEl.textContent = message || '';
  flashEl.className = type ? `flash ${type}` : 'flash';
}

async function refreshVipUi() {
  const { lu_plan } = await api.storage.local.get('lu_plan');
  const isVip = lu_plan === 'vip';
  const isFirefoxBrowser = await isFirefox();
  
  if (isVip) {
    setVipUiOn();
  } else if (isFirefoxBrowser) {
    setFirefoxFreeUi();
  } else {
    setVipUiOff();
  }
}

function setVipUiOn() {
  if (planTag) planTag.textContent = t('badge_vip');
  document.querySelectorAll('.pro').forEach(el => el.style.display = 'none');
  
  if (btnVip) {
    btnVip.textContent = t('btn_vip_active');
    btnVip.classList.add('is-disabled');
    btnVip.disabled = true;
  }
  
  if (btnPro) btnPro.style.display = 'none';
}

function setFirefoxFreeUi() {
  if (planTag) planTag.textContent = t('badge_free');
  
  // Show all sections for Firefox free mode
  document.querySelectorAll('.pro').forEach(el => el.style.display = '');
  
  if (btnVip) {
    btnVip.textContent = t('btn_activate_vip');
    btnVip.classList.remove('is-disabled');
    btnVip.disabled = false;
  }
  
  if (btnPro) btnPro.style.display = '';
  
  // Enable data collection features for Firefox
  window.LU_FEATURE_LEVEL = 'free-firefox';
}

function setVipUiOff() {
  if (planTag) planTag.textContent = t('badge_free');
  document.querySelectorAll('.pro').forEach(el => el.style.display = '');
  
  if (btnVip) {
    btnVip.textContent = t('btn_activate_vip');
    btnVip.classList.remove('is-disabled');
    btnVip.disabled = false;
  }
  
  if (btnPro) btnPro.style.display = '';
}

// What's New modal - toggle behavior
let isModalOpen = false;
function toggleWhatsNew() {
  isModalOpen = !isModalOpen;
  if (wnModal) {
    wnModal.classList.toggle('hidden', !isModalOpen);
  }
}

// ==== Event Listeners ====

// Pro button → /pricing (RU) or /en/pricing (EN)
(function() {
  const el = document.getElementById('btnPro');
  if (!el) return;
  try {
    const lang = (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
    const href = lang === 'ru' ? 'https://lifeundo.ru/pricing' : 'https://www.getlifeundo.com/pricing';
    el.addEventListener('click', () => { try { browser.tabs.create({ url: href }); } catch(_) { window.open(href, '_blank'); } });
  } catch (e) {
    el.addEventListener('click', () => window.open('https://www.getlifeundo.com/pricing', '_blank'));
  }
})();

// Language switching
document.getElementById('btnEN')?.addEventListener('click', () => {
  currentLang = 'en';
  localStorage.setItem('lu_lang', 'en');
  applyLang();
});

document.getElementById('btnRU')?.addEventListener('click', () => {
  currentLang = 'ru';
  localStorage.setItem('lu_lang', 'ru');
  applyLang();
});

// VIP activation
btnVip?.addEventListener('click', () => {
  if (btnVip.disabled) return;
  
  // Check if VIP is already active
  const { lu_plan } = api.storage.local.get('lu_plan');
  if (lu_plan === 'vip') {
    // VIP is active, open buy page
    const lang = (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
    const href = lang === 'ru' ? 'https://lifeundo.ru/buy' : 'https://www.getlifeundo.com/buy';
    try { 
      browser.tabs.create({ url: href }); 
    } catch(_) { 
      window.open(href, '_blank'); 
    }
  } else {
    // VIP not active, show file picker
    vipFile?.click();
  }
});

// VIP file import
vipFile?.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  if (!file) return;
  
  try {
    flash(t('status_importing'));
    const lic = await LicenseCore.importFromFile(file, null);
    flash(t('status_vip_ok'), 'ok');
  } catch (e) {
    console.error('VIP import error:', e);
    flash(t('status_import_err') + e.message, 'err');
  } finally {
    ev.target.value = '';
  }
});

// What's New modal
whatsNewBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  toggleWhatsNew();
});

wnClose?.addEventListener('click', () => {
  isModalOpen = false;
  if (wnModal) wnModal.classList.add('hidden');
});

// Close modal on backdrop click or ESC
wnModal?.addEventListener('click', (e) => {
  if (e.target === wnModal) {
    isModalOpen = false;
    wnModal.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isModalOpen) {
    isModalOpen = false;
    if (wnModal) wnModal.classList.add('hidden');
  }
});

// Footer links
document.getElementById('linkWebsite')?.addEventListener('click', (e) => {
  e.preventDefault();
  const lang = (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  const href = lang === 'ru' ? 'https://lifeundo.ru' : 'https://www.getlifeundo.com';
  window.open(href, '_blank');
});

document.getElementById('linkPrivacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  const lang = (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  const href = lang === 'ru' ? 'https://lifeundo.ru/privacy' : 'https://www.getlifeundo.com/privacy';
  window.open(href, '_blank');
});

document.getElementById('linkSupport')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://t.me/LifeUndoSupport', '_blank');
});

document.getElementById('linkSettings')?.addEventListener('click', (e) => {
  e.preventDefault();
  api.runtime.openOptionsPage();
});

// Storage change listener for live VIP updates
api.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.lu_plan) {
    refreshVipUi();
  }
});

// ==== Initialize ====
// Set version in modal
try {
  const v = api.runtime?.getManifest?.()?.version || '';
  if (versionTag) versionTag.textContent = v ? `(v${v})` : '';
} catch {}

// Load saved language
currentLang = localStorage.getItem('lu_lang') || 'en';

// Initialize UI with Firefox free mode
(async () => {
  const isFirefoxBrowser = await isFirefox();
  if (isFirefoxBrowser) {
    window.LU_FEATURE_LEVEL = 'free-firefox';
  }
  
  applyLang();
  refreshVipUi();
})();