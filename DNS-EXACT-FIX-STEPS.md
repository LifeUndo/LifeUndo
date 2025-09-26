# 🎯 DNS Exact Fix Steps - Точное исправление

## **1) Cloudflare DNS (getlifeundo.com)**

### **Удали:**
- `A @ = 45.130.41.28`
- Любые `CNAME` на `*.vercel.app`/`github.io`

### **Создай с Proxy ON:**
- `A @ <BEGET_IP>`
- `CNAME www getlifeundo.com`

### **Проверь AAAA:**
```bash
dig +short getlifeundo.com AAAA
```
**Если есть левые IPv6 → удали их или укажи на корректный origin/hostname**

> **Для lifeundo.ru сделай то же самое в этой же сессии:**
> - `A @ = <BEGET_IP>`
> - `CNAME www = lifeundo.ru`
> - **Proxy ON**

## **2) SSL/TLS**

### **Cloudflare:**
- **Full (strict)** (конечный режим)

### **На Beget:**
- Выпусти **Let's Encrypt** для `getlifeundo.com` и `www.getlifeundo.com` (и для `.ru`)

#### **Если LE не выдаётся из-за прокси:**
- Временно **сделай серые тучки** (Proxy OFF) на `@` и `www`
- Выпусти LE
- Потом снова **Proxy ON**

#### **Альтернатива:**
- Поставить **Cloudflare Origin Certificate** на Beget
- Затем вернуть **Full (strict)**

## **3) Кэш/режим**

- Cloudflare → **Purge Everything**
- **Development Mode: ON** (на 3 часа)
- **Always Online: OFF**

## **🔍 Быстрая проверка сразу после правок**

### **1. DNS должен уйти с 45.130.41.28 на BEGET:**
```bash
dig +short getlifeundo.com A
dig +short www.getlifeundo.com CNAME
```

### **2. Заголовки: через Cloudflare, без Vercel:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```
**Ожидаем:** `server: cloudflare`, `cf-cache-status: DYNAMIC|MISS`, **НЕТ** `x-vercel-*`

### **3. Статус/версия:**
```bash
curl -s https://getlifeundo.com/status | grep -i "App version"
```
**Ожидаем:** `App version: 0.4.2`

### **4. Если сомневаешься в TLS на origin:**
```bash
# должен показать валидный сертификат для getlifeundo.com (после LE/OriginCert)
openssl s_client -servername getlifeundo.com -connect <BEGET_IP>:443 -showcerts | head -n 25
```

## **🧪 Смоук 0.4.2 после «позеленения» HTTPS**

### **1. Pricing JSON:**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```

### **2. Status + баннер:**
```bash
curl -s https://getlifeundo.com/status | grep -i -E 'Status|App version'
```

### **3. Email тесты (замени учетку BasicAuth):**
```bash
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'

curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **🚨 Частые блокеры и мгновенные решения**

- **AAAA осталась** → удаляй/правь IPv6 (они перетирают A)
- **NS не Cloudflare** → у регистратора выставь `*.ns.cloudflare.com`
- **DNSSEC/CAA мешают LE** → на время выпуска **отключи DNSSEC** или добавь `CAA: 0 issue "letsencrypt.org"`
- **LE не ставится за прокси** → временно Proxy OFF на `@` и `www`, выпусти, затем Proxy ON
- **Кэш** → всегда Purge + `?cb=$(date +%s)` при проверках

## **🎯 ГОТОВО К ИСПРАВЛЕНИЮ:**

**Когда поменяешь записи — пришли две строки:**
```bash
dig +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**Я моментально скажу «зелено» и можно докатывать смоук 0.4.2 до конца! 🚀**

