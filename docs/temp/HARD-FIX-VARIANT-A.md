# 🚨 Жёсткая починка - Вариант A (оба домена → Cloudflare → Beget)

## **📋 ПЛАН ПОЧИНКИ:**

### **Шаг 0 — временная затычка на Vercel (чтобы сразу убрать «VIP»):**

#### **1. Создать `vercel.json` в корне проекта на Vercel:**
```json
{
  "redirects": [
    { "source": "/(.*)", "destination": "https://getlifeundo.com/$1", "permanent": true }
  ]
}
```

#### **2. Задеплой и проверить:**
```bash
curl -I https://lifeundo.ru/anything?x=1
# Должен быть 301 → https://getlifeundo.com/anything?x=1
```

**Результат:** Старая "VIP" страница сразу исчезнет, пока делаем основную миграцию.

### **Шаг 1 — у регистратора: NS = Cloudflare (критично!):**

#### **1. Проверить NS записи у регистратора:**
```bash
dig NS lifeundo.ru +short
```

#### **2. Если НЕ Cloudflare NS:**
- Зайти в панель регистратора
- Изменить NS на те, что показаны в Cloudflare
- Домен станет "Active" в Cloudflare

#### **3. Проверка после обновления:**
```bash
dig NS lifeundo.ru +short
# Должны вернуться два Cloudflare NS, не Vercel/GitHub/регистратор
```

### **Шаг 2 — Cloudflare DNS: в точности под Beget:**

#### **1. Удалить старьё:**
- `A @` → `76.76.21.21` (Vercel) — удалить
- Любые `CNAME` на `*.vercel.app` — удалить
- `CNAME www` → `lifeundo.github.io` — удалить

#### **2. Создать новые (Proxy = ON/оранжевая тучка):**

**lifeundo.ru:**
```
A     @      <BEGET_IP>       TTL Auto   Proxied
CNAME www    lifeundo.ru      TTL Auto   Proxied
```

**getlifeundo.com:**
```
A     @      <BEGET_IP>       TTL Auto   Proxied
CNAME www    getlifeundo.com  TTL Auto   Proxied
```

#### **3. SSL/TLS:**
- **Encryption mode**: **Full (strict)**
- На Beget должны быть валидные сертификаты для обоих доменов

#### **4. Кэш:**
- **Purge Everything**
- **Development Mode**: ON (3 часа)
- **Always Online**: OFF

### **Шаг 3 — Vercel: проект оставляем, домены снимаем:**

#### **1. В настройках проекта Vercel убрать кастомные домены:**
- `lifeundo.ru`
- `www.lifeundo.ru`
- (при необходимости) `getlifeundo.com` и `www`

#### **2. Проект остаётся для превью/веток (`*.vercel.app`)**

### **Шаг 4 — финальные проверки (по новой цепочке):**

#### **1. DNS должен указывать на Beget:**
```bash
dig +short lifeundo.ru A
dig +short www.lifeundo.ru CNAME
```

#### **2. Заголовки через Cloudflare, без Vercel:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip;/^location:/Ip'
```
**Ожидаем:** `server: cloudflare`, `cf-cache-status: DYNAMIC|MISS`, **НЕТ** `x-vercel-*`

#### **3. /status = 0.4.1 на обоих доменах:**
```bash
curl -s https://lifeundo.ru/status | grep -i "App version"
curl -s https://getlifeundo.com/status | grep -i "App version"
```

#### **4. Админ закрыт:**
```bash
curl -I https://lifeundo.ru/admin
```
**Ожидаем:** `401` + `WWW-Authenticate: Basic realm="getlifeundo"`

### **Шаг 5 — API смоук:**

```bash
API="<RAW_API_KEY>"

# Legacy (совместимость)
curl -s -X POST https://lifeundo.ru/api/license/validate \
  -H "Authorization: Bearer $API" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'

# Новые v1 + рост usage
for i in 1 2 3; do
  curl -s -X POST https://lifeundo.ru/api/v1/licenses/validate \
    -H "Authorization: Bearer $API" -H "Content-Type: application/json" \
    -d '{"key":"LIFE-TEST-0000-0000"}' >/dev/null
done
curl -s https://lifeundo.ru/api/v1/usage -H "Authorization: Bearer $API"
```

## **🚨 Частые залипы и как снять:**

### **1. Всё ещё Vercel в заголовках:**
- NS не Cloudflare **или** в Cloudflare записи ещё смотрят на Vercel/GitHub
- Исправь записи, включи Proxy (оранжевая тучка), Purge, Dev Mode ON

### **2. SSL ошибка:**
- На Beget не выпущен сертификат для домена
- Выпусти LE для `.ru/.com`, держим в CF «Full (strict)»

### **3. Старая статика/NotFound:**
- На Beget мог лежать `index.html` рядом с приложением
- Убери, пересобери Next:
```bash
rm -rf .next && npm run build && npm start
```

## **🎯 ИТОГ:**

- **NS → Cloudflare**, **DNS → Beget**, **Proxy ON** — и прод пойдёт ровно по Варианту A
- До обновления NS/DNS **редирект на Vercel** быстро прячет «VIP»-страницу
- Пользователи видят корректный `.com` пока идёт миграция

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] NS записи = Cloudflare
- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] Оба домена показывают 0.4.1
- [ ] Все API работают
- [ ] Admin защищен
- [ ] FreeKassa webhook работает

## **🚀 ГОТОВО К ПРОДАКШЕНУ:**

После прохождения всех шагов:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью

**GetLifeUndo 0.4.1 идеально готов! 🚀**


