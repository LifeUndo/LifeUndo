// LifeUndo Popup - v0.3.7.17
// Firefox free mode enabled, enhanced content script, fixed data collection

const api = window.browser || window.chrome;

// ==== DOM Elements ====
const btnVip = document.getElementById('btnVip');
const btnPro = document.getElementById('btnPro');
const vipFile = document.getElementById('vipFile');
const flashEl = document.getElementById('flash');
const planTag = document.getElementById('planLabel');
const whatsNewBtn = document.getElementById('btnWhatsNew');
const wnModal = document.getElementById('wnModal');
const versionTag = document.getElementById('version');
const btnEN = document.getElementById('btnEN');
const btnRU = document.getElementById('btnRU');
const linkWebsite = document.getElementById('linkWebsite');
const linkPrivacy = document.getElementById('linkPrivacy');
const linkSupport = document.getElementById('linkSupport');
const linkSettings = document.getElementById('linkSettings');

// ==== I18n ====
let currentLang = navigator.language.split('-')[0] || 'en';

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
    footer_privacy: "Конфиденциальность",
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
  return (i18n[currentLang] && i18n[currentLang][key]) || key;
}

function applyLang() {
  // Update UI texts
  if (planTag) planTag.textContent = t('badge_free');
  if (btnVip) btnVip.textContent = t('btn_activate_vip');
  if (btnPro) btnPro.textContent = t('btn_upgrade_pro');
  if (whatsNewBtn) whatsNewBtn.textContent = t('whats_new');

  // Update footer links
  if (linkWebsite) linkWebsite.textContent = t('footer_website');
  if (linkPrivacy) linkPrivacy.textContent = t('footer_privacy');
  if (linkSupport) linkSupport.textContent = t('footer_support');
  if (linkSettings) linkSettings.textContent = t('footer_license');

  // Localize any [data-i18n] elements (headings etc.)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const msg = t(key);
    if (msg && msg !== key) el.textContent = msg;
  });

  // Update What's New modal
  const wnTitle = document.getElementById('wnTitle');
  const wnList = document.getElementById('wnList');
  if (wnTitle) wnTitle.textContent = t('whats_new_title');
  if (wnList && Array.isArray(i18n[currentLang].whats_new_points)) {
    wnList.innerHTML = i18n[currentLang].whats_new_points.map(point => `<li>${point}</li>`).join('');
  }

  // Refresh VIP UI after language change
  refreshVipUi();
}

// ==== Event Listeners ====

// Pro button → /pricing (RU) or /en/pricing (EN)
(function() {
  const el = document.getElementById('btnPro');
  if (!el) return;
  try {
    const lang = currentLang;
    const href = lang === 'ru' ? 'https://getlifeundo.com/ru/pricing' : 'https://getlifeundo.com/en/pricing';
    el.addEventListener('click', () => { try { browser.tabs.create({ url: href }); } catch(_) { window.open(href, '_blank'); } });
  } catch (e) {
    el.addEventListener('click', () => window.open('https://getlifeundo.com/en/pricing', '_blank'));
  }
})();

// Language switching
btnEN?.addEventListener('click', () => {
  currentLang = 'en';
  localStorage.setItem('lu_lang', 'en');
  applyLang();
});

btnRU?.addEventListener('click', () => {
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
    const lang = currentLang;
    const href = lang === 'ru' ? 'https://getlifeundo.com/ru/buy' : 'https://getlifeundo.com/en/buy';
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

// Footer links
linkWebsite?.addEventListener('click', (e) => {
  e.preventDefault();
  const lang = currentLang;
  const href = lang === 'ru' ? 'https://getlifeundo.com/ru' : 'https://getlifeundo.com/en';
  window.open(href, '_blank');
});

linkPrivacy?.addEventListener('click', (e) => {
  e.preventDefault();
  const lang = currentLang;
  const href = lang === 'ru' ? 'https://getlifeundo.com/ru/privacy' : 'https://getlifeundo.com/en/privacy';
  window.open(href, '_blank');
});

linkSupport?.addEventListener('click', (e) => {
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