# ✅ Post-Green Tasks - После «ALL GREEN — 0.4.2 принято ✅»

## **1. Cloudflare:**

### **Dev Mode OFF:**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/development_mode" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"off"}'
```

### **Cache Rules:**
- **Bypass** `/api/*`, `/admin*`
- **Cache Everything** для `/_next/static/*`

```bash
# Bypass /api/*
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"*/api/*"}}],"actions":[{"id":"cache_level","value":"bypass"}],"priority":1,"status":"active"}'

# Bypass /admin*
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"*/admin*"}}],"actions":[{"id":"cache_level","value":"bypass"}],"priority":2,"status":"active"}'

# Cache Everything for /_next/static/*
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"*/_next/static/*"}}],"actions":[{"id":"cache_level","value":"cache_everything"}],"priority":3,"status":"active"}'
```

### **301 Redirects (www → apex):**
```bash
# getlifeundo.com
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"www.getlifeundo.com/*"}}],"actions":[{"id":"forwarding_url","value":{"url":"https://getlifeundo.com/$1","status_code":301}}],"priority":4,"status":"active"}'

# lifeundo.ru
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"www.lifeundo.ru/*"}}],"actions":[{"id":"forwarding_url","value":{"url":"https://lifeundo.ru/$1","status_code":301}}],"priority":5,"status":"active"}'
```

## **2. Безопасность:**

### **HSTS:**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_header" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":{"strict_transport_security":{"enabled":true,"max_age":31536000,"include_subdomains":true,"preload":true}}}'
```

### **SPF/DKIM/DMARC (повысит доставляемость):**

#### **SPF (TXT):**
```
v=spf1 include:<smtp-провайдер> ~all
```

#### **DKIM:**
- Ключи из SMTP-панели (CNAME/TXT)

#### **DMARC (TXT):**
```
_dmarc v=DMARC1; p=none; rua=mailto:dmarc@lifeundo.ru
```

## **3. Релизная фиксация:**

### **Отметить релиз в Sentry:**
- Версия: `0.4.2`
- Окружение: `production`

### **RELEASE-NOTES-0.4.2.md:**
- Приложить к тикету

### **UptimeRobot:**
- Проверки `/api/_health` и `/api/_health/db`

## **🎯 ГОТОВО:**

**Все задачи после зелёного готовы! 🚀**


