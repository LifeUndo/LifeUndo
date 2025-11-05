// Background service worker for LifeUndo (MV3)
import { LINKS, LIMITS, TRIAL_DAYS, LICENSE_PREFIX, MIN_LICENSE_LENGTH } from './constants.js';

const STORAGE_KEYS = {
  textHistory: 'lu_text_history',
  tabHistory: 'lu_tab_history',
  clipboardHistory: 'lu_clipboard_history',
  sessionBackups: 'lu_session_backups',
  stats: 'lu_stats',
  pro: 'lu_pro',
  screenshots: 'lu_screenshots'
};

/**
 * Initialize statistics and pro status on install
 */
async function initializeStats() {
  const store = await getStore([STORAGE_KEYS.stats, STORAGE_KEYS.pro]);
  
  // Initialize stats if not present
  if (!store[STORAGE_KEYS.stats]) {
    await setStore({
      [STORAGE_KEYS.stats]: {
        installTime: Date.now(),
        popupOpens: 0,
        undos: 0,
        tabRestores: 0,
        clipboardRestores: 0
      }
    });
  }
  
  // Initialize pro status if not present
  if (!store[STORAGE_KEYS.pro]) {
    await setStore({
      [STORAGE_KEYS.pro]: {
        licenseKey: '',
        status: 'trial',
        trialStart: Date.now()
      }
    });
  }
}

/**
 * Get feature limits based on pro status
 */
async function getFeatureLimits() {
  const { pro } = await getStore({ pro: {} });
  const isTrial = pro?.status === 'trial' && Date.now() - (pro.trialStart || 0) < TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const isPro = pro?.status === 'pro';
  
  if (isPro || isTrial) {
    return { text: LIMITS.PRO.text, tabs: LIMITS.PRO.tabs, clipboard: LIMITS.PRO.clipboard, tier: isPro ? 'pro' : 'trial' };
  }
  return { text: LIMITS.FREE.text, tabs: LIMITS.FREE.tabs, clipboard: LIMITS.FREE.clipboard, tier: 'free' };
}

/**
 * Increment statistics counter
 */
async function incrementStat(statName) {
  const store = await getStore([STORAGE_KEYS.stats]);
  const stats = store[STORAGE_KEYS.stats] || {};
  stats[statName] = (stats[statName] || 0) + 1;
  await setStore({ [STORAGE_KEYS.stats]: stats });
}

/**
 * Helper: push item into an array with cap.
 */
function pushWithCap(array, item, cap) {
  const next = [item, ...array.filter(Boolean)];
  if (next.length > cap) next.length = cap;
  return next;
}

async function getStore(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

async function setStore(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
}

// Promisified helpers for callback-based Chrome/Firefox APIs
function getRecentlyClosed(maxResults) {
  return new Promise((resolve) => chrome.sessions.getRecentlyClosed({ maxResults }, resolve));
}

function queryTabs(queryInfo) {
  return new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
}

function createTab(createProperties) {
  return new Promise((resolve) => chrome.tabs.create(createProperties, resolve));
}

function sendTabMessage(tabId, message) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, message, resolve);
    } catch (e) {
      resolve();
    }
  });
}

// Initialize stats on startup
chrome.runtime.onStartup.addListener(async () => {
  await initializeStats();
  ensureAutoSnapshotAlarm();
});
chrome.runtime.onInstalled.addListener(async () => {
  await initializeStats();
  ensureAutoSnapshotAlarm();
});

/**
 * Ensure Chrome alarm exists for periodic session snapshots
 */
function ensureAutoSnapshotAlarm() {
  try {
    // Default every 30 minutes; later can be made configurable via options
    chrome.alarms.create('lu_auto_snapshot', { periodInMinutes: 30 });
  } catch (_) {
    // no-op
  }
}

/**
 * Take a lightweight snapshot of current tabs in the focused window
 */
async function takeSessionSnapshot() {
  try {
    const limits = await getFeatureLimits();
    const allWindows = await new Promise((resolve) => chrome.windows.getAll({ populate: true }, resolve));
    const windowsData = (allWindows || []).map(w => ({
      id: w.id,
      focused: !!w.focused,
      tabs: (w.tabs || []).map(t => ({
        url: t.url || '',
        title: t.title || '',
        favicon: t.favIconUrl || ''
      }))
    }));
    const snapshot = { ts: Date.now(), windows: windowsData };

    const store = await getStore([STORAGE_KEYS.sessionBackups]);
    const cap = Math.max(5, Math.min(50, limits?.tabs || 20));
    const next = pushWithCap(store[STORAGE_KEYS.sessionBackups] || [], snapshot, cap);
    await setStore({ [STORAGE_KEYS.sessionBackups]: next });
  } catch (_) {
    // no-op
  }
}

// Alarm handler for periodic snapshots
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm && alarm.name === 'lu_auto_snapshot') {
    takeSessionSnapshot();
  }
});

/**
 * Restore snapshot by opening URLs in current window (simple strategy)
 */
async function restoreSnapshot(snapshot) {
  try {
    const urls = [];
    (snapshot.windows || []).forEach(w => {
      (w.tabs || []).forEach(t => {
        if (t.url) urls.push(t.url);
      });
    });
    if (urls.length === 0) return;
    // Open the first active, rest background
    const [first, ...rest] = urls;
    await createTab({ url: first, active: true });
    for (const u of rest) {
      await createTab({ url: u, active: false });
    }
  } catch (_) {
    // no-op
  }
}

// ===== Simple AES-GCM helpers for encrypted export/import =====
async function encryptString(password, plaintext) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  return { cipher: arrayToBase64(new Uint8Array(data)), iv: arrayToBase64(iv), salt: arrayToBase64(salt) };
}

async function decryptString(password, b64cipher, b64iv, b64salt) {
  const dec = new TextDecoder();
  const iv = base64ToArray(b64iv);
  const salt = base64ToArray(b64salt);
  const key = await deriveKey(password, salt);
  const cipher = base64ToArray(b64cipher);
  const data = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return dec.decode(new Uint8Array(data));
}

async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function arrayToBase64(arr) {
  let binary = '';
  arr.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToArray(b64) {
  const binary = atob(b64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

/**
 * Track closed tabs via sessions API (recently closed).
 */
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;
  try {
    const limits = await getFeatureLimits();
    const sessions = await getRecentlyClosed(1);
    const last = sessions && sessions[0];
    if (!last || !last.tab) return;
    const url = last.tab.url || '';
    const title = last.tab.title || '';
    const favicon = last.tab.favIconUrl || '';
    const entry = { url, title, favicon, closedAt: Date.now() };
    const store = await getStore([STORAGE_KEYS.tabHistory]);
    const next = pushWithCap(store[STORAGE_KEYS.tabHistory] || [], entry, limits.tabs);
    await setStore({ [STORAGE_KEYS.tabHistory]: next });
  } catch (err) {
    // no-op
  }
});

/**
 * Messaging protocol
 * Messages from content/popup use {type, payload}
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message || {};

  (async () => {
    switch (type) {
      case 'LU_PUSH_TEXT_STATE': {
        const limits = await getFeatureLimits();
        const page = sender?.tab?.url || 'unknown';
        const entry = {
          page,
          value: String(payload?.value || ''),
          elementPath: String(payload?.path || ''),
          ts: Date.now()
        };
        const store = await getStore([STORAGE_KEYS.textHistory]);
        const next = pushWithCap(store[STORAGE_KEYS.textHistory] || [], entry, limits.text);
        await setStore({ [STORAGE_KEYS.textHistory]: next });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_PUSH_CLIPBOARD': {
        const limits = await getFeatureLimits();
        const entry = { value: String(payload?.value || ''), ts: Date.now() };
        const store = await getStore([STORAGE_KEYS.clipboardHistory]);
        const next = pushWithCap(store[STORAGE_KEYS.clipboardHistory] || [], entry, limits.clipboard);
        await setStore({ [STORAGE_KEYS.clipboardHistory]: next });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_GET_STATE': {
        const store = await getStore(Object.values(STORAGE_KEYS));
        const limits = await getFeatureLimits();
        sendResponse({ ok: true, data: { ...store, limits } });
        break;
      }
      case 'LU_GET_LIMITS': {
        const limits = await getFeatureLimits();
        sendResponse({ ok: true, limits });
        break;
      }
      case 'LU_GET_STATS': {
        const store = await getStore([STORAGE_KEYS.stats, STORAGE_KEYS.pro]);
        sendResponse({ ok: true, stats: store[STORAGE_KEYS.stats], pro: store[STORAGE_KEYS.pro] });
        break;
      }
      case 'LU_ACTIVATE_LICENSE': {
        const key = String(payload?.key || '').trim();
        if (key.startsWith(LICENSE_PREFIX) && key.length >= MIN_LICENSE_LENGTH) {
          await setStore({
            [STORAGE_KEYS.pro]: {
              licenseKey: key,
              status: 'pro',
              trialStart: null
            }
          });
          sendResponse({ ok: true, message: 'License activated successfully' });
        } else {
          sendResponse({ ok: false, message: 'Invalid license key format' });
        }
        break;
      }
      case 'LU_EXPORT_DATA': {
        const store = await getStore(Object.values(STORAGE_KEYS));
        const exportData = {
          version: '0.2.0',
          exportTime: Date.now(),
          stats: store[STORAGE_KEYS.stats],
          pro: store[STORAGE_KEYS.pro],
          textHistory: store[STORAGE_KEYS.textHistory],
          tabHistory: store[STORAGE_KEYS.tabHistory],
          clipboardHistory: store[STORAGE_KEYS.clipboardHistory]
        };
        sendResponse({ ok: true, data: exportData });
        break;
      }
      case 'LU_GET_BACKUPS': {
        const store = await getStore([STORAGE_KEYS.sessionBackups]);
        sendResponse({ ok: true, backups: store[STORAGE_KEYS.sessionBackups] || [] });
        break;
      }
      case 'LU_TAKE_SNAPSHOT': {
        await takeSessionSnapshot();
        const store = await getStore([STORAGE_KEYS.sessionBackups]);
        sendResponse({ ok: true, backups: store[STORAGE_KEYS.sessionBackups] || [] });
        break;
      }
      case 'LU_RESTORE_BACKUP': {
        const snap = payload?.snapshot;
        if (!snap || !Array.isArray(snap.windows)) {
          sendResponse({ ok: false, reason: 'Invalid snapshot' });
          break;
        }
        await restoreSnapshot(snap);
        await incrementStat('tabRestores');
        sendResponse({ ok: true });
        break;
      }
      case 'LU_EXPORT_BACKUPS': {
        const { password = '' } = payload || {};
        const store = await getStore([STORAGE_KEYS.sessionBackups]);
        const dataStr = JSON.stringify({ version: '1', ts: Date.now(), backups: store[STORAGE_KEYS.sessionBackups] || [] });
        if (password && password.trim().length > 0) {
          const { cipher, iv, salt } = await encryptString(password, dataStr);
          sendResponse({ ok: true, encrypted: true, iv, salt, data: cipher });
        } else {
          sendResponse({ ok: true, encrypted: false, data: dataStr });
        }
        break;
      }
      case 'LU_TAKE_SCREENSHOT': {
        const dataUrl = await takeVisibleTabScreenshot();
        if (!dataUrl) {
          sendResponse({ ok: false, reason: 'capture_failed' });
          break;
        }
        const shot = { ts: Date.now(), dataUrl };
        const list = await saveScreenshotEntry(shot);
        sendResponse({ ok: true, item: shot, list });
        break;
      }
      case 'LU_GET_SCREENSHOTS': {
        const store = await getStore([STORAGE_KEYS.screenshots]);
        sendResponse({ ok: true, list: store[STORAGE_KEYS.screenshots] || [] });
        break;
      }
      case 'LU_DELETE_SCREENSHOT': {
        const idx = Number(payload?.index ?? -1);
        const store = await getStore([STORAGE_KEYS.screenshots]);
        const arr = Array.isArray(store[STORAGE_KEYS.screenshots]) ? store[STORAGE_KEYS.screenshots] : [];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx, 1);
          await setStore({ [STORAGE_KEYS.screenshots]: arr });
        }
        sendResponse({ ok: true, list: arr });
        break;
      }
      case 'LU_IMPORT_BACKUPS': {
        try {
          const { content, password = '', encrypted = false, iv, salt } = payload || {};
          let parsed;
          if (encrypted) {
            if (!password) throw new Error('Password required');
            parsed = JSON.parse(await decryptString(password, content, iv, salt));
          } else {
            parsed = JSON.parse(String(content || '{}'));
          }
          const backups = Array.isArray(parsed?.backups) ? parsed.backups : [];
          const store = await getStore([STORAGE_KEYS.sessionBackups]);
          const current = store[STORAGE_KEYS.sessionBackups] || [];
          const merged = [...backups, ...current];
          await setStore({ [STORAGE_KEYS.sessionBackups]: merged });
          sendResponse({ ok: true, count: merged.length });
        } catch (e) {
          sendResponse({ ok: false, reason: e?.message || 'Import failed' });
        }
        break;
      }
      case 'LU_RESET_STATS': {
        await setStore({
          [STORAGE_KEYS.stats]: {
            installTime: Date.now(),
            popupOpens: 0,
            undos: 0,
            tabRestores: 0,
            clipboardRestores: 0
          }
        });
        sendResponse({ ok: true, message: 'Statistics reset successfully' });
        break;
      }
      case 'LU_INCREMENT_STAT': {
        const statName = payload?.stat;
        if (statName) {
          await incrementStat(statName);
        }
        sendResponse({ ok: true });
        break;
      }
      case 'LU_UNDO_LAST': {
        const result = await performUndoLast(sender?.tab?.id);
        sendResponse(result);
        break;
      }
      default:
        sendResponse({ ok: false, reason: 'Unknown message type' });
    }
  })();

  return true; // keep channel open for async
});

/**
 * Screenshot helpers (MV3)
 */
async function takeVisibleTabScreenshot() {
  try {
    const dataUrl = await new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab({ format: 'png' }, (data) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(data);
      });
    });
    return dataUrl;
  } catch (_) {
    return null;
  }
}

async function saveScreenshotEntry(entry) {
  const store = await getStore([STORAGE_KEYS.screenshots]);
  const list = Array.isArray(store[STORAGE_KEYS.screenshots]) ? store[STORAGE_KEYS.screenshots] : [];
  const next = pushWithCap(list, entry, 20);
  await setStore({ [STORAGE_KEYS.screenshots]: next });
  return next;
}

/**
 * Reusable undo logic. Priority: text > tab > clipboard
 */
async function performUndoLast(senderTabId) {
  const store = await getStore(Object.values(STORAGE_KEYS));
  const text = store[STORAGE_KEYS.textHistory] || [];
  const tabs = store[STORAGE_KEYS.tabHistory] || [];
  const clips = store[STORAGE_KEYS.clipboardHistory] || [];

  if (text.length > 0) {
    const [last, ...rest] = text;
    await setStore({ [STORAGE_KEYS.textHistory]: rest });
    await incrementStat('undos');
    let targetTabId = senderTabId;
    if (!targetTabId) {
      const activeTabs = await queryTabs({ active: true, currentWindow: true });
      if (activeTabs && activeTabs[0] && activeTabs[0].id) targetTabId = activeTabs[0].id;
    }
    if (targetTabId) {
      await sendTabMessage(targetTabId, { type: 'LU_RESTORE_TEXT', payload: last });
    }
    return { ok: true, restored: { type: 'text', item: last } };
  }

  if (tabs.length > 0) {
    const [last, ...rest] = tabs;
    await setStore({ [STORAGE_KEYS.tabHistory]: rest });
    await createTab({ url: last.url, active: true });
    await incrementStat('tabRestores');
    return { ok: true, restored: { type: 'tab', item: last } };
  }

  if (clips.length > 0) {
    const [last, ...rest] = clips;
    await setStore({ [STORAGE_KEYS.clipboardHistory]: rest });
    await incrementStat('clipboardRestores');
    return { ok: true, restored: { type: 'clipboard', item: last } };
  }

  return { ok: false, reason: 'Nothing to undo' };
}

// Quick Undo command (Alt+U)
try {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'lu_quick_undo') {
      await performUndoLast();
    }
  });
} catch (_) {
  // no-op
}

