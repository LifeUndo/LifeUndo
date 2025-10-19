# 🔐 FreeKassa Integration - Схема подписи

## 📋 Текущая схема подписи

### Create (формирование ссылки оплаты)
```
sign = md5(`${merchant_id}:${amount}:${secret1}:${order_id}`)
```

**Пример:**
- `merchant_id`: `7b11ad5311cc3bbeb608b3cb9c8404a6`
- `amount`: `2490.00`
- `secret1`: `HU/B%o]RgX=Tq@}` (после ротации)
- `order_id`: `LU-1703123456789-abc123`
- `sign`: `md5("7b11ad5311cc3bbeb608b3cb9c8404a6:2490.00:HU/B%o]RgX=Tq@}:LU-1703123456789-abc123")`

### Notify (обработка уведомлений)
```
sign = md5(`${merchant_id}:${amount}:${secret2}:${order_id}`)
```

**Пример:**
- `merchant_id`: `7b11ad5311cc3bbeb608b3cb9c8404a6`
- `amount`: `2490.00`
- `secret2`: `M!{iW=7dr*xua(L` (после ротации)
- `order_id`: `LU-1703123456789-abc123`
- `sign`: `md5("7b11ad5311cc3bbeb608b3cb9c8404a6:2490.00:M!{iW=7dr*xua(L:LU-1703123456789-abc123")`

## 🔄 При ротации секретов

1. **В кабинете FreeKassa:**
   - Регенерировать `SECRET1`
   - Регенерировать `SECRET2`
   - Регенерировать `API_KEY`

2. **В Vercel ENV:**
   - Обновить `FK_SECRET1`
   - Обновить `FK_SECRET2`
   - Redeploy Production

3. **Проверить:**
   - Эмулятор notify: `.\fk-notify-sim.ps1 https://<project>.vercel.app MERCHANT_ID 2490.00 LU-test-123 NEW_SECRET2`
   - Должен вернуть `OK`

## 📊 Валидные примеры (для регресса)

### Create запрос
```json
{
  "email": "test@example.com",
  "plan": "vip_lifetime",
  "locale": "ru",
  "honeypot": ""
}
```

**Ожидаемый ответ:**
```json
{
  "url": "https://pay.freekassa.net/?m=7b11ad5311cc3bbeb608b3cb9c8404a6&oa=2490.00&o=LU-1703123456789-abc123&s=<sign>&currency=RUB&us_email=test@example.com&us_plan=vip_lifetime&us_cid=cid-1703123456789-abc123&lang=ru&em=test@example.com&description=LifeUndo vip_lifetime for test@example.com",
  "order_id": "LU-1703123456789-abc123"
}
```

### Notify запрос
```
POST /api/fk/notify
Content-Type: application/x-www-form-urlencoded

MERCHANT_ID=7b11ad5311cc3bbeb608b3cb9c8404a6&AMOUNT=2490.00&PAYMENT_ID=LU-1703123456789-abc123&SIGN=<sign>&intid=999999&us_email=test@example.com&us_plan=vip_lifetime&us_cid=cid-1703123456789-abc123
```

**Ожидаемый ответ:**
```
OK
```

## 🔧 Админ-эндпоинты

### Поиск заказа
```bash
GET /api/admin/orders?order_id=LU-1703123456789-abc123
Authorization: Bearer <ADMIN_TOKEN>
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

## 🚨 Troubleshooting

### Bad signature
- Проверить схему подписи в кабинете FK
- Сверить порядок полей: `merchant_id:amount:secret:order_id`
- Убедиться, что секреты актуальны

### Bad amount
- Проверить `priceMap` в коде
- Сверить с суммой из create
- Проверить валюту и округление

### 405 Not Allowed
- Notify URL должен указывать на Vercel-домен
- НЕ использовать `lifeundo.ru` если домен статический

## 📞 Контакты

- **Техническая поддержка:** developer@lifeundo.ru
- **FreeKassa поддержка:** через кабинет FK
- **Vercel поддержка:** через dashboard
