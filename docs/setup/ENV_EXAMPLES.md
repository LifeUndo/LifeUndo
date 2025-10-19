# Environment Variables Examples

## FreeKassa Integration

### Required Variables (All Environments)

```bash
# FreeKassa Configuration - use FREEKASSA_* prefix only
FREEKASSA_MERCHANT_ID=your_merchant_id_here
FREEKASSA_SECRET1=your_secret1_here
FREEKASSA_SECRET2=your_secret2_here
FREEKASSA_PAYMENT_URL=https://pay.freekassa.net/
FREEKASSA_CURRENCY=RUB
```

### Client-Side Flag (Preview Only!)

```bash
# ⚠️ CRITICAL: This must be Preview-only scope in Vercel!
NEXT_PUBLIC_FK_ENABLED=true
```

**Why Preview-only?** This variable is exposed to client-side code and can accidentally enable payment buttons on production.

### Vercel Environment Scopes

| Variable | Preview | Production | Reason |
|----------|---------|------------|---------|
| `FREEKASSA_MERCHANT_ID` | ✅ | ✅ | Server-side only |
| `FREEKASSA_SECRET1` | ✅ | ✅ | Server-side only |
| `FREEKASSA_SECRET2` | ✅ | ✅ | Server-side only |
| `FREEKASSA_PAYMENT_URL` | ✅ | ✅ | Server-side only |
| `FREEKASSA_CURRENCY` | ✅ | ✅ | Server-side only |
| `NEXT_PUBLIC_FK_ENABLED` | ✅ | ❌ | Client-side exposure |

### Site Configuration

```bash
# Site URLs
NEXT_PUBLIC_SITE_URL=https://lifeundo.ru
NEXT_PUBLIC_TG_URL=https://t.me/lifeundo_support
NEXT_PUBLIC_X_URL=https://x.com/lifeundo
NEXT_PUBLIC_YT_URL=https://youtube.com/@lifeundo
NEXT_PUBLIC_GH_URL=https://github.com/LifeUndo
```

## ⚠️ Migration from Old FK_* Variables

**DEPRECATED (DO NOT USE):**
```bash
# ❌ Old format - no longer supported
FK_MERCHANT_ID=...
FK_SECRET1=...
FK_SECRET2=...
FK_PAYMENT_URL=...
```

**NEW FORMAT (USE THESE):**
```bash
# ✅ New format - use these
FREEKASSA_MERCHANT_ID=...
FREEKASSA_SECRET1=...
FREEKASSA_SECRET2=...
FREEKASSA_PAYMENT_URL=...
FREEKASSA_CURRENCY=RUB
```

## Quick Setup Checklist

- [ ] Remove all `FK_*` variables from Vercel
- [ ] Add all `FREEKASSA_*` variables with correct values
- [ ] Set `NEXT_PUBLIC_FK_ENABLED=true` with **Preview-only** scope
- [ ] Redeploy Preview environment
- [ ] Run smoke tests
- [ ] Promote to Production when ready
- [ ] Set `NEXT_PUBLIC_FK_ENABLED=true` in Production ENV
