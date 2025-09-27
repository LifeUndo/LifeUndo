# 0.4.3 — e2e + usage + SEO

## Added
- Playwright e2e: /admin/status, /admin/emails
- Admin: /admin/usage (+ /api/admin/usage/*)
- SEO/meta: metadata, robots, sitemap

## Ops
- npm i -D @playwright/test && npx playwright install --with-deps
- ENV: E2E_BASE_URL, E2E_ADMIN_USER, E2E_ADMIN_PASS, E2E_TEST_EMAIL
- (Optional) migrate 030_usage_events_optional.sql

## Test
- npm run test:e2e
- Curl: GET /api/admin/usage/summary, /timeseries


