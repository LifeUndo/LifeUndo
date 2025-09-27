# 🧪 Smoke Tests Ready - Как только «зелено»

## **🚀 Как только «зелено» — смоук 0.4.2 (быстрый)**

### **1. Pricing JSON (tenant-aware):**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```

### **2. Статус/версия/баннер:**
```bash
curl -s https://getlifeundo.com/status | grep -i -E 'App version|status|banner'
```

### **3. Письма (BasicAuth админки):**
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

- [ ] `/api/public/pricing` возвращает JSON с планами
- [ ] `/status` показывает `App version: 0.4.2`
- [ ] Email шаблоны сохраняются
- [ ] Тест-письма отправляются

## **🎯 ГОТОВО:**

**Все тесты проходят — 0.4.2 работает! 🚀**


