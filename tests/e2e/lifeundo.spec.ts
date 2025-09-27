import { test, expect } from "@playwright/test";

test("homepage + footer + socials", async ({ page }) => {
  await page.goto("https://lifeundo.ru/");
  await expect(page.getByText("VIP лицензия")).toBeVisible();
  
  // Check social icons by aria-label
  const socials = [
    "Telegram", "X (Twitter)", "Reddit", "YouTube", "VK", 
    "Dzen", "Habr", "vc.ru", "TenChat"
  ];
  for (const ariaLabel of socials) {
    const link = page.locator(`a[aria-label="${ariaLabel}"]`).first();
    await expect(link).toHaveCount(1);
    // Check it has SVG icon
    await expect(link.locator("svg")).toHaveCount(1);
    // Check it has noopener
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  
  // Check FreeKassa badge
  const fkBadge = page.locator('img[src*="free-kassa"]');
  await expect(fkBadge).toHaveCount(1);
  
  // Check 10% Fund text
  await expect(page.getByText(/10%/)).toBeVisible();
});

test("fund page exists and mentions 10%", async ({ page }) => {
  await page.goto("https://lifeundo.ru/fund");
  const text = await page.locator("body").textContent();
  expect(text?.toLowerCase()).toContain("10%");
});

test("ok page is 200", async ({ page }) => {
  // Retry with 3 attempts for CDN cache
  let res;
  for (let i = 0; i < 3; i++) {
    res = await page.goto("https://lifeundo.ru/ok");
    if (res?.status() === 200) break;
    await page.waitForTimeout(1000);
  }
  expect(res?.status()).toBe(200);
});

test("buy flow basics", async ({ page }) => {
  await page.goto("https://lifeundo.ru/");
  await page.locator('input[id="email"]').fill("test@example.com");
  await expect(page.locator('button:has-text("Оплатить")')).toBeVisible();
  // Не нажимаем submit в продакшене. На тестовом стенде можно кликнуть.
});

test("meta tags and SEO", async ({ page }) => {
  await page.goto("https://lifeundo.ru/");
  
  // Check canonical link
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", "https://lifeundo.ru/");
  
  // Check og:title
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", "LifeUndo — VIP лицензия");
  
  // Check og:description
  const ogDesc = page.locator('meta[property="og:description"]');
  await expect(ogDesc).toHaveAttribute("content", /VIP лицензия/);
  
  // Check meta description
  const metaDesc = page.locator('meta[name="description"]');
  await expect(metaDesc).toHaveAttribute("content", /VIP лицензия/);
});
