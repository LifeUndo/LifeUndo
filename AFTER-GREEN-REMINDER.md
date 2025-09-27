# 💚 After Green Reminder - Напоминание для «после зелёного»

## **Напоминание для «после зелёного»**

### **1. Cloudflare:**
- **Dev Mode → OFF**

### **2. HSTS:**
- `max-age=31536000; includeSubDomains; preload`

### **3. SPF/DKIM/DMARC:**
- Для лучшей доставки писем

## **🔧 Команды для после зелёного:**

### **Dev Mode OFF:**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/development_mode" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"off"}'
```

### **HSTS:**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_header" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":{"strict_transport_security":{"enabled":true,"max_age":31536000,"include_subdomains":true,"preload":true}}}'
```

### **SPF (TXT):**
```
v=spf1 include:<smtp-провайдер> ~all
```

### **DKIM:**
- Ключи из SMTP-панели (CNAME/TXT)

### **DMARC (TXT):**
```
_dmarc v=DMARC1; p=none; rua=mailto:dmarc@lifeundo.ru
```

## **🎯 ГОТОВО:**

**Напоминания для после зелёного готовы! 🚀**


