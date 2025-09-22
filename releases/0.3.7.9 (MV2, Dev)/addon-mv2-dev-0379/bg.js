/* LifeUndo 0.3.7.9 — background (MV2) */

const B = (typeof browser !== 'undefined') ? browser : chrome;

const LIMIT_TEXT = 200;
const LIMIT_CLIP = 200;
const MERGE_MS   = 30_000;
const MAX_LEN    = 5000;
const TRIAL_DAYS = 7;

async function getStore() {
  const st = await B.storage.local.get({
    text: [], clip: [], vip: false, pro: false, trialStart: null
  });
  if (!st.trialStart) {
    st.trialStart = Date.now();
    await B.storage.local.set({ trialStart: st.trialStart });
  }
  st.text ||= []; st.clip ||= [];
  return st;
}
const setStore = (st)=> B.storage.local.set(st);
const trialLeft = (start)=> Math.max(0, (start||Date.now()) + TRIAL_DAYS*86400000 - Date.now());
const S = (x)=> String(x ?? '');

B.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    switch (msg?.type) {
      case 'text-input': {
        const st = await getStore();
        const entry = { val: S(msg.val).slice(0,MAX_LEN), url: S(msg.url || sender?.url), ts: msg.ts || Date.now() };

        // дедуп и «слияние» в пределах страницы в течение MERGE_MS
        if (st.text[0] && st.text[0].val === entry.val && st.text[0].url === entry.url) break;
        if (st.text[0] && st.text[0].url === entry.url && (entry.ts - st.text[0].ts) < MERGE_MS) st.text[0] = entry;
        else st.text.unshift(entry);

        st.text = st.text.slice(0, LIMIT_TEXT);
        await setStore(st);
        break;
      }

      case 'clipboard': {
        const st = await getStore();
        const entry = { val: S(msg.val).slice(0,MAX_LEN), url: S(msg.url || sender?.url), ts: msg.ts || Date.now() };
        if (!(st.clip[0] && st.clip[0].val === entry.val)) st.clip.unshift(entry);
        st.clip = st.clip.slice(0, LIMIT_CLIP);
        await setStore(st);
        break;
      }

      case 'pull-state': {
        const st = await getStore();
        let recent = [];
        try { recent = await B.sessions.getRecentlyClosed({ maxResults: 20 }); } catch(e){}
        sendResponse({
          text: st.text, clip: st.clip, recent,
          vip: !!st.vip, pro: !!st.pro,
          trialLeftMs: trialLeft(st.trialStart)
        });
        break;
      }

      case 'restore-session': {
        if (msg.sessionId) { try { await B.sessions.restore(msg.sessionId); } catch(e){} }
        break;
      }

      case 'clear': {
        const patch = {};
        if (msg.target === 'text' || msg.target === 'all') patch.text = [];
        if (msg.target === 'clip' || msg.target === 'all')  patch.clip = [];
        await B.storage.local.set(patch);
        break;
      }

      case 'set-license': {
        const st = await getStore();
        if (msg.plan === 'vip') st.vip = true;
        if (msg.plan === 'pro') st.pro = true;
        await setStore(st);
        break;
      }
    }
  })();

  // нужно для async sendResponse
  return true;
});

// (необязательно) простая защита от глубокого sleep фоновой страницы
setInterval(async () => {
  try { await B.storage.local.get('trialStart'); } catch {}
}, 300000);
