const $ = (q) => document.querySelector(q);

// Lists & empty states
const listText = $('#list-text'), emptyText = $('#empty-text');
const listTabs = $('#list-tabs'), emptyTabs = $('#empty-tabs');
const listClip = $('#list-clip'), emptyClip = $('#empty-clip');

// Buttons
const clearTextBtn = $('#clear-text');
const clearClipBtn = $('#clear-clip');
const statusChip = $('#status-chip');

// i18n
const i18n = {
  en:{
    text_title:"Latest text inputs",
    text_empty_title:"Nothing yet",
    text_empty_sub:"Type something on any regular page and refresh — entries will appear here.",
    tabs_title:"Recently closed tabs",
    tabs_empty_title:"Nothing yet",
    tabs_empty_sub:"Close a couple of tabs on a normal site — they will appear here.",
    clip_title:"Clipboard history",
    clip_empty_title:"Nothing yet",
    clip_empty_sub:"Copy 2–3 pieces of text (Ctrl/Cmd+C) — items will appear here.",
    clear_text:"Clear Text", clear_clip:"Clear Clipboard",
    site:"Website", privacy:"Privacy", support:"Support", license:"License",
    status_free:"Free", status_free_ru:"Free Version"
  },
  ru:{
    text_title:"Недавние вводы текста",
    text_empty_title:"Пока пусто",
    text_empty_sub:"Наберите текст на обычной странице и обновите — записи появятся здесь.",
    tabs_title:"Недавно закрытые вкладки",
    tabs_empty_title:"Пока пусто",
    tabs_empty_sub:"Закройте пару вкладок на обычном сайте — они появятся здесь.",
    clip_title:"История буфера",
    clip_empty_title:"Пока пусто",
    clip_empty_sub:"Скопируйте 2–3 фрагмента (Ctrl/Cmd+C) — элементы появятся здесь.",
    clear_text:"Очистить текст", clear_clip:"Очистить буфер",
    site:"Сайт", privacy:"Приватность", support:"Поддержка", license:"Лицензия",
    status_free:"Бесплатная версия"
  }
};
let lang='ru';
$('#btn-en').addEventListener('click',()=>{lang='en';applyI18n();});
$('#btn-ru').addEventListener('click',()=>{lang='ru';applyI18n();});

function applyI18n(){
  const d=i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(d[k]) el.textContent=d[k];
  });
  statusChip.textContent = (lang==='ru'? i18n.ru.status_free : i18n.en.status_free);
}

function fmtTime(ts){ try{return new Date(ts).toLocaleTimeString();}catch(e){return '';} }
function strip(s){ return String(s??'').replace(/\s+/g,' ').trim(); }
async function copyToClipboard(t){ try{ await navigator.clipboard.writeText(t); }catch{} }

function setListVisibility(count, listEl, emptyEl, clearBtn){
  if (count>0){ listEl.hidden=false; emptyEl.style.display='none'; clearBtn && (clearBtn.disabled=false); }
  else{ listEl.hidden=true; emptyEl.style.display='block'; clearBtn && (clearBtn.disabled=true); }
}

function renderList(container, items, type){
  container.innerHTML='';
  for(const it of items){
    const li=document.createElement('li'); li.className='item';
    const meta=document.createElement('div'); meta.className='meta'; meta.textContent=fmtTime(it.ts||Date.now());
    const txt=document.createElement('div'); txt.className='txt'; txt.textContent=strip(it.title||it.val||it.url||'');
    const act=document.createElement('div'); act.className='act';
    if(type==='text'||type==='clip'){
      const b=document.createElement('button'); b.className='copy'; b.textContent=(lang==='ru'?'Скопировать':'Copy'); b.onclick=()=>copyToClipboard(it.val||''); act.appendChild(b);
    }else if(type==='tabs'){
      const b=document.createElement('button'); b.className='restore'; b.textContent=(lang==='ru'?'Восстановить':'Restore');
      b.onclick=async()=>{ if(it.sessionId){ await browser.runtime.sendMessage({type:'restore-session',sessionId:it.sessionId}); await refresh(); } };
      act.appendChild(b);
    }
    li.append(meta,txt,act); container.appendChild(li);
  }
}

$('#clear-text').addEventListener('click', async ()=>{ await browser.runtime.sendMessage({type:'clear',target:'text'}); await refresh(); });
$('#clear-clip').addEventListener('click', async ()=>{ await browser.runtime.sendMessage({type:'clear',target:'clip'}); await refresh(); });

async function refresh(){
  const state = await browser.runtime.sendMessage({ type:'pull-state' });

  const textItems = (state.text||[]).slice(0,20);
  renderList(listText, textItems, 'text');
  setListVisibility(textItems.length, listText, emptyText, clearTextBtn);

  const tabs=[];
  for(const e of (state.recent||[])){
    if(e.tab?.title && e.tab?.sessionId){
      tabs.push({title:e.tab.title,url:e.tab.url,ts:e.tab.lastAccessed||Date.now(),sessionId:e.tab.sessionId});
    } else if(e.window?.sessionId){
      tabs.push({title:'[Window]',url:'',ts:Date.now(),sessionId:e.window.sessionId});
    }
  }
  const tabs20=tabs.slice(0,20);
  renderList(listTabs, tabs20, 'tabs');
  setListVisibility(tabs20.length, listTabs, emptyTabs);

  const clips=(state.clip||[]).slice(0,20);
  renderList(listClip, clips, 'clip');
  setListVisibility(clips.length, listClip, emptyClip, clearClipBtn);
}

applyI18n();
refresh();
