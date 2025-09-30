# FreeKassa Smoke Tests

## После деплоя Preview

### 1. Базовые редиректы
```bash
curl -I https://<preview>/
curl -I https://<preview>/ru
curl -I https://<preview>/ru/pricing
curl -I https://<preview>/ok
```

### 2. Debug API (только Preview)
```bash
curl https://<preview>/api/debug/fk
```

Ожидаемый ответ:
```json
{
  "ok": true,
  "env": "preview",
  "fkEnabled": true,
  "fkConfigured": true,
  "merchantIdMasked": "54c3***",
  "paymentUrl": "https://pay.freekassa.ru/",
  "timestamp": "2024-01-30T..."
}
```

### 3. Создание платежа
```bash
curl -X POST https://<preview>/api/payments/freekassa/create \
  -H "Content-Type: application/json" \
  -d '{"productId":"getlifeundo_pro","amount":"599.00","email":"test@getlifeundo.com"}'
```

Ожидаемый ответ:
```json
{
  "ok": true,
  "pay_url": "https://pay.freekassa.ru/?m=54c3ac0581ad5eeac3fbee2ffac83f6c&oa=599.00&o=...&s=...",
  "order_id": "1706630400000-abc123"
}
```

### 4. Браузерные тесты

1. **Открыть `/ru/pricing`** → увидеть кнопки "Оплатить через FreeKassa" на Pro/VIP/Team планах
2. **Клик на кнопку** → редирект на `https://pay.freekassa.ru/...`
3. **Проверить DevTools Console** → увидеть `[FK] enabled=true`

### 5. Callback тест (если есть тестовый ключ)

```bash
curl -X POST https://<preview>/api/payments/freekassa/result \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MERCHANT_ID=54c3ac0581ad5eeac3fbee2ffac83f6c&AMOUNT=599.00&MERCHANT_ORDER_ID=test123&SIGN=valid_sign&STATUS=1"
```

Ожидаемый ответ: `YES` (200)

## Критерии приёмки

- [ ] `/api/debug/fk` возвращает `fkEnabled: true`
- [ ] На `/ru/pricing` видны кнопки FreeKassa
- [ ] Клик ведёт на `pay.freekassa.ru`
- [ ] `/api/payments/freekassa/result` отвечает `200 YES` на валидной подписи
- [ ] Debug API недоступен на проде (404)
