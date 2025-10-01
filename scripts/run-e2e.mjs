import { test, expect, chromium, request } from '@playwright/test';
import fs from 'fs/promises';

const PRIMARY = process.env.PRIMARY_URL;
const SECONDARY = process.env.SECONDARY_URL;
const EMAIL = process.env.TEST_EMAIL || 'lifetests+040@getlifeundo.com';
const PLAN = process.env.PLAN || 'starter_6m';

const candidates = [PRIMARY, SECONDARY].filter(Boolean);
if (candidates.length === 0) throw new Error("No preview URLs provided");

const results = [];

async function tryUiFlow(base) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let ok = false, details = {};
  try {
    // 1. Проверяем healthz
    const healthResp = await page.goto(`${base}/api/healthz`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (!healthResp || !healthResp.ok()) {
      throw new Error(`Health check failed: ${healthResp ? healthResp.status() : 'no response'}`);
    }

    // 2. Проверяем dev status API
    const statusResp = await page.evaluate(async (baseUrl) => {
      try {
        const res = await fetch(`${baseUrl}/api/dev/license/status`);
        if (!res.ok) {
          return { enabled: false, error: `API failed: ${res.status} ${res.statusText}` };
        }
        return await res.json();
      } catch (error) {
        return { enabled: false, error: error.message };
      }
    }, base);
    
    if (!statusResp.enabled) {
      throw new Error(`Dev mode disabled (status: ${JSON.stringify(statusResp)})`);
    }

    // 3. Открываем downloads страницу
    const url = `${base}/ru/downloads`;
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!resp || !resp.ok()) throw new Error(`GET ${url} => ${resp ? resp.status() : 'no response'}`);

    // Проверяем, что страница загрузилась без ошибок
    const pageContent = await page.content();
    if (pageContent.includes('We\'re preparing the downloads page')) {
      throw new Error('Page shows fallback error message');
    }

    // Ждём загрузки формы
    await page.waitForTimeout(2000);

    // Форма должна быть видна
    const hasForm = await page.locator('input[type="email"]').isVisible().catch(()=>false);
    if (!hasForm) throw new Error(`Email input not visible`);

    await page.fill('input[type="email"]', EMAIL);
    
    // Выбираем план, если есть select
    const planSelect = page.locator('select');
    if (await planSelect.count()) {
      await planSelect.selectOption(PLAN).catch(()=>{});
    }

    await page.click('button:has-text("Grant Test License")');
    
    // Ждём результат
    await page.waitForSelector('text=/Order ID|Success|✅/', { timeout: 15000 });

    // Собираем данные результата
    const text = await page.locator('main').innerText();
    const orderId = (text.match(/(GRANT|SIM)-[^\s]+/) || [])[0] || '';
    const expires = (text.match(/(\d{4}-\d{2}-\d{2}.*?(\+|\d{2}:\d{2}))/) || [])[0] || '';

    // Проверяем Account страницу
    const accountLink = page.locator('button:has-text("Open Account")');
    if (await accountLink.count()) {
      await accountLink.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const accHtml = await page.content();
      if (!/Pro|Проф|PRO/i.test(accHtml)) {
        throw new Error('Account page does not show Pro level');
      }
    }

    ok = true;
    details = { orderId, expires };
    await browser.close();
  } catch (e) {
    await browser.close();
    throw e;
  }
  return { ok, details };
}

async function tryApiFlow(base) {
  const ctx = await request.newContext();
  const url = `${base}/api/dev/license/grant-ui`;
  const r = await ctx.post(url, {
    data: { email: EMAIL, plan: PLAN },
    timeout: 20000
  });
  if (!r.ok()) throw new Error(`POST ${url} => ${r.status()}`);
  const json = await r.json();
  if (!json.ok || !json.order_id || !json.expires_at) {
    throw new Error(`Unexpected JSON: ${JSON.stringify(json)}`);
  }
  // проверка аккаунта
  const acc = await ctx.get(`${base}/ru/account?email=${encodeURIComponent(EMAIL)}`);
  if (!acc.ok()) throw new Error(`/ru/account failed: ${acc.status()}`);
  const accHtml = await acc.text();
  if (!/Pro|Проф|PRO/i.test(accHtml)) throw new Error(`Account page has no Pro marker`);
  return { ok: true, details: { orderId: json.order_id, expires: json.expires_at } };
}

(async () => {
  for (const base of candidates) {
    const item = { base, ui: null, api: null };
    try {
      // сначала пробуем UI
      try {
        item.ui = await tryUiFlow(base);
      } catch (e) {
        item.ui = { ok: false, error: String(e) };
      }
      // затем API (на случай скрытой формы)
      try {
        item.api = await tryApiFlow(base);
      } catch (e) {
        item.api = { ok: false, error: String(e) };
      }
    } catch (e) {
      item.error = String(e);
    }
    results.push(item);
  }

  const lines = [];
  lines.push(`# E2E Downloads/Grant Report`);
  lines.push(`- Email: ${EMAIL}`);
  lines.push(`- Plan: ${PLAN}`);
  lines.push(`- Tested at: ${new Date().toISOString()}`);
  
  for (const r of results) {
    lines.push(`\n## Base: ${r.base}`);
    if (r.ui?.ok) {
      lines.push(`- UI: **OK** → order=${r.ui.details.orderId || 'n/a'}, expires=${r.ui.details.expires || 'n/a'}`);
    } else {
      lines.push(`- UI: **FAIL** → ${r.ui?.error || 'no details'}`);
    }
    if (r.api?.ok) {
      lines.push(`- API: **OK** → order=${r.api.details.orderId}, expires=${r.api.details.expires}`);
    } else {
      lines.push(`- API: **FAIL** → ${r.api?.error || 'no details'}`);
    }
  }
  
  // Summary
  const totalTests = results.length * 2; // UI + API for each
  const passedTests = results.reduce((sum, r) => sum + (r.ui?.ok ? 1 : 0) + (r.api?.ok ? 1 : 0), 0);
  lines.push(`\n## Summary`);
  lines.push(`- Tests passed: ${passedTests}/${totalTests}`);
  lines.push(`- Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  await fs.mkdir('ARTIFACTS', { recursive: true });
  await fs.writeFile('ARTIFACTS/e2e_downloads_grant_report.md', lines.join('\n'), 'utf8');
  console.log('\nReport written to ARTIFACTS/e2e_downloads_grant_report.md\n');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
