# 🚨 ЭКСТРЕННЫЙ РЕДИРЕКТ АКТИВЕН

## **СЕЙЧАС В CLOUDFLARE:**

### **UI (быстрее):**
1. **Rules** → **Redirect Rules** → **Create rule**
2. **If Hostname** is `lifeundo.ru` OR `www.lifeundo.ru`
3. **Static redirect** to `https://getlifeundo.com/$1` (301)
4. ✅ **Preserve query string**
5. **Save**

### **API (если удобнее):**
```bash
# Заполнить CF_API_TOKEN и ZONE_ID
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency .ru→.com",
    "rules": [{
      "expression": "(http.host eq \"lifeundo.ru\") or (http.host eq \"www.lifeundo.ru\")",
      "action": "redirect",
      "action_parameters": {
        "from_value": {
          "status_code": 301,
          "target_url": {"value": "https://getlifeundo.com/$1"},
          "preserve_query_string": true
        }
      }
    }]
  }'
```

## **ПРОВЕРКА:**
```bash
curl -I https://lifeundo.ru/anything?x=1
# Должен быть: 301 Location: https://getlifeundo.com/anything?x=1
```

**Это мгновенно исправит проблему "VIP лицензия"!**




