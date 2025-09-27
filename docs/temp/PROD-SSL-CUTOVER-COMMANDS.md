# 🔐 PROD SSL CUTOVER — ДЕЛАЕМ СЕЙЧАС

## 0) Подготовь переменные

```bash
# подставь свои значения
export BEGET_IP="XXX.XXX.XXX.XXX"        # IP Beget-origin
export CF_API_TOKEN="***"                 # Cloudflare API token (Zone+DNS edit)
export ZONE_ID_COM="***"                  # Zone ID getlifeundo.com
export ZONE_ID_RU="***"                   # Zone ID lifeundo.ru
```

## 1) DNS в Cloudflare → на Beget (оба домена)

```bash
# ——— getlifeundo.com
# удалить ВСЕ A @
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records?type=A&name=getlifeundo.com" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
 xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records/{}" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# удалить CNAME www (если остался старый)
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records?type=CNAME&name=www.getlifeundo.com" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
 xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records/{}" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# удалить AAAA @ (если были)
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records?type=AAAA&name=getlifeundo.com" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
 xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records/{}" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# создать A @ → BEGET_IP (proxied)
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d "{\"type\":\"A\",\"name\":\"getlifeundo.com\",\"content\":\"$BEGET_IP\",\"proxied\":true,\"ttl\":1}"

# создать CNAME www → apex (proxied)
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/dns_records" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{ "type":"CNAME","name":"www","content":"getlifeundo.com","proxied":true,"ttl":1 }'

# ——— lifeundo.ru (повтори)
# заменить $ZONE_ID_COM на $ZONE_ID_RU и имена домена
```

**Проверка DNS (через 1.1.1.1, мимо локального кеша):**

```bash
dig @1.1.1.1 +short getlifeundo.com A
dig @1.1.1.1 +short www.getlifeundo.com CNAME
dig @1.1.1.1 +short lifeundo.ru A
dig @1.1.1.1 +short www.lifeundo.ru CNAME
# Ожидаем: A = $BEGET_IP, CNAME = apex, AAAA — отсутствуют
```

## 2) Сертификат на origin (любой из вариантов)

### Вариант A — Let's Encrypt на Beget (самый быстрый)

1. В Cloudflare временно **Proxy OFF** (серые тучки) на `@` и `www` для обоих доменов.
2. В Beget → SSL → **Let's Encrypt** для apex+www.
3. Вернуть **Proxy ON**.
4. Cloudflare → **SSL mode = Full (strict)**.

### Вариант B — Cloudflare Origin Certificate (без Proxy OFF)

1. Cloudflare: **SSL/TLS → Origin Server → Create certificate** (apex+www).
2. Установить cert+key на Beget.
3. **SSL = Full (strict)**.

**Очистить кеш и Dev Mode (на время проверки):**

```bash
# Purge Everything (.com)
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/purge_cache" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" -d '{"purge_everything":true}'

# Dev Mode ON (3h)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID_COM/settings/development_mode" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" -d '{"value":"on"}'

# (повтори две команды для $ZONE_ID_RU)
```

## 3) Быстрая TLS-проверка (ожидаем Cloudflare, без Vercel)

```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
 sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | \
 sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
# Ожидаем: server: cloudflare; cf-cache-status: MISS|DYNAMIC; НЕТ x-vercel-*
```

## 🧪 PROD-СМOУК после SSL

```bash
# версия приложения
curl -s https://getlifeundo.com/status | grep -i "App version"
curl -s https://lifeundo.ru/status | grep -i "App version"
# ожидаем: App version: 0.4.3

# публичный JSON (и авто-логирование сработает)
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,(.plans[0]//{})'
curl -s https://lifeundo.ru/api/public/pricing | jq '.tenant,(.plans[0]//{})'

# usage summary (BasicAuth админки)
curl -s -u admin:****** https://getlifeundo.com/api/admin/usage/summary | jq
curl -s -u admin:****** https://lifeundo.ru/api/admin/usage/summary | jq
# ожидаем: ok:true, total >= 1, byEndpoint содержит /api/public/pricing
```

## ✅ ЗАКРЫТИЕ РЕЛИЗА 0.4.3

1. Cloudflare: **Dev Mode OFF**, 301 `www→apex`, Cache Rules: **Bypass** `/api/*`, `/admin*`.
2. Sentry: пометить релиз `0.4.3`.
3. SEO: `GET /robots.txt` и `/sitemap.xml` → 200 на обоих доменах.
4. `/admin/status` → включи баннер и проверь на `/status`.
5. (опц.) запусти тестовый платеж FreeKassa (sandbox/минимальной суммой) → проверь запись в `payments`, письмо `payment_succeeded`.

## Если где-то «красное»

Кинь **две строки по домену** — я сразу укажу точку фикса:

```bash
dig @1.1.1.1 +short <domain> A
curl -I -H "Cache-Control: no-cache" -L "https://<domain>/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

## Дальше (по желанию)

Скажи: **«SDK + чарт — одним постом»** — выдам патч:

* `/developers` с реальными ссылками на npm/PyPI,
* мини-чарт (recharts) в `/admin/usage` вместо текст-графика.


