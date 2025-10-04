# 🚀 Готовые файлы для применения

Все файлы созданы и готовы к применению! Вот что нужно сделать:

## ✅ Созданные файлы

### 1. Страницы сайта
- ✅ `src/app/support/page.tsx` — страница поддержки с Telegram и FAQ
- ✅ `src/app/success/page.tsx` — страница успешной оплаты
- ✅ `src/app/fail/page.tsx` — страница ошибки оплаты  
- ✅ `src/app/pricing/page.tsx` — обновленная страница цен (4 тарифа: Free/Pro/VIP/Team)
- ✅ `src/app/fund/page.tsx` — обновленная страница фонда с бейджем "We give 10%"
- ✅ `src/components/Footer.tsx` — футер с соцсетями и бейджами
- ✅ `src/app/page.tsx` — обновленная главная страница с футером

### 2. Патчи для расширения
- ✅ `business/popup-js-patch-0.3.7.11.diff` — патч для popup.js (кнопка Pro → /pricing)

### 3. Документация
- ✅ `business/PROJECT_READINESS.md` — полное ТЗ для Cursor

## 🔧 Как применить изменения

### 1. Применить патч для расширения
```bash
cd extension
patch -p1 < ../business/popup-js-patch-0.3.7.11.diff
```

### 2. Обновить версию в manifest.json
```json
{
  "version": "0.3.7.11"
}
```

### 3. Создать release notes
**RU:**
- Активировать VIP → встроенная страница «Лицензия»
- Кнопка Pro теперь ведет на /pricing (RU) или /en/pricing (EN)
- Исправлены баги с RU/EN переключением
- UI стабильнее и отзывчивее

**EN:**
- Activate VIP → License page built-in
- Pro button now links to /pricing (RU) or /en/pricing (EN)
- Fixed RU/EN toggle bugs
- UI more stable and responsive

### 4. Собрать XPI
```bash
npm run build:xpi
# или
./build-xpi.ps1
```

### 5. Загрузить в AMO
- Зайти в AMO Developer Hub
- Выбрать LifeUndo
- Загрузить новый XPI файл
- Заполнить release notes RU/EN
- Опубликовать

## 🎯 Что получилось

### Сайт (getlifeundo.com)
- ✅ Все страницы: `/support`, `/pricing`, `/success`, `/fail`, `/fund`
- ✅ Футер с соцсетями: Telegram, VK, Дзен, vc.ru, Habr, TenChat, YouTube, Reddit, X
- ✅ Бейджи: FreeKassa, "We give 10%"
- ✅ Тарифы: Free (0₽), Pro (149₽/мес), VIP (2490₽ lifetime), Team (от 150₽/место/мес)

### Расширение (0.3.7.11)
- ✅ Кнопка Pro → `/pricing` (RU) или `/en/pricing` (EN)
- ✅ Локализованные "What's new" и футер
- ✅ Бейдж "We give 10%" в футере

### Фонд
- ✅ Страница `/fund` с объяснением "10% net revenue → GetLifeUndo Fund"
- ✅ Бейдж "We give 10%" на сайте и в попапе

## 🚀 Готово к запуску!

Все файлы созданы согласно ТЗ. Осталось только:
1. Применить патч к расширению
2. Обновить версию
3. Собрать XPI
4. Загрузить в AMO
5. Настроить ENV переменные в Vercel
6. Провести smoke tests

**Время выполнения:** ~30 минут















