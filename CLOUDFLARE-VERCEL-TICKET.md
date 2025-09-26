# 🚨 URGENT: DNS/SSL Fix для getlifeundo.com

## Тикет для админа Cloudflare/Vercel

### **RU (для админа):**
```
СРОЧНО: Настроить DNS getlifeundo.com на Vercel. 
Удалить все старые A/AAAA записи для getlifeundo.com.
Создать: A getlifeundo.com → 76.76.21.21 (Proxy ON), CNAME www → cname.vercel-dns.com (Proxy ON).
SSL/TLS: Full (strict). Purge Cache (Everything).
В Vercel: Project → Domains → Refresh → Issue certificate → Redeploy.
```

### **EN (for admin):**
```
URGENT: Configure DNS for getlifeundo.com to point to Vercel.
Delete all old A/AAAA records for getlifeundo.com.
Create: A getlifeundo.com → 76.76.21.21 (Proxied ON), CNAME www → cname.vercel-dns.com (Proxied ON).
SSL/TLS: Full (strict). Purge Cache (Everything).
In Vercel: Project → Domains → Refresh → Issue certificate → Redeploy.
```

---

## 📋 Пошаговые инструкции:

### **Cloudflare:**
1. **DNS Records:**
   - Удалить: все A/AAAA записи для `getlifeundo.com`
   - Создать: `A getlifeundo.com → 76.76.21.21` (Proxied: ON, TTL: 120)
   - Создать: `CNAME www → cname.vercel-dns.com` (Proxied: ON)

2. **SSL/TLS:**
   - Mode: **Full (strict)**
   - Edge Certificates: включить "Always Use HTTPS"

3. **Cache:**
   - Purge Cache → **Purge Everything**

### **Vercel:**
1. **Project Settings:**
   - Domains → добавить `getlifeundo.com` и `www.getlifeundo.com`

2. **Certificate:**
   - Domains → **Refresh** рядом с доменом
   - Дождаться "Valid configuration"
   - **Issue certificate**

3. **Deploy:**
   - Deployments → Latest → **Redeploy**

---

## ✅ Критерии успеха:

```bash
# Должно вернуть HTTP/1.1 200 OK
curl.exe -I https://getlifeundo.com/
curl.exe -I https://www.getlifeundo.com/
```

**Ожидаемые заголовки:**
- `Server: Vercel`
- `X-Vercel-Cache: HIT` или `MISS`
- Валидный SSL сертификат

---

## ⏰ Время выполнения: 5-15 минут

