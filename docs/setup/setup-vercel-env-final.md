# Vercel Environment Variables Setup

## Required Environment Variables for Production + Preview:

```
NEXT_PUBLIC_SITE_URL = https://www.getlifeundo.com
FK_MERCHANT_ID       = <из FreeKassa>
FK_SECRET1           = <из FreeKassa>
FK_SECRET2           = <из FreeKassa>
ADMIN_TOKEN          = <сильный токен>
DATABASE_URL         = <строка для app_user>
EMAIL_RELAY_USER     = <опционально>
EMAIL_RELAY_PASS     = <опционально>
SENTRY_DSN           = <опционально>
LOGTAIL_TOKEN        = <опционально>
```

## Setup Instructions:

1. Go to Vercel Dashboard → Project `getlifeundo` → Settings → Environment Variables
2. Add each variable for both **Production** and **Preview** environments
3. **Redeploy** with "Use existing Build Cache" **DISABLED**

## After Setup:

- `/admin` will return 401 (BasicAuth required)
- `/api/fk/notify` GET will return 405
- `/success` and `/fail` will work correctly
- FreeKassa webhook will function properly

## Verification:

Run smoke tests after deployment to verify all endpoints work correctly.
