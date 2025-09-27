# 🔍 Final Verification Script - Две ключевые команды

## **🎯 ГОТОВО К ИСПРАВЛЕНИЮ:**

**Как обновишь DNS записи — пришли две строки:**

### **1. Проверка DNS:**
```bash
dig +short getlifeundo.com A
```

### **2. Проверка заголовков:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

## **✅ ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ:**

### **1. DNS:**
- **НЕ** `45.130.41.28`
- Должен показать `<BEGET_IP>` или `<BEGET_HOST>`

### **2. Заголовки:**
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **НЕТ** `x-vercel-*`

## **🚀 ПОСЛЕ ПРОВЕРКИ:**

**По выводу сразу скажу «зелено» и можно катить смоук 0.4.2 до конца!**

## **🧪 СМОУК 0.4.2 (после восстановления HTTPS):**

### **1. Per-tenant pricing JSON:**
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

## **🎯 ГОТОВО:**

**Две строки — и я скажу «зелено»! 🚀**


