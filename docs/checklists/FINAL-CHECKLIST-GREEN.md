# ✅ Финальный чек-лист "Зелёные инварианты"

## **🔍 ПРОВЕРКА ПОСЛЕ ИСПРАВЛЕНИЯ DNS:**

### **1. DNS записи:**
- [ ] `lifeundo.ru` → **Beget IP** (НЕ 76.76.21.21)
- [ ] `www.lifeundo.ru` → `lifeundo.ru` (НЕ github.io)
- [ ] **Proxy status**: 🟧 **Proxied** (оранжевая тучка)

### **2. Заголовки без кэша:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)"
```
- [ ] `server: cloudflare`
- [ ] `cf-cache-status: DYNAMIC|MISS`
- [ ] **НЕТ** `x-vercel-*`
- [ ] **НЕТ** редиректа (если редирект снят)

### **3. Сравнение доменов:**
```bash
curl -s "https://getlifeundo.com/status?cb=$(date +%s)" > /tmp/com.html
curl -s "https://lifeundo.ru/status?cb=$(date +%s)"   > /tmp/ru.html
diff -q /tmp/com.html /tmp/ru.html
```
- [ ] Одинаковый контент на обоих доменах
- [ ] Оба показывают `App version: 0.4.1`

## **🧪 Smoke-тест платформы:**

### **4. Статус и версия:**
```bash
curl -s https://lifeundo.ru/status | head -n1
curl -s https://getlifeundo.com/status | head -n1
```
- [ ] Оба показывают одинаковую версию

### **5. Legacy API совместимость:**
```bash
curl -s -X POST https://lifeundo.ru/api/license/validate \
  -H "Authorization: Bearer <RAW_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
```
- [ ] Возвращает `{"ok":true,"plan":"pro_m",...}`

### **6. V1 API + usage tracking:**
```bash
# Сделать несколько вызовов
for i in 1 2 3; do
  curl -s -X POST https://lifeundo.ru/api/v1/licenses/validate \
    -H "Authorization: Bearer <RAW_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{"key":"LIFE-TEST-0000-0000"}' > /dev/null
done

# Проверить usage
curl -s https://lifeundo.ru/api/v1/usage -H "Authorization: Bearer <RAW_API_KEY>"
```
- [ ] `monthCalls` увеличился после вызовов

### **7. Health checks:**
```bash
curl -s https://lifeundo.ru/api/_health
curl -s https://lifeundo.ru/api/_health/db
```
- [ ] Оба возвращают `ok`

## **🛡️ Безопасность:**

### **8. Admin защита:**
- [ ] `/admin` требует BasicAuth
- [ ] IP whitelist активен (если настроен)

### **9. Cloudflare защита:**
- [ ] WAF правила активны (`/admin`, `/drizzle`)
- [ ] Rate limiting активен (`/api/*`)

### **10. Monitoring:**
- [ ] Sentry принимает события (если DSN настроен)

## **🚨 Если что-то упрётся:**

### **301 «залип»:**
- Dev Mode ON
- Purge Everything
- Добавить `?cb=<timestamp>` к URL

### **Всё ещё Vercel:**
- Проверить DNS записи в Cloudflare
- Убедиться что нет CNAME на `*.vercel.app`

### **Старая статика:**
```bash
# На сервере Beget:
rm -rf .next
npm run build
npm start
```

## **🎯 Критерии готовности:**

- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Оба домена работают одинаково
- [ ] API endpoints работают
- [ ] Usage tracking работает
- [ ] Health checks работают
- [ ] Безопасность настроена

## **🎉 Готово к продакшену:**

После прохождения всех пунктов:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ Мониторинг активен
- ✅ Безопасность настроена

**GetLifeUndo 0.4.1 идеально готов! 🚀**


