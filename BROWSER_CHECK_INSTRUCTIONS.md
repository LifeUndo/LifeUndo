# 📋 Инструкции для проверки деплоя в браузере

## 🎯 Что нужно проверить

### 1. Preview проверки (если есть Preview деплой)

Откройте последний **Preview** ветки `fix/middleware-ru-404` в браузере:

- `https://<preview-domain>/ping` → должен показать текст **pong**
- `https://<preview-domain>/api/healthz` → должен показать **ok**
- `https://<preview-domain>/ru` → должна открыться главная страница (SberDevices-стиль)
- `https://<preview-domain>/ru/pricing` → должны открыться тарифы

**Если Preview работает корректно:**
- В карточке Preview нажмите **… → Promote to Production**
- Дождитесь завершения Production деплоя

### 2. Production проверки на `https://lifeundo.ru`

После завершения Production деплоя проверьте в браузере:

- `https://lifeundo.ru/` → должен редиректить на `/ru`
- `https://lifeundo.ru/ru` → должна открыться главная страница (200 OK)
- `https://lifeundo.ru/ru/pricing` → должны открыться тарифы (200 OK)
- `https://lifeundo.ru/ok` → должен показать "OK" (200 OK)

### 3. Проверка заголовков для `/ok`

1. Откройте `https://lifeundo.ru/ok` в браузере
2. Откройте **DevTools** (F12)
3. Перейдите на вкладку **Network**
4. Обновите страницу (F5)
5. Найдите запрос к `/ok` в списке
6. Кликните на него и проверьте заголовки:
   - `Cache-Control: no-store, no-cache, must-revalidate`
   - `Pragma: no-cache`

## 📸 Скриншоты для пруфов

Сделайте скриншоты:

### Preview (если есть):
1. `/ping` - должен показать "pong"
2. `/api/healthz` - должен показать "ok"
3. `/ru` - главная страница
4. `/ru/pricing` - страница тарифов

### Production:
1. `/ru` - главная страница (desktop)
2. `/ru` - главная страница (mobile) - используйте DevTools → Device Toolbar
3. `/ru/pricing` - страница тарифов
4. Панель заголовков у `/ok` в DevTools → Network

## 🔍 Дополнительные проверки в Vercel

### Build Log:
1. Vercel Dashboard → Projects → life-undo → Deployments
2. Найдите последний Production деплой
3. Откройте Build Log
4. Скопируйте фрагмент со списком роутов (строки вида `ƒ /[locale]`, `○ /ping`, `○ /api/healthz`)

### Domains:
1. Vercel Dashboard → Projects → life-undo → Settings → Domains
2. Сделайте скриншот с подтверждением:
   - `lifeundo.ru` = Valid Configuration
   - `www.lifeundo.ru` = Valid Configuration
   - www→apex 308 включен

## 🚨 Если что-то не работает

### Если Preview не работает:
1. Откройте карточку Preview деплоя
2. Перейдите на вкладку **Logs**
3. Скопируйте 20-30 строк логов
4. Приложите к отчету

### Если Production не работает:
1. Проверьте Build Log на ошибки
2. Если нужно - сделайте **Rollback** на предыдущий рабочий деплой
3. Приложите ID предыдущего деплоя

## ✅ Критерии успеха

- ✅ Все страницы открываются без белых экранов
- ✅ Редирект `/` → `/ru` работает
- ✅ Тестовые роуты `/ping` и `/api/healthz` отвечают
- ✅ `/ok` возвращает правильные Cache-Control заголовки
- ✅ Нет ошибок в консоли браузера
- ✅ Страницы адаптивны на мобильных устройствах

---

**После успешной проверки можно закрывать релиз!** 🎉
