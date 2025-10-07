/* global browser */
function el(q){ return document.querySelector(q); }
function clear(n){ while(n.firstChild) n.removeChild(n.firstChild); }
function li(text, sub){
  const li = document.createElement('li');
  const t = document.createElement('div'); t.textContent = text; li.appendChild(t);
  if (sub){ const s = document.createElement('div'); s.textContent = sub; s.className='item-sub'; li.appendChild(s); }
  return li;
}
function fmt(ts){ try{ const d = new Date(ts); return d.toLocaleString([], {hour12:false}); }catch{ return ""; } }
function dedupByText(arr){ const seen=new Set(); return arr.filter(x=>{const k=(x.text||x.title||"").slice(0,512); if(seen.has(k)) return false; seen.add(k); return true;}); }

async function getLocale(){
  try {
    const { uiLocale } = await browser.storage.local.get('uiLocale');
    if (uiLocale) return uiLocale;
  } catch {}
  const l = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return ['en','ru','hi','zh','ar'].includes(l) ? l : 'en';
}

async function getActiveTabUrl(){
  try{ const [tab] = await browser.tabs.query({active:true,currentWindow:true}); return (tab && tab.url) || ""; }
  catch{ return ""; }
}

function isProtectedUrl(u){
  try{
    if (!u) return false;
    if (/^(about:|moz\-extension:|view\-source:|chrome:)/i.test(u)) return true;
    const h = new URL(u).hostname.toLowerCase();
    return /(^|\.)addons\.mozilla\.org$/.test(h);
  }catch{ return false; }
}

async function readLists(){
  try{
    const all = await browser.storage.local.get(null);
    const inputs = all.lu_inputs || [];
    const clip   = all.lu_clipboard || [];
    let closed = [];
    try{
      const rc = await browser.sessions.getRecentlyClosed({maxResults: 15});
      closed = rc.filter(x=>x.tab && x.tab.url && !/^about:/.test(x.tab.url))
                 .map(x=>({ title: x.tab.title || x.tab.url, url: x.tab.url }));
    }catch{} // sessions may be restricted
    return { inputs, clip, closed };
  }catch{ return { inputs:[], clip:[], closed:[] }; }
}

function renderList(sel, arr, map){
  const box = el(sel);
  if (!box) return;
  clear(box);
  arr.forEach(it => {
    const sub = it.ts ? fmt(it.ts) : undefined;
    box.appendChild(map ? map(it) : li(it.text || it.title || String(it), sub));
  });
}

async function show7DayHint(locale){
  try {
    const st = await browser.storage.local.get(['installTime','upgradeHintDismissed']);
    if (!st.installTime) await browser.storage.local.set({ installTime: Date.now() });
    const show = !st.upgradeHintDismissed && Date.now() - (st.installTime || Date.now()) > 7*24*3600*1000;
    
    if (show) {
      const w = document.createElement('div');
      w.className = 'note';
      w.style.marginTop = '6px';
      
      const text = locale === 'ru' 
        ? 'Нравится LifeUndo? ' 
        : 'Enjoying LifeUndo? ';
      const linkText = locale === 'ru' ? 'Открыть PRO/VIP' : 'Unlock PRO/VIP';
      
      const span = document.createElement('span');
      span.textContent = text;
      
      const a = document.createElement('a');
      a.href = '#';
      a.style.color = '#9bb4ff';
      a.textContent = linkText;
      a.onclick = (e) => {
        e.preventDefault();
        browser.tabs.create({ url: `https://getlifeundo.com/${locale}/pricing` });
      };
      
      const x = document.createElement('span');
      x.id = 'hintClose';
      x.textContent = '×';
      x.style.float = 'right';
      x.style.cursor = 'pointer';
      x.onclick = async () => {
        await browser.storage.local.set({ upgradeHintDismissed: true });
        w.remove();
      };
      
      w.appendChild(span);
      w.appendChild(a);
      w.appendChild(x);
      
      const header = el('.header');
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(w, header.nextSibling);
      }
    }
  } catch (e) {
    // silent fail
  }
}

async function renderUI(){
  const locale = await getLocale();
  
  const badge = el('#version');
  if (badge) badge.textContent = /firefox/i.test(navigator.userAgent) ? 'Free Version (Firefox)' : 'Free Version';

  // protected hint
  try{
    const url = await getActiveTabUrl();
    const warn = el('#env-warning');
    if (warn){
      if (isProtectedUrl(url)){
        warn.textContent = 'Tip: inputs/clipboard are unavailable on this page (about:/AMO/etc). Try on a regular website.';
        warn.style.display = 'block';
      } else warn.style.display = 'none';
    }
  }catch{}

  const { inputs, clip, closed } = await readLists();
  renderList('#inputs',    dedupByText(inputs), it => li(it.text, it.ts && fmt(it.ts)));
  renderList('#clipboard', dedupByText(clip),   it => li(it.text, it.ts && fmt(it.ts)));
  renderList('#tabs',      dedupByText(closed), it => li(it.title, it.url));
  
  // Show 7-day hint
  await show7DayHint(locale);
  
  // Update footer links with locale
  const links = {
    website: `https://getlifeundo.com/${locale}`,
    privacy: `https://getlifeundo.com/${locale}/privacy`,
    support: `https://getlifeundo.com/${locale}/support`,
    license: `https://getlifeundo.com/${locale}/license`
  };
  
  document.querySelectorAll('nav a').forEach(a => {
    const text = a.textContent.trim().toLowerCase();
    if (text === 'website' && links.website) a.href = links.website;
    else if (text === 'privacy' && links.privacy) a.href = links.privacy;
    else if (text === 'support' && links.support) a.href = links.support;
    else if (text === 'license' && links.license) a.href = links.license;
  });
  
  // Update "Activate VIP" button to open pricing
  const activateBtn = el('#activate');
  if (activateBtn) {
    activateBtn.onclick = () => {
      browser.tabs.create({ url: `https://getlifeundo.com/${locale}/pricing` });
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  el('#clearInputs')?.addEventListener('click', async ()=>{ await browser.storage.local.set({ lu_inputs: [] }); renderUI(); });
  el('#clearClip')?.addEventListener('click',   async ()=>{ await browser.storage.local.set({ lu_clipboard: [] }); renderUI(); });
  renderUI();
});
