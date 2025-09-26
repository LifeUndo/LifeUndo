# 🚨 СРОЧНЫЙ ФИКС: lifeundo.ru

## ❌ **ПРОБЛЕМА ОБНАРУЖЕНА**

Домен `lifeundo.ru` до сих пор привязан к **Vercel**, а не к Beget Node.js приложению!

**Доказательства:**
- `X-Vercel-Cache: HIT` в заголовках
- `Age: 27413` - кэш Vercel
- Старая страница с "VIP лицензия" из Vercel

## 🚀 **СРОЧНЫЕ ДЕЙСТВИЯ (СЕЙЧАС)**

### **1. Cloudflare - ВРЕМЕННЫЙ РЕДИРЕКТ**
1. Зайти в Cloudflare → **Rules** → **Redirect Rules**
2. Создать правило:
   - **Name**: `Emergency Redirect lifeundo.ru`
   - **Expression**: `http.host eq "lifeundo.ru"`
   - **Action**: **Redirect**
   - **Status**: `301`
   - **URL**: `https://getlifeundo.com/$1`
   - **Preserve query string**: ✅
3. **Save** - это мгновенно перенаправит .ru на .com

### **2. Beget - ПРИВЯЗКА ДОМЕНА**
1. Зайти в Beget → **Домены**
2. Найти `lifeundo.ru`
3. **Привязать к Node.js приложению** (тому же, что обслуживает getlifeundo.com)
4. Убедиться, что нет статических файлов в корне

### **3. Vercel - ОТКЛЮЧИТЬ**
1. Зайти в Vercel → **Projects**
2. Найти проект с `lifeundo.ru`
3. **Remove domain** или **Pause deployment**
4. Это остановит кэширование старой версии

## ✅ **ПРОВЕРКА**

После выполнения:

```bash
# Должно показать редирект 301
curl -I https://lifeundo.ru/

# Должно показать новый контент
curl -I https://getlifeundo.com/
```

**Ожидаемый результат:**
- `lifeundo.ru` → редирект 301 на `getlifeundo.com`
- `getlifeundo.com` → новая страница без "VIP лицензия"

## 🔧 **ПОСЛЕ ФИКСА**

Когда домен правильно привязан к Beget:
1. **Убрать редирект** в Cloudflare
2. **Очистить кэш** Cloudflare
3. **Проверить** что оба домена работают одинаково

## 📱 **ПРИЛОЖЕНИЕ - БЫСТРАЯ ПРОВЕРКА**

Пока домен не исправлен, используй `getlifeundo.com`:

```bash
# Тест API
curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
```

**Ожидаемый ответ:**
```json
{"ok":true,"plan":"pro_m","expiresAt":"..."}
```

---

## 🎯 **ПРИОРИТЕТ**

1. **СРОЧНО**: Cloudflare редирект (1 минута)
2. **СРОЧНО**: Beget привязка домена (5 минут)
3. **СРОЧНО**: Vercel отключение (2 минуты)

**После этого lifeundo.ru будет работать корректно! 🚀**

