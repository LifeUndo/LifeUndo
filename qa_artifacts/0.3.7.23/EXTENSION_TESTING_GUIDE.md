# LifeUndo 0.3.7.23 - Инструкция по тестированию расширения Firefox

## 🎯 ЦЕЛЬ: Получить реальные скриншоты расширения

### 1. Загрузка расширения в Firefox

1. **Откройте Firefox**
2. **Перейдите в** `about:debugging`
3. **Нажмите** "This Firefox"
4. **Нажмите** "Load Temporary Add-on..."
5. **Выберите файл:** `ext\firefox\0.3.7.23\manifest.json`
6. **Убедитесь,** что расширение загружено без ошибок

### 2. Тестирование на обычном сайте

1. **Откройте** `https://example.com` (НЕ AMO, НЕ about:)
2. **Откройте DevTools** (F12) → Console
3. **Выполните команду:**
   ```js
   typeof browser !== 'undefined'
   ```
   **Ожидаемый результат:** `true`

4. **Создайте тестовое поле:**
   ```js
   document.body.insertAdjacentHTML('beforeend','<textarea id=t style="width:100%;height:80px;position:fixed;top:50px;left:50px;z-index:9999;"></textarea>');
   t.value="GLU test 0.3.7.23"; t.focus(); t.select(); document.execCommand('copy');
   ```

5. **Откройте попап расширения** (клик по иконке)
6. **Сделайте скриншот** - должен показать:
   - "GLU test 0.3.7.23" в Latest text inputs
   - "GLU test 0.3.7.23" в Clipboard history
   - Recently closed tabs (если закрывали вкладки)

### 3. Тестирование на защищённой странице

1. **Откройте** `about:addons` или `addons.mozilla.org`
2. **Откройте попап расширения**
3. **Сделайте скриншот** - должен показать:
   - Серое предупреждение: "Tip: inputs/clipboard are unavailable on this page..."
   - Пустые списки или скрытые секции

### 4. Проверка хранилища

1. **Откройте попап** на любой странице
2. **Откройте DevTools попапа** (F12)
3. **Выполните команду:**
   ```js
   browser.storage.local.get(null).then(x=>console.log('storage', x))
   ```
4. **Сделайте скриншот консоли** с результатом

### 5. Сохранение скриншотов

Сохраните скриншоты в:
```
qa_artifacts\0.3.7.23\screenshots\extension\
├── 01_ok-site_inputs_clipboard_tabs.png
├── 02_protected-page_warning.png
└── 03_popup_console_storage.png
```

### 6. Сохранение логов

Сохраните логи в:
```
qa_artifacts\0.3.7.23\logs\
├── extension_console.txt (логи с префиксом [LU])
├── popup_storage_dump.json (результат browser.storage.local.get(null))
└── assistant_submit.json (тестовый запрос ассистента)
```

## ⚠️ ВАЖНО

- **НЕ тестируйте сбор данных** на AMO/about: - там контент-скрипты запрещены
- **Тестируйте только на обычных сайтах** - example.com, google.com, github.com
- **Перезагружайте временное дополнение** после изменений в about:debugging

## 🎯 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

### На обычном сайте:
- ✅ Попап показывает введённый и скопированный текст
- ✅ Recently closed tabs показывает закрытые вкладки
- ✅ НЕТ предупреждения о защищённой странице

### На защищённой странице:
- ✅ Показывается серое предупреждение
- ✅ Списки пустые или скрыты
- ✅ Контент-скрипт не собирает данные

### В консоли:
- ✅ `typeof browser !== 'undefined'` = `true`
- ✅ Логи `[LU] Input captured` и `[LU] Copy captured`
- ✅ `browser.storage.local.get(null)` показывает массивы `lu_inputs` и `lu_clipboard`

---

**ГОТОВ К ТЕСТИРОВАНИЮ!** XPI файл создан: `lifeundo-0.3.7.23.xpi`
