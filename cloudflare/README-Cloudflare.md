# Cloudflare Configuration Guide

## 🚀 **Quick Setup**

### **1. Create IP List**
1. Go to **Security** → **WAF** → **IP Access Rules**
2. Click **Create IP List**
3. Name: `ADMIN_IPS`
4. Add your admin IPs (one per line)
5. Save the list

### **2. Import Firewall Rules**
1. Go to **Security** → **WAF** → **Custom Rules**
2. Click **Create Custom Rule**
3. Name: `Block Admin Access`
4. Expression: `(http.request.uri.path starts_with "/admin" or http.request.uri.path starts_with "/drizzle") and not ip.src in {ADMIN_IPS}`
5. Action: **Block**
6. Save

### **3. Setup Rate Limiting**
1. Go to **Security** → **WAF** → **Rate Limiting**
2. Click **Create Rule**
3. Name: `API Rate Limit`
4. Expression: `http.request.uri.path starts_with "/api/"`
5. Rate: **120 requests per 60 seconds**
6. Burst: **240**
7. Ban duration: **5 minutes**
8. Save

### **4. Page Rules**
1. Go to **Rules** → **Page Rules**
2. Click **Create Page Rule**
3. URL: `*/drizzle*`
4. Settings:
   - **Security Level**: Essentially Off
   - **Cache Level**: Bypass
5. Save

## 🔧 **Advanced Settings**

### **SSL/TLS**
- **SSL/TLS encryption mode**: Full (strict)
- **Always Use HTTPS**: On
- **HSTS**: Enabled with subdomains

### **Security Level**
- **Security Level**: Medium
- **Challenge Passage**: 30 minutes

### **Firewall Settings**
- **Bot Fight Mode**: On
- **Challenge Passage**: 30 minutes

## 📊 **Monitoring**

### **Analytics**
- Monitor **Security** → **Events** for blocked requests
- Check **Analytics** → **Security** for attack patterns

### **Alerts**
- Set up **Notifications** for high block rates
- Monitor **Rate Limiting** violations

## 🚨 **Troubleshooting**

### **Admin Access Blocked**
1. Check your IP is in `ADMIN_IPS` list
2. Verify IP list is active
3. Test with `curl -H "X-Forwarded-For: YOUR_IP"`

### **Rate Limiting Issues**
1. Check rate limit rules are active
2. Verify expression matches your API paths
3. Adjust limits if needed

### **SSL Issues**
1. Ensure **SSL/TLS** mode is **Full (strict)**
2. Check origin server SSL certificate
3. Verify **Always Use HTTPS** is enabled

## ✅ **Verification**

Test your configuration:

```bash
# Test admin access (should work with your IP)
curl -H "X-Forwarded-For: YOUR_IP" https://getlifeundo.com/admin

# Test rate limiting
for i in {1..130}; do
  curl https://getlifeundo.com/api/_health
done
```

---

**🎉 Cloudflare security configured! 🛡️**

