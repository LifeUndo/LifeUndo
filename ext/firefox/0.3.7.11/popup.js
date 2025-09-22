// LifeUndo Popup - v0.3.7.11
// Pro button opens pricing RU/EN, VIP opens options

const api = window.browser || window.chrome;

// ==== DOM Elements ====
const btnVip = document.getElementById('btnVip');
const btnPro = document.getElementById('btnPro');
const vipFile = document.getElementById('vipFile');
const flashEl = document.getElementById('flash');
const planTag = document.getElementById('planLabel');
const whatsNewBtn = document.getElementById('btnWhatsNew');
const wnModal = document.getElementById('wnModal');

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
    footer_fund: "Fund",
    footer_license: "License",
    whats_new: "What's new",
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
    footer_fund: "Фонд", 
    footer_license: "Лицензия",
    whats_new: "Что нового",
    status_importing: "Импорт...",
    status_vip_ok: "VIP активирован ✅",
    status_import_err: "Ошибка импорта: "
  }
};

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyLang() {
  if (planTag) planTag.textContent = t('badge_free');
  if (btnVip) btnVip.textContent = t('btn_activate_vip');
  if (btnPro) btnPro.textContent = t('btn_upgrade_pro');
  if (whatsNewBtn) whatsNewBtn.textContent = t('whats_new');
  
  const linkWebsite = document.getElementById('linkWebsite');
  const linkPrivacy = document.getElementById('linkPrivacy');
  const linkSupport = document.getElementById('linkSupport');
  const linkFund = document.getElementById('linkFund');
  const linkSettings = document.getElementById('linkSettings');
  
  if (linkWebsite) linkWebsite.textContent = t('footer_website');
  if (linkPrivacy) linkPrivacy.textContent = t('footer_privacy');
  if (linkSupport) linkSupport.textContent = t('footer_support');
  if (linkFund) linkFund.textContent = t('footer_fund');
  if (linkSettings) linkSettings.textContent = t('footer_license');
  
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
  
  if (isVip) {
    setVipUiOn();
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

// ==== Event Listeners ====

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

// Pro button - opens pricing page based on language
btnPro?.addEventListener('click', () => {
  const pricingUrl = currentLang === 'ru' 
    ? 'https://lifeundo.ru/pricing/'
    : 'https://lifeundo.ru/en/pricing/';
  api.tabs.create({ url: pricingUrl });
});

// VIP button - opens options page
btnVip?.addEventListener('click', () => {
  if (btnVip.disabled) return;
  api.runtime.openOptionsPage();
});

// What's New modal
let isModalOpen = false;
whatsNewBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  isModalOpen = !isModalOpen;
  if (wnModal) {
    wnModal.classList.toggle('hidden', !isModalOpen);
  }
});

// Close modal
wnModal?.addEventListener('click', (e) => {
  if (e.target === wnModal || e.target.closest('[data-wn-close]')) {
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
document.getElementById('linkFund')?.addEventListener('click', (e) => {
  e.preventDefault();
  const fundUrl = currentLang === 'ru' 
    ? 'https://lifeundo.ru/fund/'
    : 'https://lifeundo.ru/en/fund/';
  api.tabs.create({ url: fundUrl });
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
currentLang = localStorage.getItem('lu_lang') || 'en';
applyLang();
refreshVipUi();
