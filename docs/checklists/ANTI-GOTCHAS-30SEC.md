# 🚨 Anti-Gotchas 30sec - Быстрые анти-залипы

## **5) Быстрые анти-залипы (чек в 30 сек)**

### **1. Проверить AAAA записи:**
```bash
dig +short getlifeundo.com AAAA
```
**Если есть левые IPv6 — убери/поправь**

### **2. Проверить NS записи:**
```bash
dig NS getlifeundo.com +short
```
**Должны быть две `*.ns.cloudflare.com`**

### **3. Проверить DNSSEC/CAA:**
```bash
dig +short CAA getlifeundo.com
```
**DNSSEC/CAA могут мешать LE → временно выключи DNSSEC или добавь `CAA: 0 issue "letsencrypt.org"`**

### **4. Проверить кэш:**
```bash
# Всегда Purge Everything + ?cb=$(date +%s) при проверках
curl -I "https://getlifeundo.com/?cb=$(date +%s)" | grep -i "cf-cache-status"
```

## **🔍 Дополнительные проверки:**

### **5. Проверить все типы записей:**
```bash
dig +short getlifeundo.com ANY
```
**Убедись что нет лишних записей**

### **6. Проверить CNAME chain:**
```bash
dig +trace getlifeundo.com
```
**Убедись что цепочка разрешения корректна**

### **7. Проверить TTL:**
```bash
dig getlifeundo.com A | grep -i "ttl"
```
**TTL должен быть разумным (не 86400 для тестирования)**

## **⚡ Быстрые исправления:**

### **Удалить AAAA:**
```bash
# Если нужно удалить AAAA через API
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=getlifeundo.com" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN"
```

### **Добавить CAA:**
```bash
# Добавить CAA для Let's Encrypt
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"CAA","name":"getlifeundo.com","content":"0 issue \"letsencrypt.org\"","ttl":1}'
```

### **Purge Everything:**
```bash
# Очистить кэш Cloudflare
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

## **✅ Критерии готовности:**

- [ ] AAAA записи исправлены
- [ ] NS записи = Cloudflare
- [ ] DNSSEC/CAA не блокируют LE
- [ ] Кэш очищен
- [ ] TTL разумный
- [ ] Нет лишних записей

## **🎯 ГОТОВО:**

**Все анти-залипы устранены! DNS исправлен! 🚀**


