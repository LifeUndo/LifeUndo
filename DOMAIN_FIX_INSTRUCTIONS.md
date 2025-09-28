# 🚨 Инструкции по исправлению прод-алиаса lifeundo.ru

## Проблема
Домен `lifeundo.ru` возвращает 404 на всех страницах (`/ru`, `/ok`, `/ru/pricing`), что означает, что домен не привязан к правильному проекту или последний успешный деплой не получил прод-алиас.

## Решение

### 1. Привязка домена к правильному проекту

**В Vercel Dashboard:**

1. **Projects** → откройте **оба** проекта (например, `life-undo` и любой другой)
2. В каждом проекте → **Settings → Domains**:

   **В проекте `life-undo` (наш Next.js):**
   - Убедитесь, что `lifeundo.ru` и `www.lifeundo.ru` привязаны **только** к этому проекту
   - Установите **Primary Domain = `lifeundo.ru`**
   - Включите 308-редирект `www.lifeundo.ru` → `lifeundo.ru` (кнопка в настройках домена)
   - Дождитесь статуса **Valid Configuration**

   **В других проектах:**
   - Если домены привязаны к другому проекту → нажмите **Transfer / Move** и перенесите оба домена в `life-undo`
   - Удалите привязку доменов из неправильных проектов

### 2. Промоут успешного Preview в Production

1. **Projects → life-undo → Deployments**
2. Найдите последний **Preview** (ветка `fix/middleware-ru-404`) со статусом ✅
3. Откройте **… → Promote to Production**
4. Дождитесь завершения деплоя

   **Если Preview не зелёный:**
   - Не промоутьте
   - Скопируйте 20-30 строк из **Logs** и исправьте ошибки

### 3. Постдеплой проверки

После завершения Production деплоя проверьте в браузере:

- `https://lifeundo.ru/` → должен редиректить на `/ru` (308)
- `https://lifeundo.ru/ru` → должна открыться главная страница (200 OK)
- `https://lifeundo.ru/ru/pricing` → должны открыться тарифы (200 OK)
- `https://lifeundo.ru/ok` → должен показать "OK" (200 OK)

**Проверка заголовков для `/ok`:**
1. Откройте `https://lifeundo.ru/ok` в браузере
2. DevTools (F12) → Network
3. Обновите страницу (F5)
4. Найдите запрос к `/ok` и проверьте заголовки:
   - `Cache-Control: no-store, no-cache, must-revalidate`
   - `Pragma: no-cache`

## Технический контроль (пройден)

✅ **src/middleware.ts** - минимальный, редиректит только `/` → `/ru`
✅ **next.config.mjs** - без `output: 'export'`, редирект с `permanent: false`
✅ **Все файлы существуют**:
- `src/app/[locale]/page.tsx` ✅
- `src/app/[locale]/pricing/page.tsx` ✅
- `src/app/ok/route.ts` ✅
- `src/app/api/healthz/route.ts` ✅
- `src/app/ping/page.tsx` ✅

## Build Output (пруф)

```
Route (app)                              Size     First Load JS
├ ƒ /[locale]                            177 B          87.3 kB
├ ƒ /[locale]/pricing                    177 B          87.3 kB
├ ○ /ok                                  0 B                0 B
├ ○ /api/healthz                         0 B                0 B
└ ƒ Middleware                           26.4 kB
```

## Пруфы для релиза

После исправления предоставьте:

1. **Скрины Domains** проекта `life-undo`:
   - `lifeundo.ru` = Valid Configuration, Primary Domain
   - `www.lifeundo.ru` = Valid Configuration, 308 redirect на apex

2. **Скрин Production Deployment** (успешный)

3. **Скрины страниц**:
   - `/ru` (desktop)
   - `/ru` (mobile)
   - `/ru/pricing`
   - Панель заголовков у `/ok` в DevTools

4. **Фрагмент Vercel build log** со списком роутов

5. **Если были ошибки** - 20-30 строк Logs и что исправили

## Почему 404 сейчас?

Либо домены привязаны к другому проекту, либо последний удачный прод-деплой не получил прод-алиас. Промоут корректного Preview + привязка домена к нужному проекту решают это за пару минут.

---

**Готово к исправлению!** 🚀
