# 🚀 Post-Release 0.4.0 Checklist

## ✅ **Immediate Actions (Today)**

### **1. Beget Environment Variables**
```bash
# Add to Beget Node.js app settings:
NEXT_PUBLIC_APP_VERSION=0.4.0
ADMIN_WHITELIST=YOUR_IP_HERE
BASIC_AUTH_USER=getlifeundo_admin
BASIC_AUTH_PASS=7f3a9c6e8b4d2f9a1c3e5b7a9d2c4e6f9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5
FK_SECRET2=2f9a4b3c6d8e7f1a9b0c2d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5
```

### **2. Cloudflare Configuration**

#### **WAF Rules** (Apply `cloudflare-waf-rules.json`):
- Block `/admin*` and `/drizzle*` except whitelisted IPs
- Rate limit `/api/*` to 120 RPS (burst 240), ban 5min
- Always HTTPS + HSTS preload enabled

#### **Page Rules**:
- `/drizzle*` → 403 Forbidden

### **3. Neon Database**

#### **Create app_user role**:
```sql
-- Create minimal privilege user
CREATE USER app_user WITH PASSWORD 'strong_password_here';
GRANT CONNECT ON DATABASE getlifeundo TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

#### **Update DATABASE_URL**:
```
DATABASE_URL=postgresql://app_user:strong_password_here@host:5432/getlifeundo?sslmode=require
```

#### **Run migrations**:
```sql
-- Execute migrations/001_tenants.sql
-- Then run seed.sql for initial data
```

## 🔄 **White-Label Setup (0.4.1)**

### **Database Migration**:
```sql
-- Run migrations/001_tenants.sql
-- This creates tenants, tenant_domains, and adds tenant_id to existing tables
```

### **Tenant Configuration**:
```sql
-- Create a new tenant for white-label customer
INSERT INTO tenants (slug, name, theme, primary_color) 
VALUES ('customer-brand', 'Customer Brand', '{"logo":"/customer-logo.png"}', '#FF5722');

-- Add domain mapping
INSERT INTO tenant_domains (tenant_id, domain) 
VALUES (2, 'customer.getlifeundo.com');
```

### **Environment Variables for Multi-tenant**:
```bash
# Add to Beget env
DEFAULT_TENANT_ID=1
TENANT_RESOLUTION_ENABLED=true
```

## 📊 **Usage Tracking (0.4.1)**

### **API Usage Monitoring**:
- Real-time usage tracking via `api_usage` table
- Monthly limits enforcement
- Usage statistics in `/api/v1/usage`

### **Rate Limiting**:
- 120 RPS for API endpoints
- Cloudflare rate limiting + application-level checks

## 🛠️ **SDK Distribution (0.4.2)**

### **JavaScript SDK**:
```bash
# Build and publish
cd packages/lifeundo-js
npm run build
npm publish
```

### **Python SDK**:
```bash
# Build and publish
cd packages/lifeundo-python
python setup.py sdist bdist_wheel
twine upload dist/*
```

## 🔍 **Monitoring & Alerts**

### **Health Checks**:
- UptimeRobot → `https://getlifeundo.com/api/_health`
- Check every 5 minutes

### **Error Tracking**:
```bash
# Add to Beget env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### **Alert Thresholds**:
- 5 consecutive 5xx errors → Email/Slack alert
- >5 DUPLICATE webhooks in 1 minute → Alert
- API usage >90% of limit → Warning

## 🔐 **Security Rotation (Every 60-90 days)**

### **Rotate Credentials**:
```bash
# Generate new secrets
openssl rand -hex 32  # For BASIC_AUTH_PASS
openssl rand -hex 32  # For FK_SECRET2

# Update in Beget env
# Revoke old API keys via /api/admin/keys/rotate
```

### **API Key Rotation**:
```bash
# Generate new key for partner
curl -u "admin:password" -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Partner Key v2","planCode":"pro"}' \
  https://getlifeundo.com/api/admin/keys

# Old key remains active for 14 days
```

## 🚨 **Incident Response**

### **Security Incident**:
1. Enable Cloudflare "Under Attack" mode
2. Rotate `BASIC_AUTH_*`, `FK_SECRET2`, DB password
3. Revoke suspicious API keys
4. Check webhook logs for anomalies
5. Update `/status` with maintenance banner
6. Post-incident report

### **Performance Issues**:
1. Check Cloudflare analytics
2. Review database connection pool
3. Monitor API usage patterns
4. Scale resources if needed

## ✅ **Verification Checklist**

- [ ] `/status` shows version 0.4.0
- [ ] `/developers` and `/partners` load correctly
- [ ] `/openapi.yaml` downloads properly
- [ ] `/admin` requires Basic Auth
- [ ] API v1 endpoints work with Bearer tokens
- [ ] FreeKassa webhook accepts test notifications
- [ ] Database migrations applied successfully
- [ ] Cloudflare WAF rules active
- [ ] SSL certificate valid
- [ ] Health check endpoint responding

## 🎯 **Next Milestones**

### **0.4.1** (Next 2 weeks):
- [ ] White-label tenant support
- [ ] Usage tracking implementation
- [ ] Enhanced monitoring

### **0.4.2** (Next month):
- [ ] SDK distribution (npm/pip)
- [ ] Advanced billing features
- [ ] Partner dashboard

### **0.5.0** (Next quarter):
- [ ] Mobile SDKs (iOS/Android)
- [ ] Advanced analytics
- [ ] Enterprise features

---

**🎉 Release 0.4.0 is production-ready! Time to scale! 🚀**

