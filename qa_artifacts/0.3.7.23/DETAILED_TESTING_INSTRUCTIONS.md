# LifeUndo 0.3.7.23 - Детальная инструкция по тестированию

## КРИТИЧЕСКИ ВАЖНО: Тестируем ТОЛЬКО на обычных сайтах!

❌ **НЕ тестируйте на:**
- `addons.mozilla.org` (AMO)
- `about:addons`
- `about:preferences`
- `about:blank`
- `moz-extension:` страницы

✅ **Тестируйте на:**
- `https://example.com`
- `https://google.com`
- `https://github.com`
- Любые обычные веб-сайты

## 1. Загрузка временного дополнения

1. Откройте Firefox
2. Перейдите в `about:debugging`
3. Нажмите "This Firefox"
4. Нажмите "Load Temporary Add-on..."
5. Выберите файл `ext\firefox\0.3.7.23\manifest.json`
6. Убедитесь, что расширение загружено без ошибок

## 2. Тест контент-скрипта (ОБЯЗАТЕЛЬНО!)

### 2.1 Проверка загрузки контент-скрипта
1. Откройте `https://example.com`
2. Откройте DevTools (F12) → Console
3. Выполните команду:
   ```js
   typeof browser !== 'undefined'
   ```
   **Ожидаемый результат:** `true`
   **Если `false`** - контент-скрипт не загрузился, перезагрузите временное дополнение

### 2.2 Тест сбора данных
В той же консоли выполните:
```js
// Создаём тестовое поле и вводим текст
document.body.insertAdjacentHTML('beforeend','<textarea id=t style="width:100%;height:80px;position:fixed;top:50px;left:50px;z-index:9999;"></textarea>');
t.value="GLU test 0.3.7.23"; 
t.focus(); 
t.select(); 
document.execCommand('copy');
console.log('typed & copied');
```

**Ожидаемый результат:** В консоли должны появиться сообщения:
```
[LU] Input captured: {text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}
[LU] Copy captured: {text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}
[LU] Saved to storage: lu_inputs 1 items
[LU] Saved to storage: lu_clipboard 1 items
```

## 3. Тест попапа

### 3.1 Проверка данных в хранилище
1. Откройте попап расширения
2. Откройте DevTools попапа (F12) → Console
3. Выполните команду:
   ```js
   browser.storage.local.get(null).then(x=>console.log('storage', x));
   ```

**Ожидаемый результат:** В логе должны быть:
```js
storage: {
  lu_inputs: [{text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}],
  lu_clipboard: [{text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}]
}
```

### 3.2 Проверка отображения в попапе
В попапе должны быть видны:
- **Latest text inputs:** "GLU test 0.3.7.23"
- **Clipboard history:** "GLU test 0.3.7.23"

## 4. Тест закрытых вкладок

1. Откройте 2-3 любые страницы (например, `https://google.com`, `https://github.com`)
2. Закройте их крестиком
3. Откройте попап расширения
4. В разделе **Recently closed tabs** должны быть видны закрытые вкладки

## 5. Тест защищённых страниц

1. Откройте `about:addons` или `addons.mozilla.org`
2. Откройте попап расширения
3. **ДОЛЖНА** быть видна сиреневая плашка: "Tip: inputs/clipboard are unavailable on this page..."

## 6. Скриншоты для сохранения

Сохраните следующие скриншоты в `qa_artifacts\0.3.7.23\screenshots\extension\`:

### 6.1 Основной тест
**Файл:** `01_ok-site_inputs_clipboard_tabs.png`
- Попап на обычном сайте
- Видны: введённый текст, скопированный текст, закрытые вкладки
- НЕТ сиреневой плашки предупреждения

### 6.2 Защищённая страница
**Файл:** `02_protected-page_warning.png`
- Попап на `about:addons` или AMO
- Видна сиреневая плашка предупреждения
- Списки пустые или скрыты

### 6.3 Консоль хранилища
**Файл:** `03_popup_console_storage.png`
- Консоль попапа с результатом `browser.storage.local.get(null)`
- Видны массивы `lu_inputs` и `lu_clipboard` с данными

## 7. Типичные проблемы и решения

### Проблема: "Пустые списки в попапе"
**Причины:**
- Тестируете на защищённой странице (AMO/about:)
- Контент-скрипт не загрузился
- Неправильные ключи хранилища

**Решение:**
1. Убедитесь, что тестируете на обычном сайте
2. Проверьте `typeof browser !== 'undefined'` в консоли
3. Перезагрузите временное дополнение

### Проблема: "Нет закрытых вкладок"
**Причины:**
- Не закрывали вкладки крестиком
- Проблема с `browser.sessions.getRecentlyClosed`

**Решение:**
1. Закройте несколько вкладок крестиком
2. Проверьте права доступа в манифесте: `"permissions": ["sessions"]`

### Проблема: "Нет предупреждения на защищённых страницах"
**Причины:**
- Неправильная проверка URL в `popup.js`

**Решение:**
1. Проверьте функцию `checkProtectedPage()` в popup.js
2. Убедитесь, что проверяются все типы защищённых страниц

## 8. Критерии успеха

✅ Контент-скрипт загружается (`typeof browser !== 'undefined'` = `true`)
✅ Сбор данных работает (видны логи `[LU] Input captured`, `[LU] Copy captured`)
✅ Данные сохраняются в хранилище (`lu_inputs`, `lu_clipboard` не пустые)
✅ Попап показывает собранные данные
✅ Закрытые вкладки отображаются
✅ На защищённых страницах показывается предупреждение
✅ Все 3 скриншота сохранены

## 9. Если что-то не работает

1. **Перезагрузите временное дополнение** в `about:debugging`
2. **Очистите кеш браузера** (Ctrl+Shift+Del)
3. **Проверьте консоль** на ошибки
4. **Убедитесь, что тестируете на обычном сайте**, не на AMO/about:

**ВАЖНО:** Не создавайте XPI до успешного прохождения всех тестов!
