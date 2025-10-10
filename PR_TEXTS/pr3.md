# docs(payments): FreeKassa create API docs + smoke utilities

Что добавлено
- `docs/references/payments-freekassa.md` — спецификация `POST /api/payments/freekassa/create`.
- `scripts/fk_create_examples.http` — примеры для VS Code REST Client.
- `scripts/fk_smoke.ps1` — PowerShell smoke: печатает `pay_url` или ошибку.
- `README.md` — короткая ссылка на документ.

Контракт (выжимка)
- `POST /api/payments/freekassa/create`
- Обязательное поле: `plan ∈ { pro_month, vip_lifetime, team_5, starter_6m }`
- Опционально: `email`, `description`
- `order_id` генерируется на сервере (префиксы: `PROM|VIPL|TEAM5|S6M`)
- Ответ: `{ ok, pay_url, order_id }`
- Ошибки: `400 Missing plan / Invalid plan`, `500 …`

Примеры
- `{ "plan": "pro_month" }`
- `{ "plan": "vip_lifetime", "email": "test@example.com" }`
- `{ "plan": "team_5", "description": "Team 5 seats — monthly" }`
- `{ "plan": "starter_6m" }`

Чеклист
- Док с контрактом, примерами, ошибками
- README содержит ссылку
- Скрипты в `scripts/`, открываются и выполняются
