#!/usr/bin/env node
import { chromium, firefox } from 'playwright';
import fs from 'fs';
import path from 'path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'url';

const FX_EMAIL = process.env.FX_EMAIL || process.env.FIREFOX_EMAIL;
const FX_PASSWORD = process.env.FX_PASSWORD || process.env.FIREFOX_PASSWORD;
const FX_TOTP = process.env.FX_TOTP || '';
const AMO_EDIT_URL = process.env.AMO_EDIT_URL || 'https://addons.mozilla.org/ru/developers/addon/lifeundo/edit';
const BROWSER = (process.env.AMO_BROWSER || 'firefox').toLowerCase();
const HEADLESS = (process.env.HEADLESS ?? 'true') !== 'false';
const DRY_RUN = (process.env.DRY_RUN ?? 'false') === 'true';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = process.env.AMO_CONTENT || path.join(__dirname, 'amo-content.json');

function readJson(p) {
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

async function loginFirefoxAccounts(page) {
  const emailSelector = 'input[type="email"], input#email';
  const passwordSelector = 'input[type="password"], input#password';
  const continueBtn = 'button[type="submit"], button:has-text("Продолжить"), button:has-text("Continue")';

  const hasEmail = await page.$(emailSelector);
  if (hasEmail) {
    if (!FX_EMAIL || !FX_PASSWORD) throw new Error('FX_EMAIL/FX_PASSWORD required');
    await page.fill(emailSelector, FX_EMAIL);
    await page.click(continueBtn).catch(() => {});
    await page.waitForTimeout(500);
    await page.fill(passwordSelector, FX_PASSWORD);
    await page.click(continueBtn);

    const totpInput = await page.waitForSelector('input[autocomplete="one-time-code"], input[name="code"], input[type="tel"]', { timeout: 5000 }).catch(() => null);
    if (totpInput) {
      let code = FX_TOTP;
      if (!code) {
        const rl = readline.createInterface({ input, output });
        code = await rl.question('Enter 2FA code: ');
        await rl.close();
      }
      await totpInput.fill(code);
      await page.click(continueBtn);
    }
    await page.waitForURL(u => u.hostname.includes('addons.mozilla.org'), { timeout: 30000 });
  }
}

async function clickSave(page) {
  const selectors = [
    'button[type="submit"]:has-text("Save")',
    'button:has-text("Save")',
    'button[type="submit"]:has-text("Сохранить")',
    'button:has-text("Сохранить")'
  ];
  for (const s of selectors) {
    const el = await page.$(s);
    if (el) {
      if (!DRY_RUN) await el.click();
      return true;
    }
  }
  return false;
}

async function switchTab(page, labels) {
  for (const text of labels) {
    const candidates = [
      `role=tab[name="${text}"]`,
      `a[role=tab]:has-text("${text}")`,
      `button[role=tab]:has-text("${text}")`,
      `a:has-text("${text}")`,
      `button:has-text("${text}")`
    ];
    for (const sel of candidates) {
      const el = await page.$(sel);
      if (el) { await el.click(); await page.waitForTimeout(400); return true; }
    }
  }
  return false;
}

async function fillByLabel(page, labelText, value) {
  const handle = await page.$(`label:has-text("${labelText}")`);
  if (!handle) return false;
  const forId = await handle.getAttribute('for');
  let control = null;
  if (forId) control = await page.$(`#${forId}`);
  if (!control) control = await handle.evaluateHandle(l => l.parentElement?.querySelector('input, textarea, select'));
  if (!control) return false;
  const tag = await (await control.getProperty('tagName')).jsonValue();
  if (tag === 'TEXTAREA' || tag === 'INPUT') {
    if (!DRY_RUN) await control.fill(value);
    return true;
  }
  if (tag === 'SELECT') {
    if (!DRY_RUN) await control.selectOption({ label: value }).catch(async () => { await control.selectOption({ value }); });
    return true;
  }
  return false;
}

async function setTags(page, values) {
  const input = await page.$('input[type="text"][data-tokenfield], .tokenfield input');
  if (!input) return false;
  if (DRY_RUN) return true;
  await input.click({ clickCount: 3 }).catch(() => {});
  await input.fill('');
  for (const v of values) {
    await input.type(v);
    await input.press('Enter');
  }
  return true;
}

async function setCategory(page, value) {
  const sel = await page.$('select#id_category, select[name*="category"], select:has(option:has-text("Productivity"))');
  if (!sel) return false;
  if (!DRY_RUN) await sel.selectOption({ label: value }).catch(async () => { await sel.selectOption({ value }); });
  return true;
}

async function fillListing(page, content) {
  await switchTab(page, ['Listing', 'Список', 'Описание', 'Листинг']).catch(() => {});
  if (content.en) {
    await fillByLabel(page, 'Name', content.en.name).catch(() => {});
    await fillByLabel(page, 'Summary', content.en.summary).catch(() => {});
    await fillByLabel(page, 'Description', content.en.description).catch(() => {});
  }
  if (content.ru) {
    await fillByLabel(page, 'Название', content.ru.name).catch(() => {});
    await fillByLabel(page, 'Краткое описание', content.ru.summary).catch(() => {});
    await fillByLabel(page, 'Полное описание', content.ru.description).catch(() => {});
  }
  if (content.category) await setCategory(page, content.category).catch(() => {});
  if (content.en?.tags?.length) await setTags(page, content.en.tags).catch(() => {});
}

async function fillLocalizations(page, content) {
  const opened = await switchTab(page, ['Localizations', 'Локализации']);
  if (!opened) return;
  const localeSelect = await page.$('select#id_form-0-locale, select[name*="locale"], select.locale');
  if (!localeSelect) return;
  const locales = [ ['English (en)', 'en', content.en], ['Russian (ru)', 'ru', content.ru], ['Русский', 'ru', content.ru] ];
  for (const [label, value, data] of locales) {
    if (!data) continue;
    await localeSelect.selectOption({ value }).catch(async () => { await localeSelect.selectOption({ label }); });
    await page.waitForTimeout(400);
    await fillByLabel(page, 'Name', data.name).catch(() => {});
    await fillByLabel(page, 'Summary', data.summary).catch(() => {});
    await fillByLabel(page, 'Description', data.description).catch(() => {});
    await fillByLabel(page, 'Название', data.name).catch(() => {});
    await fillByLabel(page, 'Краткое описание', data.summary).catch(() => {});
    await fillByLabel(page, 'Полное описание', data.description).catch(() => {});
    if (!DRY_RUN) await clickSave(page).catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function fillLinks(page, links) {
  const opened = await switchTab(page, ['Technical details', 'Details', 'Технические детали', 'Подробности']);
  if (!opened) return;
  const pairs = [
    ['Homepage', links.homepage?.en],
    ['Веб-сайт', links.homepage?.ru],
    ['Support', links.support?.en],
    ['Поддержка', links.support?.ru],
    ['Privacy Policy', links.privacy?.en],
    ['Политика конфиденциальности', links.privacy?.ru],
    ['Terms', links.terms?.en],
    ['Условия использования', links.terms?.ru]
  ];
  for (const [label, value] of pairs) {
    if (!value) continue;
    await fillByLabel(page, label, value).catch(() => {});
  }
}

async function main() {
  if (!FX_EMAIL || !FX_PASSWORD) {
    console.error('Set FX_EMAIL and FX_PASSWORD env vars. Optionally FX_TOTP for 2FA.');
    process.exit(2);
  }
  const content = readJson(CONTENT_PATH);
  const browser = BROWSER === 'chromium' ? await chromium.launch({ headless: HEADLESS }) : await firefox.launch({ headless: HEADLESS });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(AMO_EDIT_URL, { waitUntil: 'domcontentloaded' });
    if (page.url().includes('accounts.firefox.com')) await loginFirefoxAccounts(page);
    await page.waitForURL(u => u.hostname.includes('addons.mozilla.org') && /\/developers\/.+\/edit/.test(u.pathname), { timeout: 30000 });

    await fillListing(page, content.listing);
    await fillLocalizations(page, content.listing);
    await fillLinks(page, content.links);

    await clickSave(page);
    console.log('AMO fill: done', { dryRun: DRY_RUN });
  } catch (e) {
    console.error('AMO fill error', e);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
}

main();
