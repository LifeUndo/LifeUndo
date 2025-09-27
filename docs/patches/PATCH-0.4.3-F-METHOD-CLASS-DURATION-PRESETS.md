# 🔧 PATCH 0.4.3-F — **Method-Class фильтр + Duration (ms) + Presets в UI**

## ✅ ЧТО СДЕЛАНО:

### **🗄️ База данных:**
- **`migrations/033_usage_add_duration_ms.sql`** - добавлена колонка `duration_ms` в `usage_events`
- **Индекс** для быстрого поиска по длительности

### **⚡ Логирование длительности:**
- **`src/lib/with-usage.ts`** - хелпер для измерения времени обработки API
- **`src/app/api/_usage/route.ts`** - обновлён для записи `duration_ms`
- **Fire-and-forget** логирование без блокировки ответов

### **📊 CSV-экспорт с новыми фильтрами:**
- **`src/app/api/admin/usage/export/route.ts`** - добавлены `methodClass`, `durationMin`, `durationMax`
- **Новая колонка** `duration_ms` в экспорте
- **Фильтры по классам методов** (read/write/other)

### **🎨 UI с пресетами:**
- **`src/app/admin/usage/page.tsx`** - быстрые кнопки (2xx OK / 4xx Errors / 5xx Incidents / Write ops / Read ops)
- **Контролы** для methodClass и duration фильтров
- **Автоматическое включение** `duration_ms` в экспорт

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# Миграция
npm run db:migrate

# Быстрый экспорт: write-операции, 4xx/5xx только, duration >= 250ms, gzip, сортировка по duration
curl -I -u admin:****** \
  "https://getlifeundo.com/api/admin/usage/export?days=7&methodClass=write&statusClass=5xx&durationMin=250&sortBy=duration_ms&sortDir=desc&gzip=1&limit=50000"

# Read-операции 2xx за сутки, CSV без gzip, отсортировано по ts asc
curl -I -u admin:****** \
  "https://getlifeundo.com/api/admin/usage/export?days=1&methodClass=read&statusClass=2xx&sortBy=ts&sortDir=asc&limit=20000"

# Явный набор столбцов (без duration), точный период
curl -s -u admin:****** \
  "https://getlifeundo.com/api/admin/usage/export?from=2025-09-20T00:00:00Z&to=2025-09-25T23:59:59Z&columns=ts,endpoint,status&limit=1000" \
  | head -n 5
```

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **Новые фильтры CSV:**
- **Method-Class:** `methodClass` (read/write/other)
- **Duration:** `durationMin`, `durationMax` (миллисекунды)
- **Колонка:** `duration_ms` в экспорте

### **Пресеты в UI:**
- **2xx OK** - успешные ответы
- **4xx Errors** - ошибки клиента
- **5xx Incidents** - ошибки сервера
- **Write ops** - операции записи
- **Read ops** - операции чтения

### **Существующие фильтры:**
- **Временные:** `days`, `from`, `to`
- **Endpoint:** `endpoint` (=), `endpointLike` (ILIKE)
- **HTTP:** `method`, `status`, `statusMin`, `statusMax`
- **Статус-класс:** `statusClass` (2xx/3xx/4xx/5xx)
- **Сортировка:** `sortBy`, `sortDir`
- **Сжатие:** `gzip=1`
- **Лимиты:** `limit` (до 100,000)

## 🔧 ИСПОЛЬЗОВАНИЕ withUsage:

```typescript
// Пример оборачивания API эндпоинта
import { withUsage } from '@/src/lib/with-usage';

async function handler(req: NextRequest) {
  // ваш код
  return NextResponse.json(data);
}

export const GET = withUsage(handler);
```

## 🎯 ГОТОВО:

**Method-Class + Duration + Presets полностью готовы! Теперь у нас есть:**
- ✅ Фильтрация по классам методов (read/write/other)
- ✅ Измерение и фильтрация по длительности запросов
- ✅ Быстрые пресеты для частых сценариев
- ✅ Автоматическое логирование duration через withUsage
- ✅ Расширенный CSV экспорт с новыми полями

---

**Хочешь добавить стримовый экспорт (NDJSON/CSV stream) и агрегаты по percentiles (p50/p95/p99 по duration) прямо на дашборде? Скажи: «stream-export + percentiles — одним постом» 🚀**


