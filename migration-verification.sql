-- Быстрая проверка миграций 035-038
-- Выполнить после apply-migrations-ready.ps1

-- Email Pause / Relay (035, 037)
SELECT 
    'email_outbox' as table_name,
    CASE WHEN to_regclass('public.email_outbox') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'email_attachments' as table_name,
    CASE WHEN to_regclass('public.email_attachments') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'email_rules' as table_name,
    CASE WHEN to_regclass('public.email_rules') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'email_relay_log' as table_name,
    CASE WHEN to_regclass('public.email_relay_log') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status

-- RBAC / Multi-tenant (036)
UNION ALL
SELECT 
    'orgs' as table_name,
    CASE WHEN to_regclass('public.orgs') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'memberships' as table_name,
    CASE WHEN to_regclass('public.memberships') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'api_keys' as table_name,
    CASE WHEN to_regclass('public.api_keys') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'quotas' as table_name,
    CASE WHEN to_regclass('public.quotas') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'branding_themes' as table_name,
    CASE WHEN to_regclass('public.branding_themes') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'webhooks' as table_name,
    CASE WHEN to_regclass('public.webhooks') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status

-- Billing Core (038)
UNION ALL
SELECT 
    'plans' as table_name,
    CASE WHEN to_regclass('public.plans') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'plan_quotas' as table_name,
    CASE WHEN to_regclass('public.plan_quotas') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'org_subscriptions' as table_name,
    CASE WHEN to_regclass('public.org_subscriptions') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'invoices' as table_name,
    CASE WHEN to_regclass('public.invoices') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'invoice_lines' as table_name,
    CASE WHEN to_regclass('public.invoice_lines') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'usage_counters' as table_name,
    CASE WHEN to_regclass('public.usage_counters') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status

ORDER BY table_name;

-- Проверка функций
SELECT 
    'check_quota' as function_name,
    CASE WHEN proname = 'check_quota' THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_proc WHERE proname = 'check_quota'
UNION ALL
SELECT 
    'increment_usage_counter' as function_name,
    CASE WHEN proname = 'increment_usage_counter' THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_proc WHERE proname = 'increment_usage_counter'
UNION ALL
SELECT 
    'generate_invoice_number' as function_name,
    CASE WHEN proname = 'generate_invoice_number' THEN 'EXISTS' ELSE 'MISSING' END as status
FROM pg_proc WHERE proname = 'generate_invoice_number';

-- Проверка ENUM типов
SELECT 
    'email_status' as enum_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'subscription_status' as enum_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'invoice_status' as enum_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN 'EXISTS' ELSE 'MISSING' END as status;

-- Итоговый статус
SELECT 
    COUNT(*) as total_tables,
    COUNT(CASE WHEN status = 'EXISTS' THEN 1 END) as existing_tables,
    COUNT(CASE WHEN status = 'MISSING' THEN 1 END) as missing_tables
FROM (
    -- Повторяем первый запрос для подсчёта
    SELECT 
        CASE WHEN to_regclass('public.email_outbox') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.email_attachments') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.email_rules') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.email_relay_log') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.orgs') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.memberships') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.api_keys') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.quotas') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.branding_themes') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.webhooks') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.plans') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.plan_quotas') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.org_subscriptions') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.invoices') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.invoice_lines') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
    UNION ALL
    SELECT 
        CASE WHEN to_regclass('public.usage_counters') IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
) t;


