// LifeUndo Popup
import { LINKS } from './constants.js';

const textList = document.getElementById('textList');
const tabList = document.getElementById('tabList');
const clipList = document.getElementById('clipList');
const undoBtn = document.getElementById('undoBtn');
const upgradeBtn = document.getElementById('upgradeBtn');
const upgradeSection = document.getElementById('upgradeSection');
const tierInfo = document.getElementById('tierInfo');
const textProBadge = document.getElementById('textProBadge');
const tabProBadge = document.getElementById('tabProBadge');
const clipProBadge = document.getElementById('clipProBadge');

let currentLimits = null;
let currentTier = 'free';

function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  const { className, text, attrs } = options;
  if (className) el.className = className;
  if (typeof text === 'string') el.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
  return el;
}

function showProBadges() {
  if (currentTier === 'free') {
    textProBadge.classList.remove('hidden');
    tabProBadge.classList.remove('hidden');
    clipProBadge.classList.remove('hidden');
    upgradeSection.classList.remove('hidden');
  } else {
    textProBadge.classList.add('hidden');
    tabProBadge.classList.add('hidden');
    clipProBadge.classList.add('hidden');
    upgradeSection.classList.add('hidden');
  }
}

function updateTierInfo() {
  if (currentTier === 'trial') {
    tierInfo.textContent = 'Trial Active - Upgrade to keep Pro features';
  } else if (currentTier === 'pro') {
    tierInfo.textContent = 'Pro License Active';
  } else {
    tierInfo.textContent = 'Free Version - Upgrade for more storage';
  }
}

function render() {
  chrome.runtime.sendMessage({ type: 'LU_GET_STATE' }, (resp) => {
    if (!resp?.ok) return;
    const { lu_text_history = [], lu_tab_history = [], lu_clipboard_history = [], limits } = resp.data || {};
    
    currentLimits = limits;
    currentTier = limits?.tier || 'free';
    
    showProBadges();
    updateTierInfo();

    textList.innerHTML = '';
    lu_text_history.forEach((t) => {
      const snippet = (t.value || '').slice(0, 120).replace(/[\n\r]+/g, ' ');
      const item = createElement('div', { className: 'item' });
      const mono = createElement('div', { className: 'mono', text: snippet || '(empty)' });
      const muted = createElement('div', { className: 'muted', text: new Date(t.ts).toLocaleTimeString() });
      item.appendChild(mono);
      item.appendChild(muted);
      textList.appendChild(item);
    });

    tabList.innerHTML = '';
    lu_tab_history.forEach((t) => {
      const item = createElement('div', { className: 'item' });
      const a = createElement('a', { attrs: { href: '#' } });
      a.textContent = t.title || t.url;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: t.url, active: true });
      });
      const muted = createElement('div', { className: 'muted', text: new Date(t.closedAt).toLocaleTimeString() });
      item.appendChild(a);
      item.appendChild(muted);
      tabList.appendChild(item);
    });

    clipList.innerHTML = '';
    lu_clipboard_history.forEach((c) => {
      const snippet = (c.value || '').slice(0, 120).replace(/[\n\r]+/g, ' ');
      const item = createElement('div', { className: 'item row' });
      const mono = createElement('div', { className: 'mono', text: snippet || '(empty)' });
      mono.style.flex = '1';
      const btn = createElement('button', { text: 'Copy' });
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(c.value || '');
        } catch {}
      });
      item.appendChild(mono);
      item.appendChild(btn);
      clipList.appendChild(item);
    });
  });
}

// Increment popup opens counter
chrome.runtime.sendMessage({ type: 'LU_INCREMENT_STAT', payload: { stat: 'popupOpens' } });

undoBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'LU_UNDO_LAST' }, (resp) => {
    render();
  });
});

upgradeBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

render();

