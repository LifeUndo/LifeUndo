# Monitoring Setup Guide

## 🚀 **Quick Setup**

### **1. Sentry Integration**

#### **Install Dependencies**
```bash
npm install @sentry/nextjs
```

#### **Environment Variables (Beget)**
```bash
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

#### **Create Sentry Project**
1. Go to [sentry.io](https://sentry.io)
2. Create new project → **Next.js**
3. Copy DSN to environment variables
4. Note org and project names

### **2. UptimeRobot Setup**

#### **Create HTTP Monitors**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add Monitor → **HTTP(s)**
3. Create monitors for:
   - `https://getlifeundo.com/api/_health` (every 5 minutes)
   - `https://getlifeundo.com/api/_health/db` (every 5 minutes)
   - `https://lifeundo.ru/api/_health` (every 5 minutes)

#### **Alert Contacts**
- Email: your-email@domain.com
- Slack webhook (optional)
- Telegram bot (optional)

### **3. Health Check Endpoints**

#### **Basic Health**
```bash
curl https://getlifeundo.com/api/_health
# Returns: "ok"
```

#### **Database Health**
```bash
curl https://getlifeundo.com/api/_health/db
# Returns: {"status":"ok","database":"connected","timestamp":"..."}
```

## 📊 **Monitoring Features**

### **Sentry**
- ✅ Error tracking and alerting
- ✅ Performance monitoring
- ✅ Session replay
- ✅ Release tracking
- ✅ Source maps for debugging

### **UptimeRobot**
- ✅ HTTP endpoint monitoring
- ✅ SSL certificate monitoring
- ✅ Email/Slack alerts
- ✅ Uptime statistics
- ✅ Response time tracking

## 🔧 **Configuration**

### **Sentry Settings**
- **Environment**: production/staging/development
- **Sample Rate**: 100% for errors, 10% for performance
- **Release Tracking**: Automatic with git commits
- **Source Maps**: Uploaded automatically

### **UptimeRobot Settings**
- **Check Interval**: 5 minutes
- **Timeout**: 30 seconds
- **Retry**: 3 times
- **Alert Threshold**: 2 consecutive failures

## 🚨 **Alerting**

### **Critical Alerts**
- Database connection failure
- API endpoint down
- SSL certificate expired
- High error rate (>5% in 5 minutes)

### **Warning Alerts**
- High response time (>2 seconds)
- Rate limit exceeded
- Memory usage high
- Disk space low

## 📈 **Dashboard**

### **Key Metrics**
- Uptime percentage
- Response time (avg/p95/p99)
- Error rate
- API usage
- Database performance

### **Custom Dashboards**
- Grafana (optional)
- DataDog (optional)
- New Relic (optional)

## ✅ **Verification**

### **Test Sentry**
```bash
# Trigger an error (for testing)
curl -X POST https://getlifeundo.com/api/test-error
```

### **Test UptimeRobot**
```bash
# Check monitor status
curl https://getlifeundo.com/api/_health
curl https://getlifeundo.com/api/_health/db
```

### **Test Alerts**
1. Temporarily break database connection
2. Verify Sentry captures error
3. Verify UptimeRobot sends alert
4. Restore connection

## 🎯 **Best Practices**

### **Error Handling**
- Log all errors to Sentry
- Don't log health check failures
- Include context in error messages
- Set up error boundaries

### **Performance**
- Monitor slow queries
- Track API response times
- Monitor memory usage
- Set up performance budgets

### **Security**
- Monitor failed login attempts
- Track suspicious API usage
- Monitor rate limit violations
- Alert on security events

---

**🎉 Monitoring fully configured! 📊**











