# 🔧 SSL/TLS FIX + E2E FILES — ONE POST

## 0) Предусловия (подставь значения)

```bash
# твои значения
export BEGET_IP="XXX.XXX.XXX.XXX"       # IP Beget-origin
export CF_API_TOKEN="***"               # Cloudflare API Token (Zone:Edit + DNS:Edit)
export ZONE_ID="***"                    # Cloudflare Zone ID (getlifeundo.com)
export ZONE_ID_RU="***"                 # Cloudflare Zone ID (lifeundo.ru)
```

## 1) Cloudflare DNS — точные шаги (оба домена)

### UI коротко:
* Удалить: `A @`, если он не = $BEGET_IP; любые `CNAME` на vercel/github; **все AAAA**.
* Создать: `A @ = $BEGET_IP` (Proxy ON); `CNAME www = <apex>` (Proxy ON).

### API (пример для .com):
```bash
# удалить A @
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=A&name=getlifeundo.com" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
 xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# удалить CNAME www (если есть)
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=www.getlifeundo.com" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
 xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# удалить любые AAAA @
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=getlifeundo.com" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
 xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"

# создать A @ → BEGET_IP (proxied)
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d "{\"type\":\"A\",\"name\":\"getlifeundo.com\",\"content\":\"$BEGET_IP\",\"proxied\":true,\"ttl\":1}"

# создать CNAME www → apex (proxied)
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{ "type":"CNAME","name":"www","content":"getlifeundo.com","proxied":true,"ttl":1 }'
```

Повтори те же 4 вызова для `lifeundo.ru` с `$ZONE_ID_RU` и именами домена.

### Проверка DNS (обходит локальный кеш):
```bash
dig @1.1.1.1 +short getlifeundo.com A
dig @1.1.1.1 +short www.getlifeundo.com CNAME
dig @1.1.1.1 +short lifeundo.ru A
dig @1.1.1.1 +short www.lifeundo.ru CNAME
```

Ожидаем: **A = $BEGET_IP**, CNAME = apex, **AAAA нет**.

## 2) SSL на Beget — два надёжных пути

### Вариант A — Let's Encrypt (HTTP-01)
1. В Cloudflare **Proxy OFF** для `@` и `www` (временно «серые тучки»).
2. В Beget → SSL → выпустить **Let's Encrypt** для apex + www (оба домена).
3. В Cloudflare вернуть **Proxy ON**; **SSL Mode = Full (strict)**.

### Вариант B — Cloudflare Origin Certificate
1. В Cloudflare: **SSL/TLS → Origin Server → Create certificate** (apex+www).
2. Установить cert+key на Beget (панель/веб-сервер).
3. Cloudflare: **SSL Mode = Full (strict)**. (Прокси — ON, ничего временно не выключаем.)

### Сброс кеша & режим разработчика на время проверок:
```bash
# Purge Everything
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{"purge_everything":true}'

# Development Mode ON (3h)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/development_mode" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{"value":"on"}'
```

### Быстрый TLS-чек:
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
# ждём: server: cloudflare; cf-cache-status: MISS|DYNAMIC; НЕТ x-vercel-*
```

## 3) HSTS/Redirect — серверные заголовки (если у тебя ещё нет)

**Файл:** `next.config.mjs` (добавь headers())

## 4) E2E — создаю недостающие файлы

**Файлы:** `playwright.config.ts`, `tests/e2e/admin-status.spec.ts`, `tests/e2e/admin-emails.spec.ts`

## 5) Приёмка 0.4.3 — финальный чек

```bash
# 1) DNS/SSL OK?
dig @1.1.1.1 +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
 sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'

# 2) Build + старт
npm run build && npm start

# 3) E2E
npm run test:e2e

# 4) Auto-usage (сделай вызовы и посмотри сводку)
curl -s https://getlifeundo.com/api/public/pricing >/dev/null
curl -s -u admin:****** https://getlifeundo.com/api/admin/usage/summary | jq
```

Ожидаем: `server: cloudflare`, **без** `x-vercel-*`, `/status` = **App version: 0.4.3**, в usage появились события.

## 6) После «зелёного»

* Cloudflare: **Dev Mode OFF**, 301 `www → apex`, Cache Rules: **Bypass** `/api/*`, `/admin*`.
* Sentry: релиз **0.4.3**.
* SEO: `/robots.txt` и `/sitemap.xml` → 200.

---

Если на каком-то шаге «красное» — скинь **две строки** (A-запись и заголовки) по каждому домену, отвечу точечно куда нажать.


