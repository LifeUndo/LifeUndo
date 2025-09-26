# 🚨 Instant Fixes - Мгновенные фиксы

## **2) Если вдруг что-то красное — мгновенные фиксы**

### **A не на Beget / есть AAAA:**

#### **Правим DNS:**
- A @ = BEGET_IP
- CNAME www → apex
- Proxy ON
- AAAA убрать

#### **Команды:**
```bash
# Создать правильную A запись
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d "{\"type\":\"A\",\"name\":\"<domain>\",\"content\":\"$BEGET_IP\",\"proxied\":true,\"ttl\":1}"

# Удалить AAAA
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=<domain>" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN"

# Purge + Dev Mode ON
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'

curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/development_mode" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"on"}'
```

### **Есть `x-vercel-*`:**

#### **Удалить все CNAME на `*.vercel.app`:**
```bash
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[] | select(.content | contains("vercel")) | .id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN"
```

#### **Проверить NS = `*.ns.cloudflare.com`:**
```bash
dig NS <domain> +short
# Должны быть две записи *.ns.cloudflare.com
```

#### **Purge:**
```bash
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

### **SSL:**

#### **Вариант 1 (Proxy OFF → LE → Proxy ON):**
```bash
# 1. Proxy OFF (вручную в UI)
# 2. Выпустить LE на Beget
# 3. Proxy ON (вручную в UI)
# 4. SSL=Full(strict)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"strict"}'
```

#### **Вариант 2 (Origin Certificate):**
```bash
# 1. Создать Origin Certificate в Cloudflare UI
# 2. Установить на Beget
# 3. SSL=Full(strict)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"strict"}'
```

### **`/status` ≠ `0.4.2`:**

#### **Пересборка на Beget:**
```bash
rm -rf .next && npm run build && npm start
```

## **🎯 ГОТОВО:**

**Все мгновенные фиксы готовы! 🚀**

