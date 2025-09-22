// license.js — офлайн-валидация лицензий для LifeUndo (ECDSA P-256 + SHA-256, публичный ключ в PEM)

const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
PASTE_YOUR_PUBLIC_PEM_HERE
-----END PUBLIC KEY-----`;

const STORAGE_KEY = 'lifeundo_license';

// base64url → ArrayBuffer
function b64urlToBuf(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const bin = atob(s); const buf = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) buf[i]=bin.charCodeAt(i); return buf.buffer; }
// PEM -> ArrayBuffer (SPKI)
function pemToSpki(pem){ const clean=pem.replace(/-----BEGIN PUBLIC KEY-----/,'').replace(/-----END PUBLIC KEY-----/,'').replace(/\s+/g,''); return b64urlToBuf(clean.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')); }
// Канонизация JSON (без поля sig)
function canonicalize(v){ if(Array.isArray(v)) return '['+v.map(canonicalize).join(',')+']'; if(v&&typeof v==='object'){ const k=Object.keys(v).filter(x=>x!=='sig').sort(); return '{'+k.map(x=>JSON.stringify(x)+':'+canonicalize(v[x])).join(',')+'}'; } return JSON.stringify(v); }
async function importPublicKeyFromPem(pem){ const spki=pemToSpki(pem); return crypto.subtle.importKey('spki',spki,{name:'ECDSA',namedCurve:'P-256'},true,['verify']); }

const License = (()=>{ let _pubKeyPromise=null; async function getPublicKey(){ if(!_pubKeyPromise) _pubKeyPromise=importPublicKeyFromPem(PUBLIC_KEY_PEM); return _pubKeyPromise; }
  async function loadFromStorage(){ const { [STORAGE_KEY]:raw } = await browser.storage.local.get(STORAGE_KEY); return raw||null; }
  async function saveToStorage(lic){ await browser.storage.local.set({ [STORAGE_KEY]: lic }); }
  async function clearStorage(){ await browser.storage.local.remove(STORAGE_KEY); }
  async function verify(lic){ if(!lic||typeof lic!=='object'||!lic.sig) return false; const canonical=canonicalize(lic); const data=new TextEncoder().encode(canonical); const sig=b64urlToBuf(lic.sig); const pub=await getPublicKey();
    if(await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},pub,sig,data)) return true;
    const clone={...lic}; delete clone.sig; const raw=new TextEncoder().encode(JSON.stringify(clone));
    return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},pub,sig,raw);
  }
  function isExpired(lic){ if(!lic||!lic.expires) return false; const exp=Date.parse(lic.expires); return isNaN(exp)?true:(Date.now()>exp); }
  function isVip(lic){ return lic&&lic.plan==='VIP'&&lic.scope==='unlimited'; }
  function humanStatus(lic){ if(!lic) return 'Лицензия не установлена.'; if(isVip(lic)) return 'VIP: безлимитная лицензия (unlimited).'; if(isExpired(lic)) return 'Лицензия просрочена.'; const plan=lic.plan||'неизвестно'; if(lic.expires){ const days=Math.ceil((Date.parse(lic.expires)-Date.now())/86400000); return `${plan}: действует ~${days} дн.`; } return `${plan}: бессрочно.`; }
  async function importAndSave(lic){ const ok=await verify(lic); if(!ok) throw new Error('Signature verification failed'); await saveToStorage(lic); return lic; }
  return { loadFromStorage, saveToStorage, clearStorage, verify, isVip, isExpired, humanStatus, importAndSave };
})();
window.License = License;