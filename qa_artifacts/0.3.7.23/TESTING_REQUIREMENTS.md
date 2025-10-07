# LifeUndo 0.3.7.23 - Требования к отчёту о тестировании

## 📋 ОБЯЗАТЕЛЬНАЯ ИНФОРМАЦИЯ ОБ ОКРУЖЕНИИ

Добавьте в `report.md` следующий блок:

```markdown
## Информация о тестировании
- **Дата:** [ДАТА ТЕСТИРОВАНИЯ]
- **Firefox версия:** [ВЕРСИЯ, например 129.0]
- **ОС:** [Windows 10/11, macOS, Linux]
- **Тестировщик:** Cursor AI
- **Статус:** [PASS/FAIL]

## Окружение тестирования
- **Обычный сайт для теста:** [URL, например https://example.com]
- **Контроль контент-скрипта:** `typeof browser !== 'undefined'` = `true` ✅
- **Тест на AMO/about:** ТОЛЬКО для проверки предупреждения (НЕ для сбора данных) ✅
- **Количество закрытых вкладок:** [ЧИСЛО] для теста "Recently closed tabs"
```

## 🔍 КРИТИЧЕСКИЕ ПРОВЕРКИ

### 1. Контент-скрипт загружается
**Обязательно:** Скриншот консоли страницы с результатом:
```js
typeof browser !== 'undefined'  // должно быть true
```

### 2. Сбор данных работает
**Обязательно:** В логах должны быть:
```
[LU] Content script loaded successfully
[LU] Input captured: {text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}
[LU] Copy captured: {text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}
[LU] Saved to storage: lu_inputs 1 items
[LU] Saved to storage: lu_clipboard 1 items
```

### 3. Хранилище содержит данные
**Обязательно:** В `popup_storage_dump.json` должны быть:
```json
{
  "lu_inputs": [{"text": "GLU test 0.3.7.23", "ts": 1234567890, "origin": "https://example.com"}],
  "lu_clipboard": [{"text": "GLU test 0.3.7.23", "ts": 1234567890, "origin": "https://example.com"}]
}
```

### 4. Предупреждение на защищённых страницах
**Обязательно:** На `about:addons` и AMO попап показывает серый хинт о недоступности

### 5. AI-ассистент работает
**Обязательно:** В `assistant_submit.json` должен быть валидный запрос:
```json
{
  "message": "test 0.3.7.23",
  "locale": "ru",
  "timestamp": "2025-01-07T...",
  "userAgent": "Mozilla/5.0..."
}
```

## ⚠️ ЧАСТЫЕ ПРОБЛЕМЫ

### Проблема: "Пустые списки в попапе"
**Проверьте:**
- Тестируете ли на обычном сайте (НЕ на AMO/about:)
- Загружается ли контент-скрипт (`typeof browser !== 'undefined'`)
- Есть ли логи `[LU]` в консоли

### Проблема: "Нет предупреждения на защищённых страницах"
**Проверьте:**
- Тестируете ли на `about:addons` или `addons.mozilla.org`
- Показывается ли серый хинт в попапе

### Проблема: "AI не отправляет сообщения"
**Проверьте:**
- Есть ли ошибки в консоли браузера
- Сохраняется ли `assistant_submit.json`

## 🎯 КРИТЕРИИ УСПЕХА

### ✅ PASS - Все критерии выполнены:
- [ ] Контент-скрипт загружается (`typeof browser !== 'undefined'` = `true`)
- [ ] Сбор данных работает (видны логи `[LU]`)
- [ ] Данные сохраняются в хранилище (`lu_inputs`, `lu_clipboard` не пустые)
- [ ] Попап показывает собранные данные
- [ ] На защищённых страницах показывается предупреждение
- [ ] Переключение языков работает на всех 7 локалях
- [ ] AI-ассистент показывает успешную отправку
- [ ] Все скриншоты и логи сохранены

### ❌ FAIL - Есть проблемы:
- [ ] Любой из критериев выше не выполнен
- [ ] Нужны дополнительные исправления

## 📁 СТРУКТУРА АРТЕФАКТОВ

```
qa_artifacts/0.3.7.23/
├── screenshots/
│   ├── extension/
│   │   ├── 01_ok-site_inputs_clipboard_tabs.png
│   │   ├── 02_protected-page_warning.png
│   │   └── 03_popup_console_storage.png
│   └── website/
│       ├── 10_langswitch_globe_dropdown.png
│       ├── 11_langswitch_ru_en_hi_zh_ar_kk_tr.png
│       ├── 12_assistant_send_ok.png
│       ├── 13_creator_apply_ok.png
│       └── 14_pricing_freekassa_ok.png
├── logs/
│   ├── extension_console.txt
│   ├── popup_storage_dump.json
│   └── assistant_submit.json
└── report.md
```

## 🚫 ЗАПРЕТЫ

- **НЕ создавать XPI** до полного прохождения всех тестов
- **НЕ загружать в AMO** до команды
- **НЕ пропускать** ни одного пункта тестирования
- **НЕ тестировать сбор данных** на защищённых страницах (AMO/about:)

---

**ГОТОВ К ПРИЁМКЕ АРТЕФАКТОВ!**
