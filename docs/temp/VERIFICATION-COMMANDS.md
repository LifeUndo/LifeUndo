# 🔍 Команды для проверки после исправления DNS

## **📋 ПРОВЕРКИ (сразу после правок):**

### **1. DNS больше НЕ должен указывать на 45.130.41.28:**
```bash
dig +short getlifeundo.com A
dig +short www.getlifeundo.com CNAME
```

### **2. Заголовки: через Cloudflare, без Vercel, SSL ок:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```
**Ожидаем:** `server: cloudflare`, `cf-cache-status: DYNAMIC|MISS`, **НЕТ** `x-vercel-*`

### **3. /status после LE/режима Full:**
```bash
curl -s https://getlifeundo.com/status | grep -i "App version"
```

## **🧪 ПОСЛЕ ВОССТАНОВЛЕНИЯ HTTPS — СМОУК 0.4.2:**

### **1. Pricing JSON:**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```

### **2. Status + баннер:**
```bash
curl -s https://getlifeundo.com/status | grep -i -E 'Status|App version'
```

### **3. Email тесты:**
```bash
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'

curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **🎯 ГОТОВО К ПРОВЕРКЕ:**

**Как только поменяешь DNS записи, пришли две строки:**
```bash
dig +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**Я по выводу сразу скажу «зелено» или где ещё подтюнить! 🚨**


