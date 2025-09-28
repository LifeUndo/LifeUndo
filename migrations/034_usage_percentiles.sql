-- Материализованный вью для персентилей p50/p95/p99
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_usage_pXX_daily AS
SELECT
  date_trunc('day', ts) AS d,
  COALESCE(endpoint, path, '') AS endpoint,
  CASE 
    WHEN COALESCE(status, 0) BETWEEN 200 AND 299 THEN '2xx'
    WHEN COALESCE(status, 0) BETWEEN 300 AND 399 THEN '3xx'
    WHEN COALESCE(status, 0) BETWEEN 400 AND 499 THEN '4xx'
    WHEN COALESCE(status, 0) BETWEEN 500 AND 599 THEN '5xx'
    ELSE 'other'
  END AS status_class,
  CASE 
    WHEN UPPER(COALESCE(method, '')) IN ('GET','HEAD','OPTIONS') THEN 'read'
    WHEN UPPER(COALESCE(method, '')) IN ('POST','PUT','PATCH','DELETE') THEN 'write'
    ELSE 'other'
  END AS method_class,
  COUNT(*) AS calls,
  percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
  percentile_cont(0.99) WITHIN GROUP (ORDER BY duration_ms) AS p99,
  COUNT(*) FILTER (WHERE COALESCE(status, 0) BETWEEN 400 AND 499) AS count_4xx,
  COUNT(*) FILTER (WHERE COALESCE(status, 0) BETWEEN 500 AND 599) AS count_5xx
FROM usage_events
WHERE duration_ms IS NOT NULL
GROUP BY 1, 2, 3, 4;

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS usage_events_performance_idx 
  ON usage_events (ts DESC, endpoint, status, method) INCLUDE (duration_ms);

CREATE UNIQUE INDEX IF NOT EXISTS mv_usage_pXX_daily_idx 
  ON mv_usage_pXX_daily (d DESC, endpoint, status_class, method_class);

-- Функция для инкрементального обновления
CREATE OR REPLACE FUNCTION refresh_usage_percentiles()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_usage_pXX_daily;
END;
$$ LANGUAGE plpgsql;



