// Background script for LifeUndo (Firefox MV2)

const STORAGE_KEYS = {
  textHistory: 'lu_text_history',
  tabHistory: 'lu_tab_history',
  clipboardHistory: 'lu_clipboard_history'
};

const LIMITS = {
  text: 20,
  tabs: 10,
  clipboard: 10
};

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

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;
  try {
    const sessions = await getRecentlyClosed(1);
    const last = sessions && sessions[0];
    if (!last || !last.tab) return;
    const url = last.tab.url || '';
    const title = last.tab.title || '';
    const favicon = last.tab.favIconUrl || '';
    const entry = { url, title, favicon, closedAt: Date.now() };
    const store = await getStore([STORAGE_KEYS.tabHistory]);
    const next = pushWithCap(store[STORAGE_KEYS.tabHistory] || [], entry, LIMITS.tabs);
    await setStore({ [STORAGE_KEYS.tabHistory]: next });
  } catch (err) {}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message || {};

  (async () => {
    switch (type) {
      case 'LU_PUSH_TEXT_STATE': {
        const page = sender?.tab?.url || 'unknown';
        const entry = {
          page,
          value: String(payload?.value || ''),
          elementPath: String(payload?.path || ''),
          ts: Date.now()
        };
        const store = await getStore([STORAGE_KEYS.textHistory]);
        const next = pushWithCap(store[STORAGE_KEYS.textHistory] || [], entry, LIMITS.text);
        await setStore({ [STORAGE_KEYS.textHistory]: next });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_PUSH_CLIPBOARD': {
        const entry = { value: String(payload?.value || ''), ts: Date.now() };
        const store = await getStore([STORAGE_KEYS.clipboardHistory]);
        const next = pushWithCap(store[STORAGE_KEYS.clipboardHistory] || [], entry, LIMITS.clipboard);
        await setStore({ [STORAGE_KEYS.clipboardHistory]: next });
        sendResponse({ ok: true });
        break;
      }
      case 'LU_GET_STATE': {
        const store = await getStore(Object.values(STORAGE_KEYS));
        sendResponse({ ok: true, data: store });
        break;
      }
      case 'LU_UNDO_LAST': {
        const store = await getStore(Object.values(STORAGE_KEYS));
        const text = store[STORAGE_KEYS.textHistory] || [];
        const tabs = store[STORAGE_KEYS.tabHistory] || [];
        const clips = store[STORAGE_KEYS.clipboardHistory] || [];

        if (text.length > 0) {
          const [last, ...rest] = text;
          await setStore({ [STORAGE_KEYS.textHistory]: rest });
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
          sendResponse({ ok: true, restored: { type: 'tab', item: last } });
          break;
        }

        if (clips.length > 0) {
          const [last, ...rest] = clips;
          await setStore({ [STORAGE_KEYS.clipboardHistory]: rest });
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

  return true;
});


