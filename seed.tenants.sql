-- Default tenant for LifeUndo (.com and .ru)
INSERT INTO tenants (slug, name, theme, primary_color) 
VALUES ('lifeundo', 'LifeUndo', '{"logo":"/logo.png","brand":"LifeUndo","description":"Управление лицензиями для разработчиков"}', '#0066CC')
ON CONFLICT (slug) DO NOTHING;

-- Domain mappings for LifeUndo
INSERT INTO tenant_domains (tenant_id, domain) 
SELECT t.id, d.domain 
FROM tenants t, (VALUES 
  ('getlifeundo.com'),
  ('www.getlifeundo.com'),
  ('lifeundo.ru'),
  ('www.lifeundo.ru')
) AS d(domain)
WHERE t.slug = 'lifeundo'
ON CONFLICT (domain) DO NOTHING;

-- Update existing data to default tenant
UPDATE licenses SET tenant_id = (SELECT id FROM tenants WHERE slug = 'lifeundo') WHERE tenant_id IS NULL;
UPDATE api_keys SET tenant_id = (SELECT id FROM tenants WHERE slug = 'lifeundo') WHERE tenant_id IS NULL;
UPDATE orders SET tenant_id = (SELECT id FROM tenants WHERE slug = 'lifeundo') WHERE tenant_id IS NULL;
UPDATE payments SET tenant_id = (SELECT id FROM tenants WHERE slug = 'lifeundo') WHERE tenant_id IS NULL;
UPDATE webhooks SET tenant_id = (SELECT id FROM tenants WHERE slug = 'lifeundo') WHERE tenant_id IS NULL;


