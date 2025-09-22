/* LifeUndo 0.3.7.9 — content script */

// запрещаем только то, где контент-скрипты не работают вообще
const FORBIDDEN = /^(about:|moz-extension:|chrome:|view-source:)/i;
if (FORBIDDEN.test(location.href)) { /* no-op */ }
else {
  const send = (msg) => (browser?.runtime?.sendMessage || chrome.runtime.sendMessage)(msg).catch?.(()=>{});
  const debounce = (fn, t=250) => { let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a), t); }; };

  const Q_INPUTS = 'textarea, input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"]';
  const Q_EDIT   = '[contenteditable],[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]';

  function collect() {
    const inputs = [...document.querySelectorAll(Q_INPUTS)];
    const edits  = [...document.querySelectorAll(Q_EDIT)].filter(n => n && typeof n.innerText === 'string');
    return {inputs, edits};
  }

  function bestSnapshot() {
    const {inputs, edits} = collect();
    const pool = [
      ...inputs.map(el => ({ val: el.value ?? '', url: location.href })),
      ...edits.map(el => ({ val: el.innerText ?? '', url: location.href }))
    ].filter(o => (o.val || '').trim().length >= 3);
    if (!pool.length) return null;
    pool.sort((a,b)=> (b.val?.length||0) - (a.val?.length||0));
    return { val: String(pool[0].val).slice(0,5000), url: pool[0].url, ts: Date.now() };
  }

  const push = debounce(()=>{
    const s = bestSnapshot();
    if (s) send({ type: 'text-input', ...s });
  }, 200);

  // основные события ввода
  ['input','change','keydown','paste'].forEach(ev => document.addEventListener(ev, push, true));

  // начальные попытки (чтобы «тяжёлые» редакторы успели подхватиться)
  const s0 = bestSnapshot(); if (s0) send({ type: 'text-input', ...s0 });
  let n=10; const t = setInterval(()=>{ const s=bestSnapshot(); if (s) send({ type:'text-input', ...s }); if(--n<=0) clearInterval(t); }, 1000);

  // последний снимок при уходе
  addEventListener('beforeunload', ()=>{
    const s = bestSnapshot(); if (s) send({ type:'text-input', ...s });
  }, true);

  // Clipboard (copy)
  document.addEventListener('copy', (e)=>{
    let txt = '';
    try {
      txt = document.getSelection()?.toString() || '';
      if (!txt && e.clipboardData) txt = e.clipboardData.getData('text/plain') || '';
    } catch {}
    if (txt) send({ type:'clipboard', val: String(txt).slice(0,5000), url: location.href, ts: Date.now() });
  }, true);
}
