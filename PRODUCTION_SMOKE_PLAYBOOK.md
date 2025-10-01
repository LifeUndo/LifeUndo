# 🔥 Production Smoke Test Playbook

## ⚠️ Перед выключением тестового режима FreeKassa

### Pre-flight Checklist
- [ ] БД миграции применены
- [ ] Webhook обрабатывает платежи
- [ ] Email уведомления работают
- [ ] Analytics собирает данные
- [ ] `NEXT_PUBLIC_FK_ENABLED=true` в Production

---

## 🧪 Smoke Test Sequence

### 1. Debug API Check
```powershell
$P = "https://getlifeundo.com"
Invoke-WebRequest -Uri "$P/api/debug/fk" -UseBasicParsing
```
**Expected:** 404 (правильно - debug API только для Preview)

### 2. Pricing Page Visual Check
- Откройте `https://getlifeundo.com/ru/pricing`
- [ ] Все 4 кнопки FreeKassa видны (Pro, VIP, Team, Starter)
- [ ] Starter Bundle имеет бейдж "ПОПУЛЯРНО"
- [ ] Цены корректны: 599, 9990, 2990, 3000 ₽

### 3. Create Payment Test (Pro)
```powershell
$body = @{ plan = "pro_month"; email = "smoke-test@example.com" } | ConvertTo-Json
$response = Invoke-RestMethod -Method Post -Uri "$P/api/payments/freekassa/create" -Body $body -ContentType "application/json"
$response.pay_url
```
**Expected:**
- Status: 200 OK
- URL содержит `currency=RUB`, `oa=599.00`, `m=66046`
- Order ID формат: `PROM-{timestamp}-{random}`

### 4. Create Payment Test (Starter Bundle)
```powershell
$body = @{ plan = "starter_6m"; email = "smoke-test@example.com" } | ConvertTo-Json
$response = Invoke-RestMethod -Method Post -Uri "$P/api/payments/freekassa/create" -Body $body -ContentType "application/json"
$response.pay_url
$orderId = $response.order_id
Write-Host "Starter Order ID: $orderId"
```
**Expected:**
- URL содержит `oa=3000.00`
- Order ID формат: `S6M-{timestamp}-{random}`

### 5. Тестовый платеж (FreeKassa Test Mode)
1. Перейдите по `$response.pay_url`
2. В форме FreeKassa выберите любой способ оплаты
3. Завершите тестовый платеж

**Expected:**
- Форма открывается без ошибок
- Платеж обрабатывается в тестовом режиме
- Redirect на success page

### 6. Webhook Verification
```sql
-- Проверить в БД
SELECT * FROM payments WHERE order_id = 'S6M-...';
-- Expected: status='paid', plan='starter_6m', amount=3000.00

SELECT * FROM licenses WHERE email = 'smoke-test@example.com';
-- Expected: level='pro', expires_at = now + 180 days

SELECT * FROM feature_flags WHERE email = 'smoke-test@example.com';
-- Expected: key='starter_bonus', value=true, expires_at = now + 180 days
```

### 7. Email Verification
- [ ] Проверьте inbox `smoke-test@example.com`
- [ ] Письмо "Ваша лицензия активирована"
- [ ] Содержит order_id, план, дату окончания
- [ ] Ссылки на support работают

### 8. Summary API Test
```powershell
Invoke-WebRequest -Uri "$P/api/payment/summary?order_id=$orderId" -UseBasicParsing
```
**Expected:**
```json
{
  "ok": true,
  "plan": "starter_6m",
  "amount": "3000.00",
  "expires_at": "2025-07-30T12:00:00Z",
  "bonus_flags": ["starter_bonus"]
}
```

### 9. Success Page Check
- Откройте `https://getlifeundo.com/ru/success?order_id=$orderId&plan=starter_6m&email=smoke-test@example.com`
- [ ] Отображается дата окончания: "Доступ Pro активен до DD.MM.YYYY"
- [ ] Кнопка "Узнать о возможностях" → `/ru/features?order_id=...`
- [ ] Кнопка "Нужна помощь?" → `/ru/support?order_id=...`

### 10. Support Page Test
- Откройте `/ru/support?order_id=$orderId`
- [ ] Order ID prefilled в форме
- [ ] FAQ отображается
- [ ] Отправка тикета работает

### 11. Features Page Test
- Откройте `/ru/features?from=payment-success&order_id=$orderId`
- [ ] Страница загружается
- [ ] CTA кнопки работают
- [ ] Описание функций отображается

### 12. Analytics Verification
- Откройте analytics dashboard
- [ ] Событие `purchase_redirect_fk` зафиксировано
- [ ] Событие `purchase_success` зафиксировано
- [ ] Параметры: plan, order_id (без секретов)

### 13. Idempotency Test
```bash
# Симулировать повторный webhook с теми же данными
# (вручную POST к /api/payments/freekassa/result)
```
**Expected:**
- Возвращает 'YES'
- НЕ создает дубликаты в БД
- НЕ отправляет повторные emails

---

## 🚨 Rollback Plan

### Если что-то пошло не так:

#### 1. Отключить кнопки (немедленно)
```
В Vercel: NEXT_PUBLIC_FK_ENABLED=false (Production)
Redeploy Production
```

#### 2. Откат кода (если критично)
```bash
# В Vercel → Deployments → найти предыдущий стабильный
# Promote to Production
```

#### 3. Очистка тестовых данных
```sql
DELETE FROM payments WHERE order_id LIKE 'S6M-%' AND created_at > NOW() - INTERVAL '1 hour';
DELETE FROM licenses WHERE email LIKE '%smoke-test%';
DELETE FROM feature_flags WHERE email LIKE '%smoke-test%';
```

---

## ✅ Sign-off Criteria (перед выключением тест-режима)

### Must Have (критично)
- ✅ Все 13 пунктов smoke test зеленые
- ✅ Idempotency работает
- ✅ Email доставляются
- ✅ БД записи корректны
- ✅ Analytics события фиксируются

### Nice to Have
- ✅ Нет ошибок в Vercel logs
- ✅ Response time < 500ms
- ✅ No memory leaks

### Ready for Live Payments
- [ ] Выключить тестовый режим в FreeKassa
- [ ] Убрать тестовый баннер (NEXT_PUBLIC_IS_TEST_MODE=false)
- [ ] Protect Production deploy
- [ ] Мониторинг первых 10 платежей

---

## 📊 Success Metrics (первые 48 часов)

- Платежей обработано: _____
- Starter Bundle конверсия: _____%
- Email delivery rate: _____%
- Ошибок webhook: _____
- Support tickets: _____

---

**После успешного прохождения smoke test - FreeKassa готова к приему реальных платежей!** 🎉

