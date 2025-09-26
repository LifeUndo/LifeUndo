-- Example White-Label Tenant: ACME Corp
INSERT INTO tenants (slug, name, theme, primary_color) 
VALUES ('acme', 'ACME Corp', '{"logo":"/acme-logo.png","brand":"ACME","description":"ACME License Management System"}', '#FF5722')
ON CONFLICT (slug) DO NOTHING;

-- Add domain for ACME tenant
INSERT INTO tenant_domains (tenant_id, domain) 
SELECT t.id, 'acmeundo.example'
FROM tenants t
WHERE t.slug = 'acme'
ON CONFLICT (domain) DO NOTHING;

-- Create example API key for ACME tenant
INSERT INTO api_keys (name, hash, plan_code, tenant_id)
SELECT 'ACME Production Key', 
       'sha256_hash_of_api_key_here', 
       'pro', 
       t.id
FROM tenants t
WHERE t.slug = 'acme'
ON CONFLICT (hash) DO NOTHING;

-- Create example license for ACME tenant
INSERT INTO licenses (key, plan_code, issued_to, devices_limit, expires_at, tenant_id)
SELECT 'ACME-XXXX-YYYY-ZZZZ',
       'pro_y',
       'customer@acme.com',
       5,
       now() + interval '365 days',
       t.id
FROM tenants t
WHERE t.slug = 'acme'
ON CONFLICT (key) DO NOTHING;

