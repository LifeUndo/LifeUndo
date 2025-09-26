# 🏢 White-Label Setup Guide

## 🚀 **Quick Setup**

### **1. Database Migrations**
```bash
npm run db:generate
npm run db:migrate
```

### **2. Seed Tenants (Neon Console)**
```sql
-- Execute seed.tenants.sql for LifeUndo (.com + .ru)
-- Execute seed.acme-example.sql for ACME example
```

### **3. Beget Environment**
```bash
# Add to Node.js app settings:
TENANT_DEFAULT_SLUG=lifeundo
TENANT_MAP_JSON={"getlifeundo.com":"lifeundo","www.getlifeundo.com":"lifeundo","lifeundo.ru":"lifeundo","www.lifeundo.ru":"lifeundo"}
```

### **4. DNS Configuration**
- Point `lifeundo.ru` to same Beget Node.js app
- Or use Cloudflare proxy to same origin

## 🏢 **Creating White-Label Tenants**

### **Via Admin API**
```bash
# Create new tenant
curl -u "admin:password" -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "acme",
    "name": "ACME Corp",
    "theme": {"logo":"/acme-logo.png","brand":"ACME"},
    "primaryColor": "#FF5722",
    "domains": ["acmeundo.example"]
  }' \
  https://getlifeundo.com/api/admin/tenants

# Add domain to existing tenant
curl -u "admin:password" -X POST \
  -H "Content-Type: application/json" \
  -d '{"domain": "subdomain.acmeundo.example"}' \
  https://getlifeundo.com/api/admin/tenants/2/domains
```

### **Database Direct**
```sql
-- Create tenant
INSERT INTO tenants (slug, name, theme, primary_color) 
VALUES ('customer-brand', 'Customer Brand', '{"logo":"/logo.png","brand":"Customer"}', '#0066CC');

-- Add domain
INSERT INTO tenant_domains (tenant_id, domain) 
VALUES (2, 'customer.getlifeundo.com');
```

## 🎨 **Customization Options**

### **Theme Configuration**
```json
{
  "logo": "/custom-logo.png",
  "brand": "Custom Brand",
  "description": "Custom license management",
  "favicon": "/favicon.ico",
  "primaryColor": "#FF5722"
}
```

### **Domain Mapping**
- Each tenant can have multiple domains
- Subdomain support: `customer.getlifeundo.com`
- Full domain support: `customer.com`
- Wildcard domains: `*.customer.com`

## 🔧 **API Integration**

### **Tenant-Aware API Calls**
All API endpoints automatically use tenant context:
- `/api/v1/licenses/validate` - validates within tenant
- `/api/v1/licenses/activate` - activates within tenant
- `/api/admin/keys` - generates tenant-specific keys

### **Usage Tracking**
- Per-tenant API usage statistics
- Tenant-specific rate limits
- Isolated billing and reporting

## 📊 **Multi-Tenant Features**

### **Data Isolation**
- Licenses, API keys, orders scoped to tenant
- Cross-tenant data access prevented
- Tenant-specific webhooks and notifications

### **Branding**
- Custom logos and colors
- Tenant-specific email templates
- Custom domain support

### **Billing**
- Per-tenant usage tracking
- Tenant-specific pricing plans
- Isolated payment processing

## 🔒 **Security**

### **Tenant Isolation**
- Database-level tenant scoping
- API key tenant validation
- Domain-based tenant resolution

### **Access Control**
- Tenant-specific admin access
- Isolated API key management
- Secure tenant switching

## 📈 **Monitoring**

### **Per-Tenant Metrics**
- API usage by tenant
- License activations by tenant
- Payment processing by tenant

### **Health Checks**
- Tenant-specific status pages
- Custom error handling
- Tenant-aware logging

## 🎯 **Example Workflow**

1. **Create Tenant**: `POST /api/admin/tenants`
2. **Add Domain**: `POST /api/admin/tenants/{id}/domains`
3. **Generate API Key**: `POST /api/admin/keys` (tenant-scoped)
4. **Create Licenses**: Tenant-specific license generation
5. **Monitor Usage**: Tenant-specific analytics

## 🚀 **Production Checklist**

- [ ] Database migrations applied
- [ ] Tenant seed data loaded
- [ ] Environment variables set
- [ ] DNS configuration complete
- [ ] SSL certificates valid
- [ ] Cloudflare rules updated
- [ ] API keys generated
- [ ] Health checks passing

---

**🎉 White-Label system ready for production! 🚀**

