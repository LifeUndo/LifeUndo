# 🚨 Срочная починка DNS - 10 минут

## **🔍 ДИАГНОЗ:**
**DNS для getlifeundo.com указывает на 45.130.41.28, а не на Beget → Cloudflare шлёт трафик не туда, SSL не сходится, всё падает.**

## **📋 ПОЧИНКА ЗА 10 МИНУТ:**

### **0) Узнай точный Beget-origin:**
- В панели Beget (сайт/приложение) посмотри **IP сервера** или **origin-hostname**
- Обозначим его как `<BEGET_IP>` (или `<BEGET_HOST>`)

### **1) Cloudflare → DNS (прямо сейчас):**

#### **Зона getlifeundo.com:**

**УДАЛИ:**
- `A @ = 45.130.41.28` (левый IP)
- Любые `CNAME` на `*.vercel.app` / `github.io`

**СОЗДАЙ (Proxy = ON, оранжевая тучка):**
- `A @` → `<BEGET_IP>` TTL Auto **Proxied**
- `CNAME www` → `@` TTL Auto **Proxied**

> Если у тебя hostname от Beget (вместо IP), можно:
> - `CNAME @` → `<BEGET_HOST>` (Cloudflare сделает **CNAME Flattening** на apex)
> - `CNAME www` → `@` (Proxied)

### **2) SSL/TLS (важно):**

#### **В Cloudflare:**
- **Full (strict)** (итоговый режим)

#### **На Beget:**
- Выпусти **Let's Encrypt** для `getlifeundo.com` и `www.getlifeundo.com`
- В Beget: Домены/SSL → Let's Encrypt → включить оба FQDN
- LE активируется только после того, как DNS реально смотрит на Beget

#### **Если LE ещё не ставится (пропагация идёт):**
На 10–30 минут можно:
- Либо временно поставить **Full** (НЕ strict) в Cloudflare
- Либо установить **Cloudflare Origin Certificate** на Beget
- После выпуска LE верни **Full (strict)**

### **3) Сброс кэша:**
- Cloudflare → **Purge Everything**
- Включи **Development Mode** (на 3 часа)
- **Always Online: OFF**

## **🔍 ПРОВЕРКИ (сразу после правок):**

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

**Ожидаем:**
- `/partners` показывает таблицу тарифов; `/api/public/pricing` — JSON
- `/status` — **App version: 0.4.2**; баннер виден при `active=true`
- Тестовое письмо приходит (если нет — проверь `SMTP_*`, SPF/DKIM/DMARC)

## **📁 БЫСТРЫЙ CSV ДЛЯ CLOUDFLARE DNS:**

*Подставь `<BEGET_IP>` и импортируй в зону getlifeundo.com; то же самое сделай для `.ru`.*

```
Type,Name,Content,TTL,Proxy
A,getlifeundo.com,<BEGET_IP>,Auto,Proxied
CNAME,www,getlifeundo.com,Auto,Proxied
```

## **🚨 ПОЧЕМУ СЕЙЧАС ВСЁ «КРАСНОЕ»:**

- Пока `A @` → **45.130.41.28**, трафик не идёт в Beget
- Cloudflare не может заверить цепочку до валидного origin-TLS → **SSL падает**
- После перевода **A/CNAME на Beget** и выпуска LE/OriginCert → **Full (strict)** даст стабильный HTTPS, и 0.4.2 станет доступен

## **🎯 ГОТОВО К ИСПРАВЛЕНИЮ:**

**Сделай правки в DNS/SSL по пунктам выше.**

**Как только поменяешь записи, пришли две строки:**
```bash
dig +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**Я по выводу сразу скажу «зелено» или где ещё подтюнить! 🚨**

