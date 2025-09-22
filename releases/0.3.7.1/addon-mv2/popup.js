const $ = (q) => document.querySelector(q);
const listText = $('#list-text');
const listTabs = $('#list-tabs');
const listClip = $('#list-clip');

const hintText = $('#hint-text');
const hintTabs = $('#hint-tabs');
const hintClip = $('#hint-clip');

$('#clear-text').addEventListener('click', async ()=>{
  await browser.runtime.sendMessage({ type: 'clear', target: 'text' });
  await refresh();
});
$('#clear-clip').addEventListener('click', async ()=>{
  await browser.runtime.sendMessage({ type: 'clear', target: 'clip' });
  await refresh();
});

// Простейшее переключение языка (подписи в попапе)
const i18n = {
  en: {
    text_title: "Latest text inputs",
    text_hint: "Type something on any regular page and refresh — entries will appear here.",
    tabs_title: "Recently closed tabs",
    tabs_hint: "Close a couple of tabs on a normal site — they will appear here.",
    clip_title: "Clipboard history",
    clip_hint: "Copy 2–3 pieces of text (Ctrl/Cmd+C) — items will appear here.",
    clear_text: "Clear Text",
    clear_clip: "Clear Clipboard",
    site: "Website", privacy: "Privacy", support: "Support", license: "License",
  },
  ru: {
    text_title: "Недавние вводы текста",
    text_hint: "Наберите текст на обычной странице и обновите — записи появятся здесь.",
    tabs_title: "Недавно закрытые вкладки",
    tabs_hint: "Закройте пару вкладок на обычном сайте — они появятся здесь.",
    clip_title: "История буфера",
    clip_hint: "Скопируйте 2–3 фрагмента (Ctrl/Cmd+C) — элементы появятся здесь.",
    clear_text: "Очистить текст",
    clear_clip: "Очистить буфер",
    site: "Сайт", privacy: "Приватность", support: "Поддержка", license: "Лицензия",
  }
};
let lang = 'en';
$('#btn-en').addEventListener('click', ()=>{ lang='en'; applyI18n(); });
$('#btn-ru').addEventListener('click', ()=>{ lang='ru'; applyI18n(); });

function applyI18n() {
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if (dict[k]) el.textContent = dict[k];
  });
}

function fmtTime(ts){
  try { return new Date(ts).toLocaleTimeString(); } catch(e){ return ''; }
}

function strip(s){ return String(s ?? '').replace(/\s+/g,' ').trim(); }

async function copyToClipboard(text){
  try { await navigator.clipboard.writeText(text); }
  catch (e) { /* ignore */ }
}

function renderList(container, items, type){
  container.innerHTML = '';
  if (!items || !items.length) return;

  for (const it of items) {
    const li = document.createElement('li');
    li.className = 'item';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = fmtTime(it.ts || Date.now());

    const txt = document.createElement('div');
    txt.className = 'txt';
    txt.textContent = strip(it.title || it.val || it.url || '');

    const act = document.createElement('div');
    act.className = 'act';

    if (type === 'text' || type === 'clip') {
      const btn = document.createElement('button');
      btn.className = 'copy';
      btn.textContent = lang === 'ru' ? 'Скопировать' : 'Copy';
      btn.addEventListener('click', ()=> copyToClipboard(it.val || ''));
      act.appendChild(btn);
    } else if (type === 'tabs') {
      const btn = document.createElement('button');
      btn.className = 'restore';
      btn.textContent = lang === 'ru' ? 'Восстановить' : 'Restore';
      btn.addEventListener('click', async ()=>{
        if (it.sessionId) {
          await browser.runtime.sendMessage({ type: 'restore-session', sessionId: it.sessionId });
          await refresh();
        }
      });
      act.appendChild(btn);
    }

    li.appendChild(meta);
    li.appendChild(txt);
    li.appendChild(act);
    container.appendChild(li);
  }
}

async function refresh(){
  const state = await browser.runtime.sendMessage({ type: 'pull-state' });
  // ТЕКСТ
  const textItems = (state.text || []).slice(0, 20);
  renderList(listText, textItems, 'text');
  hintText.style.display = textItems.length ? 'none' : 'block';

  // ВКЛАДКИ (sessions API)
  const tabs = [];
  for (const e of (state.recent || [])) {
    if (e.tab && e.tab.title && e.tab.sessionId) {
      tabs.push({ title: e.tab.title, url: e.tab.url, ts: e.tab.lastAccessed || Date.now(), sessionId: e.tab.sessionId });
    } else if (e.window && e.window.sessionId) {
      tabs.push({ title: '[Window]', url: '', ts: Date.now(), sessionId: e.window.sessionId });
    }
  }
  renderList(listTabs, tabs.slice(0, 20), 'tabs');
  hintTabs.style.display = tabs.length ? 'none' : 'block';

  // БУФЕР
  const clips = (state.clip || []).slice(0, 20);
  renderList(listClip, clips, 'clip');
  hintClip.style.display = clips.length ? 'none' : 'block';
}

applyI18n();
refresh();
