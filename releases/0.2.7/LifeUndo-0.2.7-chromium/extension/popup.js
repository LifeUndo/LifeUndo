// LifeUndo Popup
import { LINKS } from './constants.js';
import { verifyLicenseSignature, isLicenseValid, isVipLicense } from './verifyLicense.js';

const api = chrome;

const SITE = 'https://lifeundo.ru/';
const PRIV = 'https://lifeundo.ru/privacy/';
const PRICING = 'https://lifeundo.github.io/LifeUndo/#pricing';
const TELEGRAM = 'https://t.me/lifeundo';

const TRIAL_DAYS = 7;

let uiLocale = 'en';
let i18n = {};

// Load messages from _locales
async function loadMessages(loc) {
  const url = api.runtime.getURL(`_locales/${loc}/messages.json`);
  const res = await fetch(url);
  i18n = await res.json();
  uiLocale = loc;
  await api.storage.local.set({ uiLocale: loc });
}

function t(key, vars = {}) {
  const msg = i18n?.[key]?.message || key;
  return Object.keys(vars).reduce((s, k) => s.replace(new RegExp(`\\$${k}\\$`, 'g'), vars[k]), msg);
}

async function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

async function initLocale() {
  const { uiLocale: saved } = await api.storage.local.get('uiLocale');
  const loc = (saved || (api.i18n?.getUILanguage?.() || 'en')).startsWith('ru') ? 'ru' : 'en';
  await loadMessages(loc);
  await applyI18n();
}

const textList = document.getElementById('textList');
const tabList = document.getElementById('tabList');
const clipList = document.getElementById('clipList');
const undoBtn = document.getElementById('undoBtn');
const upgradeBtn = document.getElementById('upgradeBtn');
const upgradeSection = document.getElementById('upgradeSection');
const tierInfo = document.getElementById('tierInfo');
const textProBadge = document.getElementById('textProBadge');
const tabProBadge = document.getElementById('tabProBadge');
const clipProBadge = document.getElementById('clipProBadge');
const vipBadge = document.getElementById('vipBadge');

let currentLimits = null;
let currentTier = 'free';
let isVipActive = false;

function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  const { className, text, attrs } = options;
  if (className) el.className = className;
  if (typeof text === 'string') el.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
  return el;
}

async function checkVipStatus() {
  try {
    const { license, signature } = await api.storage.local.get(['license', 'signature']);
    if (license && signature) {
      const isValid = await verifyLicenseSignature({ license, signature });
      if (isValid && isLicenseValid(license) && isVipLicense(license)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking VIP status:', error);
    return false;
  }
}

function flash(text, ok = false) {
  const el = document.getElementById('flash');
  if (el) {
    el.textContent = text;
    el.className = 'flash ' + (ok ? 'ok' : 'err');
  }
}

function parseArmored(txt) {
  const m = txt.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if (!m) throw new Error('Unsupported license format');
  const b64 = m[1].replace(/[^A-Za-z0-9+/=]/g, '');
  return JSON.parse(atob(b64));
}

async function parseFile(file) {
  const txt = await file.text();
  const t = txt.trim();
  return t.startsWith('{') ? JSON.parse(t) : parseArmored(t);
}

async function doVipImport(file) {
  const btn = document.getElementById('btnVip');
  if (btn) {
    btn.classList.add('loading');
  }
  flash(t('status_importing') || 'Importing…', true);
  
  try {
    const obj = await parseFile(file);
    const ok = await verifyLicenseSignature(obj);
    if (!ok) throw new Error('Signature invalid');
    await api.storage.local.set({ license: obj.license, signature: obj.signature });
    flash(t('status_vip_ok') || 'VIP activated ✅', true);
    await api.runtime.sendMessage({ type: 'license-updated' });
    await render();
  } catch (e) {
    console.error('VIP import error', e);
    flash((t('status_vip_err') || 'Import error') + ': ' + (e.message || e), false);
  } finally {
    if (btn) {
      btn.classList.remove('loading');
    }
  }
}

// Modal functions
function openModal() {
  const modal = document.getElementById('changelog');
  const backdrop = document.getElementById('backdrop');
  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('changelog');
  const backdrop = document.getElementById('backdrop');
  modal.classList.add('hidden');
  backdrop.classList.add('hidden');
}

function showProBadges() {
  // Show/hide VIP badge
  if (isVipActive) {
    vipBadge.classList.remove('hidden');
  } else {
    vipBadge.classList.add('hidden');
  }

  // Hide PRO badges if VIP is active
  if (isVipActive) {
    textProBadge.classList.add('hidden');
    tabProBadge.classList.add('hidden');
    clipProBadge.classList.add('hidden');
    upgradeSection.classList.add('hidden');
    return;
  }

  // Show PRO badges for free tier
  if (currentTier === 'free') {
    textProBadge.classList.remove('hidden');
    tabProBadge.classList.remove('hidden');
    clipProBadge.classList.remove('hidden');
    upgradeSection.classList.remove('hidden');
  } else {
    textProBadge.classList.add('hidden');
    tabProBadge.classList.add('hidden');
    clipProBadge.classList.add('hidden');
    upgradeSection.classList.add('hidden');
  }
}

function updateTierInfo() {
  if (isVipActive) {
    tierInfo.textContent = 'VIP License Active - All features unlocked';
  } else if (currentTier === 'trial') {
    tierInfo.textContent = 'Trial Active - Upgrade to keep Pro features';
  } else if (currentTier === 'pro') {
    tierInfo.textContent = 'Pro License Active';
  } else {
    tierInfo.textContent = 'Free Version - Upgrade for more storage';
  }
}

async function getTrialDaysLeft() {
  const { trialStartedAt } = await api.storage.local.get('trialStartedAt');
  if (!trialStartedAt) return 0;
  
  const start = new Date(trialStartedAt).getTime();
  const end = start + TRIAL_DAYS * 86400 * 1000;
  const diff = Math.ceil((end - Date.now()) / (86400 * 1000));
  return Math.max(0, diff);
}

async function render() {
  // Check VIP status first
  isVipActive = await checkVipStatus();
  
  // Version
  const manifest = await api.runtime.getManifest();
  document.getElementById('version').textContent = `${t('popup_version')} ${manifest.version}`;

  // Trial info
  const trialEl = document.getElementById('trial');
  if (isVipActive) {
    trialEl.textContent = t('popup_vip');
    trialEl.style.color = '#16a34a';
  } else {
    const trialDays = await getTrialDaysLeft();
    if (trialDays > 0) {
      trialEl.textContent = t('ui_trial_days_left').replace('$DAYS$', trialDays);
      trialEl.style.color = '#9dd2ff';
    } else {
      trialEl.textContent = '';
    }
  }
  
  api.runtime.sendMessage({ type: 'LU_GET_STATE' }, (resp) => {
    if (!resp?.ok) return;
    const { lu_text_history = [], lu_tab_history = [], lu_clipboard_history = [], limits } = resp.data || {};
    
    currentLimits = limits;
    currentTier = limits?.tier || 'free';
    
    showProBadges();
    updateTierInfo();

    textList.innerHTML = '';
    lu_text_history.forEach((t) => {
      const snippet = (t.value || '').slice(0, 120).replace(/[\n\r]+/g, ' ');
      const item = createElement('div', { className: 'item' });
      const mono = createElement('div', { className: 'mono', text: snippet || '(empty)' });
      const muted = createElement('div', { className: 'muted', text: new Date(t.ts).toLocaleTimeString() });
      item.appendChild(mono);
      item.appendChild(muted);
      textList.appendChild(item);
    });

    tabList.innerHTML = '';
    lu_tab_history.forEach((t) => {
      const item = createElement('div', { className: 'item' });
      const a = createElement('a', { attrs: { href: '#' } });
      a.textContent = t.title || t.url;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        api.tabs.create({ url: t.url, active: true });
      });
      const muted = createElement('div', { className: 'muted', text: new Date(t.closedAt).toLocaleTimeString() });
      item.appendChild(a);
      item.appendChild(muted);
      tabList.appendChild(item);
    });

    clipList.innerHTML = '';
    lu_clipboard_history.forEach((c) => {
      const snippet = (c.value || '').slice(0, 120).replace(/[\n\r]+/g, ' ');
      const item = createElement('div', { className: 'item row' });
      const mono = createElement('div', { className: 'mono', text: snippet || '(empty)' });
      mono.style.flex = '1';
      const btn = createElement('button', { text: 'Copy' });
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(c.value || '');
        } catch {}
      });
      item.appendChild(mono);
      item.appendChild(btn);
      clipList.appendChild(item);
    });
  });
}

// Event listeners
document.getElementById('whatsnew').addEventListener('click', (e) => {
  e.preventDefault();
  const modal = document.getElementById('changelog');
  const isOpen = !modal.classList.contains('hidden');
  isOpen ? closeModal() : openModal();
});

document.getElementById('closeChangelog').addEventListener('click', closeModal);
document.getElementById('backdrop').addEventListener('click', closeModal);

// Language buttons
document.getElementById('lang-en').addEventListener('click', async () => {
  await loadMessages('en');
  await applyI18n();
  await render();
  document.getElementById('lang-en').classList.add('active');
  document.getElementById('lang-ru').classList.remove('active');
});

document.getElementById('lang-ru').addEventListener('click', async () => {
  await loadMessages('ru');
  await applyI18n();
  await render();
  document.getElementById('lang-ru').classList.add('active');
  document.getElementById('lang-en').classList.remove('active');
});

// Support and Settings links
document.getElementById('lnk-support').addEventListener('click', (e) => {
  e.preventDefault();
  api.tabs.create({ url: TELEGRAM });
});

document.getElementById('lnk-settings').addEventListener('click', (e) => {
  e.preventDefault();
  api.runtime.openOptionsPage();
});

// Increment popup opens counter
api.runtime.sendMessage({ type: 'LU_INCREMENT_STAT', payload: { stat: 'popupOpens' } });

if (undoBtn) {
  undoBtn.addEventListener('click', () => {
    api.runtime.sendMessage({ type: 'LU_UNDO_LAST' }, (resp) => {
      render();
    });
  });
}

if (upgradeBtn) {
  upgradeBtn.addEventListener('click', () => {
    api.tabs.create({ url: PRICING });
  });
}

// VIP Import handlers
document.getElementById('vipFile').addEventListener('change', (e) => {
  const f = e.target.files?.[0];
  if (f) doVipImport(f);
});

// ESC key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Обработка уведомлений об обновлении лицензии
api.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'license-updated') {
    try {
      render();
    } catch (e) {
      console.error('Error updating popup after license change:', e);
    }
  }
});

// Initialize
initLocale().then(() => render());