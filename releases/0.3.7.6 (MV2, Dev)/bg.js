// API alias (Firefox/Chrome совместимость)
const API = typeof browser !== 'undefined' ? browser : chrome;

const MAX_TEXT = 200, MAX_CLIP = 200, TRIAL_DAYS = 7;
const MERGE_WINDOW_MS = 30_000;
const MAX_TEXT_LEN = 5000;

async function getStore() {
  const st = await API.storage.local.get({
    text: [], clip: [], vip: false, pro: false, trialStart: null
  });
  st.text ||= []; st.clip ||= [];
  if (!st.trialStart) {
    st.trialStart = Date.now();
    await API.storage.local.set({ trialStart: st.trialStart });
  }
  return st;
}
async function setStore(st){ await API.storage.local.set(st); }
function trialLeftMs(start){ const end = start + TRIAL_DAYS*24*3600*1000; return Math.max(0, end - Date.now()); }
const norm = (s)=> String(s ?? "");

API.runtime.onMessage.addListener(async (m, sender, sendResponse) => {
  (async () => {
    if (m?.type === "text-input") {
      const st = await getStore();
      const entry = { val: norm(m.val).slice(0, MAX_TEXT_LEN), url: norm(m.url || sender?.url), ts: m.ts || Date.now() };
      if (st.text[0] && st.text[0].val === entry.val && st.text[0].url === entry.url) return sendResponse({ok:true});
      if (st.text[0] && st.text[0].url === entry.url && (entry.ts - st.text[0].ts) < MERGE_WINDOW_MS) st.text[0] = entry;
      else st.text.unshift(entry);
      st.text = st.text.slice(0, MAX_TEXT);
      await setStore(st); return sendResponse({ok:true});
    }

    if (m?.type === "clipboard") {
      const st = await getStore();
      const entry = { val: norm(m.val).slice(0, MAX_TEXT_LEN), url: norm(m.url || sender?.url), ts: m.ts || Date.now() };
      if (!(st.clip[0] && st.clip[0].val === entry.val)) st.clip.unshift(entry);
      st.clip = st.clip.slice(0, MAX_CLIP);
      await setStore(st); return sendResponse({ok:true});
    }

    if (m?.type === "pull-state") {
      const st = await getStore();
      let recent = [];
      try { recent = await API.sessions.getRecentlyClosed({ maxResults: 20 }); } catch(e){}
      return sendResponse({
        text: st.text, clip: st.clip, recent,
        vip: !!st.vip, pro: !!st.pro,
        trialLeftMs: trialLeftMs(st.trialStart)
      });
    }

    if (m?.type === "restore-session" && m.sessionId) {
      try { await API.sessions.restore(m.sessionId); return sendResponse({ ok:true }); }
      catch(e){ return sendResponse({ ok:false, error:String(e) }); }
    }

    if (m?.type === "clear") {
      const to={};
      if (m.target === "text" || m.target === "all") to.text = [];
      if (m.target === "clip" || m.target === "all") to.clip = [];
      await API.storage.local.set(to);
      return sendResponse({ ok:true });
    }

    if (m?.type === "set-license") {
      const st = await getStore();
      if (m.plan === "vip") st.vip = true;
      if (m.plan === "pro") st.pro = true;
      await setStore(st);
      return sendResponse({ ok:true });
    }
  })();
  return true; // async response
});
