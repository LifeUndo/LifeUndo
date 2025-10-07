# LifeUndo 0.3.7.23 - Быстрое тестирование

## 🎯 Что нужно протестировать и сфотографировать:

### 1. Расширение Firefox (3 скриншота)

#### Скриншот 1: Попап с данными
1. Firefox → about:debugging → Load Temporary Add-on → выберите `ext\firefox\0.3.7.23\manifest.json`
2. Откройте https://example.com
3. В консоли выполните:
   ```js
   document.body.insertAdjacentHTML('beforeend','<textarea id=t style="width:100%;height:80px;position:fixed;top:50px;left:50px;z-index:9999;"></textarea>');
   t.value="GLU test 0.3.7.23"; t.focus(); t.select(); document.execCommand('copy');
   ```
4. Откройте попап расширения
5. **СДЕЛАЙТЕ СКРИНШОТ** попапа с данными
6. Сохраните как: `01_ok-site_inputs_clipboard_tabs.jpg`

#### Скриншот 2: Защищённая страница
1. Откройте about:addons
2. Откройте попап расширения
3. **СДЕЛАЙТЕ СКРИНШОТ** с предупреждением
4. Сохраните как: `02_protected-page_warning.jpg`

#### Скриншот 3: Консоль хранилища
1. Откройте попап на любой странице
2. F12 → Console
3. Выполните: `browser.storage.local.get(null).then(x=>console.log('storage', x))`
4. **СДЕЛАЙТЕ СКРИНШОТ** консоли с результатом
5. Сохраните как: `03_popup_console_storage.jpg`

### 2. Сайт (5 скриншотов)

#### Скриншот 1: Переключатель языков
1. Откройте http://localhost:3001
2. Кликните на глобус 🌐 в хедере
3. **СДЕЛАЙТЕ СКРИНШОТ** выпадающего списка
4. Сохраните как: `10_langswitch_globe_dropdown.jpg`

#### Скриншот 2: Переключение языков
1. Русская версия сайта
2. **СДЕЛАЙТЕ СКРИНШОТ**
3. Переключите на английский
4. **СДЕЛАЙТЕ СКРИНШОТ**
5. Сохраните как: `11_langswitch_ru_en.jpg`

#### Скриншот 3: AI-ассистент
1. Кликните на AI-ассистент в правом нижнем углу
2. Введите "test 0.3.7.23"
3. Отправьте
4. **СДЕЛАЙТЕ СКРИНШОТ** уведомления
5. Сохраните как: `12_assistant_send_ok.jpg`

#### Скриншот 4: Creator Program
1. Откройте http://localhost:3001/ru/creator/apply
2. **СДЕЛАЙТЕ СКРИНШОТ** страницы
3. Сохраните как: `13_creator_apply_ok.jpg`

#### Скриншот 5: Pricing
1. Откройте http://localhost:3001/ru/pricing
2. **СДЕЛАЙТЕ СКРИНШОТ** страницы с тарифами
3. Сохраните как: `14_pricing_freekassa_ok.jpg`

## 📁 Куда сохранять:
```
qa_artifacts\0.3.7.23\screenshots\extension\
qa_artifacts\0.3.7.23\screenshots\website\
```

## ⏱️ Время: ~15 минут
- Расширение: 5 минут
- Сайт: 10 минут

## ✅ После скриншотов:
- Все файлы готовы к AMO
- XPI создан: `lifeundo-0.3.7.23.xpi`
- SHA256: `FE69499BD88134DD113070568ACD4692F0E3AECA339F18D088CC727B8A697F46`
