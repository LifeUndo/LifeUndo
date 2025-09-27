-- Пер-тенантные план-переопределения
CREATE TABLE IF NOT EXISTS tenant_plans (
  id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_code VARCHAR(40) NOT NULL,
  title VARCHAR(120),
  currency VARCHAR(8),
  amount INT,
  period VARCHAR(16),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Баннеры статуса для /status
CREATE TABLE IF NOT EXISTS status_banners (
  id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  active BOOLEAN NOT NULL DEFAULT false,
  title VARCHAR(160),
  message TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- E-mail шаблоны (подключим позже)
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key VARCHAR(64) NOT NULL,
  subject VARCHAR(160) NOT NULL,
  body_md TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Учёт использования публичного API (обновляем существующую таблицу)
ALTER TABLE api_usage RENAME COLUMN month TO ym;
ALTER TABLE api_usage ALTER COLUMN ym TYPE VARCHAR(7);

-- Индексы для производительности
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_usage_key_month
  ON api_usage (api_key_id, ym);
CREATE INDEX IF NOT EXISTS idx_tenant_plans_tenant_id ON tenant_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_status_banners_tenant_id ON status_banners(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_tenant_id ON email_templates(tenant_id);


