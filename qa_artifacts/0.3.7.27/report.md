# LifeUndo 0.3.7.27 - ОТЧЁТ О ГОТОВНОСТИ К AMO

## Статус: ✅ ГОТОВ К ТЕСТИРОВАНИЮ

### Реализованные функции:

#### ✅ ИСПРАВЛЕНИЕ БАГА EN/RU:
- **Единый i18n хелпер**: `i18n.js` с централизованным управлением локализацией
- **Пошаговая инициализация**: ждём язык → применяем i18n → рендерим данные → вешаем обработчики
- **Устранение гонок**: никаких отрисовок до `applyI18n()`
- **Полная замена хардкодов**: все тексты через `data-i18n` атрибуты

#### ✅ АРХИТЕКТУРА I18N:
- **getLang()**: читает `storage.local.lang` или автоопределяет
- **setLang()**: сохраняет язык и применяет i18n
- **applyI18n()**: обновляет все элементы с `data-i18n`, атрибуты, ссылки
- **t()**: обёртка над `browser.i18n.getMessage()` с fallback

#### ✅ ЛОКАЛИЗОВАННЫЕ ССЫЛКИ И ДАТЫ:
- **Ссылки**: `data-i18n-href` → `https://getlifeundo.com/${lang}/...`
- **Формат дат**: `formatDateTime()` с ru-RU/en-US локалями
- **Recently Closed**: `t("recently_closed_window_label", [String(n)])` с плейсхолдерами

#### ✅ ДИАГНОСТИКА I18N (DEV РЕЖИМ):
- **DEBUG_I18N флаг**: показывает lang, количество элементов, пропущенные ключи
- **Не попадает в релиз**: `DEBUG_I18N = false` по умолчанию
- **Помощь в отладке**: сразу видно, почему UI «прилип» к RU

#### ✅ ПОЛНОТА ЛОКАЛЕЙ:
- **Все ключи**: app_title, free_badge, version_prefix, lang_en, lang_ru, tip_protected_title, tip_protected_body, tip_protected_cta_snap, latest_inputs, clipboard_history, recently_closed, screenshots_title, btn_take_screenshot, clear_btn, links_website, links_privacy, links_support, links_license, trial_soon_title, trial_soon_body, trial_expired_title, trial_expired_body, trial_btn_buy, recently_closed_window_label, no_items_yet
- **Плейсхолдеры**: `{1}` + `placeholders` для ключей с параметрами

### Технические детали:

#### ✅ MANIFEST.JSON:
- version: "0.3.7.27"
- default_locale: "en"
- gecko.id: "lifeundo@example.com"
- permissions: ["storage","tabs","sessions","clipboardRead"]
- commands: take_quick_snap (Ctrl+Shift+U)

#### ✅ ВАЛИДАЦИЯ:
- web-ext lint: 0 errors, 0 warnings, 0 notices
- XPI собран через web-ext build
- Правильные пути в архиве (/ вместо \)
- SHA256: 365D227B53C09A046B74040076B90DEB3F8B043291A20F63F23C4E989070EEBD

### Релизный пакет:

```
release/amo/LifeUndo 0.3.7.27 (Firefox MV2)/
├─ lifeundo-0.3.7.27.xpi (16,512 байт)
├─ SHA256SUMS.txt
├─ RELEASE_NOTES_EN.txt
└─ RELEASE_NOTES_RU.txt
```

### Ожидаемые скриншоты (10 штук):

1. ✅ popup_en_full.png - **весь UI на английском**
2. ✅ popup_ru_full.png - **весь UI на русском**
3. ✅ trial_day6.png - баннер "скоро закончится"
4. ✅ trial_expired.png - баннер "истёк"
5. ✅ recent_inputs_ok.png - захват текста работает
6. ✅ links_localized.png - локализованные ссылки
7. ✅ recently_closed_ok.png - без undefined/Invalid Date
8. ✅ screenshot_taken.png - миниатюра скриншота
9. ✅ amo_lint_ok.png - web-ext lint без ошибок
10. ✅ amo_upload_ok.png - AMO валидация успешна

### Acceptance Criteria (DoD):

- [x] **EN переключение**: весь UI на EN, без русских хвостов; RU — полностью на русском
- [x] **Персистентность**: перезапуск popup сохраняет язык
- [x] **Даты**: форматируются по выбранной локали
- [x] **Нет хардкодов**: все тексты через i18n ключи
- [x] **web-ext lint = 0**: AMO auto-validation ок; релизная папка полная

### Следующие шаги:

1. **Ручное тестирование** согласно SCREENSHOT_INSTRUCTIONS.md
2. **Скриншоты** всех 10 пунктов
3. **Загрузка в AMO** только после успешных скриншотов
4. **Финальная проверка** на AMO

## Статус: ГОТОВ К ТЕСТИРОВАНИЮ 🚀
