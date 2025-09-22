// Контент-скрипт: сбор текста/буфера на всех обычных страницах (в т.ч. contentEditable, iframes)
const API = typeof browser !== 'undefined' ? browser : chrome;

const send = (msg) => API.runtime.sendMessage(msg).catch(()=>{});
const deb = (fn, t=300)=>{ let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a),t); }; };

function collectNodes(){
  const inputs = [...document.querySelectorAll('textarea, input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"]')];
  const edits  = [...document.querySelectorAll('[contenteditable],[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]')]
    .filter(el => el && typeof el.innerText === 'string');
  return { inputs, edits };
}

function captureTextState() {
  const { inputs, edits } = collectNodes();
  const pool = [
    ...inputs.map(el => ({ val: el.value ?? '', url: location.href })),
    ...edits.map(el => ({ val: el.innerText ?? '', url: location.href }))
  ].filter(o => (o.val || '').trim().length >= 3);

  if (!pool.length) return null;
  pool.sort((a,b)=> (b.val?.length||0) - (a.val?.length||0));
  return { val: String(pool[0].val).slice(0, 5000), url: pool[0].url, ts: Date.now() };
}

const pushText = deb(()=>{
  const s = captureTextState();
  if (s) send({ type:"text-input", ...s });
}, 200);

['input','change','keydown','paste'].forEach(ev => document.addEventListener(ev, pushText, true));

window.addEventListener('beforeunload', ()=>{
  const s = captureTextState();
  if (s) send({ type:"text-input", ...s });
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
