const api = (typeof browser!=='undefined') ? browser : chrome;
const $ = sel => document.querySelector(sel);
const flash = (m, ok=false)=>{ const el=$('#flash'); if(el){ el.textContent=m; el.className='flash '+(ok?'ok':'err'); } };

// ---- utils ----
function canonicalStringify(v){ 
  if(Array.isArray(v)) return '['+v.map(canonicalStringify).join(',')+']';
  if(v && typeof v==='object') return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonicalStringify(v[k])).join(',')+'}';
  return JSON.stringify(v); 
}

function b64ToBytes(b64){ 
  b64=b64.replace(/-/g,'+').replace(/_/g,'/'); 
  const pad=b64.length%4; 
  if(pad) b64+='='.repeat(4-pad); 
  const bin=atob(b64); 
  const u=new Uint8Array(bin.length); 
  for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); 
  return u; 
}

function derToRaw(der){ 
  let i=0; 
  if(der[i++]!==0x30) throw 0; 
  if(der[i]&0x80){ i+=der[i]-0x80+1; } else { i++; }
  if(der[i++]!==0x02) throw 0; 
  let rl=der[i++]; 
  while(der[i]===0x00){i++; rl--;} 
  const r=der.slice(i,i+rl); 
  i+=rl; 
  if(der[i++]!==0x02) throw 0; 
  let sl=der[i++]; 
  while(der[i]===0x00){i++; sl--;} 
  const s=der.slice(i,i+sl); 
  const out=new Uint8Array(64); 
  out.set(r,32-r.length); 
  out.set(s,64-s.length); 
  return out; 
}

async function importJwk(jwk){ 
  return crypto.subtle.importKey('jwk', jwk, {name:'ECDSA', namedCurve:'P-256'}, false, ['verify']); 
}

// запасной публичный ключ внутри расширения
const LICENSE_PUB_KEY_JWK = { 
  "kty":"EC","crv":"P-256","alg":"ES256","ext":true,"key_ops":["verify"],
  "x":"DKcbUAWx-zLJDi8KHeQW8AjwHmkYW2-cCxdWUj9SgUg",
  "y":"yetNtsQHQ8hK5gSmZTfalZmxRmDhEol33XOG76s-JUQ" 
};

async function verifyLicenseSignature(obj){
  if(!obj?.license || !obj?.signature?.sig_b64) throw new Error('Invalid license object');
  const jwk = obj.signature.publicKeyJwk || LICENSE_PUB_KEY_JWK;
  const key = await importJwk(jwk);
  const data = new TextEncoder().encode(canonicalStringify(obj.license));
  const raw  = b64ToBytes(obj.signature.sig_b64);
  const candidates = [raw]; 
  try{ candidates.push(derToRaw(raw)); }catch(_){}
  for(const sig of candidates){ 
    try{
      const ok = await crypto.subtle.verify({name:'ECDSA', hash:'SHA-256'}, key, sig, data);
      if(ok) return true;
    }catch(_){}
  } 
  return false;
}

async function parseLifelicFile(file){
  const txt=(await file.text()).trim();
  if(txt.startsWith('{')) return JSON.parse(txt);
  const m=txt.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if(!m) throw new Error('Unknown .lifelic format');
  return JSON.parse(atob(m[1].replace(/[^A-Za-z0-9+/_=-]/g,'')));
}

// ---- UI ----
async function doVipImport(file){
  const btn=$('#btnVip'); 
  btn?.classList.add('loading'); 
  flash('Importing…', true);
  try{
    const obj = await parseLifelicFile(file);
    const ok  = await verifyLicenseSignature(obj);
    if(!ok) throw new Error('Signature invalid');
    await api.storage.local.set({ license: obj.license, signature: obj.signature, tier: 'vip' });
    flash('VIP activated ✅', true);
    await api.runtime.sendMessage({type:'license-updated'});
    await render();
  }catch(e){ 
    console.error('[VIP] import failed:', e); 
    flash('Import error: '+(e.message||e), false); 
  }
  finally{ 
    btn?.classList.remove('loading'); 
  }
}

async function render(){
  const { license } = await api.storage.local.get('license');
  const isVip = !!(license && license.plan==='vip' && (!license.expiry || new Date(license.expiry)>=new Date()));
  
  // заголовок плана
  const planEl = document.querySelector('#planLabel'); 
  if(planEl) planEl.textContent = isVip ? 'VIP' : 'Free Version';
  
  // кнопки
  const vipBtn=$('#btnVip'), proBtn=$('#btnPro');
  if(isVip){ 
    if(proBtn) proBtn.style.display='none'; 
    if(vipBtn){ vipBtn.disabled=true; vipBtn.textContent='VIP active'; } 
  }
  else{ 
    if(proBtn) proBtn.style.display=''; 
    if(vipBtn){ vipBtn.disabled=false; vipBtn.textContent='Activate VIP'; } 
  }
  
  // спрятать PRO/Trial при VIP
  document.querySelectorAll('.badge').forEach(el=> el.style.display = isVip ? 'none' : '');
  
  // обновить версию
  const manifest = await api.runtime.getManifest();
  const versionEl = $('#version');
  if (versionEl) versionEl.textContent = `v${manifest.version}`;
}

// навешиваем обработчики ПОСЛЕ готовности DOM
document.addEventListener('DOMContentLoaded', ()=>{
  const file=$('#vipFile'), btn=$('#btnVip');
  btn?.addEventListener('click', ()=> file?.click());
  file?.addEventListener('change', e=>{ const f=e.target.files?.[0]; if(f) doVipImport(f); });
  
  // другие обработчики
  $('#btnPro')?.addEventListener('click', ()=> $('#proStub').classList.remove('hidden'));
  $('#whatsnew')?.addEventListener('click', ()=> $('#changelog').classList.remove('hidden'));
  
  // модальные окна
  $('#closeChangelog')?.addEventListener('click', ()=> $('#changelog').classList.add('hidden'));
  $('#backdrop')?.addEventListener('click', ()=> $('#changelog').classList.add('hidden'));
  $('#closeProStub')?.addEventListener('click', ()=> $('#proStub').classList.add('hidden'));
  $('#proBackdrop')?.addEventListener('click', ()=> $('#proStub').classList.add('hidden'));
  $('#closeProStubBtn')?.addEventListener('click', ()=> $('#proStub').classList.add('hidden'));
  
  $('#openPricing')?.addEventListener('click', ()=> window.open('https://lifeundo.com/pricing', '_blank'));
  
  // ссылки
  $('#lnk-website')?.addEventListener('click', ()=> window.open('https://lifeundo.com', '_blank'));
  $('#lnk-privacy')?.addEventListener('click', ()=> window.open('https://lifeundo.com/privacy', '_blank'));
  $('#lnk-support')?.addEventListener('click', ()=> window.open('https://t.me/lifeundo', '_blank'));
  $('#lnk-settings')?.addEventListener('click', ()=> api.runtime.openOptionsPage());
  
  // ESC для закрытия модалов
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $('#changelog').classList.add('hidden');
      $('#proStub').classList.add('hidden');
    }
  });
  
  // инициализация
  render();
});

// обновление лицензии
api.runtime.onMessage.addListener(msg=>{ 
  if(msg?.type==='license-updated') render(); 
});