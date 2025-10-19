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

const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const POST_LIMIT = parseInt(process.env.POST_LIMIT || '1', 10);

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHANNEL = process.env.TG_CHANNEL || '@GetLifeUndo';
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN;

function loadContent() {
  const p = path.join(__dirname, 'content.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

async function postTG(text) {
  if (!TG_BOT_TOKEN) throw new Error('TG_BOT_TOKEN missing');
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TG_CHANNEL, text }) });
  if (!res.ok) throw new Error(`TG error ${res.status}`);
  return res.json();
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
  let posted = 0;
  for (const it of items) {
    if (posted >= POST_LIMIT) break;
    for (const platform of it.platforms) {
      const text = it.text;
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
  }
}

main().catch(e => { console.error(e); process.exit(1); });
