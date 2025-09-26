# 🧪 Smoke Test 0.4.2 - Быстрая проверка

## **⚡ БЫСТРЫЙ СМОУК (2 минуты):**

### **1. /partners:**
```bash
curl -s https://getlifeundo.com/partners | grep -i "тариф"
```
**Ожидаемо:** Видна таблица тарифов, суммы/валюта подтягиваются

### **2. /api/public/pricing:**
```bash
curl -s https://getlifeundo.com/api/public/pricing
```
**Ожидаемо:** JSON с эффективными планами (tenant-aware)

### **3. /admin/status:**
- Зайти в админку
- Включить баннер
- Проверить `/status`

**Ожидаемо:** Баннер появился на **/status**

### **4. /admin/emails:**
- Сохранить шаблон
- Нажать «Отправить тест»

**Ожидаемо:** Письмо приходит

## **🔧 cURL для писем:**

### **Upsert шаблона:**
```bash
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'
```

### **Тест-отправка:**
```bash
curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **🚨 ТРОУБЛШУТИНГ:**

### **Письма не уходят:**
- Проверь `SMTP_*` и порт (465↔587)
- Проверь `MAIL_FROM`

### **Баннер не виден:**
- Обнови `/status` без кэша: `?cb=$(date +%s)`

### **Цены не меняются:**
- Проверь записи в `tenant_plans` (если нет — берётся `plans`)

## **✅ РЕЗУЛЬТАТ:**

После смоука пришли коротко:
- «/partners ок»
- «/status баннер виден»  
- «письмо пришло»

**Я сразу зафиксирую 0.4.2 — зелёный релиз! 🚀**

