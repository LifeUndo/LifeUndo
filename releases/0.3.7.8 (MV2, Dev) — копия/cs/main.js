/* LifeUndo 0.3.7.8 — content script (fix file:// + bootstrap) */

// запрещаем только то, где контент-скрипты в принципе не работают
const FORBIDDEN = /^(about:|moz-extension:|chrome:|view-source:)/i;

if (!FORBIDDEN.test(location.href)) {
  const send = (msg)=> browser.runtime.sendMessage(msg).catch(()=>{});
  const deb  = (fn, t=300)=>{ let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a),t); }; };

  function collectNodes(){
    const inputs = [...document.querySelectorAll(
      'textarea, input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"]'
    )];
    const edits  = [...document.querySelectorAll(
      '[contenteditable],[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]'
    )].filter(el => el && typeof el.innerText === 'string');
    return { inputs, edits };
  }

  function capture(){
    const { inputs, edits } = collectNodes();
    const pool = [
      ...inputs.map(el => ({ val: el.value ?? '', url: location.href })),
      ...edits.map(el => ({ val: el.innerText ?? '', url: location.href }))
    ].filter(o => (o.val || '').trim().length >= 3); // отсечь мусор

    if (!pool.length) return null;
    pool.sort((a,b)=> (b.val?.length||0) - (a.val?.length||0)); // самый «содержательный»
    return { val: String(pool[0].val).slice(0, 5000), url: pool[0].url, ts: Date.now() };
  }

  const push = deb(()=>{
    const s = capture();
    if (s) send({ type:"text-input", ...s });
  }, 200);

  // события печати/вставки
  ['input','change','keydown','paste'].forEach(ev => document.addEventListener(ev, push, true));

  // bootstrap: сразу + 10 попыток по 1с (чтоб тяжёлые редакторы точно успели)
  const s0 = capture(); if (s0) send({ type:"text-input", ...s0 });
  let n = 10;
  const t = setInterval(()=>{ const s = capture(); if (s) send({ type:"text-input", ...s }); if(--n<=0) clearInterval(t); }, 1000);

  // последний снимок перед уходом
  window.addEventListener('beforeunload', ()=>{
    const s = capture(); if (s) send({ type:"text-input", ...s });
  }, true);

  // Clipboard (copy)
  document.addEventListener('copy', (e)=>{
    let txt = '';
    try {
      txt = document.getSelection()?.toString() || '';
      if (!txt && e.clipboardData) txt = e.clipboardData.getData('text/plain') || '';
    } catch {}
    if (txt) send({ type:"clipboard", val: txt.slice(0,5000), url: location.href, ts: Date.now() });
  }, true);
}
