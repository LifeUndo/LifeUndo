# E2E Downloads/Grant Report
- Email: lifetests+040@getlifeundo.com
- Plan: starter_6m
- Tested at: 2025-10-01T20:33:39.033Z

## Base: https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app
- UI: **FAIL** → TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('text=/Order ID|Success|✅|🔴/') to be visible

- API: **FAIL** → Error: POST https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app/api/dev/license/grant-ui => 500

## Base: https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app
- UI: **FAIL** → Error: Dev mode disabled (status: {"enabled":false,"error":"API failed: 404 "})
- API: **FAIL** → Error: POST https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app/api/dev/license/grant-ui => 500

## Summary
- Tests passed: 0/4
- Success rate: 0%