# ✅ Зеленая карточка (итоговые исходы)

## **🎯 КРИТЕРИИ ЗАКРЫТИЯ МИГРАЦИИ:**

### **1. NS у регистратора**

**Команда:** `dig NS lifeundo.ru +short`

**Ожидаем:** два имени `*.ns.cloudflare.com`

**Если не так:** у регистратора выставь Cloudflare-NS для `lifeundo.ru`

### **2. A/CNAME на Beget (не Vercel/GitHub)**

**Команды:**
```bash
dig +short lifeundo.ru A
dig +short www.lifeundo.ru CNAME
```

**Ожидаем:**
- `lifeundo.ru A` → **<BEGET_IP>**
- `www.lifeundo.ru CNAME` → **lifeundo.ru**

**Если видишь:** `76.76.21.21` или `github.io` → правим записи в Cloudflare DNS, Proxy **ON**, Purge Everything

### **3. Запросы идут через Cloudflare, без Vercel**

**Команда:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**Ожидаем:**
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **НЕТ** `x-vercel-*`

### **4. Версия на обоих доменах совпадает**

**Команды:**
```bash
curl -s https://lifeundo.ru/status | grep -i "App version"
curl -s https://getlifeundo.com/status | grep -i "App version"
```

**Ожидаем:** **App version: 0.4.1** в обоих ответах

### **5. Админка закрыта**

**Команда:** `curl -I https://lifeundo.ru/admin`

**Ожидаем:** `401` + `WWW-Authenticate: Basic realm="getlifeundo"` (или `403`, если включён IP-whitelist)

### **6. API смоук + учёт вызовов**

```bash
API="<RAW_API_KEY>"
curl -s -X POST https://lifeundo.ru/api/license/validate \
  -H "Authorization: Bearer $API" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'

for i in 1 2 3; do
  curl -s -X POST https://lifeundo.ru/api/v1/licenses/validate \
    -H "Authorization: Bearer $API" -H "Content-Type: application/json" \
    -d '{"key":"LIFE-TEST-0000-0000"}' >/dev/null
done
curl -s https://lifeundo.ru/api/v1/usage -H "Authorization: Bearer $API"
```

**Ожидаем:** в `usage` `monthCalls ≥ 3`, `ok: true` в ответах

### **7. FreeKassa webhook**

**Действие:** отправить тест из ЛК FK на `https://getlifeundo.com/api/fk/notify`

**Ожидаем:** запись в `webhooks` + `payments`, повтор с тем же `intid` → `DUPLICATE`

## **🚨 Быстрые фиксы по результатам:**

### **Видишь `x-vercel-*`:**
- NS ещё не Cloudflare **или** в Cloudflare остались записи на Vercel/GitHub
- Исправь DNS, включи Proxy (оранжевая тучка), **Purge**, **Dev Mode ON**
- Добавь `?cb=<timestamp>` к URL

### **SSL-ошибка на `.com/.ru`:**
- Выпусти Let's Encrypt в Beget для обоих доменов
- В Cloudflare SSL/TLS = **Full (strict)**

### **Отдаётся «старая» страница:**
- Убедись, что на Beget нет `index.html` в корне приложения
- `rm -rf .next && npm run build && npm start`

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] NS записи = Cloudflare
- [ ] DNS записи исправлены (Beget IP)
- [ ] Заголовки без Vercel
- [ ] Оба домена показывают 0.4.1
- [ ] Admin защищен
- [ ] API работают
- [ ] Usage tracking работает
- [ ] FreeKassa webhook работает

## **🎯 ФИНАЛЬНАЯ ПРОВЕРКА:**

### **Если по этим пунктам всё совпало:**
- ✅ Миграция **закрыта зелёным**

### **Если где-то не сходится:**
Пришли 2 строки:
```bash
dig NS lifeundo.ru +short
dig +short lifeundo.ru A
```
И краткий вывод `curl -I` с `server/cf-cache-status/x-vercel`

**Я сразу укажу точку, где застряло, и как именно поправить**

## **🚀 ГОТОВО К ПРОДАКШЕНУ:**

После прохождения всех пунктов:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью
- ✅ Мониторинг активен
- ✅ Безопасность настроена

**GetLifeUndo 0.4.1 идеально готов! 🚀**


