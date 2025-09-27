# Production Environment Setup

## Required Environment Variables for Vercel

### 1. Core Configuration
```
NEXT_PUBLIC_SITE_URL=https://www.getlifeundo.com
NEXT_PUBLIC_ENV=production
NODE_ENV=production
```

### 2. Database
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 3. FreeKassa Payment Gateway
```
FK_MERCHANT_ID=your_merchant_id
FK_SECRET1=your_secret_word_1
FK_SECRET2=your_secret_word_2
```

### 4. Admin Authentication
```
ADMIN_TOKEN=your_secure_admin_token_here
```

### 5. Email Relay (Optional)
```
EMAIL_RELAY_USER=your_smtp_username
EMAIL_RELAY_PASS=your_smtp_password
EMAIL_RELAY_HOST=smtp.your-provider.com
EMAIL_RELAY_PORT=587
```

### 6. Monitoring (Optional)
```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOGTAIL_TOKEN=your_logtail_token
```

## Setup Instructions

### Step 1: Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable above with appropriate values
3. Make sure to set them for "Production" environment
4. Redeploy the project after adding variables

### Step 2: FreeKassa Configuration
1. Login to FreeKassa merchant panel
2. Set callback URL to: `https://www.getlifeundo.com/api/fk/notify`
3. Verify merchant ID and secret words match your ENV variables
4. Test with a small amount first

### Step 3: Database Security (Neon)
1. Create a new database user with minimal privileges:
   ```sql
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
   ```
2. Update `DATABASE_URL` to use the new user
3. Enable Point-in-Time Recovery (PITR) in Neon dashboard

### Step 4: Monitoring Setup
1. Create Sentry project and get DSN
2. Create Logtail account and get token
3. Add monitoring variables to Vercel
4. Test error reporting

## Security Checklist

- [ ] All secrets are properly generated (use strong passwords)
- [ ] Database user has minimal required permissions
- [ ] FreeKassa webhook URL is correct and secure
- [ ] Admin token is strong and unique
- [ ] CORS is restricted to allowed domains only
- [ ] Rate limiting is enabled on sensitive endpoints
- [ ] SSL/TLS is properly configured (Full Strict in Cloudflare)

## Testing After Setup

```bash
# Test public endpoints
curl -I https://www.getlifeundo.com/
curl -I https://www.getlifeundo.com/api/health

# Test admin endpoint (should return 401 without token)
curl -I https://www.getlifeundo.com/admin

# Test FreeKassa endpoint (should return 400 without proper params)
curl -I https://www.getlifeundo.com/api/fk/notify
```

## Troubleshooting

### Common Issues:
1. **401 on admin routes**: Check ADMIN_TOKEN is set correctly
2. **FreeKassa webhook fails**: Verify signature calculation and secret words
3. **Database connection errors**: Check DATABASE_URL format and SSL settings
4. **Rate limiting too strict**: Adjust limits in middleware.ts if needed

### Logs to Check:
- Vercel Function Logs for API errors
- Database logs in Neon dashboard
- FreeKassa merchant panel for webhook delivery status
