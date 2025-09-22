// LifeUndo Options Page - Firefox
const api = (typeof browser !== 'undefined') ? browser : chrome;

const $ = s => document.querySelector(s);
const file = $('#lifelic'), st = $('#status');
const ok = m => { st.textContent = m; st.className = 'ok'; };
const err = m => { st.textContent = m; st.className = 'err'; };
const info = m => { st.textContent = m; st.className = 'muted'; };

function parseLifelic(txt) {
  const t = txt.trim();
  if (t.startsWith('{')) return JSON.parse(t); // JSON
  const m = t.match(/BEGIN\s+LIFEUNDO\s+LICENSE-----([\s\S]*?)-----END/i);
  if (!m) throw new Error('Unknown license format');
  const b64 = m[1].replace(/[^A-Za-z0-9+/=]/g, '');
  return JSON.parse(atob(b64)); // armored -> JSON
}

async function loadSaved() {
  const { license, signature } = await api.storage.local.get(['license', 'signature']);
  if (license && signature) ok(`Found license (plan: ${license.plan}, exp: ${license.expiry || '—'})`);
  else info('No license installed');
}

async function handleFile(f) {
  try {
    const obj = parseLifelic(await f.text());
    const passed = await License.verifyToken(JSON.stringify(obj));
    if (!passed) throw new Error('Signature check failed. Verify public key and format.');
    await License.importAndSave(obj);
    ok(`License installed ✅ (plan: ${obj.license.plan})`);
    try { api.runtime.sendMessage({ type: 'license-updated' }); } catch {}
  } catch (e) { err(e.message); }
}

function bind() {
  $('#btnImport').addEventListener('click', () => file.click());
  file.addEventListener('change', () => file.files[0] && handleFile(file.files[0]));
  $('#btnVerify').addEventListener('click', async () => {
    const obj = await api.storage.local.get(['license', 'signature']);
    if (!obj.license) return err('No license found');
    const valid = await License.verifyToken(JSON.stringify(obj));
    ok(valid ? 'Signature valid ✅' : 'Signature invalid ❌');
  });
  $('#btnClear').addEventListener('click', async () => {
    await api.storage.local.remove(['license', 'signature']);
    info('License removed');
  });
  loadSaved();
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', bind) : bind();