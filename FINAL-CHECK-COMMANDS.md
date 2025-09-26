# ⚡ Финальные команды для проверки

## **🔍 1. Проверка NS записей:**

```bash
dig NS lifeundo.ru +short
```

**Ожидаемо:**
- Два имени вида `*.ns.cloudflare.com`
- НЕ Vercel/регистратор

## **🔍 2. Проверка A записи:**

```bash
dig +short lifeundo.ru A
```

**Ожидаемо:**
- `<BEGET_IP>` (НЕ 76.76.21.21)

## **🔍 3. Проверка заголовков:**

```bash
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**Ожидаемо:**
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **НЕТ** `x-vercel-*`

## **🔍 4. Проверка версий:**

```bash
curl -s https://lifeundo.ru/status | grep -i "App version"
curl -s https://getlifeundo.com/status | grep -i "App version"
```

**Ожидаемо:**
- `App version: 0.4.1` на обоих доменах

## **🔍 5. API смоук:**

```bash
API="<RAW_API_KEY>"
curl -s -X POST https://lifeundo.ru/api/v1/licenses/validate \
  -H "Authorization: Bearer $API" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
curl -s https://lifeundo.ru/api/v1/usage -H "Authorization: Bearer $API"
```

**Ожидаемо:**
- API возвращает `{"ok":true,...}`
- Usage tracking работает

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] NS записи = Cloudflare
- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Оба домена показывают 0.4.1
- [ ] API работают
- [ ] Vercel-редирект снят

## **🎯 ФИНАЛЬНАЯ ПРОВЕРКА:**

### **Две ключевые команды:**
```bash
dig NS lifeundo.ru +short
dig +short lifeundo.ru A
```

### **Ожидаемый результат:**
- **NS**: два имени вида `*.ns.cloudflare.com`
- **A**: `<BEGET_IP>` (НЕ 76.76.21.21)

## **🚀 ГОТОВО:**

После успешного прохождения всех проверок:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью

**GetLifeUndo 0.4.1 идеально готов! 🚀**

