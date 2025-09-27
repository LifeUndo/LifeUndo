# 🎯 Final Verification Commands - Две ключевые команды

## **🔍 ГОТОВО К ИСПРАВЛЕНИЮ:**

**Когда применишь DNS изменения — скинь две строки:**

### **1. Проверка DNS:**
```bash
dig @1.1.1.1 +short getlifeundo.com A
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

**По выводу сразу скажу «зелено» и закроим смоук 0.4.2!**

## **🧪 СМОУК 0.4.2 (после «зелёного» HTTPS):**

### **1. Pricing JSON (tenant-aware):**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```

### **2. Status + версия + баннер:**
```bash
curl -s https://getlifeundo.com/status | grep -i -E 'App version|status|banner'
```

### **3. Email тесты (замени BasicAuth):**
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

## **📋 Чек-лист финальной проверки:**

- [ ] DNS указывает на Beget (НЕ 45.130.41.28)
- [ ] Заголовки показывают Cloudflare
- [ ] НЕТ x-vercel-* заголовков
- [ ] SSL работает без ошибок
- [ ] /status показывает 0.4.2
- [ ] /api/public/pricing возвращает JSON
- [ ] Email тесты проходят

## **🚨 ПРИОРИТЕТ:**

**DNS записи - корень проблемы! Исправь их в Cloudflare в первую очередь!**

**БЕЗ ИСПРАВЛЕНИЯ DNS СМОУК ТЕСТ НЕВОЗМОЖЕН! 🚨**