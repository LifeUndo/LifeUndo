#!/usr/bin/env node
/* Simple social poster (dry-run by default)
   Env:
     DRY_RUN=true|false
     TG_BOT_TOKEN
     TG_CHANNEL
     X_BEARER_TOKEN
     REDDIT_CLIENT_ID, REDDIT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD (optional)
     POST_LIMIT (default 1)
*/

const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

// CLI args fallback
const args = process.argv.slice(2);
function argVal(name, def = undefined) {
  const p = args.find(a => a.startsWith(`--${name}=`));
  if (!p) return def;
  const v = p.split('=')[1];
  return v === undefined ? def : v;
}

const DRY_RUN = String(argVal('dry-run', process.env.DRY_RUN ?? 'true')).toLowerCase() !== 'false';
const POST_LIMIT = parseInt(argVal('post-limit', process.env.POST_LIMIT ?? '1'), 10);

const TG_BOT_TOKEN = argVal('token', process.env.TG_BOT_TOKEN);
const TG_CHANNEL = argVal('channel', process.env.TG_CHANNEL ?? '@GetLifeUndo');
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN;

function loadContent() {
  const p = path.join(__dirname, 'content.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function ensureOutputDir() {
  const out = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
  return out;
}

function loadPosted() {
  const out = ensureOutputDir();
  const p = path.join(out, 'posted.json');
  if (!fs.existsSync(p)) return { ids: [] };
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return { ids: [] }; }
}

function savePosted(data) {
  const out = ensureOutputDir();
  const p = path.join(out, 'posted.json');
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function isDue(it) {
  if (!it.date) return true;
  const today = new Date();
  const d = new Date(it.date + 'T00:00:00');
  return d <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function withDownloadLink(text, locale) {
  const t = String(text || '');
  if (/\/downloads/i.test(t) || /getlifeundo\.com\/\w+\/downloads/i.test(t)) return t;
  const ru = '\n\n<b>Скачать</b>\n• https://getlifeundo.com/ru/downloads';
  const en = '\n\n<b>Download</b>\n• https://getlifeundo.com/en/downloads';
  const suffix = (String(locale).toLowerCase() === 'ru') ? ru : en;
  return t + suffix;
}

function splitTg(text, limit = 4096) {
  const parts = [];
  let remaining = String(text || '');
  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf('\n\n', limit);
    if (cut < 0) cut = remaining.lastIndexOf('\n', limit);
    if (cut < 0) cut = limit;
    parts.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut);
  }
  if (remaining) parts.push(remaining);
  return parts;
}

async function postTG(text) {
  if (!TG_BOT_TOKEN) throw new Error('TG_BOT_TOKEN missing (pass --token=...)');
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
  const chunks = splitTg(text);
  let last = null;
  for (const chunk of chunks) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TG_CHANNEL, text: chunk, parse_mode: 'HTML', disable_web_page_preview: false }) });
    if (!res.ok) throw new Error(`TG error ${res.status}`);
    last = await res.json();
  }
  return last;
}

async function postX(text) {
  if (!X_BEARER_TOKEN) throw new Error('X_BEARER_TOKEN missing');
  const url = 'https://api.twitter.com/2/tweets';
  const res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${X_BEARER_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  if (res.status !== 201) throw new Error(`X error ${res.status}`);
  return res.json();
}

async function main() {
  const items = loadContent();
  const state = loadPosted();
  let posted = 0;
  for (const it of items) {
    if (state.ids.includes(it.id)) continue; // already posted
    if (!isDue(it)) continue;                // not yet scheduled
    if (posted >= POST_LIMIT) break;
    for (const platform of it.platforms) {
      const text = withDownloadLink(it.text, it.locale);
      if (DRY_RUN) {
        console.log(`[DRY] ${platform}: ${text.substring(0, 120)}...`);
      } else {
        if (platform === 'tg') {
          const r = await postTG(text);
          console.log('TG ok', r?.result?.message_id || '');
        } else if (platform === 'x') {
          const r = await postX(text);
          console.log('X ok', r?.data?.id || '');
        } else {
          console.log(`Skip unsupported platform: ${platform}`);
        }
      }
    }
    posted++;
    if (!DRY_RUN) {
      state.ids.push(it.id);
      savePosted(state);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
