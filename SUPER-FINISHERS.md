# 💚 Super Finishers - Пара «супер-добивок»

## **Пара «супер-добивок» (по желанию, сразу готово к вставке)**

### **1) Канонические редиректы (www → apex) через Cloudflare API**

```bash
# создаёт Redirect Rule для www → apex (замени ZONE_ID / TOKEN и домен)
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{
   "name":"WWW to APEX",
   "kind":"zone",
   "phase":"http_request_dynamic_redirect",
   "rules":[{"enabled":true,"action":"redirect","expression":"(http.host eq \"www.getlifeundo.com\")",
     "action_parameters":{"from_value":{"status_code":301,"target_url":{"expression":"concat(\"https://getlifeundo.com\", http.request.uri)"}}}}]
 }'
```

**(Повтори для `lifeundo.ru`.)**

### **2) Cache Rules (прямо в UI или API)**

#### **Bypass:** `/api/*`, `/admin*`
#### **Cache Everything + долгий TTL:** `/_next/static/*`

#### **API пример создания «bypass /api»:**
```bash
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{
  "name":"Bypass API/Admin",
  "kind":"zone",
  "phase":"http_request_cache_settings",
  "rules":[
    {"enabled":true,"expression":"starts_with(http.request.uri.path, \"/api/\") or starts_with(http.request.uri.path, \"/admin\")","action":"set_cache_settings","action_parameters":{"cache":"bypass"}}
  ]
}'
```

## **🎯 ГОТОВО:**

**Супер-добивки готовы к вставке! 🚀**


