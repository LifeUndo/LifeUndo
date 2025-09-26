# 🎯 Final Validation Commands - Финальная валидация

## **🔍 ГОТОВ НА ФИНАЛЬНУЮ ВАЛИДАЦИЮ:**

**Как только сделаешь правки, кинь:**

### **Две строки на .com:**
```bash
dig @1.1.1.1 +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

### **Две строки на .ru:**
```bash
dig @1.1.1.1 +short lifeundo.ru A
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

## **✅ ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ:**

### **A-запись:**
- **НЕ** `45.130.41.28`
- **НЕ** vercel/github IP
- Должен показать `<BEGET_IP>`

### **Заголовки:**
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **НЕТ** `x-vercel-*`

## **🚀 ПОСЛЕ ВАЛИДАЦИИ:**

**Я скажу «зелено»/куда докрутить точечно, и сразу закрываем смоук 0.4.2!**

## **🧪 СМОУК 0.4.2 (после зелёного):**

### **1. Pricing JSON:**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```

### **2. Status + версия:**
```bash
curl -s https://getlifeundo.com/status | grep -i -E 'App version|status|banner'
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

**Четыре строки — и я скажу «зелено»! 🚀**

