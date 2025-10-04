# LifeUndo JavaScript SDK

Official JavaScript/TypeScript SDK for LifeUndo API.

## Installation

```bash
npm install lifeundo-js
```

## Quick Start

```typescript
import { createClient } from 'lifeundo-js';

const client = createClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://getlifeundo.com' // optional
});

// Validate a license
const result = await client.validateLicense('LIFE-XXXX-YYYY-ZZZZ');
if (result.ok) {
  console.log(`Plan: ${result.plan}, expires: ${result.expiresAt}`);
} else {
  console.error('Invalid license:', result.error);
}

// Activate a device
await client.activateLicense('LIFE-XXXX-YYYY-ZZZZ', 'device-123', 'My Computer');

// Check API usage
const usage = await client.getUsage();
console.log(`Used ${usage.monthCalls}/${usage.limit} calls this month`);
```

## API Reference

### `createClient(config)`

Creates a new LifeUndo client.

**Parameters:**
- `config.apiKey` (string): Your API key
- `config.baseUrl` (string, optional): API base URL (default: https://getlifeundo.com)
- `config.timeout` (number, optional): Request timeout in ms (default: 10000)
- `config.retries` (number, optional): Number of retries (default: 3)

### `client.validateLicense(key)`

Validates a license key.

**Returns:**
```typescript
{
  ok: boolean;
  plan?: string;
  expiresAt?: string;
  error?: string;
}
```

### `client.activateLicense(key, deviceId, deviceName?)`

Activates a license on a device.

**Parameters:**
- `key` (string): License key
- `deviceId` (string): Unique device identifier
- `deviceName` (string, optional): Human-readable device name

### `client.getUsage()`

Gets current API usage statistics.

**Returns:**
```typescript
{
  ok: boolean;
  monthCalls: number;
  limit: number;
  remaining: number;
  resetDate: string;
  error?: string;
}
```

## Error Handling

The SDK automatically retries failed requests with exponential backoff. 4xx errors (except 429) are not retried.

## Rate Limits

- Dev: 60 RPS burst, 10k/month
- Pro: 120 RPS burst, 250k/month  
- Team: 200 RPS burst, 1M/month

## License

MIT
















