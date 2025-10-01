# 🔥 Final FreeKassa Smoke Test Checklist

## ✅ Pre-Test Setup (Vercel ENV)

### 1. Environment Variables Scope Check
- [ ] `NEXT_PUBLIC_FK_ENABLED=true` → **Preview scope only**
- [ ] `FREEKASSA_MERCHANT_ID` → Preview + Production
- [ ] `FREEKASSA_SECRET1` → Preview + Production  
- [ ] `FREEKASSA_SECRET2` → Preview + Production
- [ ] `FREEKASSA_PAYMENT_URL=https://pay.freekassa.ru/` → Preview + Production
- [ ] `FREEKASSA_CURRENCY=RUB` → Preview + Production

### 2. Remove Deprecated Variables
- [ ] Delete all `FK_*` variables (if any)
- [ ] Keep only `FREEKASSA_*` variables

### 3. Redeploy
- [ ] Redeploy Preview branch `feature/fk-from-prod-lock`
- [ ] Wait for deployment to complete

---

## 🧪 Smoke Test Commands

### Get Preview URL
1. Go to Vercel → Deployments
2. Find latest Preview of `feature/fk-from-prod-lock`
3. Copy the git-alias URL (not random hash)

### Test 1: Debug API
```powershell
$P = "https://your-preview-alias.vercel.app"
Invoke-WebRequest -Uri "$P/api/debug/fk" -UseBasicParsing
```

**Expected:**
```json
{
  "ok": true,
  "env": "preview",
  "fkEnabled": true,
  "fkConfigured": true,
  "merchantIdMasked": "abcd***",
  "paymentUrl": "https://pay.freekassa.ru/",
  "currency": "RUB",
  "products": {
    "getlifeundo_pro": "599.00",
    "getlifeundo_vip": "9990.00",
    "getlifeundo_team": "2990.00"
  }
}
```

### Test 2: Payment Creation (Alternative Format)
```powershell
$body = @{ currency = "RUB"; order_id = "100500"; description = "Pro plan" }
$response = Invoke-RestMethod -Method Post -Uri "$P/api/payments/freekassa/create" -Body ($body | ConvertTo-Json) -ContentType "application/json"
$response.pay_url
```

**Expected:**
- Status: 200 OK
- Response contains `pay_url` with `https://pay.freekassa.ru/`
- URL contains `currency=RUB` and `oa=599.00`

### Test 3: UI Check
```powershell
Invoke-WebRequest -Uri "$P/ru/pricing" -UseBasicParsing
```

**Expected:**
- Status: 200 OK
- Page contains "FreeKassa" elements
- Payment buttons visible

---

## 🎯 Green Criteria

### ✅ All Green If:
- [ ] Debug API returns `currency: "RUB"` and `fkEnabled: true`
- [ ] Payment creation returns valid FreeKassa URL with `currency=RUB`
- [ ] Pricing page loads with FreeKassa buttons visible
- [ ] No console errors in browser DevTools
- [ ] No leaked secrets in logs

### ❌ Red If:
- [ ] Any 4xx/5xx errors
- [ ] Missing `currency` in debug response
- [ ] Payment URL doesn't contain `currency=RUB`
- [ ] FreeKassa buttons not visible on pricing page
- [ ] Console errors or secret leaks

---

## 🚀 Production Promotion (After Green)

### 1. Promote Preview
- [ ] Vercel → Deployments → Promote to Production
- [ ] Protect the new production deploy

### 2. Production ENV
- [ ] Copy all `FREEKASSA_*` variables to Production
- [ ] Set `NEXT_PUBLIC_FK_ENABLED=true` in Production
- [ ] Verify all variables are present

### 3. Final Production Test
```powershell
$P = "https://lifeundo.ru"  # or your production domain
# Run same tests as above
```

---

## 🚨 Troubleshooting

### Problem: `DEPLOYMENT_NOT_FOUND`
**Solution:** Use git-alias URL, not random hash URL

### Problem: 400 Bad Request on `/create`
**Solution:** Check request format - use JSON, not form data

### Problem: 500 Internal Server Error
**Solution:** Check all `FREEKASSA_*` variables are set correctly

### Problem: No FreeKassa buttons visible
**Solution:** Check `NEXT_PUBLIC_FK_ENABLED=true` in Preview scope

### Problem: Currency not in debug response
**Solution:** Add `FREEKASSA_CURRENCY=RUB` variable

---

## 📸 Success Screenshots

After successful testing, provide:
1. **Debug API response** (JSON)
2. **Payment URL** (showing FreeKassa domain + currency=RUB)
3. **Pricing page** (with visible FreeKassa buttons)
4. **Vercel ENV settings** (showing correct scopes)

**Ready for production promotion!** 🎉
