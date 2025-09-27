# Vercel Environment Variables Setup

## Required Variables for Production + Preview:

```
NEXT_PUBLIC_SITE_URL = https://www.getlifeundo.com
FK_MERCHANT_ID       = <из FreeKassa>
FK_SECRET1           = <из FreeKassa>
FK_SECRET2           = <из FreeKassa>
ADMIN_TOKEN          = <сильный_токен>
DATABASE_URL         = <Neon app_user DSN>
EMAIL_RELAY_USER     = <опционально>
EMAIL_RELAY_PASS     = <опционально>
SENTRY_DSN           = <опционально>
LOGTAIL_TOKEN        = <опционально>
```

## Setup Instructions:

1. **Go to Vercel Dashboard** → Project `getlifeundo` → Settings → Environment Variables
2. **Add each variable** for both **Production** and **Preview** environments
3. **Redeploy** with "Use existing Build Cache" **DISABLED**

## Expected Results After Setup:

- `/admin` will return 401 (BasicAuth required)
- `/api/fk/notify` GET will return 405
- `/success` and `/fail` will work correctly
- FreeKassa webhook will function properly
- Database connections will use app_user role

## Verification Commands:

```powershell
curl.exe -I https://getlifeundo.com                   # 307 → www
curl.exe -I https://www.getlifeundo.com/              # 200
curl.exe -I https://www.getlifeundo.com/ok            # 200
curl.exe -I https://www.getlifeundo.com/support/      # 200
curl.exe -I https://www.getlifeundo.com/pricing/      # 200
curl.exe -I https://www.getlifeundo.com/fund          # 200
curl.exe -I https://www.getlifeundo.com/success       # 200
curl.exe -I https://www.getlifeundo.com/fail          # 200
curl.exe -I https://www.getlifeundo.com/admin         # 401
curl.exe -I https://www.getlifeundo.com/api/fk/notify # 405 (GET)
```

## Next Steps:

1. **Real FreeKassa payment test** (minimum amount)
2. **Firefox 0.3.7.11 XPI build** and AMO upload
3. **Social media launch** with 5 posts and updated links
