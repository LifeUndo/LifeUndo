# Neon Database Setup - app_user Role

## SQL Commands to Execute (as database owner):

```sql
CREATE ROLE app_user LOGIN PASSWORD '<STRONG_PASSWORD>';
GRANT CONNECT ON DATABASE neondb TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO app_user;
```

## Additional Steps:

1. **Enable PITR (Point-in-Time Recovery)** in Neon Dashboard
2. **Update DATABASE_URL** in Vercel to use app_user credentials
3. **Test connection** with new credentials

## New DATABASE_URL Format:

```
postgresql://app_user:<STRONG_PASSWORD>@<neon-host>/neondb?sslmode=require
```

## Security Benefits:

- **Principle of least privilege**: app_user can only access public schema
- **No admin privileges**: cannot create/drop tables or modify schema
- **PITR enabled**: point-in-time recovery for data protection
- **Audit trail**: all changes tracked with PITR

## After Setup:

- Update Vercel environment variables
- Redeploy without cache
- Run smoke tests to verify database connectivity
