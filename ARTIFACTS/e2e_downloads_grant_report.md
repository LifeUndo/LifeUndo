# E2E Downloads/Grant Report
- Email: lifetests+040@getlifeundo.com
- Plan: starter_6m
- Tested at: 2025-10-02T03:11:14.764Z

## Base: https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app
- UI: **FAIL** → Error: Dev mode disabled (status: {"enabled":false})
- API: **FAIL** → Error: Unexpected JSON: {"ok":false,"code":"FORBIDDEN","message":"Dev grant is disabled in Production."}

## Base: https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app
- UI: **FAIL** → Error: Dev mode disabled (status: {"enabled":false,"error":"API failed: 404 "})
- API: **FAIL** → Error: POST https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app/api/dev/license/grant-ui => 500

## Summary
- Tests passed: 0/4
- Success rate: 0%