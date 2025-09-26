# 🧪 Quick Smoke Tests - Быстрый смоук 0.4.2

## **4) Быстрый смоук 0.4.2 (как только зелено)**

### **1. Status + версия:**
```bash
curl -s https://getlifeundo.com/status | grep -i "App version"
```
**Ожидаем:** `App version: 0.4.2`

### **2. Pricing JSON (tenant-aware):**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```
**Ожидаем:** JSON с планами и tenant информацией

### **3. Admin Status (включи баннер):**
```bash
# Включить баннер через admin
curl -s -X POST https://getlifeundo.com/api/admin/status-banner \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"active":true,"title":"Тест","message":"Баннер работает!"}'

# Проверить что баннер виден на /status
curl -s https://getlifeundo.com/status | grep -i -E 'Status|banner'
```

### **4. Admin Emails (отправить тест):**
```bash
# Сохранить шаблон
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'

# Отправить тест
curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **✅ Критерии успеха:**

- [ ] `/status` показывает `App version: 0.4.2`
- [ ] `/api/public/pricing` возвращает JSON с планами
- [ ] Баннер активируется через `/admin/status`
- [ ] Email тест отправляется через `/admin/emails`

## **🎯 ГОТОВО:**

**Все тесты проходят — 0.4.2 работает! 🚀**

