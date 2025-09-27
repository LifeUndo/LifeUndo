# Настройка Neon Database

## Создание роли app_user

Выполнить SQL от владельца БД:

```sql
-- Создание роли app_user с минимальными привилегиями
CREATE ROLE app_user LOGIN PASSWORD '<STRONG_PASSWORD>';

-- Предоставление базовых привилегий
GRANT CONNECT ON DATABASE neondb TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Предоставление прав на таблицы
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Предоставление прав на будущие таблицы
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO app_user;
```

## Включение PITR (Point-in-Time Recovery)

1. Перейти в Neon Dashboard
2. Найти настройки базы данных
3. Включить **Point-in-Time Recovery (PITR)**
4. Настроить период восстановления (рекомендуется 7 дней)

## Обновление DATABASE_URL

После создания app_user обновить DATABASE_URL в Vercel:

```
DATABASE_URL=postgresql://app_user:<STRONG_PASSWORD>@ep-long-bush-ad3519rp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Проверка подключения

```bash
# Тест подключения с новым пользователем
psql 'postgresql://app_user:<STRONG_PASSWORD>@ep-long-bush-ad3519rp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Проверка прав
\dt  -- список таблиц
SELECT * FROM users LIMIT 1;  -- тест чтения
```

## Безопасность

- Использовать сильный пароль для app_user
- Регулярно ротировать пароли
- Мониторить использование привилегий
- Включить логирование подключений

## После настройки:

1. Обновить DATABASE_URL в Vercel
2. Выполнить redeploy
3. Проверить работу приложения
4. Убедиться, что PITR включен
