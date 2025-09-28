# LifeUndo E2E (Playwright)

Готовый набор автотестов для **lifeundo.ru** по GATE-чеклисту.

## Быстрый старт

```bash
# в папке проекта
npm i
npm run install:pw
npm test
# открыть отчёт
npm run report
```

По умолчанию тесты идут на https://lifeundo.ru. Можно указать другой BASE_URL:

```bash
BASE_URL=https://lifeundo.ru npm test
```

## Что проверяется
- 200 на /, /pricing, /fund, /fund/apply, /privacy, /support, /ok
- Заголовок Cache-Control на /ok = no-store, no-cache, must-revalidate
- Цены на /pricing: 149 ₽/мес, 1 490 ₽/год, 2 490 ₽
- /fund: 10%, 40/30/30, ссылка на /fund/apply
- Главная: слоган, баннер фонда
- Футер: иконки соцсетей (aria-label), бейдж FreeKassa (alt=FreeKassa)

## CI пример (GitHub Actions)
- Файл: `.github/workflows/e2e.yml`
