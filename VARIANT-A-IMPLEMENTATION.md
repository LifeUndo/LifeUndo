# 🚀 Вариант A - Прод на Beget для обоих доменов

## **📋 ПЛАН РЕАЛИЗАЦИИ:**

### **1. Проверить NS записи (ОБЯЗАТЕЛЬНО!):**
```bash
dig NS lifeundo.ru +short
dig NS getlifeundo.com +short
```
**Должны быть Cloudflare NS!** Если нет - изменить у регистратора.

### **2. Cloudflare DNS - записи под Beget:**

**Удалить старьё:**
- `A lifeundo.ru` → `76.76.21.21` (Vercel)
- `CNAME www` → `*.vercel.app` (Vercel)
- `CNAME www` → `github.io` (GitHub)
- Любые записи на Vercel/GitHub

**Создать новые:**
- `A lifeundo.ru` → `<BEGET_IP>` (Proxy: ON)
- `CNAME www` → `lifeundo.ru` (Proxy: ON)
- `A getlifeundo.com` → `<BEGET_IP>` (Proxy: ON)
- `CNAME www` → `getlifeundo.com` (Proxy: ON)

### **3. SSL/TLS:**
- **Encryption mode**: **Full (strict)**

### **4. Очистка кэша:**
- **Purge Everything**
- **Development Mode**: ON (3 часа)
- **Always Online**: OFF

### **5. Vercel - снять домены:**
- Убрать `lifeundo.ru` из кастомных доменов
- Убрать `www.lifeundo.ru` из кастомных доменов
- При необходимости убрать `getlifeundo.com`
- **Проект НЕ удалять** - оставить для превью/стейджинга

### **6. FreeKassa:**
- Оставить как есть: `https://getlifeundo.com/api/fk/notify`
- Webhook уже усилен и логируется на Beget

## **✅ РЕЗУЛЬТАТ:**

- **Прод**: оба домена на Beget (0.4.1, white-label, API)
- **Превью**: Vercel для веток/PR (*.vercel.app)
- **FreeKassa**: без изменений
- **Совместимость**: `/api/license/*` и `/api/v1/*` работают

## **🎯 ПРЕИМУЩЕСТВА:**

- ✅ Единый прод для обоих доменов
- ✅ Все патчи 0.4.1 активны
- ✅ White-label функциональность
- ✅ API совместимость
- ✅ Vercel для превью
- ✅ FreeKassa без изменений


