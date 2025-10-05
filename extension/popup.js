// LifeUndo Popup - v0.3.7.14
// Firefox hotfix: enable free features, fix links, add basic functionality

const api = window.browser || window.chrome;

// ==== DOM Elements ====
const btnVip = document.getElementById('btnVip');
const btnPro = document.getElementById('btnPro');
const upgradeBtn = document.getElementById('upgradeBtn');
const vipFile = document.getElementById('vipFile');
const flashEl = document.getElementById('flash');
const planTag = document.getElementById('planLabel');
const whatsNewBtn = document.getElementById('btnWhatsNew');
const wnModal = document.getElementById('wnModal');
const versionTag = document.getElementById('version');

// Lists
const textList = document.getElementById('textList');
const tabList = document.getElementById('tabList');
const clipList = document.getElementById('clipList');

// Pro badges
const textProBadge = document.getElementById('textProBadge');
const tabProBadge = document.getElementById('tabProBadge');
const clipProBadge = document.getElementById('clipProBadge');

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

// ==== Firefox Detection ====
const IS_FIREFOX = typeof browser !== 'undefined' && /Firefox/i.test(navigator.userAgent);

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
    whats_new_title: "What's new (v0.3.7.14)",
    whats_new_points: [
      "Fixed popup links and i18n",
      "Enabled free features for Firefox",
      "Added basic functionality",
      "Improved UI consistency"
    ],
    status_importing: "Importing...",
    status_vip_ok: "VIP activated ✅",
    status_import_err: "Import error: ",
    no_data: "No data yet",
    click_to_restore: "Click to restore",
    clipboard_empty: "Clipboard history will appear here"
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
    whats_new_title: "Что нового (v0.3.7.14)",
    whats_new_points: [
      "Исправлены ссылки в попапе и i18n",
      "Включены бесплатные функции для Firefox",
      "Добавлена базовая функциональность",
      "Улучшена консистентность UI"
    ],
    status_importing: "Импорт...",
    status_vip_ok: "VIP активирован ✅",
    status_import_err: "Ошибка импорта: ",
    no_data: "Пока нет данных",
    click_to_restore: "Нажмите для восстановления",
    clipboard_empty: "История буфера появится здесь"
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
  const linkLicense = document.getElementById('linkLicense');
  
  if (linkWebsite) linkWebsite.textContent = t('footer_website');
  if (linkPrivacy) linkPrivacy.textContent = t('footer_privacy');
  if (linkSupport) linkSupport.textContent = t('footer_support');
  if (linkLicense) linkLicense.textContent = t('footer_license');
  
  // Update What's New modal
  const wnTitle = document.querySelector('#wnModal h3');
  const wnList = document.querySelector('#wnModal ul');
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

// ==== Firefox Free Features ====
async function loadTextInputs() {
  try {
    const { recentInputs = [] } = await api.storage.local.get('recentInputs');
    
    if (textList) {
      if (recentInputs.length === 0) {
        textList.innerHTML = `<div class="item muted">${t('no_data')}</div>`;
      } else {
        textList.innerHTML = recentInputs.slice(0, 5).map((input, i) => `
          <div class="item" data-index="${i}">
            <div class="mono">${input.text.substring(0, 50)}${input.text.length > 50 ? '...' : ''}</div>
            <div class="muted">${new Date(input.timestamp).toLocaleString()}</div>
          </div>
        `).join('');
      }
    }
  } catch (e) {
    console.error('Error loading text inputs:', e);
    if (textList) textList.innerHTML = `<div class="item muted">${t('no_data')}</div>`;
  }
}

async function loadRecentTabs() {
  try {
    const sessions = await api.sessions.getRecentlyClosed({ maxResults: 5 });
    
    if (tabList) {
      if (sessions.length === 0) {
        tabList.innerHTML = `<div class="item muted">${t('no_data')}</div>`;
      } else {
        tabList.innerHTML = sessions.map((session, i) => `
          <div class="item" data-session-id="${session.tab?.sessionId}">
            <div>${session.tab?.title || 'Untitled'}</div>
            <div class="muted">${session.tab?.url || ''}</div>
          </div>
        `).join('');
      }
    }
  } catch (e) {
    console.error('Error loading recent tabs:', e);
    if (tabList) tabList.innerHTML = `<div class="item muted">${t('no_data')}</div>`;
  }
}

async function loadClipboardHistory() {
  try {
    const { clipboardHistory = [] } = await api.storage.local.get('clipboardHistory');
    
    if (clipList) {
      if (clipboardHistory.length === 0) {
        clipList.innerHTML = `<div class="item muted">${t('clipboard_empty')}</div>`;
      } else {
        clipList.innerHTML = clipboardHistory.slice(0, 5).map((item, i) => `
          <div class="item" data-index="${i}">
            <div class="mono">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</div>
            <div class="muted">${new Date(item.timestamp).toLocaleString()}</div>
          </div>
        `).join('');
      }
    }
  } catch (e) {
    console.error('Error loading clipboard history:', e);
    if (clipList) clipList.innerHTML = `<div class="item muted">${t('clipboard_empty')}</div>`;
  }
}

// ==== Event Handlers ====
async function restoreTab(sessionId) {
  try {
    await api.sessions.restore(sessionId);
    flash('Tab restored!', 'ok');
  } catch (e) {
    console.error('Error restoring tab:', e);
    flash('Failed to restore tab', 'err');
  }
}

// ==== What's New Modal ====
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

// Upgrade button
upgradeBtn?.addEventListener('click', () => {
  const locale = currentLang === 'ru' ? 'ru' : 'en';
  api.tabs.create({ url: `https://getlifeundo.com/${locale}/pricing#pro` });
});

// What's New modal
whatsNewBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  toggleWhatsNew();
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
  api.tabs.create({ url: 'https://getlifeundo.com' });
});

document.getElementById('linkPrivacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  const locale = currentLang === 'ru' ? 'ru' : 'en';
  api.tabs.create({ url: `https://getlifeundo.com/${locale}/privacy` });
});

document.getElementById('linkSupport')?.addEventListener('click', (e) => {
  e.preventDefault();
  api.tabs.create({ url: 'https://t.me/GetLifeUndoSupport' });
});

document.getElementById('linkLicense')?.addEventListener('click', (e) => {
  e.preventDefault();
  const locale = currentLang === 'ru' ? 'ru' : 'en';
  api.tabs.create({ url: `https://getlifeundo.com/${locale}/legal/offer` });
});

// Tab list click handlers
tabList?.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item && item.dataset.sessionId) {
    restoreTab(item.dataset.sessionId);
  }
});

// ==== License Modal Functions ====
function openLicenseModal() {
  licenseModal.classList.remove('hidden');
  loadLicenseStatus();
}

function closeLicenseModal() {
  licenseModal.classList.add('hidden');
}

function loadLicenseStatus() {
  api.storage.local.get(['lu_plan', 'lu_email', 'lu_expires', 'lu_bonus_expires'], (result) => {
    const plan = result.lu_plan || 'free';
    const email = result.lu_email || '';
    const expires = result.lu_expires || '';
    const bonusExpires = result.lu_bonus_expires || '';

    if (licenseLevel) licenseLevel.textContent = plan === 'free' ? 'No active license' : plan.toUpperCase();
    if (licenseExpires) licenseExpires.textContent = expires || '-';
    
    if (bonusExpires && bonusStatus) {
      bonusStatus.style.display = 'block';
      bonusExpires.textContent = bonusExpires;
    } else if (bonusStatus) {
      bonusStatus.style.display = 'none';
    }

    if (email && bindEmail) {
      bindEmail.value = email;
    }
  });
}

function resendActivationEmail() {
  api.storage.local.get(['lu_email'], (result) => {
    const email = result.lu_email;
    if (!email) {
      flash('Please enter your email first', 'err');
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
        flash('Activation email sent!', 'ok');
      } else {
        flash('Error: ' + (data.error || 'Unknown error'), 'err');
      }
    })
    .catch(error => {
      flash('Network error: ' + error.message, 'err');
    });
  });
}

function openAccountPage() {
  api.storage.local.get(['lu_email'], (result) => {
    const email = result.lu_email || '';
    const url = `https://getlifeundo.com/ru/account${email ? '?email=' + encodeURIComponent(email) : ''}`;
    api.tabs.create({ url });
  });
}

function bindPurchase() {
  const email = bindEmail.value.trim();
  const orderId = bindOrderId.value.trim();

  if (!email || !orderId) {
    flash('Please enter both email and order ID', 'err');
    return;
  }

  fetch(`https://getlifeundo.com/api/payment/summary?order_id=${encodeURIComponent(orderId)}`)
    .then(response => response.json())
    .then(data => {
      if (data.ok && data.email === email) {
        api.storage.local.set({
          lu_plan: data.level || 'pro',
          lu_email: email,
          lu_expires: data.expires_at || '',
          lu_bonus_expires: data.bonus_expires_at || ''
        });
        
        flash('Purchase bound successfully!', 'ok');
        loadLicenseStatus();
        refreshVipUi();
      } else {
        flash('Order not found or email mismatch', 'err');
      }
    })
    .catch(error => {
      flash('Error: ' + error.message, 'err');
    });
}

// License Modal Event Listeners
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

// Load data for Firefox (enable free features)
if (IS_FIREFOX) {
  // Hide PRO badges for Firefox
  if (textProBadge) textProBadge.classList.add('hidden');
  if (tabProBadge) tabProBadge.classList.add('hidden');
  if (clipProBadge) clipProBadge.classList.add('hidden');
  
  // Load data
  loadTextInputs();
  loadRecentTabs();
  loadClipboardHistory();
}