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

#### Тест создания платежа
```bash
node test-webhook.js create https://your-project.vercel.app/api/fk/create
```

#### Тестовый webhook
```bash
node test-webhook.js notify https://your-project.vercel.app/api/fk/notify
```

#### Ручной тест webhook
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
│   ├── notify.ts      # FreeKassa webhook (обработка уведомлений)
│   └── create.ts      # Создание платежных ссылок
├── health.ts          # Health check
├── package.json       # Зависимости
├── vercel.json        # Конфигурация Vercel
├── test-webhook.js    # Тестовый скрипт
└── API_README.md      # Эта инструкция
```

## API Endpoints

### POST /api/fk/create
Создает платежную ссылку FreeKassa.

**Request:**
```json
{
  "email": "user@example.com",
  "plan": "pro_year",
  "locale": "ru"
}
```

**Response:**
```json
{
  "url": "https://pay.freekassa.ru/?merchant_id=...",
  "order_id": "LU-1234567890-abc123"
}
```

### POST /api/fk/notify
Webhook для обработки уведомлений от FreeKassa.

**Features:**
- Проверка подписи
- Идемпотентность (защита от повторной обработки)
- Валидация плана и суммы
- Автоматическая отправка email уведомлений

### GET /api/health
Health check endpoint.

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
