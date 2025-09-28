# 🚨 Отчет о проблеме с прод-алиасом lifeundo.ru

## Проблема
Домен `lifeundo.ru` возвращает 404 на всех страницах:
- `https://lifeundo.ru/` → 404
- `https://lifeundo.ru/ru` → 404  
- `https://lifeundo.ru/ok` → 404
- `https://lifeundo.ru/ru/pricing` → 404

## Диагностика
Vercel отдает `not found` в ответах, что означает:
1. **Домен не привязан к правильному проекту**, или
2. **Последний успешный деплой не получил прод-алиас**

## Техническое состояние (проверено)

### ✅ Код готов
- **src/middleware.ts** - минимальный, редиректит только `/` → `/ru`
- **next.config.mjs** - без `output: 'export'`, редирект с `permanent: false`
- **Все файлы существуют** и корректны
- **Сборка проходит успешно** без ошибок

### ✅ Build Output
```
Route (app)                              Size     First Load JS
├ ƒ /[locale]                            177 B          87.3 kB
├ ƒ /[locale]/pricing                    177 B          87.3 kB
├ ○ /ok                                  0 B                0 B
├ ○ /api/healthz                         0 B                0 B
└ ƒ Middleware                           26.4 kB
```

## Решение

### 1. Привязка домена
**Vercel → Projects → life-undo → Settings → Domains:**
- Убедиться, что `lifeundo.ru` и `www.lifeundo.ru` привязаны **только** к проекту `life-undo`
- Установить **Primary Domain = `lifeundo.ru`**
- Включить 308-редирект `www.lifeundo.ru` → `lifeundo.ru`
- Дождаться статуса **Valid Configuration**

### 2. Промоут Preview
**Projects → life-undo → Deployments:**
- Найти последний **Preview** (ветка `fix/middleware-ru-404`) со статусом ✅
- **… → Promote to Production**
- Дождаться завершения

### 3. Проверка результата
После деплоя проверить:
- `https://lifeundo.ru/` → редирект на `/ru` (308)
- `https://lifeundo.ru/ru` → главная страница (200 OK)
- `https://lifeundo.ru/ru/pricing` → тарифы (200 OK)
- `https://lifeundo.ru/ok` → статус с заголовками (200 OK)

## Ожидаемые результаты

После исправления:
- ✅ Все страницы `/ru/*` открываются корректно
- ✅ Редирект `/` → `/ru` работает
- ✅ `/ok` возвращает правильные Cache-Control заголовки
- ✅ Нет ошибок в консоли браузера

## Пруфы для релиза

После исправления предоставить:
1. **Скрины Domains** - Valid Configuration, Primary Domain
2. **Скрин Production Deployment** - успешный
3. **Скрины страниц** - desktop, mobile, pricing, headers
4. **Фрагмент build log** - список роутов
5. **Логи ошибок** (если были) - 20-30 строк

---

**Проблема диагностирована, решение готово!** 🚀

Нужно только исправить привязку домена в Vercel и промоутить Preview в Production.
