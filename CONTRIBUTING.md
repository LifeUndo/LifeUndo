# Руководство по участию в проекте

Спасибо за интерес к проекту GetLifeUndo! Мы приветствуем вклад от сообщества.

## 🚀 Как начать

1. **Fork** репозиторий
2. **Clone** ваш fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/LifeUndo.git
   cd LifeUndo
   ```
3. Создайте **feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 📝 Процесс разработки

### Требования
- Node.js 18+
- npm или yarn
- Git

### Настройка окружения
```bash
npm install
npm run dev  # Запуск сайта в режиме разработки
```

### Тестирование
```bash
npm run test
npm run lint
```

## 🐛 Сообщения об ошибках

Используйте [GitHub Issues](https://github.com/GetLifeUndo/LifeUndo/issues) для сообщений об ошибках.

### Шаблон для бага
```markdown
**Описание**
Краткое описание проблемы.

**Шаги для воспроизведения**
1. Перейти к '...'
2. Нажать на '...'
3. Прокрутить до '...'
4. Увидеть ошибку

**Ожидаемое поведение**
Что должно было произойти.

**Скриншоты**
Если применимо, добавьте скриншоты.

**Окружение:**
 - ОС: [e.g. Windows 11]
 - Браузер: [e.g. Firefox 119]
 - Версия расширения: [e.g. 0.3.7.13]
```

## ✨ Предложения функций

Мы открыты для предложений! Используйте [GitHub Issues](https://github.com/GetLifeUndo/LifeUndo/issues) с тегом `enhancement`.

### Шаблон для предложения
```markdown
**Описание функции**
Четкое и краткое описание желаемой функции.

**Проблема, которую это решает**
Какую проблему это решает?

**Предлагаемое решение**
Опишите, как вы хотите, чтобы это работало.

**Альтернативы**
Опишите любые альтернативные решения.

**Дополнительный контекст**
Добавьте любой другой контекст или скриншоты.
```

## 🔧 Разработка расширения

### Структура проекта
```
extension_firefox/
├── manifest.json          # Манифест расширения
├── popup.html             # Интерфейс попапа
├── popup.js               # Логика попапа
├── background.js          # Background script
├── contentScript.js       # Content script
├── _locales/              # Локализация
│   ├── en/messages.json
│   └── ru/messages.json
└── web-ext-artifacts/     # Собранные файлы
```

### Сборка
```bash
cd extension_firefox
npx web-ext build -s . -o
```

### Тестирование
```bash
npx web-ext lint -s .
npx web-ext run -s .
```

## 🌐 Локализация

Добавление новых языков:

1. Создайте папку `extension_firefox/_locales/[код_языка]/`
2. Скопируйте `messages.json` из `en/`
3. Переведите все значения `message`
4. Обновите `manifest.json` если нужно

## 📋 Стандарты кода

### JavaScript/TypeScript
- Используйте ESLint конфигурацию проекта
- Следуйте стандартам ES6+
- Добавляйте JSDoc комментарии для функций

### CSS
- Используйте Tailwind CSS классы
- Следуйте BEM методологии для кастомных стилей

### Коммиты
Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: добавить новую функцию
fix: исправить баг
docs: обновить документацию
style: форматирование кода
refactor: рефакторинг
test: добавить тесты
chore: обновить зависимости
```

## 🔒 Безопасность

Если вы обнаружили уязвимость безопасности, пожалуйста:

1. **НЕ** создавайте публичный issue
2. Отправьте email на: security@getlifeundo.com
3. Опишите уязвимость подробно

## 📄 Лицензия

Внося вклад в проект, вы соглашаетесь с тем, что ваш вклад будет лицензирован под той же лицензией, что и проект.

## 🎉 Признание

Все участники будут упомянуты в:
- README.md
- CHANGELOG.md
- Официальном сайте

## 📞 Контакты

- **Email**: support@getlifeundo.com
- **Telegram**: [@GetLifeUndoSupport](https://t.me/GetLifeUndoSupport)
- **GitHub Issues**: [Issues](https://github.com/GetLifeUndo/LifeUndo/issues)

---

Спасибо за ваш вклад! 🙏
