-- Billing Core: планы, подписки, квоты, инвойсы, usage counters
DO $$ BEGIN
    CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'void');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Планы (расширение существующей таблицы)
-- Добавляем недостающие колонки к существующей таблице plans
DO $$ 
BEGIN
  -- Добавляем name если его нет (переименовываем title в name)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'title') THEN
    ALTER TABLE plans RENAME COLUMN title TO name;
  END IF;
  
  -- Добавляем description если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'description') THEN
    ALTER TABLE plans ADD COLUMN description text;
  END IF;
  
  -- Добавляем price_cents если его нет (переименовываем amount в price_cents)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'amount') THEN
    ALTER TABLE plans RENAME COLUMN amount TO price_cents;
  END IF;
  
  -- Добавляем billing_cycle если его нет (переименовываем period в billing_cycle)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'period') THEN
    ALTER TABLE plans RENAME COLUMN period TO billing_cycle;
  END IF;
  
  -- Добавляем is_active если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'is_active') THEN
    ALTER TABLE plans ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
  
  -- Добавляем features если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'features') THEN
    ALTER TABLE plans ADD COLUMN features jsonb NOT NULL DEFAULT '{}';
  END IF;
  
  -- Добавляем created_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'created_at') THEN
    ALTER TABLE plans ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
  
  -- Добавляем updated_at если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'updated_at') THEN
    ALTER TABLE plans ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Подписки организаций
CREATE TABLE IF NOT EXISTS org_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  plan_id integer NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  trial_end timestamptz,
  grace_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id) -- одна активная подписка на org
);

-- Квоты планов
CREATE TABLE IF NOT EXISTS plan_quotas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id integer NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  name text NOT NULL,
  "limit" int NOT NULL,
  "window" quota_window NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id, name, "window")
);

-- Инвойсы
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES org_subscriptions(id),
  invoice_number text UNIQUE NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  subtotal_cents int NOT NULL DEFAULT 0,
  discount_cents int NOT NULL DEFAULT 0,
  tax_cents int NOT NULL DEFAULT 0,
  total_cents int NOT NULL DEFAULT 0,
  status invoice_status NOT NULL DEFAULT 'draft',
  issued_at timestamptz,
  paid_at timestamptz,
  external_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Строки инвойсов
CREATE TABLE IF NOT EXISTS invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  sku text NOT NULL,
  description text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_cents int NOT NULL DEFAULT 0,
  amount_cents int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Usage counters для биллинга
CREATE TABLE IF NOT EXISTS usage_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  counter text NOT NULL,
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  value bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, counter, window_start, window_end)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS plans_code_idx ON plans(code);
CREATE INDEX IF NOT EXISTS plans_active_idx ON plans(is_active);

CREATE INDEX IF NOT EXISTS org_subscriptions_org_idx ON org_subscriptions(org_id);
CREATE INDEX IF NOT EXISTS org_subscriptions_plan_idx ON org_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS org_subscriptions_status_idx ON org_subscriptions(status);
CREATE INDEX IF NOT EXISTS org_subscriptions_period_end_idx ON org_subscriptions(current_period_end);

CREATE INDEX IF NOT EXISTS plan_quotas_plan_idx ON plan_quotas(plan_id);
CREATE INDEX IF NOT EXISTS plan_quotas_name_window_idx ON plan_quotas(name, "window");

CREATE INDEX IF NOT EXISTS invoices_org_idx ON invoices(org_id);
CREATE INDEX IF NOT EXISTS invoices_subscription_idx ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_period_idx ON invoices(period_start, period_end);
CREATE INDEX IF NOT EXISTS invoices_number_idx ON invoices(invoice_number);

CREATE INDEX IF NOT EXISTS invoice_lines_invoice_idx ON invoice_lines(invoice_id);

CREATE INDEX IF NOT EXISTS usage_counters_org_counter_idx ON usage_counters(org_id, counter);
CREATE INDEX IF NOT EXISTS usage_counters_window_idx ON usage_counters(window_start, window_end);
CREATE INDEX IF NOT EXISTS usage_counters_org_window_idx ON usage_counters(org_id, window_start, window_end);

-- Функции для обновления updated_at
DROP TRIGGER IF EXISTS plans_updated_at ON plans;
CREATE TRIGGER plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS org_subscriptions_updated_at ON org_subscriptions;
CREATE TRIGGER org_subscriptions_updated_at
  BEFORE UPDATE ON org_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS invoices_updated_at ON invoices;
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS usage_counters_updated_at ON usage_counters;
CREATE TRIGGER usage_counters_updated_at
  BEFORE UPDATE ON usage_counters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Функция для генерации номера инвойса
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS text AS $$
DECLARE
  year_part text;
  month_part text;
  seq_part text;
  invoice_num text;
BEGIN
  year_part := to_char(now(), 'YYYY');
  month_part := to_char(now(), 'MM');
  
  -- Получаем следующий номер в месяце
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS int)), 0) + 1
  INTO seq_part
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || year_part || month_part || '-%';
  
  invoice_num := 'INV-' || year_part || month_part || '-' || LPAD(seq_part::text, 4, '0');
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Функция для проверки квоты
CREATE OR REPLACE FUNCTION check_quota(
  org_id_param uuid,
  quota_name_param text,
  quota_window_param quota_window
) RETURNS TABLE (
  allowed boolean,
  limit_value int,
  current_value bigint,
  usage_percent numeric
) AS $$
DECLARE
  plan_limit int;
  current_usage bigint;
  window_start_ts timestamptz;
  window_end_ts timestamptz;
BEGIN
  -- Получаем лимит из плана
  SELECT pq.limit INTO plan_limit
  FROM org_subscriptions os
  JOIN plan_quotas pq ON os.plan_id = pq.plan_id
  WHERE os.org_id = org_id_param 
    AND os.status = 'active'
    AND pq.name = quota_name_param
    AND pq.window = quota_window_param;
  
  IF plan_limit IS NULL THEN
    RETURN QUERY SELECT true, 999999999, 0::bigint, 0::numeric;
    RETURN;
  END IF;
  
  -- Вычисляем окно
  CASE quota_window_param
    WHEN 'minute' THEN
      window_start_ts := date_trunc('minute', now());
      window_end_ts := window_start_ts + interval '1 minute';
    WHEN 'hour' THEN
      window_start_ts := date_trunc('hour', now());
      window_end_ts := window_start_ts + interval '1 hour';
    WHEN 'day' THEN
      window_start_ts := date_trunc('day', now());
      window_end_ts := window_start_ts + interval '1 day';
    WHEN 'month' THEN
      window_start_ts := date_trunc('month', now());
      window_end_ts := window_start_ts + interval '1 month';
  END CASE;
  
  -- Получаем текущее использование
  SELECT COALESCE(uc.value, 0) INTO current_usage
  FROM usage_counters uc
  WHERE uc.org_id = org_id_param
    AND uc.counter = quota_name_param
    AND uc.window_start = window_start_ts
    AND uc.window_end = window_end_ts;
  
  RETURN QUERY SELECT 
    current_usage < plan_limit,
    plan_limit,
    current_usage,
    CASE WHEN plan_limit > 0 THEN ROUND((current_usage::numeric / plan_limit::numeric) * 100, 2) ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Функция для инкремента usage counter
CREATE OR REPLACE FUNCTION increment_usage_counter(
  org_id_param uuid,
  counter_param text,
  window_param quota_window,
  increment_value bigint DEFAULT 1
) RETURNS void AS $$
DECLARE
  window_start_ts timestamptz;
  window_end_ts timestamptz;
BEGIN
  -- Вычисляем окно
  CASE window_param
    WHEN 'minute' THEN
      window_start_ts := date_trunc('minute', now());
      window_end_ts := window_start_ts + interval '1 minute';
    WHEN 'hour' THEN
      window_start_ts := date_trunc('hour', now());
      window_end_ts := window_start_ts + interval '1 hour';
    WHEN 'day' THEN
      window_start_ts := date_trunc('day', now());
      window_end_ts := window_start_ts + interval '1 day';
    WHEN 'month' THEN
      window_start_ts := date_trunc('month', now());
      window_end_ts := window_start_ts + interval '1 month';
  END CASE;
  
  -- Инкрементируем или создаем запись
  INSERT INTO usage_counters (org_id, counter, window_start, window_end, value)
  VALUES (org_id_param, counter_param, window_start_ts, window_end_ts, increment_value)
  ON CONFLICT (org_id, counter, window_start, window_end)
  DO UPDATE SET 
    value = usage_counters.value + increment_value,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Создаем базовые планы
INSERT INTO plans (code, name, description, price_cents, currency, billing_cycle, features) VALUES
('FREE', 'Free Plan', 'Perfect for getting started', 0, 'USD', 'monthly', '{"priority_support": false, "sso_allowed": false, "webhook_premium": false, "white_label_full": false}'),
('PRO', 'Pro Plan', 'For growing businesses', 900, 'USD', 'monthly', '{"priority_support": true, "sso_allowed": false, "webhook_premium": true, "white_label_full": false}'),
('TEAM', 'Team Plan', 'For teams and organizations', 2900, 'USD', 'monthly', '{"priority_support": true, "sso_allowed": true, "webhook_premium": true, "white_label_full": true}'),
('VIP', 'VIP Plan', 'Enterprise features and support', 9900, 'USD', 'monthly', '{"priority_support": true, "sso_allowed": true, "webhook_premium": true, "white_label_full": true}')
ON CONFLICT (code) DO NOTHING;

-- Создаем квоты для планов
-- FREE Plan
INSERT INTO plan_quotas (plan_id, name, "limit", "window") VALUES
((SELECT id FROM plans WHERE code = 'FREE'), 'emails_per_day', 50, 'day'),
((SELECT id FROM plans WHERE code = 'FREE'), 'api_reads_per_min', 60, 'minute'),
((SELECT id FROM plans WHERE code = 'FREE'), 'exports_per_day', 1, 'day'),
((SELECT id FROM plans WHERE code = 'FREE'), 'storage_mb_per_org', 250, 'month'),
((SELECT id FROM plans WHERE code = 'FREE'), 'seats', 1, 'month')
ON CONFLICT (plan_id, name, "window") DO NOTHING;

-- PRO Plan
INSERT INTO plan_quotas (plan_id, name, "limit", "window") VALUES
((SELECT id FROM plans WHERE code = 'PRO'), 'emails_per_day', 500, 'day'),
((SELECT id FROM plans WHERE code = 'PRO'), 'api_reads_per_min', 240, 'minute'),
((SELECT id FROM plans WHERE code = 'PRO'), 'exports_per_day', 10, 'day'),
((SELECT id FROM plans WHERE code = 'PRO'), 'storage_mb_per_org', 2048, 'month'),
((SELECT id FROM plans WHERE code = 'PRO'), 'seats', 3, 'month')
ON CONFLICT (plan_id, name, "window") DO NOTHING;

-- TEAM Plan
INSERT INTO plan_quotas (plan_id, name, "limit", "window") VALUES
((SELECT id FROM plans WHERE code = 'TEAM'), 'emails_per_day', 5000, 'day'),
((SELECT id FROM plans WHERE code = 'TEAM'), 'api_reads_per_min', 600, 'minute'),
((SELECT id FROM plans WHERE code = 'TEAM'), 'exports_per_day', 50, 'day'),
((SELECT id FROM plans WHERE code = 'TEAM'), 'storage_mb_per_org', 10240, 'month'),
((SELECT id FROM plans WHERE code = 'TEAM'), 'seats', 10, 'month')
ON CONFLICT (plan_id, name, "window") DO NOTHING;

-- VIP Plan
INSERT INTO plan_quotas (plan_id, name, "limit", "window") VALUES
((SELECT id FROM plans WHERE code = 'VIP'), 'emails_per_day', 25000, 'day'),
((SELECT id FROM plans WHERE code = 'VIP'), 'api_reads_per_min', 1800, 'minute'),
((SELECT id FROM plans WHERE code = 'VIP'), 'exports_per_day', 250, 'day'),
((SELECT id FROM plans WHERE code = 'VIP'), 'storage_mb_per_org', 102400, 'month'),
((SELECT id FROM plans WHERE code = 'VIP'), 'seats', 50, 'month')
ON CONFLICT (plan_id, name, "window") DO NOTHING;

-- Создаем подписки для существующих организаций (по умолчанию FREE)
INSERT INTO org_subscriptions (org_id, plan_id, status, current_period_start, current_period_end)
SELECT 
  id,
  (SELECT id FROM plans WHERE code = 'FREE'),
  'active',
  date_trunc('month', now()),
  date_trunc('month', now()) + interval '1 month'
FROM orgs
WHERE NOT EXISTS (
  SELECT 1 FROM org_subscriptions WHERE org_id = orgs.id
)
ON CONFLICT (org_id) DO NOTHING;


