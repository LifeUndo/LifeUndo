const MAX_TEXT = 200, MAX_CLIP = 200, TRIAL_DAYS = 7;

async function getStore() {
  const st = await browser.storage.local.get({
    text: [], clip: [], vip: false, pro: false, trialStart: null
  });
  st.text ||= []; st.clip ||= [];
  if (!st.trialStart) {
    st.trialStart = Date.now();
    await browser.storage.local.set({ trialStart: st.trialStart });
  }
  return st;
}
async function setStore(st) { await browser.storage.local.set(st); }

// trial helper
function trialLeftMs(trialStart) {
  const end = trialStart + TRIAL_DAYS*24*3600*1000;
  return Math.max(0, end - Date.now());
}

browser.runtime.onMessage.addListener(async (m, sender) => {
  if (m?.type === "text-input") {
    const st = await getStore();
    st.text.unshift({ val: String(m.val||"").slice(0,5000), url: String(m.url||sender?.url||""), ts: m.ts||Date.now() });
    st.text = st.text.slice(0, MAX_TEXT);
    await setStore(st);
  }
  if (m?.type === "clipboard") {
    const st = await getStore();
    st.clip.unshift({ val: String(m.val||"").slice(0,5000), url: String(m.url||sender?.url||""), ts: m.ts||Date.now() });
    st.clip = st.clip.slice(0, MAX_CLIP);
    await setStore(st);
  }
  if (m?.type === "pull-state") {
    const st = await getStore();
    let recent = [];
    try { recent = await browser.sessions.getRecentlyClosed({ maxResults: 20 }); } catch(e){}
    const left = trialLeftMs(st.trialStart);
    return { text: st.text, clip: st.clip, recent, vip: !!st.vip, pro: !!st.pro, trialLeftMs: left };
  }
  if (m?.type === "restore-session" && m.sessionId) {
    try { await browser.sessions.restore(m.sessionId); return { ok:true }; }
    catch(e){ return { ok:false, error:String(e) }; }
  }
  if (m?.type === "clear") {
    const to = {};
    if (m.target === "text" || m.target === "all") to.text = [];
    if (m.target === "clip" || m.target === "all") to.clip = [];
    await browser.storage.local.set(to);
    return { ok:true };
  }
  if (m?.type === "set-license") {
    const st = await getStore();
    if (m.plan === "vip") st.vip = true;
    if (m.plan === "pro") st.pro = true;
    await setStore(st);
    return { ok:true };
  }
});
