/* global browser */

async function getLocale(){
  try {
    const { uiLocale } = await browser.storage.local.get('uiLocale');
    if (uiLocale) return uiLocale;
  } catch {}
  const l = (navigator.language||'en').slice(0,2).toLowerCase();
  return ['en','ru','hi','zh','ar','kk','tr'].includes(l) ? l : 'en';
}

function openTab(url){ 
  try {
    browser.tabs.create({ url }); 
  } catch (e) {
    console.error('Failed to open tab:', e);
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

async function renderLists(){
  const { inputs, clip, closed } = await readLists();
  
  // Latest text inputs
  const inpList = el('#inputs-list');
  clear(inpList);
  if (inputs.length === 0) {
    inpList.appendChild(li('No text inputs yet', 'Start typing in forms...'));
  } else {
    inputs.slice(0, 10).forEach(item => {
      const liEl = li(item.text, item.origin);
      liEl.onclick = () => {
        navigator.clipboard.writeText(item.text).catch(() => {});
      };
      inpList.appendChild(liEl);
    });
  }
  
  // Clipboard history
  const clipList = el('#clipboard-list');
  clear(clipList);
  if (clip.length === 0) {
    clipList.appendChild(li('No clipboard history', 'Copy some text...'));
  } else {
    clip.slice(0, 10).forEach(item => {
      const liEl = li(item.text, item.origin);
      liEl.onclick = () => {
        navigator.clipboard.writeText(item.text).catch(() => {});
      };
      clipList.appendChild(liEl);
    });
  }
  
  // Recently closed tabs
  const closedList = el('#closed-list');
  clear(closedList);
  if (closed.length === 0) {
    closedList.appendChild(li('No recently closed tabs', 'Close some tabs...'));
  } else {
    closed.slice(0, 10).forEach(item => {
      const liEl = li(item.title, item.url);
      liEl.onclick = () => {
        openTab(item.url);
      };
      closedList.appendChild(liEl);
    });
  }
}

async function checkProtectedPage() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const url = currentTab.url;
      if (url.startsWith('about:') || url.startsWith('moz-extension:') || url.includes('addons.mozilla.org')) {
        const warning = el('#protected-warning');
        if (warning) {
          warning.style.display = 'block';
          warning.textContent = 'Protected page detected. Data collection disabled for security.';
        }
      }
    }
  } catch (e) {
    console.error('Error checking protected page:', e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderLists();
  await checkProtectedPage();
  
  // Локализация ссылок
  const locale = await getLocale();
  const L = {
    website:  `https://getlifeundo.com/${locale}`,
    privacy:  `https://getlifeundo.com/${locale}/privacy`,
    support:  `https://getlifeundo.com/${locale}/support`,
    license:  `https://getlifeundo.com/${locale}/license`,
    pricing:  `https://getlifeundo.com/${locale}/pricing`,
  };
  
  // Обновить кнопку Activate VIP
  document.querySelector('#activate')?.addEventListener('click', () => openTab(L.pricing));
  
  // Обновить ссылки в футере
  document.querySelector('a[data-k="website"]')?.setAttribute('href', L.website);
  document.querySelector('a[data-k="privacy"]')?.setAttribute('href', L.privacy);
  document.querySelector('a[data-k="support"]')?.setAttribute('href', L.support);
  document.querySelector('a[data-k="license"]')?.setAttribute('href', L.license);
  
  // Clear buttons
  el('#clear-inputs')?.addEventListener('click', async () => {
    await browser.storage.local.remove('lu_inputs');
    await renderLists();
  });
  
  el('#clear-clipboard')?.addEventListener('click', async () => {
    await browser.storage.local.remove('lu_clipboard');
    await renderLists();
  });
});