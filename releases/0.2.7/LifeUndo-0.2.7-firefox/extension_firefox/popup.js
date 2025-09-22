import { verifyLicenseSignature, isLicenseValid, isVipLicense } from './verifyLicense.js';

const api = (typeof browser !== 'undefined') ? browser : chrome;

const AMO_RU = 'https://addons.mozilla.org/ru/firefox/addon/lifeundo/';
const AMO_EN = 'https://addons.mozilla.org/en-US/firefox/addon/lifeundo/';
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

async function checkVipStatus() {
  const { license, signature } = await api.storage.local.get(['license', 'signature']);
  if (!license || !signature) return false;
  
  try {
    const isValid = await verifyLicenseSignature({ license, signature });
    return isValid && license.plan === 'vip';
  } catch (e) {
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
  btn.classList.add('loading');
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
    btn.classList.remove('loading');
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

async function getTrialDaysLeft() {
  const { trialStartedAt } = await api.storage.local.get('trialStartedAt');
  if (!trialStartedAt) return 0;
  
  const start = new Date(trialStartedAt).getTime();
  const end = start + TRIAL_DAYS * 86400 * 1000;
  const diff = Math.ceil((end - Date.now()) / (86400 * 1000));
  return Math.max(0, diff);
}

async function render() {
  // Check VIP status
  const isVip = await checkVipStatus();
  const trialEl = document.getElementById('trial');

  // Version
  const manifest = await api.runtime.getManifest();
  document.getElementById('version').textContent = `${t('popup_version')} ${manifest.version}`;

  if (isVip) {
    // VIP активен - убираем PRO бейджи, показываем VIP
    document.querySelectorAll('.badge').forEach(badge => {
      badge.textContent = 'VIP';
      badge.style.background = '#059669';
    });
    document.querySelectorAll('.row').forEach(row => {
      row.classList.remove('disabled');
    });
    
    // Скрываем trial, показываем VIP активен
    trialEl.textContent = t('popup_vip');
    trialEl.style.color = '#16a34a';
    
    // Кнопки: VIP disabled, Pro скрыт
    document.getElementById('btnVip').textContent = 'VIP Active';
    document.getElementById('btnVip').disabled = true;
    document.getElementById('btnPro').style.display = 'none';
    
  } else {
    // Не VIP - показываем PRO бейджи
    document.querySelectorAll('.badge').forEach(badge => {
      badge.textContent = 'PRO';
      badge.style.background = '#3b2a7a';
    });
    document.querySelectorAll('.row').forEach(row => {
      row.classList.add('disabled');
    });
    
    // Trial только если нет лицензии
    const trialDays = await getTrialDaysLeft();
    if (trialDays > 0) {
      trialEl.textContent = t('ui_trial_days_left').replace('$DAYS$', trialDays);
      trialEl.style.color = '#9dd2ff';
    } else {
      trialEl.textContent = '';
    }
    
    // Кнопки: обе активны
    document.getElementById('btnVip').textContent = t('popup_activate_vip');
    document.getElementById('btnVip').disabled = false;
    document.getElementById('btnPro').style.display = 'block';
    document.getElementById('btnPro').textContent = t('popup_upgrade_pro');
  }

  // Links
  const ws = document.getElementById('lnk-website');
  ws.href = SITE;

  const pv = document.getElementById('lnk-privacy');
  pv.href = PRIV;

  // Support link
  const support = document.getElementById('lnk-support');
  support.onclick = (e) => {
    e.preventDefault();
    api.tabs.create({ url: TELEGRAM });
  };

  // Settings link
  const settings = document.getElementById('lnk-settings');
  settings.onclick = (e) => {
    e.preventDefault();
    api.runtime.openOptionsPage();
  };

  // Language buttons
  document.getElementById('lang-en').onclick = async () => {
    await loadMessages('en');
    await applyI18n();
    await render();
  };
  document.getElementById('lang-ru').onclick = async () => {
    await loadMessages('ru');
    await applyI18n();
    await render();
  };
  
  // Highlight active language
  document.getElementById('lang-en').style.background = uiLocale === 'en' ? '#334155' : '#222';
  document.getElementById('lang-ru').style.background = uiLocale === 'ru' ? '#334155' : '#222';
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

document.getElementById('btnVip').addEventListener('click', () => {
  if (!document.getElementById('btnVip').disabled) {
    document.getElementById('vipFile').click();
  }
});

document.getElementById('vipFile').addEventListener('change', (e) => {
  const f = e.target.files?.[0];
  if (f) doVipImport(f);
});

document.getElementById('btnPro').addEventListener('click', () => {
  api.tabs.create({ url: PRICING });
});

// ESC key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Обработка уведомлений об обновлении лицензии
api.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'license-updated') {
    try { render(); } catch (e) { console.error('Error updating popup after license change:', e); }
  }
});

// Initialize
initLocale().then(() => render());