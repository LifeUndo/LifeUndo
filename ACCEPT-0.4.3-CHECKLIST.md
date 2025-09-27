# ✅ ACCEPT 0.4.3 + AUTO-USAGE PATCH

## **0) Быстрый приёмочный чек (команды)**

```bash
# сборка/запуск
npm run build
npm start

# e2e смоук
npm run test:e2e

# API usage (должно отвечать JSON)
curl -s -u admin:****** https://getlifeundo.com/api/admin/usage/summary | jq
curl -s -u admin:****** "https://getlifeundo.com/api/admin/usage/timeseries?days=7" | jq
```

**Если summary пустой — ниже патч на автоматическую запись событий.**

## **1) ENV (добавить один секрет для внутреннего логера)**

```diff
# File: .env.example
+INTERNAL_USAGE_KEY=CHANGE_ME_LONG_RANDOM
```

**Поставь то же значение на проде (Beget) для `.com` и `.ru`.**

## **2) Internal usage endpoint (принимает события от middleware)**

**Файл:** `src/app/api/_usage/route.ts` ✅ **СОЗДАН**

## **3) Edge middleware: отправляем «файр-энд-форгет» лог на каждый запрос к /api/***

**Файл:** `src/middleware.ts` ✅ **ОБНОВЛЁН**

## **4) Admin навигация: ссылка на usage**

**Файл:** `src/app/admin/page.tsx` ✅ **ОБНОВЛЁН**

## **5) (Опционально) Если таблицы `usage_events` ещё нет**

**Файл:** `migrations/030_usage_events_optional.sql` ✅ **СОЗДАН**

## **6) Быстрый тест авто-логгера**

```bash
# 1) дёрнем публичный эндпойнт (он пройдёт через middleware)
curl -s https://getlifeundo.com/api/public/pricing >/dev/null

# 2) проверим summary и топ-эндпоинты
curl -s -u admin:****** https://getlifeundo.com/api/admin/usage/summary | jq
# ожидаем total >= 1 и в byEndpoint что-то вроде "/api/public/pricing"
```

## **7) Финальные штрихи релиза 0.4.3**

```diff
# File: .env (на Beget)
-NEXT_PUBLIC_APP_VERSION=0.4.2
+NEXT_PUBLIC_APP_VERSION=0.4.3
```

- Sentry: отметь релиз `0.4.3`
- SEO: проверь `https://getlifeundo.com/robots.txt` и `/sitemap.xml` отдают 200
- Cloudflare: Cache Rules — Bypass `/api/*`, `/admin*`; 301 `www→apex`; Dev Mode OFF

## **🎯 ГОТОВО К ПРИЁМКЕ:**

1. `npm run build && npm start`
2. `npm run test:e2e` (два теста зелёные)
3. Дёрнуть 1–2 API → `/api/admin/usage/summary` должен показать рост `total`

**Если что-то потребуется подправить — скажи «фиксанём точечно», и я дам мини-патч в одном посте! 🚀**


