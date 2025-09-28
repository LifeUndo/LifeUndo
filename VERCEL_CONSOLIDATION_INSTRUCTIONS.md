# 🚀 ПОЛНЫЕ ИНСТРУКЦИИ: Консолидация доменов на getlifeundo.com

## Цель
Консолидировать все домены на `getlifeundo.com` с 301 редиректами с `.ru` доменов.

## ✅ ЧТО УЖЕ ГОТОВО В КОДЕ

### 1. Хост-редиректы настроены
- `lifeundo.ru` → `https://getlifeundo.com/ru/*`
- `www.lifeundo.ru` → `https://getlifeundo.com/ru/*`
- `getlifeundo.ru` → `https://getlifeundo.com/ru/*`
- `www.getlifeundo.ru` → `https://getlifeundo.com/ru/*`

### 2. SEO обновлено
- `robots.ts` и `sitemap.ts` используют `getlifeundo.com`
- Добавлены canonical URLs и hreflang
- OpenGraph обновлен на `getlifeundo.com`

### 3. Security headers обновлены
- CSP настроен под `getlifeundo.com`
- Временно оставлены `.ru` домены для миграции

### 4. Брендинг обновлен
- Соцсети переключены на @GetLifeUndo
- Все ссылки используют ENV переменные

## 🎯 ДЕЙСТВИЯ В VERCEL DASHBOARD

### ШАГ 1: Найти основной проект
1. **Vercel Dashboard → Projects**
2. **Найти проект `getlifeundo`** (основной проект)
3. Если его нет - создать новый проект с этим именем

### ШАГ 2: Настроить домены
1. **Projects → getlifeundo → Settings → Domains**
2. **Add Domain** → `getlifeundo.com` (Primary)
3. **Add Domain** → `www.getlifeundo.com` → **Redirect to getlifeundo.com (308)**
4. **Add Domain** → `lifeundo.ru` → **Redirect to getlifeundo.com**
5. **Add Domain** → `www.lifeundo.ru` → **Redirect to getlifeundo.com**
6. **Add Domain** → `getlifeundo.ru` → **Redirect to getlifeundo.com**
7. **Add Domain** → `www.getlifeundo.ru` → **Redirect to getlifeundo.com**

### ШАГ 3: Настроить Redirects (дополнительно)
1. **Settings → Redirects**
2. **Add Redirect**:
   ```
   Source: https://lifeundo.ru/(.*)
   Destination: https://getlifeundo.com/ru/$1
   Type: 301
   ```
3. **Add Redirect**:
   ```
   Source: https://www.lifeundo.ru/(.*)
   Destination: https://getlifeundo.com/ru/$1
   Type: 301
   ```
4. **Add Redirect**:
   ```
   Source: https://getlifeundo.ru/(.*)
   Destination: https://getlifeundo.com/ru/$1
   Type: 301
   ```
5. **Add Redirect**:
   ```
   Source: https://www.getlifeundo.ru/(.*)
   Destination: https://getlifeundo.com/ru/$1
   Type: 301
   ```

### ШАГ 4: Environment Variables
1. **Settings → Environment Variables (Production)**
2. **Добавить переменные**:
   ```
   NEXT_PUBLIC_SITE_URL=https://getlifeundo.com
   NEWSITE_MODE=true
   NEXT_PUBLIC_TG_URL=https://t.me/GetLifeUndo
   NEXT_PUBLIC_X_URL=https://x.com/GetLifeUndo
   NEXT_PUBLIC_YT_URL=https://youtube.com/@GetLifeUndo
   NEXT_PUBLIC_GH_URL=https://github.com/LifeUndo
   ```

### ШАГ 5: Подключить репозиторий
1. **Settings → Git**
2. **Connect Git Repository** → выбрать `LifeUndo/LifeUndo`
3. **Production Branch** → `main`
4. **Root Directory** → `/` (если нужно)

### ШАГ 6: Деплой
1. **Deployments**
2. **Deploy** → выбрать последний коммит
3. Или **Redeploy** если проект уже подключен

## 🔧 DNS НАСТРОЙКИ

### Для .ru доменов
1. **У регистратора** настроить DNS:
   - **A-запись** `@` → IP Vercel (из Domains → Valid Configuration)
   - **CNAME** `www` → `cname.vercel-dns.com`

### Для .com домена
1. **У регистратора** настроить DNS:
   - **A-запись** `@` → IP Vercel
   - **CNAME** `www` → `cname.vercel-dns.com`

## 📋 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

### Основные URL:
- ✅ `https://getlifeundo.com/` → 308 на `/ru`
- ✅ `https://getlifeundo.com/ru` → 200 OK (главная страница)
- ✅ `https://getlifeundo.com/ru/pricing` → 200 OK (тарифы)
- ✅ `https://getlifeundo.com/ru/support` → 200 OK (поддержка)

### Редиректы с .ru:
- ✅ `https://lifeundo.ru/` → 301 на `https://getlifeundo.com/ru`
- ✅ `https://lifeundo.ru/pricing` → 301 на `https://getlifeundo.com/ru/pricing`
- ✅ `https://getlifeundo.ru/` → 301 на `https://getlifeundo.com/ru`

### Технические URL:
- ✅ `https://getlifeundo.com/ok` → 200 OK с правильными заголовками
- ✅ `https://getlifeundo.com/robots.txt` → 200 OK с доменом `getlifeundo.com`
- ✅ `https://getlifeundo.com/sitemap.xml` → 200 OK с ссылками на `getlifeundo.com`

## 📸 ЧТО ПРИСЛАТЬ КАК ПРУФЫ

1. **Скриншот Domains** в проекте `getlifeundo`:
   - `getlifeundo.com` = Primary Domain
   - `www.getlifeundo.com` = Redirect to apex
   - Все `.ru` домены = Redirect to getlifeundo.com
   - Статус "Valid Configuration" для всех

2. **Скриншот Environment Variables** (Production)

3. **Скриншот Production Deployment** (успешный)

4. **Скрины страниц:**
   - `https://getlifeundo.com/ru` (desktop и mobile)
   - `https://getlifeundo.com/ru/pricing`
   - `https://getlifeundo.com/ok` с заголовками в DevTools

5. **Тест редиректов:**
   - `https://lifeundo.ru/` → должен показать 301 в DevTools
   - `https://lifeundo.ru/pricing` → должен показать 301 в DevTools

6. **Фрагмент Vercel build log** с роутами

## ⚠️ ЕСЛИ ЧТО-ТО ПОЙДЕТ НЕ ТАК

1. **Прислать 20-30 строк Logs** из проблемного деплоя
2. **Проверить DNS** - все домены должны указывать на Vercel
3. **Проверить Redirects** - правила должны быть активны
4. **В крайнем случае** - Rollback на предыдущий деплой

## 🎯 ИТОГОВЫЙ СТАТУС

**✅ КОД ГОТОВ НА 100%**
**⚠️ ТРЕБУЕТСЯ НАСТРОЙКА ДОМЕНОВ В VERCEL**

После выполнения всех шагов все домены будут консолидированы на `getlifeundo.com`!
