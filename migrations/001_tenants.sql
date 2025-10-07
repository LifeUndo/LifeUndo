-- White-Label: Multi-tenant support
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  theme JSONB DEFAULT '{}',
  favicon_url VARCHAR(255),
  primary_color VARCHAR(7) DEFAULT '#0066CC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE tenant_domains (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add tenant_id to existing tables
ALTER TABLE licenses ADD COLUMN tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL;
ALTER TABLE api_keys ADD COLUMN tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL;
ALTER TABLE webhooks ADD COLUMN tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL;

-- Create default tenant
INSERT INTO tenants (slug, name, theme, primary_color) 
VALUES ('default', 'GetLifeUndo', '{"logo":"/logo.png","brand":"LifeUndo"}', '#0066CC');

-- Indexes for performance
CREATE INDEX idx_tenant_domains_domain ON tenant_domains(domain);
CREATE INDEX idx_licenses_tenant_id ON licenses(tenant_id);
CREATE INDEX idx_api_keys_tenant_id ON api_keys(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);




















