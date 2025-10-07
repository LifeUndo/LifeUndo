-- Creator Program Database Migration
-- Version: 1.0
-- Date: 2025-10-06

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    channel_url TEXT NOT NULL,
    socials TEXT,
    country VARCHAR(2) NOT NULL,
    language VARCHAR(5) NOT NULL,
    audience_size VARCHAR(20) NOT NULL,
    desired_promocode VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending_verification',
    payout_method VARCHAR(20) DEFAULT 'manual',
    payout_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT
);

-- Creator campaigns (promo codes)
CREATE TABLE IF NOT EXISTS creator_campaigns (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    commission_scheme VARCHAR(20) NOT NULL, -- '6m' or '12m'
    cap_amount INTEGER, -- Optional spending cap
    active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Click tracking
CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES creator_campaigns(id) ON DELETE CASCADE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_lang VARCHAR(5),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES creator_campaigns(id) ON DELETE CASCADE,
    order_id VARCHAR(100) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    amount_rub DECIMAL(10,2) NOT NULL,
    coupon_code VARCHAR(50),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_lang VARCHAR(5),
    country VARCHAR(2),
    status VARCHAR(20) DEFAULT 'completed', -- completed, refunded, chargeback
    converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_amount DECIMAL(10,2)
);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    amount_rub DECIMAL(10,2) NOT NULL,
    method VARCHAR(20) NOT NULL, -- 'manual', 'fk', 'usdt'
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    payment_details JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents versioning
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    locale VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    url TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(slug, version, locale)
);

-- Country price floors for anti-arbitrage
CREATE TABLE IF NOT EXISTS country_price_floors (
    id SERIAL PRIMARY KEY,
    country VARCHAR(2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    floor_amount DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country, currency)
);

-- FX rates for multi-currency display
CREATE TABLE IF NOT EXISTS fx_rates (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency, DATE(fetched_at))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_creators_email ON creators(email);
CREATE INDEX IF NOT EXISTS idx_creators_status ON creators(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_code ON creator_campaigns(code);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON creator_campaigns(active);
CREATE INDEX IF NOT EXISTS idx_clicks_creator_id ON clicks(creator_id);
CREATE INDEX IF NOT EXISTS idx_clicks_campaign_id ON clicks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_conversions_creator_id ON conversions(creator_id);
CREATE INDEX IF NOT EXISTS idx_conversions_campaign_id ON conversions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON conversions(converted_at);
CREATE INDEX IF NOT EXISTS idx_payouts_creator_id ON payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_period ON payouts(period_start, period_end);

-- Insert default data
INSERT INTO country_price_floors (country, currency, floor_amount) VALUES
('US', 'USD', 5.00),
('IN', 'INR', 400.00),
('CN', 'CNY', 35.00),
('AE', 'AED', 18.00),
('RU', 'RUB', 300.00)
ON CONFLICT (country, currency) DO NOTHING;

-- Insert default documents
INSERT INTO documents (slug, version, locale, title, content) VALUES
('partner-offer', '1.0', 'en', 'Partner Offer', 'Partner Offer content...'),
('partner-offer', '1.0', 'ru', 'Партнёрская оферта', 'Содержимое партнёрской оферты...'),
('program-policy', '1.0', 'en', 'Program Policy', 'Program Policy content...'),
('program-policy', '1.0', 'ru', 'Политика программы', 'Содержимое политики программы...')
ON CONFLICT (slug, version, locale) DO NOTHING;



