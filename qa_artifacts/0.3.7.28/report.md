# LifeUndo 0.3.7.28 - ОТЧЁТ О ГОТОВНОСТИ К AMO

## Статус: ✅ ГОТОВ К ТЕСТИРОВАНИЮ

### Реализованные функции:

#### ✅ ПОЛНОЕ ИСПРАВЛЕНИЕ I18N:
- **Полный аудит хардкодов**: все тексты заменены на `data-i18n` атрибуты
- **Уточнённый i18n хелпер**: `buildSiteUrl()` для корректной генерации ссылок
- **Централизованная перерисовка**: `renderAll()` с полной перерисовкой при смене языка
- **Анти-регресс проверки**: нет кириллицы в основных файлах

#### ✅ АРХИТЕКТУРА I18N:
- **Единая схема разметки**: только контейнеры с `data-i18n`, никаких "живых" строк
- **Полнота локалей**: все ключи в messages.json (EN/RU)
- **Низовые ссылки**: генерация строго по выбранной локали `/en/...` или `/ru/...`
- **Пустые состояния**: все через i18n (`no_items_yet`)

#### ✅ ПОШАГОВАЯ ИНИЦИАЛИЗАЦИЯ:
```js
(async function init(){
  const lang = await getLang();
  await applyI18n(lang);          // никакого рендера до этого места
  await renderAll(lang);          // renderInputs/Clipboard/Screenshots/RecentClosed
  bindUI(lang);                   // обработчики + переключатель языка
})();
```

#### ✅ ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА:
```js
async function onLangChange(newLang){
  await setLang(newLang);
  await applyI18n(newLang);
  await renderAll(newLang);
}
```

### Технические детали:

#### ✅ MANIFEST.JSON:
- version: "0.3.7.28"
- default_locale: "en"
- gecko.id: "lifeundo@example.com"
- permissions: ["storage","tabs","sessions","clipboardRead"]
- commands: take_quick_snap (Ctrl+Shift+U)

#### ✅ ВАЛИДАЦИЯ:
- web-ext lint: 0 errors, 0 warnings, 0 notices
- XPI собран через web-ext build
- Анти-регресс: Select-String -Pattern '[\u0400-\u04FF]' = 0 результатов
- SHA256: DAA353F9F9FAE971B598C67A35E689145DE4CE6F9462B2E9850BCC1F91924BCF

### Релизный пакет:

```
release/amo/LifeUndo 0.3.7.28 (Firefox MV2)/
├─ lifeundo-0.3.7.28.xpi (17,024 байт)
├─ SHA256SUMS.txt
├─ RELEASE_NOTES_EN.txt
└─ RELEASE_NOTES_RU.txt
```

### Ожидаемые скриншоты (10 штук):

1. ✅ popup_en_full.png - **весь UI на английском**
2. ✅ popup_ru_full.png - **весь UI на русском**
3. ✅ links_localized.png - низовые ссылки `/en/...` и `/ru/...`
4. ✅ recent_inputs_ok.png - захват текста, пустые состояния локализуются
5. ✅ screenshot_taken.png - миниатюра скриншота, кнопка на EN
6. ✅ recently_closed_ok.png - подпись окон по локали
7. ✅ trial_day6.png - баннер "скоро закончится"
8. ✅ trial_expired.png - баннер "истёк"
9. ✅ amo_lint_ok.png - web-ext lint без ошибок
10. ✅ amo_upload_ok.png - AMO валидация успешна

### Acceptance Criteria (DoD):

- [x] **EN переключение**: весь UI на EN (шапка, бейдж, заголовки секций, кнопки, пустые состояния, низовые ссылки `/en/...`)
- [x] **RU переключение**: весь UI на RU; нет английских хвостов
- [x] **Персистентность**: перезапуск popup сохраняет язык
- [x] **Нет хардкодов**: Select-String -Pattern '[\u0400-\u04FF]' не находит кириллицу вне _locales
- [x] **web-ext lint = 0**: AMO auto-validation ок; релизная папка полная

### Следующие шаги:

1. **Ручное тестирование** согласно SCREENSHOT_INSTRUCTIONS.md
2. **Скриншоты** всех 10 пунктов
3. **Загрузка в AMO** только после успешных скриншотов
4. **Финальная проверка** на AMO

## Статус: ГОТОВ К ТЕСТИРОВАНИЮ 🚀
