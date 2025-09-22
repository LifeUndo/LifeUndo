const API = typeof browser !== 'undefined' ? browser : chrome;
const $  = (q)=>document.querySelector(q);

// lists & placeholders
const listText=$('#list-text'), emptyText=$('#empty-text');
const listTabs=$('#list-tabs'), emptyTabs=$('#empty-tabs');
const listClip=$('#list-clip'), emptyClip=$('#empty-clip');

// buttons
const clearTextBtn=$('#clear-text'), clearClipBtn=$('#clear-clip');
const statusChip=$('#status-chip');
const openLicense=$('#open-license');
const btnPro=$('#btn-pro'), btnVip=$('#btn-vip');

// modal refs
const wnBtn=$('#whatsnew'), overlay=$('#wn-overlay'), wnClose=$('#wn-close');

const i18n={
  en:{text_title:"Latest text inputs",text_empty_title:"Nothing yet",text_empty_sub:"Type something on any regular page and refresh — entries will appear here.",
      tabs_title:"Recently closed tabs",tabs_empty_title:"Nothing yet",tabs_empty_sub:"Close a couple of tabs on a normal site — they will appear here.",
      clip_title:"Clipboard history",clip_empty_title:"Nothing yet",clip_empty_sub:"Copy 2–3 pieces of text (Ctrl/Cmd+C) — items will appear here.",
      clear_text:"Clear Text",clear_clip:"Clear Clipboard",site:"Website",privacy:"Privacy",support:"Support",license:"License",
      status_free:"Free · Trial: {d}d {h}h",more:"Show more",less:"Show less"},
  ru:{text_title:"Недавние вводы текста",text_empty_title:"Пока пусто",text_empty_sub:"Наберите текст на обычной странице и обновите — записи появятся здесь.",
      tabs_title:"Недавно закрытые вкладки",tabs_empty_title:"Пока пусто",tabs_empty_sub:"Закройте пару вкладок на обычном сайте — они появятся здесь.",
      clip_title:"История буфера",clip_empty_title:"Пока пусто",clip_empty_sub:"Скопируйте 2–3 фрагмента (Ctrl/Cmd+C) — элементы появятся здесь.",
      clear_text:"Очистить текст",clear_clip:"Очистить буфер",site:"Сайт",privacy:"Приватность",support:"Поддержка",license:"Лицензия",
      status_free:"Бесплатная · Триал: {d}д {h}ч",more:"Показать ещё",less:"Свернуть"}
};
let lang='ru';
$('#btn-en').onclick=()=>{lang='en';applyI18n();refresh();};
$('#btn-ru').onclick=()=>{lang='ru';applyI18n();refresh();};

function applyI18n(){
  const d=i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(d[k]) el.textContent=d[k];
  });
}
function fmtTime(ts){ try{return new Date(ts).toLocaleTimeString();}catch(e){return '';} }
function strip(s){ return String(s??'').replace(/\s+/g,' ').trim(); }
async function copyToClipboard(t){ try{ await navigator.clipboard.writeText(t); }catch{} }

function setListVisibility(count, listEl, emptyEl, clearBtn){
  if (count>0){ listEl.hidden=false; emptyEl.style.display='none'; if(clearBtn) clearBtn.disabled=false; }
  else { listEl.hidden=true; emptyEl.style.display='block'; if(clearBtn) clearBtn.disabled=true; }
}

function addMoreToggle(li){
  const btn=document.createElement('button');
  btn.className='more';
  btn.textContent=i18n[lang].more;
  btn.onclick=()=>{ const ex = li.classList.toggle('expanded'); btn.textContent=ex?i18n[lang].less:i18n[lang].more; };
  return btn;
}

function renderList(container, items, type){
  container.innerHTML='';
  for(const it of items){
    const li=document.createElement('li'); li.className='item';
    const meta=document.createElement('div'); meta.className='meta'; meta.textContent=fmtTime(it.ts||Date.now());
    const txt=document.createElement('div'); txt.className='txt'; txt.textContent=strip(it.title||it.val||it.url||'');
    const act=document.createElement('div'); act.className='act';

    if ((it.val||'').length > 400) act.appendChild(addMoreToggle(li));
    if(type==='text'||type==='clip'){
      const b=document.createElement('button'); b.className='copy'; b.textContent=(lang==='ru'?'Скопировать':'Copy'); b.onclick=()=>copyToClipboard(it.val||''); act.appendChild(b);
    } else if(type==='tabs'){
      const b=document.createElement('button'); b.className='restore'; b.textContent=(lang==='ru'?'Восстановить':'Restore');
      b.onclick=async()=>{ if(it.sessionId){ await API.runtime.sendMessage({type:'restore-session',sessionId:it.sessionId}); await refresh(); } };
      act.appendChild(b);
    }
    li.append(meta,txt,act); container.appendChild(li);
  }
}

function fmtTrial(ms){
  const d=Math.floor(ms/86400000), h=Math.floor((ms%86400000)/3600000);
  const tpl=i18n[lang].status_free; return tpl.replace('{d}',d).replace('{h}',h);
}

$('#clear-text').onclick=async()=>{ await API.runtime.sendMessage({type:'clear',target:'text'}); await refresh(); };
$('#clear-clip').onclick=async()=>{ await API.runtime.sendMessage({type:'clear',target:'clip'}); await refresh(); };
btnPro.onclick=()=>{ window.open('https://lifeundo.ru/pricing/index.html','_blank'); };
btnVip.onclick=()=>{ window.location.href='license.html'; };
openLicense.onclick=(e)=>{ e.preventDefault(); window.location.href='license.html'; };

async function refresh(){
  const state = await API.runtime.sendMessage({ type:'pull-state' });

  if (state.vip) statusChip.textContent = (lang==='ru'?'VIP активен':'VIP active');
  else if (state.pro) statusChip.textContent = 'PRO';
  else statusChip.textContent = fmtTrial(state.trialLeftMs||0);

  const textItems=(state.text||[]).slice(0,20);
  renderList(listText, textItems, 'text');
  setListVisibility(textItems.length, listText, emptyText, clearTextBtn);

  const tabs=[];
  for(const e of (state.recent||[])){
    if(e.tab?.title && e.tab?.sessionId) tabs.push({title:e.tab.title,url:e.tab.url,ts:e.tab.lastAccessed||Date.now(),sessionId:e.tab.sessionId});
    else if(e.window?.sessionId) tabs.push({title:'[Window]',url:'',ts:Date.now(),sessionId:e.window.sessionId});
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

// Trial — авто-обновление раз в минуту
setInterval(async ()=>{ try{
  const st = await API.runtime.sendMessage({type:'pull-state'});
  if (!st.vip && !st.pro) statusChip.textContent = fmtTrial(st.trialLeftMs||0);
}catch{} }, 60_000);

/* Modal */
const openModal=()=>{ overlay.style.display='flex'; };
const closeModal=()=>{ overlay.style.display='none'; };
wnBtn?.addEventListener('click', openModal);
wnClose?.addEventListener('click', closeModal);
overlay?.addEventListener('click', (e)=>{ if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e)=>{ if (overlay.style.display !== 'none' && e.key === 'Escape') closeModal(); });
