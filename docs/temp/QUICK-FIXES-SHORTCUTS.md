# 🚨 Quick Fixes Shortcuts - Быстрые шпаргалки

## **🚨 Если вдруг что-то красное — быстрые шпаргалки**

### **A не на Beget:**
- Правим A @
- Убираем AAAA
- Purge + Dev Mode ON

### **Есть `x-vercel-*`:**
- Где-то осталось на Vercel
- Убираем CNAME/старые NS
- Purge

### **SSL ошибается:**
- **Proxy OFF** (apex+www)
- **LE на Beget**
- **Proxy ON**
- **SSL=Full(strict)**
- **Или** ставим Cloudflare Origin Cert на Beget

### **/status ≠ 0.4.2:**
- Пересборка на Beget: `rm -rf .next && npm run build && npm start`

## **🔧 API команды для быстрого фикса:**

### **Удалить AAAA:**
```bash
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=<domain>" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN"
```

### **Создать правильную A запись:**
```bash
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d "{\"type\":\"A\",\"name\":\"<domain>\",\"content\":\"$BEGET_IP\",\"proxied\":true,\"ttl\":1}"
```

### **Purge Everything:**
```bash
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

### **Dev Mode ON:**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/development_mode" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"on"}'
```

### **SSL Full (strict):**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"strict"}'
```

## **🎯 ГОТОВО:**

**Все быстрые шпаргалки готовы! 🚀**


