import { test, expect, request } from '@playwright/test';

const R = (s: string) => new RegExp(s.replace(/\s+/g,'\s+'), 'i');

test.describe('getlifeundo.com EN GATE', () => {

  test('Status for key routes', async ({ page }) => {
    // success/fail expected 200 once deployed
    const must200 = ['/', '/pricing', '/fund', '/privacy', '/support'];
    for (const r of must200) {
      const resp = await page.goto(r, { waitUntil: 'domcontentloaded' });
      expect(resp, `${r} should respond`).toBeTruthy();
      expect(resp!.status(), `${r} should be 200`).toBe(200);
    }
  });

  test('/success and /fail (if present)', async ({ page }) => {
    // If not yet deployed they might be 404; mark as soft check for visibility
    const respSuccess = await page.goto('/success', { waitUntil: 'domcontentloaded' });
    const respFail = await page.goto('/fail', { waitUntil: 'domcontentloaded' });
    expect([200,404]).toContain(respSuccess?.status() ?? 0);
    expect([200,404]).toContain(respFail?.status() ?? 0);
  });

  test('/admin protected (401 expected)', async ({ request }) => {
    const resp = await request.get('/admin', { maxRedirects: 0 });
    expect([401, 403]).toContain(resp.status()); // allow 403 during interim configs
  });

  test('GET /api/fk/notify returns 405', async ({ request }) => {
    const resp = await request.get('/api/fk/notify', { maxRedirects: 0 });
    expect(resp.status()).toBe(405);
  });

  test('/pricing shows EN prices', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).toContainText(R('\$3\.99\s*/\s*mo'));
    await expect(page.locator('body')).toContainText(R('\$29\s*/\s*yr'));
    await expect(page.locator('body')).toContainText(R('\$49')); // VIP lifetime
  });

});
