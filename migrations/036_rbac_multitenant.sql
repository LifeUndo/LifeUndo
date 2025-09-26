-- RBAC Multi-tenant: роли, организации, API-ключи, квоты, аудит
CREATE TYPE org_type AS ENUM ('internal', 'partner', 'customer');
CREATE TYPE membership_role AS ENUM ('admin', 'operator', 'auditor', 'partner', 'viewer');
CREATE TYPE membership_status AS ENUM ('active', 'invited', 'disabled');
CREATE TYPE actor_type AS ENUM ('user', 'api');
CREATE TYPE quota_window AS ENUM ('minute', 'hour', 'day', 'month');

-- Организации (тенанты)
CREATE TABLE IF NOT EXISTS orgs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type org_type NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  branding_theme_id uuid
);

-- Пользователи (расширение существующей таблицы если есть)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Участники организаций
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role membership_role NOT NULL,
  invited_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status membership_status NOT NULL DEFAULT 'active',
  UNIQUE(org_id, user_id)
);

-- API-ключи
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash char(64) NOT NULL,
  scopes text[] NOT NULL DEFAULT '{}',
  rate_limit_per_min int NOT NULL DEFAULT 120,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  UNIQUE(org_id, name)
);

-- Квоты/лимиты
CREATE TABLE IF NOT EXISTS quotas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name text NOT NULL,
  "limit" int NOT NULL,
  window quota_window NOT NULL,
  reset_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, name)
);

-- Аудит (расширение существующей таблицы если есть)
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  actor_type actor_type NOT NULL,
  actor_id text NOT NULL, -- user_id или api_key_id
  action text NOT NULL,
  target_type text,
  target_id text,
  ip text,
  user_agent text,
  ts timestamptz NOT NULL DEFAULT now(),
  meta jsonb
);

-- Брендинг (white-label)
CREATE TABLE IF NOT EXISTS branding_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  logo_url text,
  accent_color text DEFAULT '#3B82F6',
  dark_mode boolean NOT NULL DEFAULT false,
  footer_html text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id)
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_delivery_at timestamptz,
  last_delivery_status text,
  last_delivery_error text
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS memberships_org_user_idx ON memberships(org_id, user_id);
CREATE INDEX IF NOT EXISTS memberships_user_idx ON memberships(user_id);
CREATE INDEX IF NOT EXISTS memberships_role_idx ON memberships(role);
CREATE INDEX IF NOT EXISTS memberships_status_idx ON memberships(status);

CREATE INDEX IF NOT EXISTS api_keys_org_idx ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS api_keys_hash_idx ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS api_keys_revoked_idx ON api_keys(revoked_at) WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS quotas_org_name_idx ON quotas(org_id, name);
CREATE INDEX IF NOT EXISTS quotas_reset_at_idx ON quotas(reset_at) WHERE reset_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS audit_log_org_ts_idx ON audit_log(org_id, ts DESC);
CREATE INDEX IF NOT EXISTS audit_log_actor_idx ON audit_log(actor_type, actor_id);
CREATE INDEX IF NOT EXISTS audit_log_action_idx ON audit_log(action);

CREATE INDEX IF NOT EXISTS branding_themes_org_idx ON branding_themes(org_id);
CREATE INDEX IF NOT EXISTS webhooks_org_active_idx ON webhooks(org_id, is_active);
CREATE INDEX IF NOT EXISTS webhooks_events_idx ON webhooks USING GIN(events);

-- Функции для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orgs_updated_at
  BEFORE UPDATE ON orgs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER quotas_updated_at
  BEFORE UPDATE ON quotas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER branding_themes_updated_at
  BEFORE UPDATE ON branding_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Добавляем org_id к существующим таблицам (если нужно)
DO $$ 
BEGIN
  -- Добавляем org_id к usage_events если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usage_events' AND column_name = 'org_id') THEN
    ALTER TABLE usage_events ADD COLUMN org_id uuid REFERENCES orgs(id) ON DELETE CASCADE;
    UPDATE usage_events SET org_id = (SELECT id FROM orgs WHERE slug = 'default' LIMIT 1) WHERE org_id IS NULL;
    ALTER TABLE usage_events ALTER COLUMN org_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS usage_events_org_idx ON usage_events(org_id);
  END IF;

  -- Добавляем org_id к email_outbox если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'org_id') THEN
    ALTER TABLE email_outbox ADD COLUMN org_id uuid REFERENCES orgs(id) ON DELETE CASCADE;
    UPDATE email_outbox SET org_id = (SELECT id FROM orgs WHERE slug = 'default' LIMIT 1) WHERE org_id IS NULL;
    ALTER TABLE email_outbox ALTER COLUMN org_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS email_outbox_org_idx ON email_outbox(org_id);
  END IF;

  -- Добавляем org_id к tenant_api_keys если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenant_api_keys' AND column_name = 'org_id') THEN
    ALTER TABLE tenant_api_keys ADD COLUMN org_id uuid REFERENCES orgs(id) ON DELETE CASCADE;
    UPDATE tenant_api_keys SET org_id = (SELECT id FROM orgs WHERE slug = 'default' LIMIT 1) WHERE org_id IS NULL;
    ALTER TABLE tenant_api_keys ALTER COLUMN org_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS tenant_api_keys_org_idx ON tenant_api_keys(org_id);
  END IF;
END $$;

-- Создаем дефолтную организацию если её нет
INSERT INTO orgs (id, name, slug, type) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Organization', 'default', 'internal')
ON CONFLICT (slug) DO NOTHING;

-- Создаем дефолтные квоты
INSERT INTO quotas (org_id, name, "limit", window, reset_at)
SELECT 
  id,
  'emails_per_day',
  500,
  'day'::quota_window,
  date_trunc('day', now() + interval '1 day')
FROM orgs WHERE slug = 'default'
ON CONFLICT (org_id, name) DO NOTHING;

INSERT INTO quotas (org_id, name, "limit", window, reset_at)
SELECT 
  id,
  'api_reads_per_min',
  120,
  'minute'::quota_window,
  date_trunc('minute', now() + interval '1 minute')
FROM orgs WHERE slug = 'default'
ON CONFLICT (org_id, name) DO NOTHING;

