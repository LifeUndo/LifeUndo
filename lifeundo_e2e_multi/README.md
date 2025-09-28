# LifeUndo E2E (RU + EN)

Набор автотестов Playwright для проверки **lifeundo.ru** и **getlifeundo.com**.

## Быстрый старт
```bash
npm i
npm run install:pw

# RU домен
npm run test:ru

# EN домен
npm run test:en

# Оба
npm run test:all
```
Отчёт:
```bash
npm run report
```

## Что проверяется
### RU (lifeundo.ru)
- 200 на ключевых страницах
- Cache-Control на /ok — no-store, no-cache, must-revalidate
- Цены: 149 ₽/мес, 1 490 ₽/год, 2 490 ₽

### EN (getlifeundo.com)
- 200 на /, /pricing, /fund, /privacy, /support
- /success и /fail — 200 (или 404 до деплоя)
- /admin — защищён (401/403)
- GET /api/fk/notify — 405
- Цены: $3.99/mo, $29/yr, $49 lifetime
