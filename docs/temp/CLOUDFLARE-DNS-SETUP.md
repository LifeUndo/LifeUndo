# 🔧 Cloudflare DNS Setup - Готовые записи

## **📋 ГОТОВЫЕ DNS-ЗАПИСИ:**

### **1. Удалить (если есть):**
- `A @` → `76.76.21.21` (Vercel)
- `CNAME www` → `lifeundo.github.io` (GitHub)
- Любые записи на `*.vercel.app`

### **2. Создать:**
- `A @` → `<BEGET_ORIGIN_IP>` (Proxy: ON)
- `CNAME www` → `lifeundo.ru` (Proxy: ON)

## **📁 ИМПОРТ CSV:**

Используй файл `CLOUDFLARE-DNS-RECORDS.csv`:

1. Cloudflare → **DNS** → **Records**
2. **Import** → загрузить CSV
3. Заменить `<BEGET_ORIGIN_IP>` на реальный IP
4. **Save**

## **⚙️ НАСТРОЙКИ:**

### **SSL/TLS:**
- **Encryption mode**: **Full (strict)**

### **Caching:**
- **Development Mode**: ON (3 часа)
- **Always Online**: OFF
- **Purge Everything**

## **🔍 ПРОВЕРКА NS:**

```bash
dig NS lifeundo.ru +short
```

**Должны быть Cloudflare NS:**
- `abigail.ns.cloudflare.com`
- `kanye.ns.cloudflare.com`

## **✅ РЕЗУЛЬТАТ:**

После настройки:
- `lifeundo.ru` → Beget (через Cloudflare)
- `www.lifeundo.ru` → `lifeundo.ru` (через Cloudflare)
- Все правила/редиректы заработают
- Старая "VIP лицензия" исчезнет


