# Инструкции по настройке Vercel для исправления проблем

## Проблемы, которые были исправлены в коде:

✅ **GitHub Actions** - отключен падающий workflow `update-payment-form.yml`
✅ **LanguageSwitcher** - исправлено залипание dropdown на мобилке
✅ **ModernHeader** - добавлен `relative` контейнер для правильного позиционирования
✅ **Layout** - добавлен `pt-20` для отступа под фиксированную шапку
✅ **next.config.mjs** - редирект `/ → /ru` уже настроен

## Что нужно сделать в Vercel:

### 1. Настройка проекта

1. **Зайти в Vercel Dashboard** → Projects
2. **Выбрать ОДИН проект** как основной (например, `lifeundo`)
3. **Удалить или отключить второй проект** (если есть `life-undo`)
4. **Настроить домен**:
   - Settings → Domains
   - Убедиться, что `lifeundo.ru` привязан ТОЛЬКО к основному проекту
   - Удалить привязку к другим проектам

### 2. Настройки деплоя

1. **Settings → Git**:
   - Production Branch: `main`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Environment Variables** (если нужны):
   - Проверить, что все переменные окружения настроены в основном проекте

### 3. Передеплой

1. **Redeploy** с очисткой кэша:
   - Зайти в последний деплой
   - Нажать "Redeploy" 
   - ✅ Поставить галочку "Use existing Build Cache" = OFF
   - Запустить

### 4. Проверка результата

После деплоя проверить:

```bash
# Проверка редиректа корня
curl -I https://lifeundo.ru/
# Должен вернуть: HTTP/1.1 301 Moved Permanently
# Location: /ru

# Проверка главной страницы
curl -I https://lifeundo.ru/ru
# Должен вернуть: HTTP/1.1 200 OK

# Проверка других страниц
curl -I https://lifeundo.ru/ru/pricing
curl -I https://lifeundo.ru/ru/support
curl -I https://lifeundo.ru/ru/use-cases
curl -I https://lifeundo.ru/ru/fund/apply

# Проверка кэширования /ok
curl -I https://lifeundo.ru/ok
# Должен вернуть: Cache-Control: no-store, no-cache, must-revalidate
```

### 5. Визуальная проверка

1. **Открыть https://lifeundo.ru** - должен автоматически перенаправить на `/ru`
2. **Проверить мобильную версию**:
   - Открыть DevTools → Device Toolbar
   - Выбрать iPhone/Android
   - Нажать на языковой переключатель
   - ✅ Dropdown должен открываться и закрываться корректно
   - ✅ Ничего не должно "залипать" поверх контента

3. **Проверить десктопную версию**:
   - Языковые кнопки должны работать как раньше
   - Навигация должна работать корректно

## Если проблемы остаются:

### Проблема: "Белый экран" в превью Vercel
- **Причина**: Минискрин показывает `/` (корень), а редирект не сработал
- **Решение**: Проверить, что деплоится правильная ветка с `next.config.mjs`

### Проблема: Домен показывает старую версию
- **Причина**: Кэш CDN или неправильная привязка домена
- **Решение**: 
  1. Проверить привязку домена к правильному проекту
  2. Очистить кэш браузера (Ctrl+Shift+R)
  3. Подождать 5-10 минут для обновления CDN

### Проблема: LanguageSwitcher все еще "залипает"
- **Причина**: iOS Safari баги с `backdrop-filter`
- **Решение**: В `LanguageSwitcher.tsx` заменить `backdrop-blur-md` на обычный фон:
  ```tsx
  className="md:hidden absolute right-0 top-9 z-[60] min-w-[8rem]
             bg-black/80 border border-white/10 rounded-xl p-1
             shadow-lg"
  ```

## Результат

После выполнения всех шагов:
- ✅ GitHub Actions больше не падают
- ✅ Мобильный LanguageSwitcher работает корректно
- ✅ Домен показывает новую главную страницу
- ✅ Редирект `/ → /ru` работает
- ✅ Все страницы доступны и работают
