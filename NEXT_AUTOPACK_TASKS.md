# 🚀 Cursor: AutoPack — БД/Webhook/Email/Analytics (Единый PR)

## Цель
Завершить интеграцию Starter Bundle с реальным БД, идемпотентным webhook, email уведомлениями и аналитикой.

---

## 1) Подключение БД (Postgres/Neon)

### Задачи:
- [ ] Проверить наличие `DATABASE_URL` в ENV
- [ ] Установить ORM (если нет): `npm install drizzle-orm @neondatabase/serverless`
- [ ] Создать `src/db/client.ts` с connection pool
- [ ] Применить миграцию `migrations/100_payments_licenses.sql`

### Файлы:
- `src/db/client.ts` (создать/обновить)
- `src/db/schema.ts` (создать Drizzle schema)
- `.env.example` (добавить DATABASE_URL)

### Критерии:
- Connection pool инициализируется без ошибок
- Таблицы созданы в БД
- Можно делать SELECT/INSERT

---

## 2) Webhook Idempotency + Payment Processing

### Задачи в `src/app/api/payments/freekassa/result/route.ts`:
- [ ] Убрать TODO: проверка существования `order_id` в `payments`
- [ ] Если существует и `status='paid'` → return 'YES' (идемпотентность)
- [ ] Сохранить платеж в БД с полными данными
- [ ] Извлечь email из `formData.get('PAYER_EMAIL')` или fallback
- [ ] Вызвать `activateLicense()` с реальным сохранением в БД
- [ ] Логировать событие `payment_processed`

### Код (убрать TODO):
```ts
// Проверить идемпотентность
const existing = await db.query.payments.findFirst({
  where: eq(payments.order_id, orderId)
});

if (existing && existing.status === 'paid') {
  console.log('[webhook] Already processed:', orderId);
  return new Response('YES', { status: 200 });
}

// Сохранить платеж
await db.insert(payments).values({
  order_id: orderId,
  plan: plan || 'unknown',
  amount: parseFloat(amount),
  currency: 'RUB',
  status: 'paid',
  paid_at: new Date(),
  raw: { merchantId, amount, orderId, status, signature }
});
```

### Файлы:
- `src/app/api/payments/freekassa/result/route.ts` (убрать TODO)
- `src/lib/payments/license.ts` (добавить DB calls)

### Критерии:
- Повторный webhook не создает дубликаты
- License активируется корректно
- Feature flags записываются в БД

---

## 3) Email Notifications

### Задачи:
- [ ] Установить: `npm install nodemailer @sendgrid/mail` (выбрать один)
- [ ] Создать `src/lib/email/client.ts` с конфигурацией
- [ ] Создать шаблон `src/lib/email/templates/license-activated.ts`
- [ ] Добавить ENV: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (или `SENDGRID_API_KEY`)
- [ ] Убрать TODO в `license.ts`: отправка email после активации

### Шаблон письма:
```
Subject: Ваша лицензия GetLifeUndo активирована!

Привет!

Спасибо за покупку GetLifeUndo {PLAN_TITLE}.

Order ID: {ORDER_ID}
Лицензия: Pro
Активна до: {EXPIRES_AT}
{IF starter_6m}Бонус: starter_bonus до {EXPIRES_AT}{/IF}

Как активировать:
1. Установите расширение GetLifeUndo
2. Откройте настройки → Лицензия
3. Лицензия активируется автоматически

Возможности Pro:
- История буфера обмена (50 элементов)
- Восстановление вкладок
- Автосохранение форм
- Экспорт данных

Нужна помощь? https://getlifeundo.com/ru/support?order_id={ORDER_ID}

С уважением,
Команда GetLifeUndo
```

### Файлы:
- `src/lib/email/client.ts`
- `src/lib/email/templates/license-activated.ts`
- `src/lib/payments/license.ts` (убрать TODO)

### Критерии:
- Email отправляется после успешного webhook
- Письмо содержит order_id, план, дату окончания
- Ссылки работают

---

## 4) Analytics Integration (Privacy-Friendly)

### Задачи:
- [ ] Выбрать платформу: Plausible или Umami (self-hosted, без cookies)
- [ ] Добавить ENV: `NEXT_PUBLIC_ANALYTICS_URL` (опционально)
- [ ] Создать `src/lib/analytics.ts` с методами track()
- [ ] Убрать TODO комментарии в create/success/pricing

### События:
```ts
// В pricing page
analytics.track('pricing_click_pay', { plan });
analytics.track('starter_click');

// В API create
analytics.track('purchase_redirect_fk', { plan, order_id, amount, currency });

// В success page
analytics.track('purchase_success', { plan, order_id });

// В support page
analytics.track('support_opened', { order_id, plan });
```

### Файлы:
- `src/lib/analytics.ts`
- `src/app/[locale]/pricing/page.tsx` (добавить track)
- Success page (добавить track)

### Критерии:
- События отправляются без секретов
- Privacy-friendly (без личных данных)
- Можно отключить через ENV

---

## 5) Success Page Enhancements

### Задачи:
- [ ] Создать API endpoint `/api/payment/summary?order_id=`
- [ ] Возвращать: `{ plan, amount, expires_at, bonus_flags }`
- [ ] На success page отображать дату окончания для starter_6m
- [ ] Добавить условный рендер: "Доступ Pro активен до DD.MM.YYYY"

### Файлы:
- `src/app/api/payment/summary/route.ts` (создать)
- Success page (обновить)

### Критерии:
- API возвращает данные по order_id
- Дата форматируется корректно
- Для starter_6m показывается bonus hint

---

## 6) Pricing UI Polish

### Задачи:
- [ ] Добавить бейдж "ВЫГОДНО" на Starter Bundle карточку
- [ ] Добавить analytics track на все кнопки оплаты
- [ ] Обновить тексты из `messages/ru/pricing.json`

### Критерии:
- Starter Bundle выделяется визуально
- Клики трекаются
- i18n ключи используются

---

## 🧪 Testing Plan

### Unit Tests
- [ ] БД operations (insert/select/update)
- [ ] Email template rendering
- [ ] Analytics event format

### Integration Tests
- [ ] Full payment flow: create → webhook → license → email
- [ ] Idempotency: duplicate webhook calls
- [ ] Summary API с valid/invalid order_id

### Manual Testing
- [ ] Тестовый платеж Starter Bundle
- [ ] Проверка email в inbox
- [ ] Проверка записи в БД
- [ ] Analytics dashboard

---

## 📋 ENV для этого PR

### Добавить в Vercel:
```bash
DATABASE_URL=postgresql://...
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=<sendgrid_api_key>
SMTP_FROM=noreply@getlifeundo.com
NEXT_PUBLIC_ANALYTICS_URL=https://plausible.io (опционально)
```

---

## 🚀 Smoke Test После Deploy

```powershell
$P = "https://preview-url.vercel.app"

# 1. Создать тестовый платеж Starter
$body = @{ plan = "starter_6m"; email = "test@example.com" } | ConvertTo-Json
$response = Invoke-RestMethod -Method Post -Uri "$P/api/payments/freekassa/create" -Body $body -ContentType "application/json"
Write-Host "Order ID: $($response.order_id)"
Write-Host "Pay URL: $($response.pay_url)"

# 2. Симулировать webhook (вручную или через FreeKassa тест)
# Проверить БД:
# SELECT * FROM payments WHERE order_id = '...';
# SELECT * FROM licenses WHERE email = 'test@example.com';
# SELECT * FROM feature_flags WHERE email = 'test@example.com';

# 3. Проверить email в inbox

# 4. Проверить summary API
Invoke-WebRequest -Uri "$P/api/payment/summary?order_id=$($response.order_id)" -UseBasicParsing

# 5. Проверить analytics dashboard
```

---

## 🎯 Acceptance Criteria

- [ ] БД подключена, миграции применены
- [ ] Webhook создает payment record
- [ ] Идемпотентность работает (повторный webhook → no action)
- [ ] License активируется с expires_at
- [ ] Feature flag `starter_bonus` создается
- [ ] Email отправляется с правильными данными
- [ ] Summary API возвращает корректную информацию
- [ ] Analytics события отправляются
- [ ] Все TODO комментарии убраны
- [ ] Тесты зеленые

---

## 📦 Deliverables

1. Рабочий webhook с БД интеграцией
2. Email notifications
3. Analytics tracking
4. Summary API
5. Обновленные тесты
6. README секция "Database Setup"

---

**Готов к запуску!** После выполнения этого автопакета получим полностью рабочий Starter Bundle с персистентностью и уведомлениями.

