# ✅ ACCEPTANCE CHECKLIST 0.4.3 - Добиваем приёмку

## **1) Быстрый приёмочный прогон (5 минут)**

### **0) ENV на проде (оба домена/Beget):**
```bash
export INTERNAL_USAGE_KEY='<тот_же_что_в .env>'
export NEXT_PUBLIC_APP_VERSION=0.4.3
```

### **1) Сборка/рестарт (если нода вручную):**
```bash
npm run build && npm start
```

### **2) E2E смоук:**
```bash
npm run test:e2e
```

### **3) Проверка авто-логгера (middleware → /api/_usage):**
```bash
# сделаем пару публичных запросов (они должны залогироваться):
curl -s https://getlifeundo.com/api/public/pricing >/dev/null
curl -s https://getlifeundo.com/status >/dev/null
```

### **4) Сводка usage:**
```bash
curl -s -u admin:****** https://getlifeundo.com/api/admin/usage/summary | jq
```

### **5) Временной ряд (7 дней):**
```bash
curl -s -u admin:****** "https://getlifeundo.com/api/admin/usage/timeseries?days=7" | jq
```

**Ожидаем в `/api/admin/usage/summary`:**
- `ok: true`, `total ≥ 2`
- в `byEndpoint` присутствует `"/api/public/pricing"` (и/или другие дергаемые роуты)

## **2) Ручная проверка UI админки**

- Открой `/admin` → видна ссылка **Usage дашборд** → график/таблица
- `/admin/status` → включи баннер → появился на `/status`
- `/admin/emails` → upsert шаблон и «Отправить тест» → письмо пришло

## **3) Финальные штрихи после «зелёного»**

- Cloudflare: Dev Mode **OFF**, 301 `www→apex`, Cache Rules: **Bypass** `/api/*`, `/admin*`
- Sentry: пометить релиз **0.4.3**
- SEO: `GET /robots.txt` и `/sitemap.xml` → 200
- `/status` показывает: **App version: 0.4.3**

## **4) Если usage не растёт (точечные фиксы)**

### **INTERNAL_USAGE_KEY:**
- Одно и то же значение в `.env` **и** в окружении на проде

### **Исключения в middleware:**
- Логер не пишет для `/api/_usage` и `/api/admin/*` — это нормально

### **DB-таблицы нет:**
- Прогнать `migrations/030_usage_events_optional.sql`

### **CORS/Origin:**
- Middleware шлёт на `${origin}/api/_usage` — на проде ок
- Если есть кастомные прокси — не переписывайте путь `/api/_usage`

## **5) Мини-rollback (если вдруг)**

- В `middleware.ts` временно закомментировать блок `fetch(.../api/_usage)` и пересобрать — система продолжит работать без авто-логов
- Эндпойнт `/api/_usage` можно оставить — он без ключа не примет запрос

## **🎯 ГОТОВО:**

**Хочешь — сразу прикручу /developers с реальными ссылками на SDK после публикации npm/PyPI и добавлю мини-чарт в usage (recharts). Скажи: «SDK + чарт — одним постом», и выдам патч! 🚀**

