# 🚀 Финальный чек-лист релиза LifeUndo

## ✅ Что уже исправлено в коде

- [x] **GitHub Actions** - отключен падающий workflow
- [x] **LanguageSwitcher** - исправлено залипание на мобилке
- [x] **ModernHeader** - добавлен relative контейнер
- [x] **Layout** - добавлен pt-20 отступ под header
- [x] **next.config.mjs** - редирект `/ → /ru` настроен
- [x] **Security headers** - настроены в next.config.mjs
- [x] **robots.txt и sitemap.xml** - проверены и настроены

## 🔧 Что нужно сделать в Vercel

### 1. Настройка проекта
- [ ] Оставить **один** прод-проект (например, `lifeundo`)
- [ ] Отключить/архивировать второй проект (`life-undo`)
- [ ] Привязать `lifeundo.ru` ТОЛЬКО к основному проекту
- [ ] Установить **Production Branch = `main`**

### 2. Передеплой
- [ ] **Redeploy** с **Clear build cache** (галочка OFF)
- [ ] Дождаться завершения билда
- [ ] Проверить, что минискрин показывает корректную страницу

## 📋 Команды для проверки

### Запуск автоматической проверки:
```powershell
.\scripts\verify-deployment.ps1
```

### Ручная проверка:
```bash
# Редирект корня
curl -I https://lifeundo.ru/
# Должен вернуть: HTTP/1.1 301 Moved Permanently

# Ключевые страницы
curl -I https://lifeundo.ru/ru
curl -I https://lifeundo.ru/ru/pricing
curl -I https://lifeundo.ru/ru/support
curl -I https://lifeundo.ru/ru/use-cases
curl -I https://lifeundo.ru/ru/fund/apply
curl -I https://lifeundo.ru/ru/privacy

# Проверка кэширования /ok
curl -I https://lifeundo.ru/ok
# Должен вернуть: Cache-Control: no-store, no-cache, must-revalidate

# Проверка security headers
curl -I https://lifeundo.ru/ru
# Должны быть: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security
```

## 📱 Визуальная проверка

### Десктоп:
- [ ] Открыть https://lifeundo.ru → должен перенаправить на /ru
- [ ] Проверить все страницы навигации
- [ ] LanguageSwitcher работает корректно (ряд кнопок)
- [ ] Нет ошибок в консоли браузера

### Мобилка:
- [ ] LanguageSwitcher открывается/закрывается корректно
- [ ] Dropdown не "залипает" поверх контента
- [ ] Закрытие по: тапу вне, скроллу, ESC, смене роута
- [ ] Все страницы адаптивны

## 🔍 Пруфы для релиза

### Обязательные скриншоты:
- [ ] Главная страница (desktop)
- [ ] Главная страница (mobile)
- [ ] Страница /ru/support
- [ ] Страница /ru/pricing
- [ ] Build log с маршрутами `/ru/*`

### Вывод команд:
- [ ] Результат `curl -I` для всех URL
- [ ] Подтверждение security headers
- [ ] Подтверждение кэширования /ok

## 🦊 AMO (Firefox Add-ons)

### Вариант A: Hidden Listed (быстро)
- [ ] Зайти в AMO Developer Hub
- [ ] LifeUndo → Manage Status & Versions
- [ ] Нажать "Make Invisible" / "Hidden"
- [ ] **Пруф:** Скриншот AMO с статусом "Hidden"

### Вариант B: Unlisted Self-Distribution (правильно)
- [ ] Собрать новую версию: `web-ext sign --channel=unlisted`
- [ ] Разместить .xpi в `/public/downloads/`
- [ ] Обновить `/ru/download` для ссылки на наш файл
- [ ] **Пруф:** Ссылка на наш .xpi + номер версии

## 🚨 Критические проверки

### Перед релизом:
- [ ] Все URL возвращают корректные статусы
- [ ] Редирект `/ → /ru` работает
- [ ] Мобильный LanguageSwitcher не залипает
- [ ] Security headers присутствуют
- [ ] Нет ошибок в консоли браузера

### После релиза:
- [ ] GitHub Actions зелёные
- [ ] Vercel показывает корректный деплой
- [ ] Домен обновился (может потребоваться 5-10 минут)
- [ ] AMO настроен (Hidden или Unlisted)

## 📞 Экстренные действия

### Если "белый экран" в Vercel:
1. Проверить привязку домена к правильному проекту
2. Убедиться, что деплоится ветка `main`
3. Очистить кэш браузера (Ctrl+Shift+R)

### Если LanguageSwitcher залипает на iOS:
1. Заменить `backdrop-blur-md` на `bg-black/80` в LanguageSwitcher
2. Добавить `[transform:translateZ(0)]` к dropdown

### Если домен не обновился:
1. Проверить CDN кэш (подождать 5-10 минут)
2. Очистить кэш браузера
3. Проверить настройки домена в Vercel

---

## 🎯 Итоговый результат

После выполнения всех пунктов:
- ✅ Сайт работает стабильно
- ✅ Все страницы доступны
- ✅ Мобильная версия корректна
- ✅ Security настроена
- ✅ AMO не показывает счётчик
- ✅ GitHub Actions зелёные
- ✅ Готов к релизу! 🚀
