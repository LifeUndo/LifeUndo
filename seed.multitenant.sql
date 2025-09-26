-- LifeUndo баннер: «всё ок»
WITH t AS (SELECT id FROM tenants WHERE slug='lifeundo')
INSERT INTO status_banners (tenant_id, active, title, message)
SELECT t.id, false, 'OK', '—' FROM t
ON CONFLICT DO NOTHING;

-- ACME демонстрационный тенант
INSERT INTO tenants (slug,name,primary_color)
VALUES ('acme','ACME Undo','#0ea5e9')
ON CONFLICT (slug) DO NOTHING;

WITH a AS (SELECT id FROM tenants WHERE slug='acme')
INSERT INTO tenant_domains (tenant_id,domain)
SELECT a.id, 'acmeundo.example' FROM a
ON CONFLICT (domain) DO NOTHING;

WITH a AS (SELECT id FROM tenants WHERE slug='acme')
INSERT INTO status_banners (tenant_id,active,title,message)
SELECT a.id, true, 'Техработы', 'ACME биллинг обновляется' FROM a
ON CONFLICT DO NOTHING;

