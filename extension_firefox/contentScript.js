// Firefox MV2 content script (same logic)

function getElementPath(element) {
  if (!element) return '';
  const path = [];
  let el = element;
  while (el && el.nodeType === 1 && path.length < 10) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) selector += `#${el.id}`;
    if (el.className && typeof el.className === 'string') {
      const cls = el.className.trim().split(/\s+/).slice(0, 2).join('.');
      if (cls) selector += `.${cls}`;
    }
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(' > ');
}

let lastValueSample = '';
let lastSentAt = 0;

function maybeSendTextState(target) {
  if (!target || !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable)) return;
  const value = target.isContentEditable ? target.textContent : target.value;
  if (typeof value !== 'string') return;
  const sample = value.slice(0, 1000);
  const now = Date.now();
  if (sample === lastValueSample && now - lastSentAt < 5000) return;
  lastValueSample = sample;
  lastSentAt = now;
  chrome.runtime.sendMessage({ type: 'LU_PUSH_TEXT_STATE', payload: { value: sample, path: getElementPath(target) } }).catch(() => {});
}

document.addEventListener('input', (e) => {
  const target = e.target;
  maybeSendTextState(target);
}, { capture: true });

document.addEventListener('keyup', (e) => {
  const target = e.target;
  if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
    maybeSendTextState(target);
  }
}, { capture: true });

document.addEventListener('copy', () => {
  const text = document.getSelection()?.toString() || '';
  if (text) {
    chrome.runtime.sendMessage({ type: 'LU_PUSH_CLIPBOARD', payload: { value: text.slice(0, 2000) } }).catch(() => {});
  }
}, { capture: true });

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'LU_RESTORE_TEXT') {
    const active = document.activeElement;
    const value = message.payload?.value || '';
    if (active && (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement)) {
      active.value = value;
      active.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (active && active.isContentEditable) {
      active.textContent = value;
      active.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
});




