# 🚀 DNS Quick Fix Package - "Пакет удара"

## **⚡ ЧТО СДЕЛАТЬ (СУПЕРКОРОТКО):**

### **1. Выясни `<BEGET_IP>` или `<BEGET_HOST>`:**
- В панели Beget у приложения

### **2. Cloudflare → DNS (зона `getlifeundo.com`):**

#### **Удалить:**
- `A @ = 45.130.41.28`
- Любые записи на `*.vercel.app` и `github.io`

#### **Создать (оба Proxy: ON):**
- **Вариант с IP**: `A @ = <BEGET_IP>`
- `CNAME www = getlifeundo.com`

#### **ОК-альтернатива с хостнеймом:**
- `CNAME @ = <BEGET_HOST>` (Cloudflare сделает **CNAME flattening**)
- `CNAME www = @`

### **3. SSL/TLS:**
- **Cloudflare**: `Full (strict)`
- **Beget**: Выпусти **Let's Encrypt** для `getlifeundo.com` и `www.getlifeundo.com`

#### **Если LE пока не ставится:**
- Временно поставь **Full** (НЕ strict)
- Либо установи **Cloudflare Origin Certificate** на Beget
- Как только LE готов — верни **Full (strict)**

### **4. Caching:**
- **Purge Everything**
- Включи **Development Mode (3h)**
- **Always Online = OFF**

## **🔍 ПРОВЕРКИ (сразу после правок):**

### **1. DNS больше НЕ должен быть 45.130.41.28:**
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

### **3. /status должен показать 0.4.2:**
```bash
curl -s https://getlifeundo.com/status | grep -i "App version"
```

### **4. Проверить цепочку TLS на origin (полезно, если сомневаешься):**
```bash
# должен вернуться валидный сертификат для getlifeundo.com (после LE/OriginCert)
openssl s_client -servername getlifeundo.com -connect <BEGET_IP>:443 -showcerts | head -n 25
```

## **🧪 ПОСЛЕ ВОССТАНОВЛЕНИЯ HTTPS — СМОУК 0.4.2:**

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

## **🚨 ТОП-5 АНТИ-ЗАЛИПОВ (часто мешают SSL/DNS):**

### **1. AAAA-запись осталась и указывает не туда:**
```bash
dig +short getlifeundo.com AAAA
```
**Если есть левые IPv6 — удали или укажи на Beget/hostname**

### **2. NS не Cloudflare у регистратора:**
```bash
dig NS getlifeundo.com +short
```
**Должны быть два `*.ns.cloudflare.com`**

### **3. DNSSEC включён у регистратора, а в Cloudflare — нет (или наоборот):**
**Приведи к единому состоянию (обычно OFF на время миграции)**

### **4. CAA блокирует выпуск LE:**
```bash
dig +short CAA getlifeundo.com
```
**Добавь при необходимости `0 issue "letsencrypt.org"`**

### **5. Старые кэши:**
**Всегда делай `Purge Everything` и добавляй `?cb=$(date +%s)` к URL на время проверки**

## **🎯 ГОТОВО К ИСПРАВЛЕНИЮ:**

**Как обновишь записи — пришли две строки:**
```bash
dig +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**По ним сразу скажу «зелено» и можно катить смоук 0.4.2 до конца! 🚀**


