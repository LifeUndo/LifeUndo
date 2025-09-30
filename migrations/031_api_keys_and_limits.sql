-- File: migrations/031_api_keys_and_limits.sql

-- Храним только ХЭШ ключа (SHA-256) + последние 4 символа
CREATE TABLE IF NOT EXISTS tenant_api_keys (
  id            bigserial PRIMARY KEY,
  tenant_id     uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_hash      text NOT NULL,
  last4         text NOT NULL,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_tenant ON tenant_api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_active ON tenant_api_keys(active);

-- Один активный ключ на арендатора (логикой обеспечим)
-- Лимит в месяц — на планах (fallback через ENV)
ALTER TABLE plans        ADD COLUMN IF NOT EXISTS monthly_limit int;
ALTER TABLE tenant_plans ADD COLUMN IF NOT EXISTS monthly_limit int;






