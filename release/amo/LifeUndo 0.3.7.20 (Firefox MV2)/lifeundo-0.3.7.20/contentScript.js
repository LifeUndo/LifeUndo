(function () {
  const MAX = 20;

  function isPwd(el) {
    if (!el) return false;
    if (el instanceof HTMLInputElement) {
      const t = (el.type || '').toLowerCase();
      if (t === 'password' || t === 'hidden') return true;
    }
    const mark = ((el.name || '') + ' ' + (el.id || '') + ' ' + (el.className || '')).toLowerCase();
    return /pass|passwd|password/.test(mark);
  }

  async function save(key, entry) {
    try {
      const cur = (await browser.storage.local.get(key))[key] || [];
      const filtered = cur.filter(x => x.text !== entry.text);
      const next = [entry, ...filtered].slice(0, MAX);
      await browser.storage.local.set({ [key]: next });
    } catch (_) { /* no-op */ }
  }

  function commitInput(val) {
    const v = (val || '').trim();
    if (v.length > 10000) return; // anti-spam huge pastes
    if (v) save('lu_inputs', { text: v, ts: Date.now() });
  }

  addEventListener('input', e => {
    const el = e.target;
    if (!el) return;
    if (el.isContentEditable) return commitInput(el.textContent);
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      if (!isPwd(el)) commitInput(el.value);
    }
  }, true);

  addEventListener('change', e => {
    const el = e.target;
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      if (!isPwd(el)) commitInput(el.value);
    }
  }, true);

  addEventListener('copy', () => {
    try {
      const sel = String(document.getSelection() || '').trim();
      if (sel) save('lu_clipboard', { text: sel, ts: Date.now() });
    } catch (_) { /* no-op */ }
  }, true);

  addEventListener('cut', () => {
    try {
      const sel = String(document.getSelection() || '').trim();
      if (sel) save('lu_clipboard', { text: sel, ts: Date.now() });
    } catch (_) { /* no-op */ }
  }, true);
})();