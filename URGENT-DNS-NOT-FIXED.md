# 🚨 СРОЧНО: DNS НЕ ИСПРАВЛЕН!

## **❌ ПРОБЛЕМА:**

**DNS записи всё ещё указывают на Vercel!**

### **Текущее состояние:**
- `lifeundo.ru` → `76.76.21.21` (Vercel IP)
- `www.lifeundo.ru` → не разрешается
- Заголовки показывают `Server: Vercel`
- Страницы возвращают `NOT_FOUND`

## ** СОЧНЫЕ ДЕЙСТВИЯ:**

### **1. Cloudflare DNS (ПРЯМО СЕЙЧАС!):**

#### **Удалить:**
- `A @` → `76.76.21.21` (Vercel)
- Любые записи на `*.vercel.app`
- Любые записи на `github.io`

#### **Создать:**
- `A @` → `<BEGET_IP>` (Proxy: ON)
- `CNAME www` → `@` (Proxy: ON)

### **2. SSL/TLS:**
- **Encryption mode**: **Full (strict)**

### **3. Очистка кэша:**
- **Purge Everything**
- **Development Mode**: ON (3 часа)
- **Always Online**: OFF

### **4. Проверка NS:**
```bash
dig NS lifeundo.ru +short
```
**Должны быть Cloudflare NS!**

## **🔍 ПРОВЕРКА ПОСЛЕ ИСПРАВЛЕНИЯ:**

```bash
# DNS должен показать Beget IP
dig +short lifeundo.ru A

# Заголовки без Vercel
curl -I https://lifeundo.ru/

# Должно быть:
# - server: cloudflare
# - cf-cache-status: DYNAMIC|MISS
# - НЕТ x-vercel-*
```

## **🎯 КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Страницы доступны
- [ ] API работают
- [ ] Admin защищен

## **🚨 ПРИОРИТЕТ:**

**DNS записи - это корень проблемы!** Исправь их в Cloudflare в первую очередь!

**БЕЗ ИСПРАВЛЕНИЯ DNS МИГРАЦИЯ НЕВОЗМОЖНА! 🚨**

