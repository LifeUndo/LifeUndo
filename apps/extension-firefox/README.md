# GetLifeUndo Firefox Extension

Расширение для Firefox, которое добавляет функцию "отмены" действий в браузере.

## Возможности

- **Отмена закрытия вкладок** — восстановление случайно закрытых вкладок
- **Отмена изменений в формах** — восстановление введённого текста
- **Отмена навигации** — возврат к предыдущим страницам
- **Горячие клавиши** — Ctrl+Z для отмены, Ctrl+Shift+Z для повторения

## Установка

### Для разработки

1. Установите web-ext:
```bash
npm i -g web-ext
```

2. Соберите расширение:
```bash
web-ext build -s apps/extension-firefox --overwrite-dest
```

3. Загрузите в Firefox:
   - Откройте `about:debugging`
   - Нажмите "Загрузить временное дополнение"
   - Выберите файл `manifest.json`

### Для публикации в AMO

1. Подготовьте API ключи в кабинете AMO
2. Подпишите расширение:
```bash
web-ext sign --api-key=<AMO_KEY> --api-secret=<AMO_SECRET> -s apps/extension-firefox
```

## Структура проекта

```
apps/extension-firefox/
├── manifest.json          # Манифест расширения
├── icons/                 # Иконки расширения
│   ├── 16.png
│   ├── 32.png
│   ├── 48.png
│   ├── 96.png
│   ├── 128.png
│   └── 256.png
└── src/
    ├── background.js      # Service Worker
    ├── content.js        # Content Script
    └── ui/               # Popup интерфейс
        ├── popup.html
        ├── popup.css
        └── popup.js
```

## Разработка

### Тестирование

```bash
# Линтинг
web-ext lint -s apps/extension-firefox

# Запуск в Firefox
web-ext run -s apps/extension-firefox

# Сборка
web-ext build -s apps/extension-firefox
```

### Отладка

- **Background Script**: Откройте `about:debugging` → "Исследовать"
- **Content Script**: Откройте DevTools на любой странице
- **Popup**: Правый клик на иконке → "Исследовать"

## API

### Background Script

- `chrome.runtime.onInstalled` — обработка установки
- `chrome.runtime.onMessage` — обработка сообщений
- `chrome.tabs.onRemoved` — отслеживание закрытия вкладок

### Content Script

- `setupFormTracking()` — отслеживание изменений в формах
- `setupUndoShortcuts()` — настройка горячих клавиш
- `handleUndoAction()` — обработка отмены
- `handleRedoAction()` — обработка повторения

### Storage

- `state_*` — сохранённые состояния форм
- `tab_*` — информация о закрытых вкладках
- `action_*` — история действий

## Безопасность

- Не сохраняем пароли и чувствительные данные
- Минимальные права доступа
- Локальное хранение данных
- Прозрачная политика приватности

## Поддержка

- **Веб-сайт**: https://getlifeundo.com/ru/support
- **Email**: support@getlifeundo.com
- **Telegram**: https://t.me/LifeUndoSupport

## Лицензия

Copyright © 2024 GetLifeUndo. Все права защищены.
