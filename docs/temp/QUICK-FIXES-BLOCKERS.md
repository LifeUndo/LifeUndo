# 🚨 Quick Fixes Blockers - Частые блокеры → мгновенный фикс

## **🚨 Частые блокеры → мгновенный фикс**

### **1. AAAA перетирает A:**
```bash
dig +short <domain> AAAA
```
**→ удаляем/правим IPv6**

### **2. NS не Cloudflare:**
```bash
dig NS <domain> +short
```
**→ должны быть `*.ns.cloudflare.com`**

### **3. LE не выдаётся:**
- Временно **Proxy OFF** (apex+www)
- Выпустить LE
- **Proxy ON**
- **Либо** ставим Origin Cert

### **4. CAA/DNSSEC:**
- На время выпуска выключить DNSSEC
- **Или** добавить `CAA: 0 issue "letsencrypt.org"`

### **5. Кэш:**
- Purge + `?cb=$(date +%s)` к URL

## **🔧 API команды для быстрого фикса:**

### **Удалить AAAA:**
```bash
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=<domain>" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN"
```

### **Добавить CAA:**
```bash
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"CAA","name":"<domain>","content":"0 issue \"letsencrypt.org\"","ttl":1}'
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

## **✅ Критерии устранения блокеров:**

- [ ] AAAA записи удалены/исправлены
- [ ] NS записи = Cloudflare
- [ ] LE выпущен или Origin Cert установлен
- [ ] CAA/DNSSEC не блокируют LE
- [ ] Кэш очищен

## **🎯 ГОТОВО:**

**Все блокеры устранены! DNS исправлен! 🚀**


