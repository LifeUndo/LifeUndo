const textList = document.getElementById('textList');
const tabList = document.getElementById('tabList');
const clipList = document.getElementById('clipList');
const undoBtn = document.getElementById('undoBtn');

function el(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

function render() {
  chrome.runtime.sendMessage({ type: 'LU_GET_STATE' }, (resp) => {
    if (!resp?.ok) return;
    const { lu_text_history = [], lu_tab_history = [], lu_clipboard_history = [] } = resp.data || {};

    textList.innerHTML = '';
    lu_text_history.forEach((t) => {
      const snippet = (t.value || '').slice(0, 120).replace(/[\n\r]+/g, ' ');
      const item = el(`<div class="item"><div class="mono">${snippet || '<empty>'}</div><div class="muted">${new Date(t.ts).toLocaleTimeString()}</div></div>`);
      textList.appendChild(item);
    });

    tabList.innerHTML = '';
    lu_tab_history.forEach((t) => {
      const item = el(`<div class="item"><a href="#" data-url="${t.url}">${t.title || t.url}</a><div class="muted">${new Date(t.closedAt).toLocaleTimeString()}</div></div>`);
      item.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: t.url, active: true });
      });
      tabList.appendChild(item);
    });

    clipList.innerHTML = '';
    lu_clipboard_history.forEach((c) => {
      const snippet = (c.value || '').slice(0, 120).replace(/[\n\r]+/g, ' ');
      const item = el(`<div class="item row"><div class="mono" style="flex:1">${snippet || '<empty>'}</div><button>Copy</button></div>`);
      item.querySelector('button').addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(c.value || '');
        } catch {}
      });
      clipList.appendChild(item);
    });
  });
}

undoBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'LU_UNDO_LAST' }, (resp) => {
    render();
  });
});

render();

