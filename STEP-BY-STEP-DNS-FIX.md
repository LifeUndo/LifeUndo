# 🔧 Пошаговое исправление DNS

## **ШАГ 1: Cloudflare DNS Records**

### **1.1 Исправить lifeundo.ru:**
1. Cloudflare → **DNS** → **Records**
2. Найти запись `lifeundo.ru`
3. **Изменить на:**
   - **Type**: A
   - **Name**: `lifeundo.ru`
   - **IPv4 address**: **[IP Beget сервера]** (спросить у поддержки Beget)
   - **Proxy status**: 🟧 **Proxied**
   - **TTL**: Auto

### **1.2 Исправить www.lifeundo.ru:**
1. Найти запись `www.lifeundo.ru`
2. **Изменить на:**
   - **Type**: CNAME
   - **Name**: `www.lifeundo.ru`
   - **Target**: `lifeundo.ru`
   - **Proxy status**: 🟧 **Proxied**
   - **TTL**: Auto

### **1.3 Удалить старые записи:**
- Удалить любые записи с `*.vercel.app`
- Удалить любые записи с `github.io`
- Удалить любые записи с `76.76.21.21`

## **ШАГ 2: SSL/TLS**

1. Cloudflare → **SSL/TLS** → **Overview**
2. **Encryption mode**: **Full (strict)**

## **ШАГ 3: Очистка кэша**

1. Cloudflare → **Caching** → **Configuration**
2. **Purge Everything**
3. **Development Mode**: ON (3 часа)
4. **Always Online**: OFF

## **ШАГ 4: Проверка DNS**

```bash
# Должен показать Beget IP (НЕ 76.76.21.21)
nslookup lifeundo.ru

# Должен показать lifeundo.ru (НЕ github.io)
nslookup www.lifeundo.ru
```

## **ШАГ 5: Проверка заголовков**

```bash
curl -I https://lifeundo.ru/
```

**Ожидаемо:**
- ✅ `server: cloudflare`
- ✅ `cf-cache-status: DYNAMIC|MISS`
- ❌ **НЕТ** `x-vercel-*`

## **ШАГ 6: Проверка редиректа**

```bash
curl -I https://lifeundo.ru/anything?x=1
```

**Должен показать:**
- `301 Moved Permanently`
- `Location: https://getlifeundo.com/anything?x=1`

## **ШАГ 7: Снять редирект (после исправления DNS)**

1. Cloudflare → **Rules** → **Redirect Rules**
2. **Delete** emergency redirect rule
3. **Purge Everything** еще раз

## **ШАГ 8: Финальная проверка**

```bash
# Оба домена должны работать одинаково
curl -I https://lifeundo.ru/status
curl -I https://getlifeundo.com/status

# Должны показать одинаковый контент
```

## **ПРИОРИТЕТ:**

1. **КРИТИЧНО**: Исправить DNS записи
2. **ВАЖНО**: Очистить кэш
3. **ПРОВЕРИТЬ**: Заголовки без Vercel
4. **СНЯТЬ**: Редирект после исправления

**DNS записи - ключ к решению проблемы! 🔑**

