# LifeUndo 0.3.7.23 - Инструкция по самотестированию

## 1. Загрузка временного дополнения

1. Откройте Firefox
2. Перейдите в `about:debugging`
3. Нажмите "This Firefox"
4. Нажмите "Load Temporary Add-on..."
5. Выберите файл `ext\firefox\0.3.7.23\manifest.json`
6. Убедитесь, что расширение загружено без ошибок

## 2. Тест на обычном сайте

1. Откройте `https://example.com`
2. Откройте DevTools (F12)
3. В консоли выполните:
   ```javascript
   const textarea = document.createElement('textarea');
   textarea.style.cssText = 'position:fixed;top:50px;left:50px;width:200px;height:100px;z-index:9999;';
   document.body.appendChild(textarea);
   ```
4. Введите в textarea: **текст А**
5. Выделите весь текст и нажмите Ctrl+C
6. Закройте вкладку
7. Откройте попап расширения

### Ожидаемый результат:
- **Latest text inputs** содержит "текст А" (вверху)
- **Clipboard history** содержит "текст А"
- **Recently closed tabs** содержит только что закрытую вкладку

## 3. Тест на защищённой странице

1. Откройте `addons.mozilla.org` или `about:preferences`
2. Откройте попап расширения
3. Должна быть видна подсказка: "Tip: inputs/clipboard are unavailable on this page..."

## 4. Проверка хранилища

1. Откройте попап на любой странице
2. Откройте DevTools (F12)
3. В консоли выполните:
   ```javascript
   browser.storage.local.get(null).then(console.log);
   ```
4. В логе должны быть массивы `lu_inputs` и `lu_clipboard` с текущими элементами

## 5. Скриншоты для сохранения

Сохраните следующие скриншоты в `qa_artifacts\0.3.7.23\screenshots\extension\`:

1. `01_ok-site_inputs_clipboard_tabs.png` - попап на обычном сайте с данными
2. `02_protected-page_warning.png` - попап на защищённой странице с предупреждением
3. `03_popup_console_storage.png` - консоль с выводом browser.storage.local.get(null)

## 6. Критерии успеха

✅ На обычном сайте попап показывает ввод, буфер и закрытые вкладки
✅ На защищённой странице показывается предупреждение
✅ В browser.storage.local есть актуальные данные
✅ Все скриншоты сохранены
✅ Никаких ошибок в консоли попапа
