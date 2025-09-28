import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: 1,
  use: {
    baseURL: process.env.BASE_URL || 'https://lifeundo.ru',
    viewport: { width: 1366, height: 820 },
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ]
});
