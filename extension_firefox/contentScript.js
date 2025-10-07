/* global browser */

// 1) Защищённые страницы — не пишем и выходим тихо
const PROTECTED = location.protocol === 'about:' ||
                  location.protocol === 'moz-extension:' ||
                  location.protocol === 'view-source:';
if (PROTECTED) { 
  // Ничего не делаем на защищённых страницах
  console.log('[LifeUndo] Protected page detected, skipping');
}

// 2) Дебаунс сохранения
const saveDebounced = (() => {
  let t; 
  return (k, v) => { 
    clearTimeout(t); 
    t = setTimeout(() => save(k, v), 120); 
  };
})();

// 3) Универсальная проверка «парольности»
const isSecret = el =>
  !el || el.type === 'password' ||
  /password|passwd|pwd/i.test(el.name || '') ||
  /password|passwd|pwd/i.test(el.id || '') ||
  el.getAttribute('autocomplete') === 'current-password';

// 4) Безопасный сбор ввода (input/keyup/change)
function onAnyInput(e) {
  const el = e.target;
  if (!el || isSecret(el)) return;
  const txt = (el.value || '').trim();
  if (!txt) return;
  const rec = { text: txt, ts: Date.now(), origin: location.origin };
  saveDebounced('lu_inputs', rec);
}

// 5) Копирование в буфер
function onCopy(e) {
  try {
    const sel = (document.getSelection() || '').toString().trim();
    if (!sel) return;
    const rec = { text: sel, ts: Date.now(), origin: location.origin };
    saveDebounced('lu_clipboard', rec);
  } catch(_) {}
}

// 6) Хранилище с лимитом
async function save(key, rec) {
  try {
    const data = await browser.storage.local.get({ [key]: [] });
    const arr = Array.isArray(data[key]) ? data[key] : [];
    arr.unshift(rec);
    const MAX = 50;
    await browser.storage.local.set({ [key]: arr.slice(0, MAX) });
  } catch (error) {
    console.error('[LifeUndo] Save error:', error);
  }
}

// 7) Авточерновик для больших полей (страховка от потери текста)
const autoFields = new Set(['TEXTAREA', 'INPUT']);
document.addEventListener('keyup', (e) => {
  const el = e.target;
  if (!el || !autoFields.has(el.tagName) || isSecret(el)) return;
  const val = (el.value || '').trim();
  if (!val) return;
  
  const k = `lu_draft:${location.origin}${location.pathname}`;
  browser.storage.local.set({ [k]: { v: val, ts: Date.now() } }).catch(() => {});
}, true);

// Подключение событий
['input', 'change', 'keyup'].forEach(ev => 
  document.addEventListener(ev, onAnyInput, true)
);
document.addEventListener('copy', onCopy, true);

console.log('[LifeUndo] Content script loaded successfully');