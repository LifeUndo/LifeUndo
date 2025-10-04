// LifeUndo Popup - v0.3.7
// One-click VIP activation, unified license core, stable RU/EN

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

// License Modal Elements
const linkLicense = document.getElementById('linkLicense');
const licenseModal = document.getElementById('licenseModal');
const closeLicenseModalBtn = document.getElementById('closeLicenseModal');
const licenseBackdrop = document.getElementById('licenseBackdrop');
const licenseLevel = document.getElementById('licenseLevel');
const licenseExpires = document.getElementById('licenseExpires');
const bonusStatus = document.getElementById('bonusStatus');
const bonusExpires = document.getElementById('bonusExpires');
const resendEmailBtn = document.getElementById('resendEmailBtn');
const openAccountBtn = document.getElementById('openAccountBtn');
const bindEmail = document.getElementById('bindEmail');
const bindOrderId = document.getElementById('bindOrderId');
const bindPurchaseBtn = document.getElementById('bindPurchaseBtn');

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

// What's New modal - toggle behavior
let isModalOpen = false;
function toggleWhatsNew() {
  isModalOpen = !isModalOpen;
  if (wnModal) {
    wnModal.classList.toggle('hidden', !isModalOpen);
  }
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

// VIP activation
btnVip?.addEventListener('click', () => {
  if (btnVip.disabled) return;
  vipFile?.click();
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
  window.open('https://lifeundo.ru', '_blank');
});

document.getElementById('linkPrivacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://lifeundo.ru/privacy/', '_blank');
});

document.getElementById('linkSupport')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://t.me/lifeundo', '_blank');
});

document.getElementById('linkSettings')?.addEventListener('click', (e) => {
  e.preventDefault();
  api.runtime.openOptionsPage();
});

// ==== License Modal Functions ====
function openLicenseModal() {
  licenseModal.classList.remove('hidden');
  loadLicenseStatus();
  // Track telemetry
  if (window.LifeUndoTelemetry) {
    window.LifeUndoTelemetry.trackLicenseViewed();
  }
}

function closeLicenseModal() {
  licenseModal.classList.add('hidden');
}

function loadLicenseStatus() {
  // Get stored license info
  api.storage.local.get(['lu_plan', 'lu_email', 'lu_expires', 'lu_bonus_expires'], (result) => {
    const plan = result.lu_plan || 'free';
    const email = result.lu_email || '';
    const expires = result.lu_expires || '';
    const bonusExpires = result.lu_bonus_expires || '';

    // Update UI
    licenseLevel.textContent = plan === 'free' ? 'No active license' : plan.toUpperCase();
    licenseExpires.textContent = expires || '-';
    
    if (bonusExpires) {
      bonusStatus.style.display = 'block';
      bonusExpires.textContent = bonusExpires;
    } else {
      bonusStatus.style.display = 'none';
    }

    // Pre-fill email if available
    if (email) {
      bindEmail.value = email;
    }
  });
}

function resendActivationEmail() {
  // Track telemetry
  if (window.LifeUndoTelemetry) {
    window.LifeUndoTelemetry.trackResendClicked();
  }

  api.storage.local.get(['lu_email'], (result) => {
    const email = result.lu_email;
    if (!email) {
      showFlash('Please enter your email first', 'err');
      return;
    }

    fetch('https://getlifeundo.com/api/account/resend-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        showFlash('Activation email sent!', 'ok');
      } else {
        showFlash('Error: ' + (data.error || 'Unknown error'), 'err');
      }
    })
    .catch(error => {
      showFlash('Network error: ' + error.message, 'err');
    });
  });
}

function openAccountPage() {
  // Track telemetry
  if (window.LifeUndoTelemetry) {
    window.LifeUndoTelemetry.trackAccountOpened();
  }

  api.storage.local.get(['lu_email'], (result) => {
    const email = result.lu_email || '';
    const url = `https://getlifeundo.com/ru/account${email ? '?email=' + encodeURIComponent(email) : ''}`;
    window.open(url, '_blank');
  });
}

function bindPurchase() {
  const email = bindEmail.value.trim();
  const orderId = bindOrderId.value.trim();

  if (!email || !orderId) {
    showFlash('Please enter both email and order ID', 'err');
    return;
  }

  // Call payment summary API
  fetch(`https://getlifeundo.com/api/payment/summary?order_id=${encodeURIComponent(orderId)}`)
    .then(response => response.json())
    .then(data => {
      if (data.ok && data.email === email) {
        // Store license info
        api.storage.local.set({
          lu_plan: data.level || 'pro',
          lu_email: email,
          lu_expires: data.expires_at || '',
          lu_bonus_expires: data.bonus_expires_at || ''
        });
        
        showFlash('Purchase bound successfully!', 'ok');
        loadLicenseStatus();
        refreshVipUi();
        
        // Track successful bind
        if (window.LifeUndoTelemetry) {
          window.LifeUndoTelemetry.trackBindAttempted(true);
        }
      } else {
        showFlash('Order not found or email mismatch', 'err');
        
        // Track failed bind
        if (window.LifeUndoTelemetry) {
          window.LifeUndoTelemetry.trackBindAttempted(false);
        }
      }
    })
    .catch(error => {
      showFlash('Error: ' + error.message, 'err');
      
      // Track failed bind
      if (window.LifeUndoTelemetry) {
        window.LifeUndoTelemetry.trackBindAttempted(false);
      }
    });
}

// ==== Event Listeners ====
linkLicense?.addEventListener('click', (e) => {
  e.preventDefault();
  openLicenseModal();
});

closeLicenseModalBtn?.addEventListener('click', closeLicenseModal);
licenseBackdrop?.addEventListener('click', closeLicenseModal);
resendEmailBtn?.addEventListener('click', resendActivationEmail);
openAccountBtn?.addEventListener('click', openAccountPage);
bindPurchaseBtn?.addEventListener('click', bindPurchase);

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

// Initialize UI
applyLang();
refreshVipUi();