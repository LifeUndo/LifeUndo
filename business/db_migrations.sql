-- LifeUndo Database Migrations
-- Version: 0.4.9
-- Description: Full schema for subscriptions, newsletter system, admin panel

-- =============================================
-- CORE TABLES
-- =============================================

-- Users/Accounts (assuming this exists, if not create it)
-- CREATE TABLE accounts (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   display_name VARCHAR(255),
--   created_at TIMESTAMP DEFAULT now(),
--   updated_at TIMESTAMP DEFAULT now()
-- );

-- Subscriptions: подписки/триалы
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  plan VARCHAR(32) NOT NULL DEFAULT 'pro',
  status VARCHAR(20) NOT NULL DEFAULT 'trial', -- trial|active|past_due|canceled|expired
  auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
  trial_started_at TIMESTAMP,
  trial_ends_at TIMESTAMP,
  next_bill_at TIMESTAMP,
  current_period_end TIMESTAMP,
  payment_token VARCHAR(255), -- PSP token (never store PAN)
  card_brand VARCHAR(64),
  card_last4 VARCHAR(8),
  trial_consent_ts TIMESTAMP,
  trial_consent_ip VARCHAR(64),
  trial_consent_ua TEXT,
  grace_until TIMESTAMP,
  retries_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Payments: история платежей
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  amount INTEGER NOT NULL, -- в копейках
  currency VARCHAR(3) DEFAULT 'RUB',
  status VARCHAR(20) NOT NULL, -- pending|succeeded|failed|refunded|disputed
  psp_transaction_id VARCHAR(255),
  psp_payment_method_id VARCHAR(255),
  failure_reason TEXT,
  webhook_data JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Risk profiles: анти-абуз
CREATE TABLE risk_profiles (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  card_hash VARCHAR(255), -- SHA256 hash of card fingerprint
  fp_hash VARCHAR(255), -- browser fingerprint hash
  ip_hash VARCHAR(255), -- IP hash (/24 prefix)
  last_trial_at TIMESTAMP,
  trial_count INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 0, -- 0-100
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- =============================================
-- NEWSLETTER SYSTEM
-- =============================================

-- Newsletter templates (catalog)
CREATE TABLE newsletter_templates (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  locale VARCHAR(8) DEFAULT 'ru',
  tone VARCHAR(32) DEFAULT 'scary', -- scary|educational|neutral
  category VARCHAR(64),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Records which template sent to which user (to avoid duplicates)
CREATE TABLE newsletter_sent (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id),
  account_id INTEGER NOT NULL,
  template_id INTEGER NOT NULL REFERENCES newsletter_templates(id),
  sent_at TIMESTAMP DEFAULT now(),
  email_opened BOOLEAN DEFAULT FALSE,
  email_clicked BOOLEAN DEFAULT FALSE
);

-- Per-user schedule state (next_send_at, cadence etc)
CREATE TABLE newsletter_schedule (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  next_send_at TIMESTAMP,
  cadence_days INTEGER DEFAULT 30, -- monthly default
  cycle_started_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- =============================================
-- ADMIN SYSTEM
-- =============================================

-- Admin users
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(128),
  password_hash VARCHAR(255),
  roles TEXT, -- JSON array of roles: ['admin', 'support', 'finance']
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Admin grants (manual granting of subscriptions)
CREATE TABLE grants (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  granted_by_admin INTEGER NOT NULL REFERENCES admin_users(id),
  plan VARCHAR(32),
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  note TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Audit log for admin actions
CREATE TABLE admin_audit_log (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admin_users(id),
  action VARCHAR(64) NOT NULL, -- 'grant_subscription', 'cancel_subscription', 'send_newsletter'
  target_type VARCHAR(32), -- 'subscription', 'user', 'newsletter'
  target_id INTEGER,
  details JSONB,
  ip_address VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- =============================================
-- ANALYTICS & EVENTS
-- =============================================

-- Download events (who downloaded extension, from where)
CREATE TABLE download_events (
  id SERIAL PRIMARY KEY,
  account_id INTEGER,
  ip VARCHAR(64),
  user_agent TEXT,
  country VARCHAR(64),
  source VARCHAR(128), -- 'amo-unlisted', 'site', 'telegram', 'referral'
  referrer VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

-- Extension install events
CREATE TABLE install_events (
  id SERIAL PRIMARY KEY,
  account_id INTEGER,
  extension_version VARCHAR(32),
  browser_version VARCHAR(64),
  os VARCHAR(64),
  country VARCHAR(64),
  created_at TIMESTAMP DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_account_id ON subscriptions(account_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_ends_at ON subscriptions(trial_ends_at);
CREATE INDEX idx_subscriptions_next_bill_at ON subscriptions(next_bill_at);

-- Payments indexes
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Risk profiles indexes
CREATE INDEX idx_risk_profiles_account_id ON risk_profiles(account_id);
CREATE INDEX idx_risk_profiles_card_hash ON risk_profiles(card_hash);
CREATE INDEX idx_risk_profiles_fp_hash ON risk_profiles(fp_hash);

-- Newsletter indexes
CREATE INDEX idx_newsletter_templates_locale ON newsletter_templates(locale);
CREATE INDEX idx_newsletter_templates_active ON newsletter_templates(is_active);
CREATE INDEX idx_newsletter_sent_account_id ON newsletter_sent(account_id);
CREATE INDEX idx_newsletter_sent_template_id ON newsletter_sent(template_id);
CREATE INDEX idx_newsletter_sent_sent_at ON newsletter_sent(sent_at);
CREATE INDEX idx_newsletter_schedule_account_id ON newsletter_schedule(account_id);
CREATE INDEX idx_newsletter_schedule_next_send_at ON newsletter_schedule(next_send_at);
CREATE INDEX idx_newsletter_schedule_active ON newsletter_schedule(active);

-- Admin indexes
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_grants_account_id ON grants(account_id);
CREATE INDEX idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- Events indexes
CREATE INDEX idx_download_events_account_id ON download_events(account_id);
CREATE INDEX idx_download_events_source ON download_events(source);
CREATE INDEX idx_download_events_created_at ON download_events(created_at);
CREATE INDEX idx_install_events_account_id ON install_events(account_id);
CREATE INDEX idx_install_events_created_at ON install_events(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_profiles_updated_at BEFORE UPDATE ON risk_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_templates_updated_at BEFORE UPDATE ON newsletter_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_schedule_updated_at BEFORE UPDATE ON newsletter_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA
-- =============================================

-- Create default admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO admin_users (username, display_name, password_hash, roles) VALUES 
('admin', 'System Administrator', '$2b$10$rQZ8K9vXvQZ8K9vXvQZ8K9vXvQZ8K9vXvQZ8K9vXvQZ8K9vXvQZ8K9vX', '["admin"]');

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE subscriptions IS 'User subscriptions and trial management';
COMMENT ON TABLE payments IS 'Payment history and PSP webhook data';
COMMENT ON TABLE risk_profiles IS 'Anti-abuse: card/fingerprint tracking';
COMMENT ON TABLE newsletter_templates IS 'Email templates for retention campaigns';
COMMENT ON TABLE newsletter_sent IS 'Tracking sent newsletters to prevent duplicates';
COMMENT ON TABLE newsletter_schedule IS 'Per-user newsletter scheduling';
COMMENT ON TABLE admin_users IS 'Admin panel users and roles';
COMMENT ON TABLE grants IS 'Manual subscription grants by admins';
COMMENT ON TABLE admin_audit_log IS 'Audit trail for admin actions';
COMMENT ON TABLE download_events IS 'Extension download tracking';
COMMENT ON TABLE install_events IS 'Extension installation tracking';
