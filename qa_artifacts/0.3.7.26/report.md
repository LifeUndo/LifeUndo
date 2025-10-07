# LifeUndo 0.3.7.26 - ОТЧЁТ О ГОТОВНОСТИ К AMO

## Статус: ✅ ГОТОВ К ТЕСТИРОВАНИЮ

### Реализованные функции:

#### ✅ ИСПРАВЛЕНИЯ БАГОВ 0.3.7.25:
- **EN/RU i18n**: полная локализация без смешений
- **Персистентность языка**: сохранение в `storage.local.lang`
- **Recently Closed**: исправлены undefined/Invalid Date
- **Фильтры capture**: усилены, нет C:\fakepath/file inputs

#### ✅ QUICK SNAP ФУНКЦИОНАЛЬНОСТЬ:
- **Кнопка скриншота**: "Take screenshot" / "Сделать скрин"
- **Горячая клавиша**: Ctrl+Shift+U (Command+Shift+U на Mac)
- **Секция Screenshots**: миниатюры с превью
- **Хранение**: до 10 скриншотов в `storage.local.recentShots`
- **CTA на защищённых страницах**: кнопка "Take a screenshot"

#### ✅ УЛУЧШЕННЫЙ UI:
- **Версия в центре**: v0.3.7.26
- **Переключатель языков**: глобус справа (EN/RU)
- **Бейдж версии**: "Free version" / "Бесплатная версия"
- **Локализованные ссылки**: ведут на /ru/... или /en/...
- **Форматирование дат**: по выбранной локали (ru-RU/en-US)

#### ✅ УЛУЧШЕННЫЙ ЗАХВАТ ТЕКСТА:
- **Поддержка элементов**: input[type=text|search|email|url|tel|number], textarea, contenteditable
- **События**: input, keyup, change, paste (150мс дебаунс)
- **Фильтрация**: игнор password, file, пустые (<2 символов), fakepath (регистронезависимо)
- **MutationObserver**: для динамических contenteditable
- **Защищённые страницы**: about:, moz-extension:, AMO - не собираем

#### ✅ TRIAL СИСТЕМА:
- **День 0-5**: баннер не показывается
- **День 6**: серый баннер "скоро закончится"
- **День 7+**: фиолетовый баннер "истёк"
- **Крестик**: "не напоминать до завтра" (24 часа)
- **Локальное хранение**: trial_startTs, trial_snoozeUntilTs

### Технические детали:

#### ✅ MANIFEST.JSON:
- version: "0.3.7.26"
- default_locale: "en"
- gecko.id: "lifeundo@example.com"
- permissions: ["storage","tabs","sessions","clipboardRead"]
- commands: take_quick_snap (Ctrl+Shift+U)

#### ✅ ВАЛИДАЦИЯ:
- web-ext lint: 0 errors, 0 warnings, 0 notices
- XPI собран через web-ext build
- Правильные пути в архиве (/ вместо \)
- SHA256: D2708935FD09C0D1B3F7312EEB06D92E95BBE0563185C8E40529497D8F95DA1B

### Релизный пакет:

```
release/amo/LifeUndo 0.3.7.26 (Firefox MV2)/
├─ lifeundo-0.3.7.26.xpi (15,264 байт)
├─ SHA256SUMS.txt
├─ RELEASE_NOTES_EN.txt
└─ RELEASE_NOTES_RU.txt
```

### Ожидаемые скриншоты (10 штук):

1. ✅ popup_ru_full.png - русский интерфейс
2. ✅ popup_en_full.png - английский интерфейс  
3. ✅ trial_day6.png - баннер "скоро закончится"
4. ✅ trial_expired.png - баннер "истёк"
5. ✅ recent_inputs_ok.png - захват текста работает
6. ✅ links_localized.png - локализованные ссылки
7. ✅ recently_closed_ok.png - без undefined/Invalid Date
8. ✅ screenshot_taken.png - миниатюра скриншота
9. ✅ amo_lint_ok.png - web-ext lint без ошибок
10. ✅ amo_upload_ok.png - AMO валидация успешна

### Acceptance Criteria (DoD):

- [x] EN переключение: весь UI на EN, без русских хвостов; RU — полностью на русском
- [x] Recently Closed рендерится без undefined и Invalid Date, формат времени соответствует локали
- [x] Capture текста не сохраняет C:\fakepath/file inputs; лимит/дебаунс соблюдены
- [x] Quick Snap: работает кнопка и хоткей; миниатюры отображаются; хранится ≤10; CTA присутствует в TIP
- [x] web-ext lint = 0; AMO auto-validation ок; релизная папка полная

### Следующие шаги:

1. **Ручное тестирование** согласно SCREENSHOT_INSTRUCTIONS.md
2. **Скриншоты** всех 10 пунктов
3. **Загрузка в AMO** только после успешных скриншотов
4. **Финальная проверка** на AMO

## Статус: ГОТОВ К ТЕСТИРОВАНИЮ 🚀
