# GetLifeUndo

**Ctrl+Z для вашей онлайн-жизни**

GetLifeUndo — это браузерное расширение, которое восстанавливает случайно удаленные данные: текст форм, закрытые вкладки и историю буфера обмена. Все данные хранятся локально в браузере для максимальной приватности.

## 🚀 Возможности

- **Восстановление текста форм** — после перезагрузки страницы
- **История закрытых вкладок** — быстрое восстановление
- **Локальная история буфера** — без отправки на серверы
- **100% приватность** — все данные остаются в браузере

## 📦 Установка

### Firefox (AMO)
[![Firefox Add-on](https://img.shields.io/badge/Firefox-Add--on-orange?logo=firefox&logoColor=white)](https://addons.mozilla.org/firefox/addon/lifeundo/)

### Chrome/Edge
Скоро будет доступно в Chrome Web Store и Microsoft Edge Add-ons.

### Desktop приложения
- **Windows**: [Скачать .exe](https://cdn.getlifeundo.com/app/latest/undo-setup-latest.exe)
- **macOS**: [Скачать .dmg](https://cdn.getlifeundo.com/app/latest/undo-latest.dmg)

## 🛠️ Разработка

### Требования
- Node.js 18+
- npm или yarn

### Установка
```bash
git clone https://github.com/GetLifeUndo/LifeUndo.git
cd LifeUndo
npm install
```

### Запуск сайта
```bash
npm run dev
```

### Сборка расширения
```bash
cd extension_firefox
npx web-ext build -s . -o
```

## 📋 Требования

- **Firefox**: 109.0+
- **Chrome**: 88+ (планируется)
- **Edge**: 88+ (планируется)

## 🔒 Приватность

- Все данные хранятся локально в браузере
- Нет телеметрии или отслеживания
- Данные не передаются на внешние серверы
- Подробнее: [Политика конфиденциальности](https://getlifeundo.com/ru/privacy)

## 📞 Поддержка

- **Email**: support@getlifeundo.com
- **Telegram**: [@GetLifeUndoSupport](https://t.me/GetLifeUndoSupport)
- **Сайт**: [getlifeundo.com](https://getlifeundo.com)

## 📄 Лицензия

Copyright © 2024 GetLifeUndo. Все права защищены.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! См. [CONTRIBUTING.md](CONTRIBUTING.md) для подробностей.

## 🔧 API

Для разработчиков доступно API для интеграции:
- [Документация API](https://getlifeundo.com/ru/developers)
- [OpenAPI спецификация](https://getlifeundo.com/openapi.yaml)

## 🏢 White-label / OEM

Интересуетесь корпоративными решениями? См. [Партнерскую программу](https://getlifeundo.com/ru/partners).

---

**Версия**: 0.3.7.13  
**Последнее обновление**: 5 октября 2025