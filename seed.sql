-- Базовые планы
INSERT INTO plans (code,title,currency,amount,period) VALUES
 ('free','Free','RUB',0,'month')
,('pro_m','Pro Monthly','RUB',29900,'month')
,('pro_y','Pro Yearly','RUB',299000,'year')
,('vip','VIP','RUB',999000,'year')
,('team','Team Seat','RUB',149900,'seat')
ON CONFLICT (code) DO NOTHING;

-- Тестовая лицензия (на 2 девайса, на 90 дней)
INSERT INTO licenses (key,plan_code,issued_to,devices_limit,expires_at,meta)
VALUES ('LIFE-TEST-0000-0000','pro_m','qa@getlifeundo.com',2,now() + interval '90 days','{}')
ON CONFLICT (key) DO NOTHING;

