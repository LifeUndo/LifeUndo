# LifeUndo 0.3.7.25 - ОТЧЁТ О ГОТОВНОСТИ К AMO

## Статус: ✅ ГОТОВ К ТЕСТИРОВАНИЮ

### Реализованные функции:

#### ✅ UI/UX УЛУЧШЕНИЯ:
- **Версия в центре шапки**: v0.3.7.25 отображается по центру
- **Переключатель языков**: глобус справа с dropdown (EN/RU)
- **Персистентный язык**: выбор сохраняется в storage.local
- **Бейдж версии**: "Free Version" / "Бесплатная версия" под шапкой
- **Локализованные ссылки**: ведут на /ru/... или /en/...

#### ✅ TRIAL СИСТЕМА (7 дней):
- **День 0-5**: баннер не показывается
- **День 6**: серый баннер "скоро закончится"
- **День 7+**: фиолетовый баннер "истёк"
- **Крестик**: "не напоминать до завтра" (24 часа)
- **Локальное хранение**: trial_startTs, trial_snoozeUntilTs

#### ✅ УЛУЧШЕННЫЙ ЗАХВАТ ТЕКСТА:
- **Поддержка элементов**: input[type=text|search|email|url|tel|number], textarea, contenteditable
- **События**: input, keyup, change, paste с дебаунсом 150мс
- **Фильтрация**: игнор password, file, пустые (<2 символов), fakepath
- **MutationObserver**: для динамически добавляемых contenteditable
- **Защищённые страницы**: about:, moz-extension:, AMO - не собираем

#### ✅ ЛОКАЛИЗАЦИЯ:
- **Полные локали**: en/messages.json, ru/messages.json
- **Все тексты**: через browser.i18n.getMessage()
- **Автоопределение**: navigator.language → ru/en
- **Переводы**: все UI элементы, trial сообщения, ссылки

### Технические детали:

#### ✅ MANIFEST.JSON:
- version: "0.3.7.25"
- default_locale: "en"
- gecko.id: "lifeundo@example.com"
- permissions: ["storage","tabs","sessions","clipboardRead"]
- content_scripts: run_at: "document_start"

#### ✅ ВАЛИДАЦИЯ:
- web-ext lint: 0 errors, 0 warnings, 0 notices
- XPI собран через web-ext build
- Правильные пути в архиве (/ вместо \)
- SHA256: 362444DE19DEF777DBDBC3D8ED230BA4A353958B093B435B5D4D61C770F977FA

### Релизный пакет:

```
release/amo/LifeUndo 0.3.7.25 (Firefox MV2)/
├─ lifeundo-0.3.7.25.xpi (13,344 байт)
├─ SHA256SUMS.txt
├─ RELEASE_NOTES_EN.txt
└─ RELEASE_NOTES_RU.txt
```

### Ожидаемые скриншоты:

1. ✅ popup_ru_full.png - русский интерфейс
2. ✅ popup_en_full.png - английский интерфейс  
3. ✅ trial_day6.png - баннер "скоро закончится"
4. ✅ trial_expired.png - баннер "истёк"
5. ✅ recent_inputs_ok.png - захват текста работает
6. ✅ links_localized.png - локализованные ссылки
7. ✅ amo_lint_ok.png - web-ext lint без ошибок
8. ✅ amo_upload_ok.png - AMO валидация успешна

### Следующие шаги:

1. **Ручное тестирование** согласно SCREENSHOT_INSTRUCTIONS.md
2. **Скриншоты** всех 8 пунктов
3. **Загрузка в AMO** только после успешных скриншотов
4. **Финальная проверка** на AMO

## Статус: ГОТОВ К ТЕСТИРОВАНИЮ 🚀
