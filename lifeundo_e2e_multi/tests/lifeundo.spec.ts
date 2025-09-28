import { test, expect, request } from '@playwright/test';

const R = (s: string) => new RegExp(s.replace(/\s+/g,'\s+'), 'i');

test.describe('lifeundo.ru GATE', () => {
  test('Status 200 for key routes', async ({ page }) => {
    const routes = ['/', '/pricing', '/fund', '/fund/apply', '/privacy', '/support', '/ok'];
    for (const r of routes) {
      const resp = await page.goto(r, { waitUntil: 'domcontentloaded' });
      expect(resp, `${r} should respond`).toBeTruthy();
      expect(resp!.status(), `${r} should be 200`).toBe(200);
    }
  });

  test('/ok has correct Cache-Control', async ({ baseURL }) => {
    const ctx = await request.newContext();
    const resp = await ctx.get(`${baseURL}/ok`, { maxRedirects: 0 });
    expect(resp.status(), '/ok should be 200').toBe(200);
    const cc = resp.headers()['cache-control'] || '';
    expect(cc.toLowerCase()).toContain('no-store');
    expect(cc.toLowerCase()).toContain('no-cache');
    expect(cc.toLowerCase()).toContain('must-revalidate');
  });

  test('/pricing shows correct RU prices', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).toContainText(R('149\s?₽/мес'));
    await expect(page.locator('body')).toContainText(R('1\s?490\s?₽/год'));
    await expect(page.locator('body')).toContainText(R('2\s?490\s?₽'));
  });
});
