# LifeUndo 0.3.7.23 - Скрипт проверки артефактов

## Автоматическая проверка готовности к приёмке

### Проверка структуры папок
```bash
# Проверить наличие всех обязательных папок
ls qa_artifacts/0.3.7.23/screenshots/extension/
ls qa_artifacts/0.3.7.23/screenshots/website/
ls qa_artifacts/0.3.7.23/logs/
```

### Проверка обязательных файлов
```bash
# Скриншоты расширения (3 файла)
ls qa_artifacts/0.3.7.23/screenshots/extension/01_ok-site_inputs_clipboard_tabs.png
ls qa_artifacts/0.3.7.23/screenshots/extension/02_protected-page_warning.png
ls qa_artifacts/0.3.7.23/screenshots/extension/03_popup_console_storage.png

# Скриншоты сайта (5 файлов)
ls qa_artifacts/0.3.7.23/screenshots/website/10_langswitch_globe_dropdown.png
ls qa_artifacts/0.3.7.23/screenshots/website/11_langswitch_ru_en_hi_zh_ar_kk_tr.png
ls qa_artifacts/0.3.7.23/screenshots/website/12_assistant_send_ok.png
ls qa_artifacts/0.3.7.23/screenshots/website/13_creator_apply_ok.png
ls qa_artifacts/0.3.7.23/screenshots/website/14_pricing_freekassa_ok.png

# Логи (3 файла)
ls qa_artifacts/0.3.7.23/logs/extension_console.txt
ls qa_artifacts/0.3.7.23/logs/popup_storage_dump.json
ls qa_artifacts/0.3.7.23/logs/assistant_submit.json

# Отчёт
ls qa_artifacts/0.3.7.23/report.md
```

### Проверка содержимого логов
```bash
# Проверить наличие ключевых логов в extension_console.txt
grep "\[LU\]" qa_artifacts/0.3.7.23/logs/extension_console.txt

# Проверить структуру popup_storage_dump.json
cat qa_artifacts/0.3.7.23/logs/popup_storage_dump.json | jq '.'

# Проверить структуру assistant_submit.json
cat qa_artifacts/0.3.7.23/logs/assistant_submit.json | jq '.'
```

### Проверка отчёта
```bash
# Проверить статус в report.md
grep "ФИНАЛЬНЫЙ СТАТУС" qa_artifacts/0.3.7.23/report.md
grep "ГОТОВНОСТЬ К XPI" qa_artifacts/0.3.7.23/report.md
```

## Критерии для GREEN статуса

### 1. Все файлы на месте (11 файлов)
- 3 скриншота расширения
- 5 скриншотов сайта  
- 3 лога
- 1 отчёт

### 2. Логи содержат нужную информацию
- `extension_console.txt`: логи `[LU]` с префиксом
- `popup_storage_dump.json`: массивы `lu_inputs`, `lu_clipboard`
- `assistant_submit.json`: валидный запрос ассистента

### 3. Отчёт показывает PASS
- `report.md`: статус PASS по всем пунктам
- Готовность к XPI: ДА

## Если что-то отсутствует

### Отсутствуют скриншоты
- Проверить качество тестирования
- Повторить тесты с сохранением скриншотов

### Отсутствуют логи
- Проверить работу расширения
- Убедиться, что контент-скрипт загружается

### Отсутствует отчёт
- Заполнить `report.md` с результатами тестирования
- Указать статус PASS/FAIL

## Команда для быстрой проверки
```bash
# Проверить все файлы одной командой
find qa_artifacts/0.3.7.23/ -name "*.png" -o -name "*.txt" -o -name "*.json" -o -name "*.md" | wc -l
# Должно быть 12 файлов (8 скриншотов + 3 лога + 1 отчёт)
```

---

**ГОТОВ К ПРИЁМКЕ АРТЕФАКТОВ!**
