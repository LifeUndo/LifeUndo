# LifeUndo 0.3.7.23 - Чек-лист приёмки

## 🎯 КРИТЕРИИ ПРИЁМКИ (что я проверяю)

### 1. Расширение Firefox
- [ ] **На обычной странице** в попапе **ЕСТЬ** введённый и скопированный текст
- [ ] **В storage-дампе** — массивы `lu_inputs` и `lu_clipboard` с актуальными элементами
- [ ] **На AMO/about** есть **ХИНТ**, а не пустой экран
- [ ] **Контент-скрипт** загружается (`typeof browser !== 'undefined'` = `true`)

### 2. Сайт
- [ ] **Переключение языков** реальное (без хардкода)
- [ ] **Любые два раздела** (например, `/pricing` и `/support`) корректно локализуются на всех 7 локалях
- [ ] **Ассистент** — модал об успешной отправке и валидный лог запроса
- [ ] **Creator Program** работает на всех локалях

### 3. Артефакты
- [ ] **Все скрины и логи** лежат в оговорённых путях
- [ ] **Качество скриншотов** достаточное для анализа
- [ ] **Логи содержат** нужную информацию для отладки

## 📁 ОБЯЗАТЕЛЬНЫЕ ФАЙЛЫ

### Скриншоты расширения:
- [ ] `01_ok-site_inputs_clipboard_tabs.png` - попап с данными на обычном сайте
- [ ] `02_protected-page_warning.png` - попап на AMO/about: с предупреждением
- [ ] `03_popup_console_storage.png` - консоль с данными хранилища

### Скриншоты сайта:
- [ ] `10_langswitch_globe_dropdown.png` - выпадающий список языков
- [ ] `11_langswitch_ru_en_hi_zh_ar_kk_tr.png` - примеры переключений
- [ ] `12_assistant_send_ok.png` - уведомление об отправке
- [ ] `13_creator_apply_ok.png` - страница Creator Program
- [ ] `14_pricing_freekassa_ok.png` - страница тарифов с платежами

### Логи:
- [ ] `extension_console.txt` - логи contentScript/popup с префиксом [LU]
- [ ] `popup_storage_dump.json` - результат browser.storage.local.get(null)
- [ ] `assistant_submit.json` - тело запроса ассистента

### Отчёт:
- [ ] `report.md` - краткий отчёт с статусом PASS/FAIL

## 🚫 ЗАПРЕТЫ

- [ ] **НЕ создавать XPI** до полного прохождения всех тестов
- [ ] **НЕ загружать в AMO** до команды
- [ ] **НЕ пропускать** ни одного пункта тестирования

## ✅ ПРИЗНАКИ УСПЕХА

### Расширение работает если:
- На `https://example.com` попап показывает "GLU test 0.3.7.23" в обоих списках
- На `about:addons` попап показывает серый хинт о недоступности
- В консоли видны логи `[LU] Input captured` и `[LU] Copy captured`
- `browser.storage.local.get(null)` возвращает массивы с данными

### Сайт работает если:
- Глобус открывает список из 7 языков
- Переключение на любой язык меняет URL и контент
- AI-ассистент показывает "Сообщение отправлено"
- Creator Program открывается на всех локалях

## 🔍 ЧТО ИСКАТЬ В ЛОГАХ

### extension_console.txt должен содержать:
```
[LU] Content script loaded successfully
[LU] Input captured: {text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}
[LU] Copy captured: {text: "GLU test 0.3.7.23", ts: ..., origin: "https://example.com"}
[LU] Saved to storage: lu_inputs 1 items
[LU] Saved to storage: lu_clipboard 1 items
```

### popup_storage_dump.json должен содержать:
```json
{
  "lu_inputs": [{"text": "GLU test 0.3.7.23", "ts": ..., "origin": "https://example.com"}],
  "lu_clipboard": [{"text": "GLU test 0.3.7.23", "ts": ..., "origin": "https://example.com"}]
}
```

### assistant_submit.json должен содержать:
```json
{
  "message": "test 0.3.7.23",
  "locale": "ru",
  "timestamp": "...",
  "userAgent": "..."
}
```

## 🎯 ФИНАЛЬНАЯ ПРОВЕРКА

После получения всех артефактов проверяю:

1. **Все файлы на месте?** ✅/❌
2. **Скриншоты показывают ожидаемое поведение?** ✅/❌
3. **Логи содержат нужную информацию?** ✅/❌
4. **Отчёт показывает PASS?** ✅/❌

**Если все ✅ - даю команду на создание XPI**
**Если есть ❌ - требую исправления**
