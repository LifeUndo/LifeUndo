# 🌪️ Cloudflare API Commands - Точечные команды

## **1) Cloudflare DNS — точечные команды (API)**

> **Подставь `CF_API_TOKEN`, `ZONE_ID`, `<BEGET_IP>`. Эти 4 вызова удалят старьё и создадут нужные записи с Proxy ON.**

### **Получить API токен и Zone ID:**
```bash
# API Token: Cloudflare Dashboard → My Profile → API Tokens → Create Token
# Zone ID: Cloudflare Dashboard → getlifeundo.com → Overview → Zone ID
export CF_API_TOKEN="your_token_here"
export ZONE_ID="your_zone_id_here"
export BEGET_IP="your_beget_ip_here"
```

### **Удалить старые записи:**
```bash
# (а) удалить старый A @
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=A&name=getlifeundo.com" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# (б) удалить CNAME www (если указывалось на github/vercel)
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=www.getlifeundo.com" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"
```

### **Создать новые записи:**
```bash
# (в) создать A @ → <BEGET_IP>, Proxy=ON
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d "{\"type\":\"A\",\"name\":\"getlifeundo.com\",\"content\":\"$BEGET_IP\",\"proxied\":true,\"ttl\":1}"

# (г) создать CNAME www → @, Proxy=ON
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{ "type":"CNAME","name":"www","content":"getlifeundo.com","proxied":true,"ttl":1 }'
```

> **Повтори те же шаги для lifeundo.ru (замени домен и ZONE_ID). После этого — Purge Everything + Dev Mode ON (3h).**

## **2) Быстрая проверка DNS/SSL (без локального кэша)**

```bash
# DNS через 1.1.1.1 (чтобы обойти локальный резолвер)
dig @1.1.1.1 +short getlifeundo.com A
dig @1.1.1.1 +short www.getlifeundo.com CNAME

# заголовки: должен быть cloudflare, без x-vercel, без редиректов
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**✅ Ожидаем:** `server: cloudflare`, `cf-cache-status: DYNAMIC|MISS`, **нет** `x-vercel-*`.

## **3) SSL на Beget — два надёжных пути**

### **Вариант 1 (LE по HTTP-01):**
- В Cloudflare на время выпуска **Proxy OFF** (серые тучки) для `@` и `www`
- В Beget: Домены → SSL → **Let's Encrypt** для `getlifeundo.com` и `www.getlifeundo.com`
- После выпуска → в Cloudflare снова **Proxy ON**; режим SSL = **Full (strict)**

### **Вариант 2 (Origin Cert, без выключения прокси):**
- В Cloudflare: SSL/TLS → Origin Server → **Create certificate** для apex+www
- Установи сертификат на Beget (если панель поддерживает)
- Cloudflare SSL = **Full (strict)**

> **Позже можно всё равно выпустить LE.**

## **4) Смоук 0.4.2 (после «зелёного» HTTPS)**

```bash
# pricing JSON (tenant-aware)
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'

# статус + версия + баннер
curl -s https://getlifeundo.com/status | grep -i -E 'App version|status|banner'

# письма (замени BasicAuth)
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'

curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **5) Быстрые анти-залипы (чек в 30 сек)**

- `dig +short getlifeundo.com AAAA` → если есть левые IPv6 — убери/поправь
- `dig NS getlifeundo.com +short` → **две** `*.ns.cloudflare.com`
- DNSSEC/CAA могут мешать LE → временно **выключи DNSSEC** или добавь `CAA: 0 issue "letsencrypt.org"`
- Всегда **Purge Everything** + `?cb=$(date +%s)` при проверках

## **🎯 ГОТОВО К ИСПРАВЛЕНИЮ:**

**Когда применишь — скинь две строки:**
```bash
dig @1.1.1.1 +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**По выводу сразу скажу «зелено» и закроим смоук 0.4.2! 🚀**


