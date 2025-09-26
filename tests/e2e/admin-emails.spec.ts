import { test, expect } from '@playwright/test';

test('admin emails test', async ({ page }) => {
  await page.goto('/admin/emails');
  await expect(page.getByRole('heading')).toBeVisible();
});