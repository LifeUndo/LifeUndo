# 📊 Валидные примеры для регресса

## 🔐 Схема подписи (актуальная)

### Create
```
sign = md5(`${merchant_id}:${amount}:${secret1}:${order_id}`)
```

### Notify
```
sign = md5(`${merchant_id}:${amount}:${secret2}:${order_id}`)
```

## 📋 Валидные примеры (маскированные)

### Create запрос
```json
POST /api/fk/create
Content-Type: application/json
Origin: https://lifeundo.ru

{
  "email": "ab***@domain.com",
  "plan": "vip_lifetime",
  "locale": "ru",
  "honeypot": ""
}
```

**Ожидаемый ответ:**
```json
{
  "url": "https://pay.freekassa.ru/?m=7b11ad5311cc3bbeb608b3cb9c8404a6&oa=2490.00&o=LU-1703123456789-abc123&s=<sign>&currency=RUB&us_email=ab***@domain.com&us_plan=vip_lifetime&us_cid=cid-1703123456789-abc123&lang=ru&em=ab***@domain.com&description=LifeUndo vip_lifetime for ab***@domain.com",
  "order_id": "LU-1703123456789-abc123"
}
```

### Notify запрос
```
POST /api/fk/notify
Content-Type: application/x-www-form-urlencoded

MERCHANT_ID=7b11ad5311cc3bbeb608b3cb9c8404a6&AMOUNT=2490.00&PAYMENT_ID=LU-1703123456789-abc123&SIGN=<sign>&intid=999999&us_email=ab***@domain.com&us_plan=vip_lifetime&us_cid=cid-1703123456789-abc123
```

**Ожидаемый ответ:**
```
OK
```

## 📊 Логи (маскированные)

### Create лог
```
[FK][create] { 
  order_id: "LU-1703123456789-abc123", 
  email: "ab***@domain.com", 
  plan: "vip_lifetime", 
  amount: 2490, 
  currency: "RUB",
  correlation_id: "cid-1703123456789-abc123",
  ip: "192.168.1.100"
}
```

### Notify лог
```
[FK][notify] OK { 
  order_id: "LU-1703123456789-abc123", 
  amount: 2490, 
  intid: "999999", 
  plan: "vip_lifetime", 
  email: "ab***@domain.com",
  correlation_id: "cid-1703123456789-abc123"
}
```

### Idempotency лог
```
[FK][idempotency] Order processed { 
  order_id: "LU-1703123456789-abc123", 
  amount: 2490, 
  plan: "vip_lifetime", 
  email: "ab***@domain.com", 
  processed_at: "2025-01-01T12:00:00.000Z", 
  ttl_days: 30 
}
```

## 🔧 Админ-эндпоинты

### Поиск заказа
```bash
GET /api/admin/orders?order_id=LU-1703123456789-abc123
Authorization: Bearer <ADMIN_TOKEN>
```

**Ожидаемый ответ:**
```json
{
  "found": true,
  "order": {
    "order_id": "LU-1703123456789-abc123",
    "email": "ab***@domain.com",
    "plan": "vip_lifetime",
    "amount": 2490,
    "status": "paid",
    "paid_at": "2025-01-01T12:00:00.000Z",
    "intid": "999999"
  }
}
```

### Переотправка ключа
```bash
POST /api/admin/orders
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "order_id": "LU-1703123456789-abc123",
  "action": "resend_license"
}
```

**Ожидаемый ответ:**
```json
{
  "success": true,
  "message": "License key resent",
  "order_id": "LU-1703123456789-abc123"
}
```

## 🧪 Тестовые сценарии

### Успешный платеж
1. Create → URL FreeKassa
2. Оплата на FreeKassa
3. Notify → OK
4. Логи: `[FK][create]` + `[FK][notify] OK`
5. Админ: поиск по `order_id` → "paid"

### Идемпотентность
1. Первый notify → OK
2. Второй notify (тот же `order_id`) → OK
3. Логи: `[FK][notify] Already processed`

### Bad signature
1. Notify с неверной подписью → 400 "Bad signature"
2. Логи: `[FK][notify] bad signature`

### Bad amount
1. Notify с неверной суммой → 400 "Bad amount"
2. Логи: `[FK][notify] amount mismatch`

### Rate limiting
1. 10+ запросов create в минуту → 429 "Too Many Requests"
2. Логи: `[FK][create] Rate limit exceeded`

### Honeypot
1. Create с `honeypot: "bot"` → 400 "Bad Request"
2. Логи: `[FK][create] Honeypot triggered`

## 🔄 При ротации секретов

### Старые секреты (до ротации)
- `FK_SECRET1`: `HU/B%o]RgX=Tq@}`
- `FK_SECRET2`: `M!{iW=7dr*xua(L`

### Новые секреты (после ротации)
- `FK_SECRET1`: `<новый-секрет-1>`
- `FK_SECRET2`: `<новый-секрет-2>`

### Проверка после ротации
```bash
# Эмулятор notify с новыми секретами
.\fk-notify-sim.ps1 https://<project>.vercel.app MERCHANT_ID 2490.00 LU-test-123 <новый-секрет-2>
```

**Ожидаемо:** `OK` + лог `[FK][notify] OK`

## 📞 Контакты для эскалации

- **Техническая поддержка:** developer@lifeundo.ru
- **FreeKassa поддержка:** через кабинет FK
- **Vercel поддержка:** через dashboard
