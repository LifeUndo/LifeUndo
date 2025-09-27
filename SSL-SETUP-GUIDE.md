# 🔐 SSL Setup Guide - Два надёжных пути

## **3) SSL на Beget — два надёжных пути**

### **Вариант 1 (LE по HTTP-01):**

#### **Шаги:**
1. **В Cloudflare на время выпуска Proxy OFF** (серые тучки) для `@` и `www`
2. **В Beget:** Домены → SSL → **Let's Encrypt** для `getlifeundo.com` и `www.getlifeundo.com`
3. **После выпуска** → в Cloudflare снова **Proxy ON**; режим SSL = **Full (strict)**

#### **Команды для проверки:**
```bash
# Проверить что LE сертификат выпущен
openssl s_client -servername getlifeundo.com -connect <BEGET_IP>:443 -showcerts | head -n 25

# Проверить что Cloudflare видит сертификат
curl -I https://getlifeundo.com | grep -i "server\|cf-"
```

### **Вариант 2 (Origin Cert, без выключения прокси):**

#### **Шаги:**
1. **В Cloudflare:** SSL/TLS → Origin Server → **Create certificate** для apex+www
2. **Установи сертификат на Beget** (если панель поддерживает)
3. **Cloudflare SSL = Full (strict)**

#### **Команды для проверки:**
```bash
# Проверить Origin Certificate
curl -I https://getlifeundo.com | grep -i "server\|cf-"

# Проверить SSL режим в Cloudflare
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq '.result.value'
```

## **🔧 Дополнительные SSL команды:**

### **Проверить SSL режим:**
```bash
# Текущий SSL режим
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq '.result.value'
```

### **Установить Full (strict):**
```bash
# Установить Full (strict)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"full_strict"}'
```

### **Проверить сертификат:**
```bash
# Проверить сертификат на origin
openssl s_client -servername getlifeundo.com -connect <BEGET_IP>:443 -showcerts | head -n 25

# Проверить через Cloudflare
curl -I https://getlifeundo.com | grep -i "server\|cf-"
```

## **✅ Критерии готовности SSL:**

- [ ] SSL режим = **Full (strict)**
- [ ] Сертификат валиден для `getlifeundo.com` и `www.getlifeundo.com`
- [ ] Cloudflare проксирует HTTPS трафик
- [ ] Нет SSL ошибок в браузере

## **🎯 ГОТОВО:**

**После настройки SSL — можно переходить к смоук тестам 0.4.2! 🚀**


