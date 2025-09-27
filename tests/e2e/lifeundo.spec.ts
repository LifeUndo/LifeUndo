import { test, expect } from "@playwright/test";

test("homepage + footer + socials", async ({ page }) => {
  await page.goto("https://lifeundo.ru/");
  await expect(page.getByText("VIP лицензия")).toBeVisible();
  // соцсети существуют
  const socials = ["t.me", "x.com", "reddit.com", "youtube.com", "vk.com", "dzen.ru", "habr.com", "vc.ru", "tenchat.ru"];
  for (const host of socials) {
    const link = page.locator(`a[href*="${host}"]`).first();
    await expect(link).toHaveCount(1);
  }
});

test("fund page exists and mentions 10%", async ({ page }) => {
  await page.goto("https://lifeundo.ru/fund");
  const text = await page.locator("body").textContent();
  expect(text?.toLowerCase()).toContain("10%");
});

test("ok page is 200", async ({ page }) => {
  const res = await page.goto("https://lifeundo.ru/ok");
  expect(res?.status()).toBe(200);
});

test("buy flow basics", async ({ page }) => {
  await page.goto("https://lifeundo.ru/");
  await page.locator('input[name="email"]').fill("test@example.com");
  await expect(page.locator('button:has-text("Оплатить")')).toBeVisible();
  // Не нажимаем submit в продакшене. На тестовом стенде можно кликнуть.
});
