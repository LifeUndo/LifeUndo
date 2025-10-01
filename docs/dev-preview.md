# Dev Preview Configuration

## Environment Variables (Scope: Preview)

```bash
DEV_SIMULATE_WEBHOOK_ENABLED=true
ADMIN_GRANT_TOKEN=<long_random_string>
NEXT_EMAIL_ENABLED=false
# Optional (for actual license granting):
DATABASE_URL=postgresql://...
```

## API Endpoints

### Health Check
- **GET** `/api/healthz` → `200 OK` (returns "ok")

### Dev Status
- **GET** `/api/dev/license/status` → `{"enabled": true}` (if dev mode is on)

### Diagnostics
- **GET** `/api/dev/diag` → Environment flags (no secrets):
  ```json
  {
    "vercelEnv": "preview",
    "devEnabled": true,
    "emailEnabled": false,
    "hasDbUrl": true,
    "isProd": false
  }
  ```

### Grant Test License
- **POST** `/api/dev/license/grant-ui` → Test license granting

## Error Handling

### Without Database (`hasDbUrl: false`)
- Form shows orange banner: "Database Not Connected"
- Clicking "Grant Test License" returns `400` with `code: "NO_DATABASE_URL"`
- User sees friendly error message instead of 500

### With Database (`hasDbUrl: true`)
- Form shows normally
- Clicking "Grant Test License" creates actual license
- Success shows green block with order details

## Database Setup

If you want to grant actual test licenses:

1. **Add DATABASE_URL** to Vercel Preview ENV
2. **Run migration:**
   ```sql
   \i migrations/100_payments_licenses.sql
   ```
3. **Redeploy Preview** with Clear build cache

## Testing Flow

1. **Check status:** `/api/dev/license/status` → `{"enabled": true}`
2. **Check diagnostics:** `/api/dev/diag` → `hasDbUrl` true/false
3. **Open downloads:** `/ru/downloads` → form appears
4. **Grant license:** Enter email → Grant → Success/Error

## Error Codes

- `FORBIDDEN` (403) - Production environment
- `DEV_DISABLED` (400) - Dev mode not enabled
- `NO_DATABASE_URL` (400) - Database not connected
- `MISSING_PARAMS` (400) - Missing email or plan
- `NO_ADMIN_TOKEN` (500) - Admin token not configured
- `DB_ERROR` (500) - Database operation failed
- `GRANT_FAILED` (varies) - Grant API failed
- `INTERNAL_ERROR` (500) - Unexpected error
