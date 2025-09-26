import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'https://getlifeundo.com',
    extraHTTPHeaders: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.E2E_ADMIN_USER || 'admin'}:${process.env.E2E_ADMIN_PASS || 'admin'}`
        ).toString('base64'),
    },
    ignoreHTTPSErrors: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
