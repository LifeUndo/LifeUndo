# 💚 Final Wait - Жду вывод green-check

## **Что нужно от тебя сейчас:**

**Запусти `bash green-check.sh` и пришли 2 блока (PASS/FAIL) для:**

- `getlifeundo.com`
- `lifeundo.ru`

**Я по месту дам вердикт «зелено» или укажу точечно, что подкрутить.**

## **🚀 После зелёного:**

### **Печать «0.4.2 принято ✅»**
### **Полетим к 0.4.3**

## **📋 Готовые финишеры:**

### **1. Канонические редиректы (www → apex):**
```bash
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

### **2. Cache Rules:**
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

**Жду вывод `green-check` по .com и .ru — добиваем, ставим печать «0.4.2 принято ✅» и полетим к 0.4.3! 🚀**


