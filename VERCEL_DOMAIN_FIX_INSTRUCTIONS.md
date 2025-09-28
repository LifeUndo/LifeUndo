# 🚨 ПОШАГОВЫЕ ИНСТРУКЦИИ: Привязка домена lifeundo.ru в Vercel

## Текущая проблема
- `https://lifeundo.ru` возвращает 404 NOT_FOUND
- Домен не привязан к правильному проекту в Vercel
- Последний деплой не получил прод-алиас

## ✅ РЕШЕНИЕ: Пошаговые действия в Vercel Dashboard

### ШАГ 1: Открыть Vercel Dashboard
1. Перейти на https://vercel.com/dashboard
2. Войти в аккаунт

### ШАГ 2: Найти правильный проект
1. В списке проектов найти **`life-undo`** (основной проект)
2. Если есть несколько проектов с похожими названиями - выбрать тот, который собирает текущий репозиторий

### ШАГ 3: Проверить привязку домена
1. **Projects → life-undo → Settings → Domains**
2. Проверить, есть ли в списке доменов:
   - `lifeundo.ru`
   - `www.lifeundo.ru`

### ШАГ 4: Если домен привязан к другому проекту
1. **Перейти в другой проект** (где сейчас привязан `lifeundo.ru`)
2. **Settings → Domains → Remove** домен `lifeundo.ru`
3. **Вернуться к проекту `life-undo`**

### ШАГ 5: Добавить домен в правильный проект
1. **Projects → life-undo → Settings → Domains**
2. **Add Domain** → ввести `lifeundo.ru`
3. **Add Domain** → ввести `www.lifeundo.ru`
4. Для `www.lifeundo.ru` включить **Redirect to apex (308)**
5. Дождаться статуса **Valid Configuration** для обоих доменов

### ШАГ 6: Настроить Environment Variables
1. **Projects → life-undo → Settings → Environment Variables**
2. **Production Environment** → добавить переменные:

```
NEWSITE_MODE=true
NEXT_PUBLIC_SITE_URL=https://lifeundo.ru
NEXT_PUBLIC_TG_URL=https://t.me/lifeundo_support
NEXT_PUBLIC_X_URL=https://x.com/lifeundo
NEXT_PUBLIC_YT_URL=https://youtube.com/@lifeundo
NEXT_PUBLIC_GH_URL=https://github.com/LifeUndo
```

### ШАГ 7: Прод-деплой
1. **Projects → life-undo → Deployments**
2. Найти последний **зеленый Preview** (ветка `main`)
3. **… → Promote to Production**
4. Если кнопки нет - **Redeploy** последнего Production

## ✅ ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

После выполнения всех шагов:

- `https://lifeundo.ru/` → 308 редирект на `/ru`
- `https://lifeundo.ru/ru` → 200 OK (главная страница)
- `https://lifeundo.ru/ru/pricing` → 200 OK (тарифы)
- `https://lifeundo.ru/ok` → 200 OK с правильными заголовками
- `https://lifeundo.ru/robots.txt` → 200 OK с доменом `lifeundo.ru`
- `https://lifeundo.ru/sitemap.xml` → 200 OK с ссылками на `lifeundo.ru`

## 📋 ЧТО ПРИСЛАТЬ КАК ПРУФЫ

1. **Скриншот Domains** в проекте `life-undo`:
   - `lifeundo.ru` = Primary Domain
   - `www.lifeundo.ru` = Redirect to apex
   - Статус "Valid Configuration"

2. **Скриншот Environment Variables** (Production)

3. **Скриншот Production Deployment** (успешный)

4. **Скрины страниц:**
   - `/ru` (desktop и mobile)
   - `/ru/pricing`
   - `/ok` с заголовками в DevTools

5. **Фрагмент Vercel build log** с роутами

## ⚠️ ЕСЛИ ЧТО-ТО ПОЙДЕТ НЕ ТАК

1. **Прислать 20-30 строк Logs** из проблемного деплоя
2. **Проверить middleware.ts** - должен редиректить только `/` → `/ru`
3. **Проверить next.config.mjs** - не должно быть `output: 'export'`
4. **В крайнем случае** - Rollback на последний рабочий деплой
