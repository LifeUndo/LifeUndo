#!/usr/bin/env node
import { chromium, firefox } from 'playwright';
import fs from 'fs';
import path from 'path';

// Config via env (do not hardcode secrets)
const FX_EMAIL = process.env.FX_EMAIL || process.env.FIREFOX_EMAIL;
const FX_PASSWORD = process.env.FX_PASSWORD || process.env.FIREFOX_PASSWORD;
const FX_TOTP = process.env.FX_TOTP || ''; // optional one-time code (if available)
const AMO_EDIT_URL = process.env.AMO_EDIT_URL || 'https://addons.mozilla.org/ru/developers/addon/lifeundo/edit';
const BROWSER = (process.env.AMO_BROWSER || 'firefox').toLowerCase(); // 'firefox' | 'chromium'
const HEADLESS = (process.env.HEADLESS ?? 'true') !== 'false';
const OUT_DIR = process.env.AMO_OUT_DIR || path.resolve('scripts', 'output');
const OUT_FILE = process.env.AMO_OUT_FILE || path.join(OUT_DIR, 'amo-listing.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function loginFirefoxAccounts(page) {
  // AMO redirects to accounts.firefox.com при необходимости. Будем ловить форму логина по селекторам.
  // Поддерживаем RU/EN разметку с data-testid и именами полей.
  // 1) Страница логина
  const emailSelector = 'input[type="email"], input#email';
  const passwordSelector = 'input[type="password"], input#password';
  const continueBtn = 'button[type="submit"], button:has-text("Продолжить"), button:has-text("Continue")';

  // Ждём появление формы логина или её отсутствие (если уже авторизованы)
  const hasEmail = await page.$(emailSelector);
  if (hasEmail) {
    if (!FX_EMAIL || !FX_PASSWORD) throw new Error('FX_EMAIL/FX_PASSWORD are required to login');

    await page.fill(emailSelector, FX_EMAIL);
    await page.click(continueBtn).catch(() => {});

    await page.waitForTimeout(600);
    await page.fill(passwordSelector, FX_PASSWORD);
    await page.click(continueBtn);

    // 2) TOTP (если включён)
    // Ищем поле кода 2FA
    const totpInput = await page.waitForSelector('input[autocomplete="one-time-code"], input[name="code"], input[type="tel"]', { timeout: 5000 }).catch(() => null);
    if (totpInput) {
      if (FX_TOTP) {
        await totpInput.fill(FX_TOTP);
        await page.click(continueBtn);
      } else {
        console.warn('[amo-scrape] 2FA запрошена. Установите FX_TOTP (одноразовый код) в переменные окружения и запустите заново.');
        throw new Error('Missing FX_TOTP for 2FA');
      }
    }

    // Ждём возврат на AMO после успешной авторизации
    await page.waitForURL(url => url.hostname.includes('addons.mozilla.org'), { timeout: 30000 });
  }
}

async function scrapeFieldMapByLabels(page) {
  // Собираем пары label->value для видимых input/textarea/select на текущей вкладке
  return await page.evaluate(() => {
    function getLabelText(label) {
      return label.innerText.trim().replace(/\s+/g, ' ');
    }
    function getValue(el) {
      if (!el) return '';
      if (el.tagName === 'TEXTAREA') return el.value || '';
      if (el.tagName === 'SELECT') {
        const opt = el.selectedOptions?.[0];
        return opt ? opt.textContent?.trim() : '';
      }
      if (el.tagName === 'INPUT') return el.value || '';
      return el.textContent?.trim() || '';
    }

    const data = {};

    // По связке label[for] -> элемент
    document.querySelectorAll('label[for]').forEach(label => {
      const id = label.getAttribute('for');
      if (!id) return;
      const input = document.getElementById(id);
      if (!input) return;
      const key = getLabelText(label);
      data[key] = getValue(input);
    });

    // Дополнительно — поля без label[for], но внутри form-group
    document.querySelectorAll('.form-group').forEach(group => {
      const label = group.querySelector('label');
      const control = group.querySelector('input, textarea, select');
      if (label && control) {
        const key = getLabelText(label);
        const val = getValue(control);
        if (key && !(key in data)) data[key] = val;
      }
    });

    // Теги (могут быть токены)
    const tagInputs = Array.from(document.querySelectorAll('input[type="text"][data-tokenfield], .tokenfield input'));
    tagInputs.forEach((inp, idx) => {
      const key = `Tags #${idx+1}`;
      data[key] = inp.value || '';
    });

    return data;
  });
}

async function switchTab(page, tabText) {
  // Пытаемся кликнуть по вкладке по видимому тексту (RU/EN)
  const candidates = [
    `role=tab[name="${tabText}"]`,
    `a[role=tab]:has-text("${tabText}")`,
    `button[role=tab]:has-text("${tabText}")`,
    `a:has-text("${tabText}")`,
    `button:has-text("${tabText}")`
  ];
  for (const sel of candidates) {
    const el = await page.$(sel);
    if (el) {
      await el.click();
      await page.waitForTimeout(400);
      return true;
    }
  }
  return false;
}

async function scrapeLocalizations(page) {
  // Переключаем локали, если есть селектор локали
  const result = {};
  const localeSelectors = [
    'select#id_form-0-locale, select[name*="locale"]',
    'select.locale',
  ];
  let localeSelect = null;
  for (const sel of localeSelectors) {
    const el = await page.$(sel);
    if (el) { localeSelect = el; break; }
  }
  if (!localeSelect) {
    // Если отдельная вкладка "Localizations" — уходим через неё, иначе пытаемся собрать с текущей
    result.current = await scrapeFieldMapByLabels(page);
    return result;
  }

  const options = await localeSelect.$$('option');
  for (const opt of options) {
    const value = await opt.getAttribute('value');
    const text = (await opt.textContent())?.trim();
    if (!value) continue;
    await localeSelect.selectOption(value);
    await page.waitForTimeout(500);
    result[text || value] = await scrapeFieldMapByLabels(page);
  }
  return result;
}

async function main() {
  if (!FX_EMAIL || !FX_PASSWORD) {
    console.error('[amo-scrape] Set FX_EMAIL and FX_PASSWORD env vars. Optionally FX_TOTP for 2FA.');
    process.exit(2);
  }

  ensureDir(OUT_DIR);

  const browser = BROWSER === 'chromium' ? await chromium.launch({ headless: HEADLESS }) : await firefox.launch({ headless: HEADLESS });
  const context = await browser.newContext();
  const page = await context.newPage();

  const out = {
    meta: {
      ts: new Date().toISOString(),
      url: AMO_EDIT_URL,
      browser: BROWSER,
      headless: HEADLESS,
    },
    sections: {}
  };

  try {
    await page.goto(AMO_EDIT_URL, { waitUntil: 'domcontentloaded' });

    // Если редиректит на аккаунт — логинимся
    if (page.url().includes('accounts.firefox.com')) {
      await loginFirefoxAccounts(page);
    }

    // Гарантируем, что на странице редактирования аддона
    await page.waitForURL(url => url.hostname.includes('addons.mozilla.org') && /\/developers\/.+\/edit/.test(url.pathname), { timeout: 30000 });

    // Снимаем HTML снапшот для отладки
    const html = await page.content();
    fs.writeFileSync(path.join(OUT_DIR, 'amo-edit-raw.html'), html, 'utf8');

    // Пытаемся обойти вкладки (RU/EN назв.)
    const tabs = [
      { key: 'Listing', labels: ['Listing', 'Список', 'Описание', 'Листинг'] },
      { key: 'Localizations', labels: ['Localizations', 'Локализации'] },
      { key: 'Images', labels: ['Images', 'Images & Media', 'Изображения', 'Изображения и медиа'] },
      { key: 'Details', labels: ['Technical details', 'Details', 'Технические детали', 'Подробности'] },
    ];

    for (const tab of tabs) {
      let opened = false;
      for (const label of tab.labels) {
        if (await switchTab(page, label)) { opened = true; break; }
      }
      if (!opened) {
        // Возможно, вкладки — секции одной страницы; попробуем собрать текущую как есть
        out.sections[tab.key] = await scrapeFieldMapByLabels(page);
        continue;
      }

      if (tab.key === 'Localizations') {
        out.sections[tab.key] = await scrapeLocalizations(page);
      } else {
        out.sections[tab.key] = await scrapeFieldMapByLabels(page);
      }
    }

    fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
    console.log(`[amo-scrape] OK -> ${OUT_FILE}`);
  } catch (err) {
    console.error('[amo-scrape] ERROR', err);
    // Сохраняем хотя бы текущую страницу
    try {
      const html = await page.content();
      fs.writeFileSync(path.join(OUT_DIR, 'amo-edit-error.html'), html, 'utf8');
    } catch {}
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
}

main();
