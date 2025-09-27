-- Email Pause Gateway: схема для перехвата и модерации исходящих писем
DO $$ BEGIN
    CREATE TYPE email_status AS ENUM ('HOLD', 'APPROVED', 'DENIED', 'SENT', 'FAILED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE email_action AS ENUM ('AUTO_HOLD', 'AUTO_ALLOW', 'AUTO_DENY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Основная таблица исходящих писем
CREATE TABLE IF NOT EXISTS email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Envelope
  "from" text NOT NULL,
  "to" text[] NOT NULL,
  cc text[] DEFAULT '{}',
  bcc text[] DEFAULT '{}',
  subject text NOT NULL,
  text_content text,
  html_content text,
  
  -- Status & Moderation
  status email_status NOT NULL DEFAULT 'HOLD',
  hold_reason text,
  expires_at timestamptz,
  approved_by uuid REFERENCES orgs(id),
  approved_at timestamptz,
  denied_by uuid REFERENCES orgs(id),
  denied_at timestamptz,
  
  -- Relay & Delivery
  relay_attempts int NOT NULL DEFAULT 0,
  last_error text,
  last_relay_at timestamptz,
  
  -- Deduplication
  message_id text UNIQUE,
  fingerprint char(64) NOT NULL, -- SHA-256 hash of content
  
  -- Tenant isolation
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE
);

-- Вложения
CREATE TABLE IF NOT EXISTS email_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outbox_id uuid NOT NULL REFERENCES email_outbox(id) ON DELETE CASCADE,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  storage_key text NOT NULL, -- путь в blob storage
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Правила автоматической модерации
CREATE TABLE IF NOT EXISTS email_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  name text NOT NULL,
  priority int NOT NULL DEFAULT 100,
  
  -- Matching conditions
  match_from text, -- ILIKE pattern
  match_to text,   -- ILIKE pattern  
  match_subject text, -- ILIKE pattern
  match_domain text, -- для to/cc/bcc
  max_recipients int,
  min_size_mb numeric,
  max_size_mb numeric,
  has_attachments boolean,
  
  -- Action
  action email_action NOT NULL,
  reason text NOT NULL,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS email_outbox_status_idx ON email_outbox(status);
CREATE INDEX IF NOT EXISTS email_outbox_created_at_idx ON email_outbox(created_at DESC);
CREATE INDEX IF NOT EXISTS email_outbox_expires_at_idx ON email_outbox(expires_at) WHERE status = 'HOLD';
CREATE INDEX IF NOT EXISTS email_outbox_from_created_idx ON email_outbox("from", created_at DESC);
CREATE INDEX IF NOT EXISTS email_outbox_org_status_idx ON email_outbox(org_id, status);
CREATE INDEX IF NOT EXISTS email_outbox_fingerprint_idx ON email_outbox(fingerprint);

CREATE INDEX IF NOT EXISTS email_attachments_outbox_idx ON email_attachments(outbox_id);
CREATE INDEX IF NOT EXISTS email_attachments_size_idx ON email_attachments(size_bytes DESC);

CREATE INDEX IF NOT EXISTS email_rules_org_enabled_idx ON email_rules(org_id, enabled, priority);
CREATE INDEX IF NOT EXISTS email_rules_priority_idx ON email_rules(priority);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_email_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_outbox_updated_at ON email_outbox;
CREATE TRIGGER email_outbox_updated_at
  BEFORE UPDATE ON email_outbox
  FOR EACH ROW EXECUTE FUNCTION update_email_updated_at();

DROP TRIGGER IF EXISTS email_rules_updated_at ON email_rules;
CREATE TRIGGER email_rules_updated_at
  BEFORE UPDATE ON email_rules
  FOR EACH ROW EXECUTE FUNCTION update_email_updated_at();

-- Функция для автоматического истечения HOLD писем
CREATE OR REPLACE FUNCTION expire_old_hold_emails()
RETURNS void AS $$
BEGIN
  UPDATE email_outbox 
  SET status = 'EXPIRED'
  WHERE status = 'HOLD' 
    AND expires_at IS NOT NULL 
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql;


