# ⚡ Быстрая проверка после правок

## **🔍 1. Проверка DNS:**

```bash
# DNS должен указывать на Beget (а не 76.76.21.21 / github.io)
dig +short lifeundo.ru A
dig +short www.lifeundo.ru CNAME
dig +short getlifeundo.com A
dig +short www.getlifeundo.com CNAME
```

**Ожидаемо:**
- `lifeundo.ru` → `<BEGET_IP>` (НЕ 76.76.21.21)
- `www.lifeundo.ru` → `lifeundo.ru` (НЕ github.io)
- `getlifeundo.com` → `<BEGET_IP>`
- `www.getlifeundo.com` → `getlifeundo.com`

## **🔍 2. Проверка заголовков:**

```bash
# Заголовки: через Cloudflare, без Vercel
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip;/^location:/Ip'
```

**Ожидаемо:**
- ✅ `server: cloudflare`
- ✅ `cf-cache-status: DYNAMIC|MISS`
- ❌ **НЕТ** `x-vercel-*`

## **🔍 3. Проверка версий:**

```bash
# /status на обоих доменах (версия должна совпадать, сейчас 0.4.1)
curl -s https://lifeundo.ru/status | head -n1
curl -s https://getlifeundo.com/status | head -n1
```

**Ожидаемо:**
- Оба показывают `App version: 0.4.1`

## **🔍 4. Проверка legacy API:**

```bash
# legacy эндпоинты (совместимость со старым приложением)
curl -s -X POST https://lifeundo.ru/api/license/validate \
  -H "Authorization: Bearer <RAW_API_KEY>" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
```

**Ожидаемо:**
- `{"ok":true,"plan":"pro_m",...}`

## **🔍 5. Проверка новых API + usage:**

```bash
# новые эндпоинты + рост usage
for i in 1 2 3; do
  curl -s -X POST https://lifeundo.ru/api/v1/licenses/validate \
    -H "Authorization: Bearer <RAW_API_KEY>" -H "Content-Type: application/json" \
    -d '{"key":"LIFE-TEST-0000-0000"}' >/dev/null
done
curl -s https://lifeundo.ru/api/v1/usage -H "Authorization: Bearer <RAW_API_KEY>"
```

**Ожидаемо:**
- `monthCalls` увеличился после вызовов

## **🔍 6. Проверка FreeKassa:**

```bash
# FreeKassa webhook должен работать
curl -s https://getlifeundo.com/api/fk/notify
```

**Ожидаемо:**
- Возвращает статус (не ошибку)

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Оба домена показывают 0.4.1
- [ ] Legacy API работает
- [ ] Новые API работают
- [ ] Usage tracking работает
- [ ] FreeKassa webhook работает

## **🎉 ГОТОВО К ПРОДАКШЕНУ:**

После прохождения всех проверок:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью

**GetLifeUndo 0.4.1 идеально готов! 🚀**


