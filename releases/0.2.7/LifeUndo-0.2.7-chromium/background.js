// Background service worker for LifeUndo (MV3)
import { LINKS, LIMITS, TRIAL_DAYS, LICENSE_PREFIX, MIN_LICENSE_LENGTH } from './constants.js';

const STORAGE_KEYS = {
  textHistory: 'lu_text_history',
  tabHistory: 'lu_tab_history',
  clipboardHistory: 'lu_clipboard_history',
  stats: 'lu_stats',
  pro: 'lu_pro'
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
chrome.runtime.onStartup.addListener(initializeStats);
chrome.runtime.onInstalled.addListener(initializeStats);

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
        // Priority: text > tab > clipboard
        const store = await getStore(Object.values(STORAGE_KEYS));
        const text = store[STORAGE_KEYS.textHistory] || [];
        const tabs = store[STORAGE_KEYS.tabHistory] || [];
        const clips = store[STORAGE_KEYS.clipboardHistory] || [];

        if (text.length > 0) {
          const [last, ...rest] = text;
          await setStore({ [STORAGE_KEYS.textHistory]: rest });
          await incrementStat('undos');
          // Try to restore into the originating tab; fallback to active tab
          let targetTabId = sender?.tab?.id;
          if (!targetTabId) {
            const tabs = await queryTabs({ active: true, currentWindow: true });
            if (tabs && tabs[0] && tabs[0].id) targetTabId = tabs[0].id;
          }
          if (targetTabId) {
            await sendTabMessage(targetTabId, { type: 'LU_RESTORE_TEXT', payload: last });
          }
          sendResponse({ ok: true, restored: { type: 'text', item: last } });
          break;
        }

        if (tabs.length > 0) {
          const [last, ...rest] = tabs;
          await setStore({ [STORAGE_KEYS.tabHistory]: rest });
          await createTab({ url: last.url, active: true });
          await incrementStat('tabRestores');
          sendResponse({ ok: true, restored: { type: 'tab', item: last } });
          break;
        }

        if (clips.length > 0) {
          const [last, ...rest] = clips;
          await setStore({ [STORAGE_KEYS.clipboardHistory]: rest });
          await incrementStat('clipboardRestores');
          sendResponse({ ok: true, restored: { type: 'clipboard', item: last } });
          break;
        }

        sendResponse({ ok: false, reason: 'Nothing to undo' });
        break;
      }
      default:
        sendResponse({ ok: false, reason: 'Unknown message type' });
    }
  })();

  return true; // keep channel open for async
});

