# AMO Release Guide - GetLifeUndo 0.3.7.13

## Где взять XPI файл
- Путь: `/app/releases/lifeundo-0.3.7.13.xpi` (после сборки)
- Сборка: `npx web-ext build -s dist-ff -o`

## Описание для карточки AMO

### RU (краткое):
GetLifeUndo — Ctrl+Z для вашей онлайн-жизни. Восстанавливает случайно удалённый текст, предыдущие версии ввода, а также помогает вернуться к закрытым вкладкам. Всё локально, без телеметрии.

### EN (краткое):
GetLifeUndo is Ctrl+Z for your online life. Restore accidentally deleted text, previous input versions, and quickly return to closed tabs. 100% local, no telemetry.

## Release Notes (из whats-new.json)
- Fix: стабильная ссылка оплаты FreeKassa из UI
- Fix: RU/EN i18n в хедере и футере всех страниц
- UI: единые официальные бейджи App Store / Google Play / RuStore  
- Site: legal-страницы приведены к единому layout
- Perf: мелкие оптимизации загрузки

## Ссылки для карточки
- Homepage: `https://getlifeundo.com`
- Support Email: `support@getlifeundo.com`
- Privacy Policy URL: `https://getlifeundo.com/ru/privacy`

## Сборка и валидация
```bash
cd extension
npx web-ext lint -s dist-ff
npx web-ext build -s dist-ff -o
```

## Загрузка в AMO
1. Перейти в [AMO Developer Hub](https://addons.mozilla.org/developers/)
2. Выбрать GetLifeUndo
3. "Submit a New Version"
4. Загрузить XPI файл
5. Вставить Release Notes
6. Отправить на модерацию
