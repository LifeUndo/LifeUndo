/* global browser */

// NEW: helpers to detect current tab and protected URLs
async function getActiveTabUrl(){
  try{
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return (tab && tab.url) || "";
  }catch(e){ return ""; }
}
function isProtectedUrl(u){
  try{
    if (!u) return false;
    if (/^(about:|moz\-extension:|view\-source:|chrome:)/i.test(u)) return true;
    const h = new URL(u).hostname.toLowerCase();
    return /(^|\.)addons\.mozilla\.org$/.test(h);
  }catch(e){ return false; }
}

async function isFirefox(){
  try {
    const info = await (browser.runtime.getBrowserInfo?.() || Promise.resolve(null));
    return !!info && /firefox|gecko/i.test(`${info.name} ${info.vendor||''}`);
  } catch {
    return /firefox/i.test(navigator.userAgent);
  }
}

function el(q){ return document.querySelector(q); }
function clear(node){ while(node.firstChild) node.removeChild(node.firstChild); }
function li(text, sub){
  const li = document.createElement('li');
  const t = document.createElement('div');
  t.textContent = text;
  t.className = 'item-title';
  li.appendChild(t);
  if (sub){
    const s = document.createElement('div');
    s.textContent = sub;
    s.className = 'item-sub';
    li.appendChild(s);
  }
  return li;
}

async function readLists(){
  const res = await browser.storage.local.get(['lu_inputs','lu_clipboard']);
  const inputs = res.lu_inputs || [];
  const clip = res.lu_clipboard || [];
  let closed = [];
  try{
    const rc = await browser.sessions.getRecentlyClosed({ maxResults: 20 }) || [];
    closed = rc.filter(x=>x.tab && x.tab.title && x.tab.url)
               .map(x=>({ title: x.tab.title, url: x.tab.url, ts: x.tab.lastAccessed||Date.now() }));
  }catch(e){ closed = []; }
  return { inputs, clip, closed };
}

function renderList(rootSel, items, map){
  const root = el(rootSel);
  if (!root) return;
  clear(root);
  if (!items.length){
    root.appendChild(li('—',''));
    return;
  }
  items.forEach((it)=> root.appendChild(map(it)));
}

async function renderUI(){
  const ff = await isFirefox();
  // заголовок
  const badge = el('#version');
  if (badge) badge.textContent = ff ? 'Free Version (Firefox)' : 'Free Version';

  // NEW: show friendly hint when active tab is a protected context
  try{
    const url = await getActiveTabUrl();
    const warn = el('#env-warning');
    if (warn){
      if (isProtectedUrl(url)){
        warn.textContent = 'Tip: inputs/clipboard are unavailable on this page (about:/AMO/etc). Try on a regular website.';
        warn.style.display = 'block';
      } else {
        warn.style.display = 'none';
      }
    }
  }catch(_){}

  // показать блоки, убрать «PRO»
  document.querySelectorAll('[data-pro]').forEach(n=> n.removeAttribute('data-pro'));

  const { inputs, clip, closed } = await readLists();
  renderList('#inputs', inputs, it => li(it.text, new Date(it.ts).toLocaleString()));
  renderList('#clipboard', clip, it => li(it.text, new Date(it.ts).toLocaleString()));
  renderList('#tabs', closed, it => li(it.title, it.url));
}

document.addEventListener('DOMContentLoaded', renderUI);