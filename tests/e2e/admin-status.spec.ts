import { test, expect } from '@playwright/test';

test('admin status banner test', async ({ page }) => {
  await page.goto('/admin/status');
  await expect(page.getByRole('heading')).toBeVisible();
});

