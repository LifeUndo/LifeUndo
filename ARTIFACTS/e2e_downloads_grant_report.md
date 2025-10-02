# E2E Downloads/Grant Report
- Email: lifetests+040@getlifeundo.com
- Plan: starter_6m
- Tested at: 2025-10-02T01:19:21.420Z

## Base: https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app
- UI: **OK** → Case: no-db, order=N/A (no DB), expires=N/A (no DB), hasDb=false
- API: **FAIL** → Error: POST https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app/api/dev/license/grant-ui => 400

## Base: https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app
- UI: **FAIL** → Error: Dev mode disabled (status: {"enabled":false,"error":"API failed: 404 "})
- API: **FAIL** → Error: POST https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app/api/dev/license/grant-ui => 500

## Summary
- Tests passed: 1/4
- Success rate: 25%