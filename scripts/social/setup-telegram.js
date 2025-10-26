#!/usr/bin/env node
/* Telegram Bot profile setup
   Env:
     TG_BOT_TOKEN (required)
   Actions:
     - setMyName (ru/en)
     - setMyDescription (ru/en)
     - setMyShortDescription (ru/en)
     - setMyCommands (ru/en)
*/

const fetch = global.fetch || require('node-fetch');

let TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
if (!TG_BOT_TOKEN) {
  // allow --token CLI arg as fallback
  const argToken = process.argv.find(a => a.startsWith('--token='))?.split('=')[1] || null;
  TG_BOT_TOKEN = argToken || null;
}
if (!TG_BOT_TOKEN) {
  console.error('TG_BOT_TOKEN env is required (or pass --token=...)');
  process.exit(2);
}

const API = (method) => `https://api.telegram.org/bot${TG_BOT_TOKEN}/${method}`;

async function call(method, body) {
  const res = await fetch(API(method), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method} failed: ${res.status} ${JSON.stringify(json)}`);
  return json.result;
}

async function setNames() {
  await call('setMyName', { name: 'GetLifeUndo' });
  await call('setMyName', { name: 'GetLifeUndo', language_code: 'en' });
  await call('setMyName', { name: 'GetLifeUndo', language_code: 'ru' });
}

async function setDescriptions() {
  const desc_en = 'GetLifeUndo — Ctrl+Z for your browser. Restore form text, reopen closed tabs and keep clipboard history. 100% local on your device: no cloud, no telemetry, no tracking. Fast, private, productivity-first.';
  const short_en = 'Restore forms, tabs, clipboard — 100% local.';
  const desc_ru = 'GetLifeUndo — Ctrl+Z для браузера. Возвращает текст форм, недавно закрытые вкладки и историю буфера обмена. 100% локально на вашем устройстве: без облака, телеметрии и трекинга. Быстро, приватно, для продуктивности.';
  const short_ru = 'Формы, вкладки, буфер — 100% локально.';

  await call('setMyDescription', { description: desc_en });
  await call('setMyShortDescription', { short_description: short_en });

  await call('setMyDescription', { description: desc_en, language_code: 'en' });
  await call('setMyShortDescription', { short_description: short_en, language_code: 'en' });

  await call('setMyDescription', { description: desc_ru, language_code: 'ru' });
  await call('setMyShortDescription', { short_description: short_ru, language_code: 'ru' });
}

async function setCommands() {
  const cmds_en = [
    { command: 'start', description: 'About GetLifeUndo' },
    { command: 'site', description: 'Open website' },
    { command: 'downloads', description: 'Download GetLifeUndo' },
    { command: 'privacy', description: 'Privacy policy' },
    { command: 'terms', description: 'Terms of service' },
    { command: 'help', description: 'Contact support' },
  ];
  const cmds_ru = [
    { command: 'start', description: 'О проекте GetLifeUndo' },
    { command: 'site', description: 'Открыть сайт' },
    { command: 'downloads', description: 'Скачать GetLifeUndo' },
    { command: 'privacy', description: 'Политика конфиденциальности' },
    { command: 'terms', description: 'Условия использования' },
    { command: 'help', description: 'Связаться с поддержкой' },
  ];
  await call('setMyCommands', { commands: cmds_en });
  await call('setMyCommands', { commands: cmds_en, language_code: 'en' });
  await call('setMyCommands', { commands: cmds_ru, language_code: 'ru' });
}

async function main() {
  await setNames();
  await setDescriptions();
  await setCommands();
  console.log('Telegram bot profile configured (name, descriptions, commands)');
}

main().catch(e => { console.error(e); process.exit(1); });
