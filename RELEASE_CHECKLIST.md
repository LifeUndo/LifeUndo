# 🚀 Финальные шаги для релиза 0.3.7.12

## ✅ Что уже готово:

1. **XPI файл собран:** `public/app/0.3.7.12/lifeundo-0.3.7.12.xpi` (31.96 KB)
2. **Checksums сгенерированы:** SHA256 для всех файлов
3. **Latest обновлен:** файлы скопированы в `/latest/`
4. **Архив подготовлен:** структура для 0.3.7.11 готова
5. **Сайт обновлен:** баннер исправлен, хедер увеличен

## 📋 Что нужно сделать:

### 1. Загрузить на CDN
```bash
# Скопировать файлы на cdn.getlifeundo.com
rclone copy public/app/0.3.7.12/ remote:cdn.getlifeundo.com/app/0.3.7.12 --progress
rclone copy public/app/latest/ remote:cdn.getlifeundo.com/app/latest --progress
```

### 2. Отправить в AMO
- Зайти в [Firefox Developer Hub](https://addons.mozilla.org/ru/developers/addons)
- "Submit a New Version"
- Загрузить `lifeundo-0.3.7.12.xpi`
- Заполнить Release Notes (готовы в `RELEASE_NOTES.md`)
- Support email: `support@getlifeundo.com`
- Privacy policy: ссылка на `/privacy`

### 3. Обновить ссылку Firefox
После аппрува AMO обновить `latest.json`:
```json
{
  "files": {
    "firefox": "https://addons.mozilla.org/firefox/addon/getlifeundo/",
    "win": "https://cdn.getlifeundo.com/app/latest/undo-setup-latest.exe",
    "mac": "https://cdn.getlifeundo.com/app/latest/undo-latest.dmg"
  }
}
```

### 4. Заменить placeholder файлы
Когда будут готовы реальные инсталлеры:
- `undo-setup-0.3.7.12.exe` (Windows)
- `undo-0.3.7.12.dmg` (macOS)
- Пересчитать checksums: `npm run release:sha public/app/0.3.7.12`

### 5. Архив 0.3.7.11
Если есть файлы 0.3.7.11:
- Поместить в `public/app/0.3.7.11/`
- Запустить: `npm run release:sha public/app/0.3.7.11`

## 🎯 Результат:
- Сайт `/downloads` автоматически покажет актуальные кнопки
- Недоступные платформы будут скрыты
- Архив `/downloads/archive` покажет все версии
- Версия 0.3.7.12 готова к использованию!

## 📁 Структура файлов:
```
public/app/
├── 0.3.7.11/
│   ├── RELEASE_NOTES.md
│   └── README.md (placeholder)
├── 0.3.7.12/
│   ├── lifeundo-0.3.7.12.xpi ✅
│   ├── undo-setup-0.3.7.12.exe (placeholder)
│   ├── undo-0.3.7.12.dmg (placeholder)
│   ├── checksums.txt ✅
│   └── RELEASE_NOTES.md ✅
└── latest/
    ├── lifeundo-latest.xpi ✅
    ├── undo-setup-latest.exe ✅
    ├── undo-latest.dmg ✅
    └── latest.json ✅
```
