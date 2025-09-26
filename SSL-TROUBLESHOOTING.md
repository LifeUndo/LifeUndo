# 🔐 SSL Troubleshooting - Если упёрлось в SSL

## **🚨 Если упёрлось в SSL:**

### **Быстро (Proxy OFF → LE → Proxy ON):**

#### **1. Временно Proxy OFF:**
- В Cloudflare: DNS → `@` и `www` → **Proxy OFF** (серые тучки)

#### **2. Выпустить Let's Encrypt на Beget:**
- В Beget: Домены → SSL → **Let's Encrypt**
- Для `getlifeundo.com` и `www.getlifeundo.com`
- Для `lifeundo.ru` и `www.lifeundo.ru`

#### **3. Вернуть Proxy ON:**
- В Cloudflare: DNS → `@` и `www` → **Proxy ON** (оранжевые тучки)

#### **4. SSL режим:**
- Cloudflare: SSL/TLS → **Full (strict)**

### **Альтернатива (Origin Certificate):**

#### **1. Создать Origin Certificate:**
- В Cloudflare: SSL/TLS → Origin Server → **Create certificate**
- Для apex+www (`getlifeundo.com`, `www.getlifeundo.com`)
- Скачать сертификат

#### **2. Установить на Beget:**
- В Beget: Домены → SSL → **Upload certificate**
- Загрузить скачанный сертификат

#### **3. SSL режим:**
- Cloudflare: SSL/TLS → **Full (strict)**

## **🔧 Команды для проверки SSL:**

### **Проверить сертификат на origin:**
```bash
# Проверить что LE сертификат выпущен
openssl s_client -servername getlifeundo.com -connect <BEGET_IP>:443 -showcerts | head -n 25

# Проверить через Cloudflare
curl -I https://getlifeundo.com | grep -i "server\|cf-"
```

### **Проверить SSL режим в Cloudflare:**
```bash
curl -sX GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" | jq '.result.value'
```

### **Установить Full (strict):**
```bash
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"strict"}'
```

## **✅ Критерии готовности SSL:**

- [ ] SSL режим = **Full (strict)**
- [ ] Сертификат валиден для всех доменов
- [ ] Cloudflare проксирует HTTPS трафик
- [ ] Нет SSL ошибок в браузере

## **🎯 ГОТОВО:**

**SSL настроен! Можно запускать green-check.sh! 🚀**

