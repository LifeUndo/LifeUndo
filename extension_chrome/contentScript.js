(function(){
  const MAX = 20;

  function isPwd(el){
    if (!el) return false;
    if (el instanceof HTMLInputElement) {
      const t = (el.type||'').toLowerCase();
      if (t === 'password' || t === 'hidden') return true;
    }
    const s = ((el.name||'') + ' ' + (el.id||'') + ' ' + (el.className||'')).toLowerCase();
    return /pass|passwd|password/.test(s);
  }

  async function save(key, entry){
    try{
      const result = await chrome.storage.local.get(key);
      const cur = result[key] || [];
      const filtered = cur.filter(x => x.text !== entry.text);
      const next = [entry, ...filtered].slice(0, MAX);
      await chrome.storage.local.set({ [key]: next });
    }catch(e){
      console.error('Storage error:', e);
    }
  }

  // Input tracking
  addEventListener('input', e=>{
    const el = e.target;
    if (!el) return;
    if (el.isContentEditable) {
      const v = (el.textContent||'').trim();
      if (v) save('lu_inputs', { text: v, ts: Date.now() });
      return;
    }
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      if (!isPwd(el)) {
        const v = (el.value||'').trim();
        if (v) save('lu_inputs', { text: v, ts: Date.now() });
      }
    }
  }, true);

  // Change tracking (for select, checkbox, etc.)
  addEventListener('change', e=>{
    const el = e.target;
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      if (!isPwd(el)) {
        const v = (el.value||'').trim();
        if (v) save('lu_inputs', { text: v, ts: Date.now() });
      }
    }
  }, true);

  // Clipboard tracking
  addEventListener('copy', ()=>{
    try{
      const sel = String(document.getSelection()||'').trim();
      if (sel) save('lu_clipboard', { text: sel, ts: Date.now() });
    }catch(e){
      console.error('Clipboard error:', e);
    }
  }, true);

  console.log('GetLifeUndo content script loaded');
})();



