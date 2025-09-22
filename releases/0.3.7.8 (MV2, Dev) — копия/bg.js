// bg.js — хранит истории и обслуживает запросы попапа
const MAX_TEXT = 200; // записей текста
const MAX_CLIP = 200; // записей буфера

async function getStore() {
  const st = await browser.storage.local.get({ text: [], clip: [] });
  st.text ||= [];
  st.clip ||= [];
  return st;
}

async function setStore(st) {
  await browser.storage.local.set(st);
}

browser.runtime.onMessage.addListener(async (m, sender) => {
  // Принимаем сообщения от контент-скрипта
  if (m && m.type === "text-input") {
    const st = await getStore();
    st.text.unshift({
      val: String(m.val || "").slice(0, 5000),
      url: String(m.url || sender?.url || ""),
      ts: m.ts || Date.now(),
    });
    st.text = st.text.slice(0, MAX_TEXT);
    await setStore(st);
  }

  if (m && m.type === "clipboard") {
    const st = await getStore();
    st.clip.unshift({
      val: String(m.val || "").slice(0, 5000),
      url: String(m.url || sender?.url || ""),
      ts: m.ts || Date.now(),
    });
    st.clip = st.clip.slice(0, MAX_CLIP);
    await setStore(st);
  }

  // Запросы попапа
  if (m && m.type === "pull-state") {
    const st = await getStore();
    // Недавно закрытые вкладки запрашиваем на лету
    const recent = await browser.sessions
      .getRecentlyClosed({ maxResults: 20 })
      .catch(() => []);
    return { text: st.text, clip: st.clip, recent };
  }

  // Обнуление
  if (m && m.type === "clear") {
    const st = await getStore();
    if (m.target === "text") st.text = [];
    if (m.target === "clip") st.clip = [];
    await setStore(st);
  }

  // Восстановление
  if (m && m.type === "restore-session") {
    await browser.sessions.restore(m.sessionId);
  }
});

// Если контент-скрипт ещё не вставился — вставляем.
// Это нужно для старта на страницах, открытых до установки.
async function ensureInjected() {
  const [tab] = await browser.tabs
    .query({ active: true, currentWindow: true })
    .catch(() => []);
  if (!tab || !tab.url) return;
  const protocol = new URL(tab.url).protocol;

  // Не вставляем скрипты на служебные страницы браузера
  if (["http:", "https:", "file:", "ftp:"].includes(protocol)) {
    try {
      await browser.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ["cs/main.js"],
      });
    } catch (e) {
      console.error("Failed to inject content script:", e);
    }
  }
}

// Запускаем инжекцию скрипта при обновлении или активации вкладки
browser.tabs.onUpdated.addListener((id, info) => {
  if (info.status === "complete") ensureInjected();
});
browser.tabs.onActivated.addListener(ensureInjected);