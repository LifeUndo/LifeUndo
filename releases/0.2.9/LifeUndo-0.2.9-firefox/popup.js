// LifeUndo Popup v0.2.9 - Inline License Verifier
const api = (typeof browser !== 'undefined') ? browser : chrome;

const AMO_RU = 'https://addons.mozilla.org/ru/firefox/addon/lifeundo/';
const AMO_EN = 'https://addons.mozilla.org/en-US/firefox/addon/lifeundo/';
const SITE = 'https://lifeundo.ru/';
const PRIV = 'https://lifeundo.ru/privacy/';
const PRICING = 'https://lifeundo.github.io/LifeUndo/#pricing';
const TELEGRAM = 'https://t.me/lifeundo';

const TRIAL_DAYS = 7;

// Встроенный публичный ключ как fallback
const LICENSE_PUB_KEY_JWK = {
  "kty": "EC",
  "crv": "P-256",
  "x": "Y2F0Y2hidWxrZXJ0aGF0aXNub3R0aGVyZWFsbHlrZXl0aGF0aXNub3R0aGVyZWFsbHlLZXk=",
  "y": "dGhpc2lzbm90dGhlcmVhbGx5a2V5dGhhdGlzbm90dGhlcmVhbGx5S2V5",
  "use": "sig",
  "alg": "ES256"
};

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

// Inline License Verifier - всё в одном файле
const $ = s => document.querySelector(s);
const flash = (m, ok = false) => { 
  const el = $('#flash'); 
  if (el) {
    el.textContent = m; 
    el.className = 'flash ' + (ok ? 'ok' : 'err'); 
  }
};

function canonicalStringify(value) {
  if (Array.isArray(value)) return '[' + value.map(canonicalStringify).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonicalStringify(value[k])).join(',') + '}';
  }
  return JSON.stringify(value);
}

function b64ToBytes(b64) {
  // поддержка base64 и base64url
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad) b64 += '='.repeat(4 - pad);
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

// DER <-> RAW конвертер для ECDSA
function derToRaw(der) {
  let i = 0;
  if (der[i++] !== 0x30) throw new Error('DER: no SEQUENCE');
  if (der[i] & 0x80) { i += der[i] - 0x80 + 1; } else { i++; }
  if (der[i++] !== 0x02) throw new Error('DER: no INTEGER r');
  let rlen = der[i++];
  while (der[i] === 0x00) { i++; rlen--; }
  const r = der.slice(i, i + rlen);
  i += rlen;
  if (der[i++] !== 0x02) throw new Error('DER: no INTEGER s');
  let slen = der[i++];
  while (der[i] === 0x00) { i++; slen--; }
  const s = der.slice(i, i + slen);
  const out = new Uint8Array(64);
  out.set(r, 32 - r.length);
  out.set(s, 64 - s.length);
  return out;
}

async function importJwk(jwk) {
  return crypto.subtle.importKey(
    'jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']
  );
}

async function verifyLicenseSignature(licenseObj, jwkFallback) {
  if (!licenseObj?.license || !licenseObj?.signature?.sig_b64) {
    throw new Error('Invalid license object');
  }
  
  const jwk = licenseObj.signature.publicKeyJwk || jwkFallback;
  if (!jwk) {
    throw new Error('Public key missing');
  }
  
  const key = await importJwk(jwk);
  const data = new TextEncoder().encode(canonicalStringify(licenseObj.license));
  const sigBytes = b64ToBytes(licenseObj.signature.sig_b64);

  // Пробуем сначала RAW (64 байта), потом DER→RAW
  const candidates = [sigBytes];
  try { 
    candidates.push(derToRaw(sigBytes)); 
  } catch (_) {} // если это уже RAW — дер разбор упадёт, игнорим

  for (const sig of candidates) {
    try {
      const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sig, data);
      if (ok) return true;
    } catch (_) {} // пробуем следующую форму
  }
  return false;
}

async function parseLicenseFile(file) {
  const txt = await file.text();
  const t = txt.trim();
  if (t.startsWith('{')) return JSON.parse(t);
  const m = t.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if (!m) throw new Error('Unknown .lifelic format');
  return JSON.parse(atob(m[1].replace(/[^A-Za-z0-9+/=_-]/g, '')));
}

async function doVipImport(file) {
  const btn = $('#btnVip');
  btn.classList.add('loading');
  flash(t('status_importing') || 'Importing…', true);
  
  try {
    const obj = await parseLicenseFile(file);
    const ok = await verifyLicenseSignature(obj, LICENSE_PUB_KEY_JWK);
    if (!ok) throw new Error('Signature invalid');
    await api.storage.local.set({ license: obj.license, signature: obj.signature, tier: 'vip' });
    flash(t('status_vip_ok') || 'VIP activated ✅', true);
    await api.runtime.sendMessage({ type: 'license-updated' });
    await render();
  } catch (e) {
    console.error('[VIP] import failed:', e);
    flash((t('status_vip_err') || 'Import error') + ': ' + (e.message || e), false);
  } finally {
    btn.classList.remove('loading');
  }
}

async function checkVipStatus() {
  const { license, signature } = await api.storage.local.get(['license', 'signature']);
  if (!license || !signature) return false;
  
  try {
    const isValid = await verifyLicenseSignature({ license, signature }, LICENSE_PUB_KEY_JWK);
    return isValid && license.plan === 'vip' && (!license.expiry || new Date(license.expiry) >= new Date());
  } catch (e) {
    console.error('[VIP] status check failed:', e);
    return false;
  }
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(modalId === 'changelog' ? 'backdrop' : 'proBackdrop');
  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(modalId === 'changelog' ? 'backdrop' : 'proBackdrop');
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
    document.getElementById('btnVip').textContent = t('popup_vip_active');
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
  isOpen ? closeModal('changelog') : openModal('changelog');
});

document.getElementById('closeChangelog').addEventListener('click', () => closeModal('changelog'));
document.getElementById('backdrop').addEventListener('click', () => closeModal('changelog'));

// Pro stub modal
document.getElementById('btnPro').addEventListener('click', (e) => {
  e.preventDefault();
  openModal('proStub');
});

document.getElementById('closeProStub').addEventListener('click', () => closeModal('proStub'));
document.getElementById('closeProStubBtn').addEventListener('click', () => closeModal('proStub'));
document.getElementById('proBackdrop').addEventListener('click', () => closeModal('proStub'));

document.getElementById('openPricing').addEventListener('click', () => {
  api.tabs.create({ url: PRICING });
  closeModal('proStub');
});

// VIP Import handlers
document.getElementById('btnVip').addEventListener('click', () => {
  if (!document.getElementById('btnVip').disabled) {
    document.getElementById('vipFile').click();
  }
});

document.getElementById('vipFile').addEventListener('change', (e) => {
  const f = e.target.files?.[0];
  if (f) doVipImport(f);
});

// ESC key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('changelog');
    closeModal('proStub');
  }
});

// Обработка уведомлений об обновлении лицензии
api.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'license-updated') {
    try { render(); } catch (e) { console.error('Error updating popup after license change:', e); }
  }
});

// Initialize
initLocale().then(() => render());