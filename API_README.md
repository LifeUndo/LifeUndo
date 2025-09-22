# LifeUndo FreeKassa Webhook API

## Развертывание на Vercel

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения в Vercel

В панели Vercel → Settings → Environment Variables добавить:

```
FK_MERCHANT_ID=xxxxxxxx
FK_SECRET=xxxxxxxx
FK_ALLOWED_IPS=your,ip,list
MAIL_FROM="LifeUndo <noreply@lifeundo.ru>"
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@lifeundo.ru
SMTP_PASS=***************
```

### 3. Развертывание
```bash
vercel --prod
```

### 4. Настройка в кабинете FreeKassa

- **Notify URL**: `https://your-project.vercel.app/api/fk/notify`
- **Success URL**: `https://lifeundo.ru/success.html`
- **Fail URL**: `https://lifeundo.ru/fail.html`

### 5. Тестирование

#### Health Check
```bash
curl https://your-project.vercel.app/api/health
```

#### Тестовый webhook
```bash
curl -X POST https://your-project.vercel.app/api/fk/notify \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id":"XXXX",
    "order_id":"LU-TEST-001",
    "amount":"1490",
    "currency":"RUB",
    "us_email":"tester@example.com",
    "us_plan":"pro_year",
    "us_locale":"ru",
    "sign":"<подпись_по_формуле>"
  }'
```

## Структура проекта

```
api/
├── fk/
│   └── notify.ts      # FreeKassa webhook
├── health.ts          # Health check
├── package.json       # Зависимости
├── vercel.json        # Конфигурация Vercel
└── API_README.md      # Эта инструкция
```

## Важные замечания

1. **Подпись FreeKassa**: В `verifySignature()` нужно обновить формулу согласно актуальной документации кабинета FreeKassa
2. **SMTP**: Настроить DNS записи (SPF, DKIM) для доставляемости писем
3. **Логирование**: Сейчас логи идут в консоль Vercel, позже можно добавить Vercel Blob/KV
4. **Безопасность**: IP whitelist работает только если задан `FK_ALLOWED_IPS`

## DNS настройки для email

### SPF (TXT запись)
```
v=spf1 include:_spf.mailgun.org include:sendgrid.net ~all
```

### DKIM
Включить у SMTP провайдера и добавить их CNAME/TXT в DNS

### DMARC (TXT запись)
```
v=DMARC1; p=none; rua=mailto:dmarc@lifeundo.ru
```
