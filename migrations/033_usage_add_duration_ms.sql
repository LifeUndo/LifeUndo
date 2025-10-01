-- добавляем колонку для длительности ответа в миллисекундах
ALTER TABLE usage_events
ADD COLUMN IF NOT EXISTS duration_ms INTEGER NULL;
CREATE INDEX IF NOT EXISTS usage_events_duration_ms_idx
  ON usage_events (duration_ms);











