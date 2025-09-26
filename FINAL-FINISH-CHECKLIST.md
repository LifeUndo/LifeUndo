# 🚀 Финальный "финиш" - Вариант A

## **📋 ЧТО ДЕЛАЕМ ПРЯМО СЕЙЧАС:**

### **1. Vercel-затычка:**
- ✅ Уже готова - держим включённой
- ✅ Пока NS/DNS не переключатся на Cloudflare+Beget

### **2. Меняем NS у регистратора на Cloudflare:**
- ✅ В панели регистратора выставить обе NS
- ✅ Вид обычно `xxxx.ns.cloudflare.com` и `yyyy.ns.cloudflare.com`
- ✅ Зона станет "Active" в Cloudflare

### **3. Cloudflare DNS (после того как зона станет Active):**

#### **Удалить:**
- `A @ = 76.76.21.21` (Vercel)
- Любые `CNAME *.vercel.app`
- `CNAME www = github.io`

#### **Создать:**
- `A @ = <BEGET_IP>` (Proxy ON)
- `CNAME www = lifeundo.ru` (Proxy ON)

#### **SSL/TLS:**
- **Full (strict)**
- **Purge Everything**
- **Development Mode ON** (3 часа)
- **Always Online OFF**

## **✅ КОГДА СЧИТАТЬ МИГРАЦИЮ ЗАКРЫТОЙ:**

### **4 команды для проверки:**

```bash
# 1) NS реально Cloudflare (не Vercel/регистратор)
dig NS lifeundo.ru +short
# => два имени вида *.ns.cloudflare.com

# 2) A-запись не вернёт 76.76.21.21
dig +short lifeundo.ru A
# => <BEGET_IP>

# 3) Заголовки без Vercel
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
# => server: cloudflare, cf-cache-status: DYNAMIC|MISS, НЕТ x-vercel-*

# 4) Версия совпадает
curl -s https://lifeundo.ru/status | grep -i "App version"
curl -s https://getlifeundo.com/status | grep -i "App version"
# => App version: 0.4.1 на обоих
```

### **После этого:**

#### **1. Снять Vercel-редирект:**
- Удалить домены из проекта на Vercel
- Сам проект оставить для превью

#### **2. Смоук API:**
```bash
API="<RAW_API_KEY>"
curl -s -X POST https://lifeundo.ru/api/v1/licenses/validate \
  -H "Authorization: Bearer $API" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
curl -s https://lifeundo.ru/api/v1/usage -H "Authorization: Bearer $API"
```

## **🚨 МАЛЕНЬКИЕ АНТИ-ЗАЛИПЫ:**

### **1. Всё ещё видишь `X-Vercel-*`:**
- **NS** не Cloudflare **или** в Cloudflare ещё стоят старые записи
- Правим, **Proxy ON**, Purge, Dev Mode ON
- Добавить `?cb=<timestamp>` к URL

### **2. SSL ошибка:**
- На Beget выпусти LE-сертификаты для `.ru` и `.com`

### **3. Старый контент:**
- На Beget не должно быть `index.html` в корне
- `rm -rf .next && npm run build && npm start`

## **🎯 ФИНАЛЬНАЯ ПРОВЕРКА:**

### **Две ключевые команды:**
```bash
dig NS lifeundo.ru +short
dig +short lifeundo.ru A
```

### **Ожидаемый результат:**
- **NS**: два имени вида `*.ns.cloudflare.com`
- **A**: `<BEGET_IP>` (НЕ 76.76.21.21)

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] NS записи = Cloudflare
- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Оба домена показывают 0.4.1
- [ ] API работают
- [ ] Vercel-редирект снят

## **🎉 ГОТОВО К ПРОДАКШЕНУ:**

После прохождения всех проверок:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью

**GetLifeUndo 0.4.1 идеально готов! 🚀**

