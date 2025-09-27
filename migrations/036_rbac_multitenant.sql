-- RBAC Multi-tenant: роли, организации, API-ключи, квоты, аудит
DO $$ BEGIN
    CREATE TYPE org_type AS ENUM ('internal', 'partner', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_role AS ENUM ('admin', 'operator', 'auditor', 'partner', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_status AS ENUM ('active', 'invited', 'disabled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE actor_type AS ENUM ('user', 'api');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quota_window AS ENUM ('minute', 'hour', 'day', 'month');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
-- Добавляем недостающие колонки к существующей таблице users
DO $$ 
BEGIN
  -- Добавляем is_active если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
    ALTER TABLE users ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
  
  -- Добавляем updated_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
    ALTER TABLE users ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Участники организаций
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role membership_role NOT NULL,
  invited_by integer REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status membership_status NOT NULL DEFAULT 'active',
  UNIQUE(org_id, user_id)
);

-- API-ключи (расширение существующей таблицы)
-- Добавляем недостающие колонки к существующей таблице api_keys
DO $$ 
BEGIN
  -- Добавляем org_id если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'org_id') THEN
    ALTER TABLE api_keys ADD COLUMN org_id uuid REFERENCES orgs(id) ON DELETE CASCADE;
    UPDATE api_keys SET org_id = (SELECT id FROM orgs WHERE slug = 'default' LIMIT 1) WHERE org_id IS NULL;
    ALTER TABLE api_keys ALTER COLUMN org_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS api_keys_org_idx ON api_keys(org_id);
  END IF;
  
  -- Добавляем scopes если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'scopes') THEN
    ALTER TABLE api_keys ADD COLUMN scopes text[] NOT NULL DEFAULT '{}';
  END IF;
  
  -- Добавляем rate_limit_per_min если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'rate_limit_per_min') THEN
    ALTER TABLE api_keys ADD COLUMN rate_limit_per_min int NOT NULL DEFAULT 120;
  END IF;
  
  -- Добавляем last_used_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'last_used_at') THEN
    ALTER TABLE api_keys ADD COLUMN last_used_at timestamptz;
  END IF;
  
  -- Переименовываем revoked в revoked_at если нужно
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'revoked') THEN
    ALTER TABLE api_keys RENAME COLUMN revoked TO revoked_at;
  END IF;
  
  -- Переименовываем hash в key_hash если нужно
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'hash') THEN
    ALTER TABLE api_keys RENAME COLUMN hash TO key_hash;
  END IF;
END $$;

-- Квоты/лимиты
CREATE TABLE IF NOT EXISTS quotas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name text NOT NULL,
  "limit" int NOT NULL,
  "window" quota_window NOT NULL,
  reset_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, name, "window")
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

-- Webhooks (расширение существующей таблицы)
-- Добавляем недостающие колонки к существующей таблице webhooks
DO $$ 
BEGIN
  -- Добавляем org_id если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'org_id') THEN
    ALTER TABLE webhooks ADD COLUMN org_id uuid REFERENCES orgs(id) ON DELETE CASCADE;
    UPDATE webhooks SET org_id = (SELECT id FROM orgs WHERE slug = 'default' LIMIT 1) WHERE org_id IS NULL;
    ALTER TABLE webhooks ALTER COLUMN org_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS webhooks_org_idx ON webhooks(org_id);
  END IF;
  
  -- Добавляем url если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'url') THEN
    ALTER TABLE webhooks ADD COLUMN url text NOT NULL DEFAULT '';
  END IF;
  
  -- Добавляем secret если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'secret') THEN
    ALTER TABLE webhooks ADD COLUMN secret text NOT NULL DEFAULT '';
  END IF;
  
  -- Добавляем events если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'events') THEN
    ALTER TABLE webhooks ADD COLUMN events text[] NOT NULL DEFAULT '{}';
  END IF;
  
  -- Добавляем is_active если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'is_active') THEN
    ALTER TABLE webhooks ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
  
  -- Добавляем created_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'created_at') THEN
    ALTER TABLE webhooks ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
  
  -- Добавляем updated_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'updated_at') THEN
    ALTER TABLE webhooks ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
  
  -- Добавляем last_delivery_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'last_delivery_at') THEN
    ALTER TABLE webhooks ADD COLUMN last_delivery_at timestamptz;
  END IF;
  
  -- Добавляем last_delivery_status если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'last_delivery_status') THEN
    ALTER TABLE webhooks ADD COLUMN last_delivery_status text;
  END IF;
  
  -- Добавляем last_delivery_error если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhooks' AND column_name = 'last_delivery_error') THEN
    ALTER TABLE webhooks ADD COLUMN last_delivery_error text;
  END IF;
END $$;

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

DROP TRIGGER IF EXISTS orgs_updated_at ON orgs;
CREATE TRIGGER orgs_updated_at
  BEFORE UPDATE ON orgs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS memberships_updated_at ON memberships;
CREATE TRIGGER memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS quotas_updated_at ON quotas;
CREATE TRIGGER quotas_updated_at
  BEFORE UPDATE ON quotas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS branding_themes_updated_at ON branding_themes;
CREATE TRIGGER branding_themes_updated_at
  BEFORE UPDATE ON branding_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS webhooks_updated_at ON webhooks;
CREATE TRIGGER webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Переименовываем tenant_id в org_id в существующих таблицах
DO $$ 
BEGIN
  -- Переименовываем tenant_id в org_id в email_outbox если есть tenant_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'tenant_id') THEN
    -- Сначала удаляем внешний ключ
    ALTER TABLE email_outbox DROP CONSTRAINT IF EXISTS email_outbox_tenant_id_fkey;
    -- Переименовываем колонку
    ALTER TABLE email_outbox RENAME COLUMN tenant_id TO org_id;
    -- Создаем новый внешний ключ
    ALTER TABLE email_outbox ADD CONSTRAINT email_outbox_org_id_fkey FOREIGN KEY (org_id) REFERENCES orgs(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS email_outbox_org_idx ON email_outbox(org_id);
  END IF;
  
  -- Переименовываем tenant_id в org_id в email_rules если есть tenant_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_rules' AND column_name = 'tenant_id') THEN
    -- Сначала удаляем внешний ключ
    ALTER TABLE email_rules DROP CONSTRAINT IF EXISTS email_rules_tenant_id_fkey;
    -- Переименовываем колонку
    ALTER TABLE email_rules RENAME COLUMN tenant_id TO org_id;
    -- Создаем новый внешний ключ
    ALTER TABLE email_rules ADD CONSTRAINT email_rules_org_id_fkey FOREIGN KEY (org_id) REFERENCES orgs(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS email_rules_org_idx ON email_rules(org_id);
  END IF;
END $$;

-- Создаем дефолтную организацию если её нет
INSERT INTO orgs (id, name, slug, type) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Organization', 'default', 'internal')
ON CONFLICT (slug) DO NOTHING;

-- Создаем дефолтные квоты
INSERT INTO quotas (org_id, name, "limit", "window", reset_at)
SELECT 
  id,
  'emails_per_day',
  500,
  'day'::quota_window,
  date_trunc('day', now() + interval '1 day')
FROM orgs 
WHERE slug = 'default' 
  AND NOT EXISTS (SELECT 1 FROM quotas WHERE org_id = orgs.id AND name = 'emails_per_day');

INSERT INTO quotas (org_id, name, "limit", "window", reset_at)
SELECT 
  id,
  'api_reads_per_min',
  120,
  'minute'::quota_window,
  date_trunc('minute', now() + interval '1 minute')
FROM orgs 
WHERE slug = 'default' 
  AND NOT EXISTS (SELECT 1 FROM quotas WHERE org_id = orgs.id AND name = 'api_reads_per_min');


