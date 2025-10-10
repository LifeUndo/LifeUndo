/* global chrome */
async function isChrome(){
  try {
    return !!chrome.runtime && chrome.runtime.getManifest().manifest_version === 3;
  } catch {
    return /chrome/i.test(navigator.userAgent);
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
  const res = await chrome.storage.local.get(['lu_inputs','lu_clipboard']);
  const inputs = res.lu_inputs || [];
  const clip = res.lu_clipboard || [];
  let closed = [];
  
  try{
    // Use message passing for MV3
    const response = await chrome.runtime.sendMessage({ action: 'getRecentlyClosed' });
    if (response && response.success) {
      closed = response.tabs || [];
    }
  }catch(e){ 
    console.error('Sessions error:', e);
    closed = []; 
  }
  
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
  const chrome = await isChrome();
  // заголовок
  const badge = el('#version');
  if (badge) badge.textContent = chrome ? 'Free Version (Chrome)' : 'Free Version';

  // показать блоки, убрать «PRO»
  document.querySelectorAll('[data-pro]').forEach(n=> n.removeAttribute('data-pro'));

  const { inputs, clip, closed } = await readLists();
  renderList('#inputs', inputs, it => li(it.text, new Date(it.ts).toLocaleString()));
  renderList('#clipboard', clip, it => li(it.text, new Date(it.ts).toLocaleString()));
  renderList('#tabs', closed, it => li(it.title, it.url));
}

document.addEventListener('DOMContentLoaded', renderUI);



