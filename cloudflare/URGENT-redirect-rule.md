# 🚨 СРОЧНО: Включить редирект в Cloudflare

## **Прямо сейчас в Cloudflare:**

1. **Rules** → **Redirect Rules** → **Create Redirect Rule**

2. **Настройки:**
   - **Rule name**: `Emergency Redirect lifeundo.ru`
   - **When incoming requests match**: `http.host eq "lifeundo.ru"`
   - **Then**: **Redirect**
   - **Status code**: `301`
   - **Destination**: `https://getlifeundo.com/$1`
   - **Preserve query string**: ✅

3. **Save** - это мгновенно исправит проблему!

## **Проверка:**
```bash
curl -I https://lifeundo.ru/
# Должен показать: 301 Moved Permanently
# Location: https://getlifeundo.com/
```

## **После этого:**
- Пользователи будут перенаправлены на рабочий .com
- Старая "VIP лицензия" исчезнет
- Можно спокойно исправлять привязку домена

**Это займёт 30 секунд и мгновенно решит проблему!**



