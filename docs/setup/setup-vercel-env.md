# Настройка ENV переменных в Vercel

## Переменные для Production и Preview:

```
NEXT_PUBLIC_SITE_URL = https://www.getlifeundo.com
FK_MERCHANT_ID       = 65875
FK_SECRET1           = myavF/PTAGmJz,(
FK_SECRET2           = 2aqzSYf?29aO-w6
ADMIN_TOKEN          = admin_1234567890abcd
EMAIL_RELAY_USER     = <опционально>
EMAIL_RELAY_PASS     = <опционально>
SENTRY_DSN           = <опционально>
LOGTAIL_TOKEN        = <опционально>
DATABASE_URL         = postgresql://neondb_owner:npg_jI4FywUl9kQi@ep-long-bush-ad3519rp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Инструкции:

1. Перейти в Vercel Dashboard → Project `getlifeundo` → Settings → Environment Variables
2. Добавить каждую переменную выше с соответствующими значениями
3. Установить для "Production" и "Preview" окружений
4. Выполнить **Redeploy** (отключить "Use existing Build Cache")

## После настройки:

- Проверить, что все переменные установлены
- Выполнить redeploy без кэша
- Проверить работу сайта
