# 🚀 Финальный чек-лист миграции - Вариант A

## **📋 ЧТО СДЕЛАТЬ ПРЯМО СЕЙЧАС:**

### **1. NS у регистратора = Cloudflare:**
- [ ] Проверить NS записи у регистратора
- [ ] Если не Cloudflare - сменить на NS из зоны Cloudflare
- [ ] Домен должен стать "Active" в Cloudflare

### **2. Cloudflare → DNS (на каждую зону):**
- [ ] **Удалить:**
  - `A @` → `76.76.21.21` (Vercel)
  - `CNAME www` → `*.vercel.app` (Vercel)
  - `CNAME www` → `github.io` (GitHub)
- [ ] **Создать:**
  - `A @` → `<BEGET_IP>` (Proxy **ON**)
  - `CNAME www` → `@` (Proxy **ON**)
- [ ] **SSL/TLS**: Full (strict)

### **3. Caching:**
- [ ] **Purge Everything**
- [ ] **Dev Mode ON** (3 часа)
- [ ] **Always Online OFF**

### **4. Vercel:**
- [ ] **Снять домены**: `lifeundo.ru`, `www.lifeundo.ru`
- [ ] **При необходимости**: `getlifeundo.com`
- [ ] **Проект НЕ удалять** - оставить для превью

## **🔍 БЫСТРЫЕ ПРОВЕРКИ (после DNS):**

### **1. DNS указывает на Beget:**
```bash
dig +short lifeundo.ru A
dig +short www.lifeundo.ru CNAME
```
- [ ] НЕ `76.76.21.21`
- [ ] НЕ `github.io`

### **2. Заголовки через Cloudflare:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip;/^location:/Ip'
```
- [ ] `server: cloudflare`
- [ ] `cf-cache-status: DYNAMIC|MISS`
- [ ] **НЕТ** `x-vercel-*`

## **✅ ACCEPTANCE-КРИТЕРИИ (готово, если все true):**

### **1. Версии:**
- [ ] `.ru` и `.com` отдают **0.4.1** на `/status`

### **2. Заголовки:**
- [ ] Нет `X-Vercel-*` и лишних редиректов

### **3. Безопасность:**
- [ ] `/admin` закрыт BasicAuth
- [ ] IP whitelist активен (желательно)

### **4. API endpoints:**
- [ ] **Legacy**: `/api/license/{validate|activate}` работают
- [ ] **Новые**: `/api/v1/{licenses/validate|activate, usage}` работают
- [ ] `/api/v1/usage` увеличивается после 2-3 вызовов

### **5. Monitoring:**
- [ ] Sentry ловит события (если DSN добавлен)
- [ ] Cloudflare WAF активен (`/admin`, `/drizzle`)
- [ ] Rate Limit `/api/*` активен

## ** FreeKassa (ничего не меняем):**

### **1. Webhook:**
- [ ] Остаётся: `https://getlifeundo.com/api/fk/notify`
- [ ] Смоук: тест-уведомление в ЛК FK
- [ ] Запись в `webhooks`, `payments`, `orders.status=paid`

## **🚨 Если что-то «залипло»:**

### **1. Кэш:**
- [ ] Dev Mode ON
- [ ] Purge Everything
- [ ] Добавить `?cb=<timestamp>` в URL

### **2. Beget:**
```bash
rm -rf .next && npm run build && npm start
```
- [ ] Убрать `index.html` из корня
- [ ] Пересобрать Next

## **🔄 Rollback (на всякий):**

### **1. Временный редирект:**
- [ ] Cloudflare → Redirect Rule 301
- [ ] `.ru → .com` пока правишь DNS
- [ ] После фикса - снять редирект
- [ ] Снова Purge

## **🎯 КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] NS записи = Cloudflare
- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Оба домена показывают 0.4.1
- [ ] Все API работают
- [ ] Usage tracking работает
- [ ] FreeKassa webhook работает
- [ ] Безопасность настроена

## **🎉 ГОТОВО К ПРОДАКШЕНУ:**

После прохождения всех пунктов:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью
- ✅ Мониторинг активен
- ✅ Безопасность настроена

**GetLifeUndo 0.4.1 идеально готов! 🚀**

