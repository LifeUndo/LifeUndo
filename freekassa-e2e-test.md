# FreeKassa E2E Test Plan

## 1. FreeKassa Configuration

### Webhook URLs:
- **Result**: `https://www.getlifeundo.com/api/fk/notify`
- **Success**: `https://www.getlifeundo.com/success`
- **Fail**: `https://www.getlifeundo.com/fail`

### Secrets Verification:
- **Secret 1**: Must match `FK_SECRET1` in Vercel ENV
- **Secret 2**: Must match `FK_SECRET2` in Vercel ENV

## 2. Test Payment Flow

### Step 1: Create Order
1. Go to `/pricing` page
2. Click "Buy Pro Month" button
3. Enter test email
4. Submit form

### Step 2: Payment Processing
1. Redirect to FreeKassa payment page
2. Use test payment method (if available)
3. Complete payment with minimum amount

### Step 3: Webhook Verification
1. Check `/api/fk/notify` receives POST request
2. Verify response is 200 OK
3. Check idempotency (duplicate requests return same result)
4. Verify database records are created

### Step 4: Success/Fail Pages
1. After successful payment → redirect to `/success`
2. After failed payment → redirect to `/fail`
3. Verify pages load correctly

## 3. Expected Results

### Database Records:
- `orders` table: new record with status 'paid'
- `payments` table: new record with provider 'fk'
- `webhooks` table: new record with event 'notify_success'

### API Responses:
- `POST /api/fk/notify` → 200 OK
- `GET /api/fk/notify` → 405 Method Not Allowed
- Webhook payload validation passes

### Email (if configured):
- License key sent to customer email
- Confirmation email sent

## 4. Troubleshooting

### Common Issues:
- **Webhook 500**: Check ENV variables in Vercel
- **Signature validation fails**: Verify FK_SECRET1/2 match
- **Database errors**: Check DATABASE_URL and app_user permissions
- **404 on success/fail**: Verify index.html files exist in public/success/ and public/fail/

### Debug Commands:
```bash
# Check webhook endpoint
curl -X POST https://www.getlifeundo.com/api/fk/notify -d "test=1"

# Check success page
curl -I https://www.getlifeundo.com/success

# Check fail page  
curl -I https://www.getlifeundo.com/fail
```

## 5. Success Criteria

✅ **Payment completes successfully**  
✅ **Webhook receives and processes notification**  
✅ **Database records created correctly**  
✅ **Success page loads after payment**  
✅ **Idempotency works (duplicate webhooks handled)**  
✅ **No errors in logs**

## 6. Next Steps After Success

1. **Firefox 0.3.7.11 XPI build** and AMO upload
2. **Social media launch** with payment success story
3. **Monitor production** for 48 hours
4. **Backup verification** and PITR testing
