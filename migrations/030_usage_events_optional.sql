-- Опционально: если ещё нет таблицы usage_events
CREATE TABLE IF NOT EXISTS usage_events (
  id bigserial PRIMARY KEY,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  ts timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_usage_events_tenant_ts ON usage_events(tenant_id, ts);
CREATE INDEX IF NOT EXISTS idx_usage_events_endpoint ON usage_events(endpoint);










