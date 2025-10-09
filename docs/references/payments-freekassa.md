# Payments / FreeKassa (Preview)

This document describes the public API contract for creating FreeKassa payments in Preview.

- Environment: Preview only. Production is not affected.
- Secrets are never exposed in responses or logs.

## Endpoint
- Method: POST
- Route: `/api/payments/freekassa/create`
- Content-Type: `application/json`

## Request body
- Required:
  - `plan` (string) ∈ { `pro_month`, `vip_lifetime`, `team_5`, `starter_6m` }
    - See `src/lib/payments/fk-plans.ts` for authoritative list.
- Optional:
  - `email` (string)
  - `description` (string)

Notes:
- `order_id` is generated server-side. Prefixes reflect plan family: `PROM`/`VIPL`/`TEAM5`/`S6M`.

## Successful response (200)
```json
{
  "ok": true,
  "pay_url": "https://pay.fk.money/…",
  "order_id": "<server-generated>"
}
```

## Error responses
- 400 Bad Request
  - `{ "error": "Missing plan parameter" }`
  - `{ "error": "Invalid plan" }`
- 500 Internal Server Error (rare, service/internal)
  - `{ "error": "FreeKassa not configured" }`
  - `{ "error": "Payment creation failed" }`

## Examples
Minimal:
```http
POST /api/payments/freekassa/create
Content-Type: application/json

{ "plan": "pro_month" }
```

With email:
```http
POST /api/payments/freekassa/create
Content-Type: application/json

{ "plan": "vip_lifetime", "email": "test@example.com" }
```

With description:
```http
POST /api/payments/freekassa/create
Content-Type: application/json

{ "plan": "team_5", "description": "Team – 5 seats monthly" }
```

## Smoke tools
- VS Code examples: `scripts/fk_create_examples.http`
- PowerShell smoke: `scripts/fk_smoke.ps1`
