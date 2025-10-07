# LifeUndo 0.3.7.26 - ИНСТРУКЦИИ ДЛЯ СКРИНШОТОВ

## Обязательные скриншоты для приёмки (10 штук):

### 1. popup_ru_full.png
- Открыть расширение на обычном сайте
- Переключить язык на русский
- Скриншот: все заголовки/кнопки на русском, версия в центре, глобус справа, бейдж «Бесплатная версия»

### 2. popup_en_full.png  
- Переключить язык на английский
- Скриншот: все переведено, версия в центре, глобус справа, бейдж «Free version»

### 3. trial_day6.png
- В консоли popup выполнить:
```javascript
browser.storage.local.set({ trial_startTs: Date.now() - 6 * 86400000 });
location.reload();
```
- Скриншот: серый баннер «Пробный период скоро закончится»

### 4. trial_expired.png
- В консоли popup выполнить:
```javascript
browser.storage.local.set({ trial_startTs: Date.now() - 8 * 86400000 });
location.reload();
```
- Скриншот: фиолетовый баннер «Пробный период истёк»

### 5. recent_inputs_ok.png
- На https://example.com ввести текст в input и textarea
- Открыть popup
- Скриншот: элементы видны (НЕ C:\fakepath)

### 6. links_localized.png
- Кликнуть на ссылки внизу popup
- Скриншот: ссылки ведут на /ru/... или /en/...

### 7. recently_closed_ok.png
- Закрыть несколько вкладок
- Открыть popup
- Скриншот: вкладки отображаются без undefined/Invalid Date

### 8. screenshot_taken.png
- Нажать кнопку "Take screenshot" / "Сделать скрин"
- Скриншот: видна миниатюра в секции Screenshots

### 9. amo_lint_ok.png
- Выполнить: cd ext/firefox/0.3.7.26 && npx web-ext lint
- Скриншот: вывод с 0 errors

### 10. amo_upload_ok.png
- Загрузить XPI в AMO (только после всех проверок)
- Скриншот: страница валидации AMO «no errors»

## Тестирование:

1. Загрузить временное дополнение: about:debugging → Load Temporary Add-on → manifest.json
2. Проверить все функции согласно скриншотам выше
3. Проверить горячую клавишу Ctrl+Shift+U для скриншотов
4. Сохранить все 10 скриншотов в qa_artifacts/0.3.7.26/screenshots/
