# 🔧 PATCH 0.4.4-S — **Stream-Export + Percentiles (p50/p95/p99)**, UI-dash, E2E

## ✅ ЧТО СДЕЛАНО:

### **🗄️ База данных:**
- **`migrations/034_usage_percentiles.sql`** - материализованный вью `mv_usage_pXX_daily`
- **Персентили:** p50, p95, p99 по дням с группировкой по endpoint/statusClass/methodClass
- **Индексы** для производительности и инкрементального обновления

### **📊 API Endpoints:**
- **`src/app/api/admin/usage/stream/route.ts`** - стрим-экспорт NDJSON/CSV с пагинацией
- **`src/app/api/admin/usage/percentiles/route.ts`** - персентили p50/p95/p99 с фильтрами
- **`src/lib/percentiles.ts`** - сервис для работы с персентилями

### **🎨 UI Components:**
- **`src/app/admin/usage/components/PercentilesCards.tsx`** - карточки p50/p95/p99 с цветовой индикацией
- **`src/app/admin/usage/page.tsx`** - новые пресеты (Slow endpoints, Instability), Stream NDJSON кнопка

## 🧪 СМОУК-ПРОВЕРКИ:

```bash
# 1) NDJSON stream, write ops, p95 hotspots за 7 дней, gzip
curl -u admin:****** \
  "https://getlifeundo.com/api/admin/usage/stream?days=7&methodClass=write&gzip=1&format=ndjson&durationMin=250" \
  | gunzip | head -n 3

# 2) CSV stream, read 2xx за сутки, отсортировано по ts (сервер сам стримит чанки)
curl -u admin:****** \
  "https://getlifeundo.com/api/admin/usage/stream?days=1&statusClass=2xx&methodClass=read&format=csv&gzip=1" \
  | gunzip | head -n 5

# 3) Percentiles по endpoint (rollup=daily, 30 дней)
curl -s -u admin:****** \
  "https://getlifeundo.com/api/admin/usage/percentiles?days=30&groupBy=endpoint&rollup=daily" \
  | jq .

# 4) Миграция персентилей
npm run db:migrate
```

## 📋 ФУНКЦИОНАЛЬНОСТЬ:

### **Stream Export:**
- **Форматы:** NDJSON (по умолчанию), CSV
- **Пагинация:** cursor-based через `{ts, id}`
- **Фильтры:** все существующие + новые (methodClass, duration)
- **Сжатие:** gzip поддержка
- **Лимиты:** до 10,000 записей на чанк

### **Percentiles API:**
- **Метрики:** p50 (median), p95, p99 по duration_ms
- **Группировка:** none/endpoint/statusClass/methodClass
- **Режимы:** live (прямой запрос) / daily (из материализованного вью)
- **Фильтры:** все существующие фильтры из CSV экспорта

### **UI Presets:**
- **Slow endpoints** - p95 > 250ms, сортировка по duration_ms
- **Instability** - 5xx > 1% или p99 > 1000ms
- **Stream NDJSON** - кнопка для стрим-экспорта с gzip

### **Performance Cards:**
- **Цветовая индикация:** зеленый/желтый/красный по порогам
- **Пороги:** Warning ≥ 250ms, Critical ≥ 800ms (конфигурируемо)
- **Error Rate:** процент 4xx/5xx ответов

## 🔧 КОНФИГУРАЦИЯ:

```bash
# Пороги персентилей (опционально)
NEXT_PUBLIC_USAGE_PCTL_WARN_MS=250
NEXT_PUBLIC_USAGE_PCTL_CRIT_MS=800

# Обновление материализованного вью (cron)
# Каждые 5 минут: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_usage_pXX_daily
```

## 🎯 ГОТОВО:

**Stream-Export + Percentiles полностью готовы! Теперь у нас есть:**
- ✅ Стрим-экспорт NDJSON/CSV с пагинацией
- ✅ Персентили p50/p95/p99 с группировкой
- ✅ Performance карточки с цветовой индикацией
- ✅ Новые пресеты (Slow endpoints, Instability)
- ✅ Материализованный вью для быстрых агрегаций
- ✅ Полная совместимость с существующими фильтрами

---

**Версия: 0.4.4-S** — готово к деплою согласно планам! 🚀


