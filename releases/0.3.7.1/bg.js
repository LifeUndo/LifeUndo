// bg.js — хранит истории и обслуживает запросы попапа
const MAX_TEXT = 200;     // записей текста
const MAX_CLIP = 200;     // записей буфера

async function getStore() {
  const st = await browser.storage.local.get({ text: [], clip: [] });
  st.text ||= []; st.clip ||= [];
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
      ts: m.ts || Date.now()
    });
    st.text = st.text.slice(0, MAX_TEXT);
    await setStore(st);
  }

  if (m && m.type === "clipboard") {
    const st = await getStore();
    st.clip.unshift({
      val: String(m.val || "").slice(0, 5000),
      url: String(m.url || sender?.url || ""),
      ts: m.ts || Date.now()
    });
    st.clip = st.clip.slice(0, MAX_CLIP);
    await setStore(st);
  }

  // Запросы попапа
  if (m && m.type === "pull-state") {
    const st = await getStore();
    // Недавно закрытые вкладки запрашиваем на лету
    const recent = await browser.sessions.getRecentlyClosed({ maxResults: 20 }).catch(() => []);
    return { text: st.text, clip: st.clip, recent };
  }

  if (m && m.type === "restore-session" && m.sessionId) {
    try {
      await browser.sessions.restore(m.sessionId);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  if (m && m.type === "clear") {
    const toClear = {};
    if (m.target === "text" || m.target === "all") toClear.text = [];
    if (m.target === "clip" || m.target === "all") toClear.clip = [];
    await browser.storage.local.set(toClear);
    return { ok: true };
  }
});
