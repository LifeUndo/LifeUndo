import { test, expect } from '@playwright/test';

test.describe('LifeUndo Website', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/ru');
    
    // Проверяем, что страница загрузилась
    await expect(page).toHaveTitle(/LifeUndo/);
    
    // Проверяем основные элементы
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Ctrl+Z')).toBeVisible();
  });

  test('download page works', async ({ page }) => {
    await page.goto('http://localhost:3000/ru/download');
    
    // Проверяем заголовок
    await expect(page.locator('h1')).toContainText('Скачать');
    
    // Проверяем кнопку скачивания
    await expect(page.locator('a[href*="lifeundo-0.3.7.12.xpi"]')).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/ru/pricing');
    
    // Проверяем, что страница загрузилась
    await expect(page.locator('h1')).toBeVisible();
  });
});