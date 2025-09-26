# LifeUndo Python SDK

Official Python SDK for LifeUndo API.

## Installation

```bash
pip install lifeundo-python
```

## Quick Start

```python
from lifeundo import create_client

client = create_client('your-api-key-here')

# Validate a license
result = client.validate_license('LIFE-XXXX-YYYY-ZZZZ')
if result['ok']:
    print(f"Plan: {result['plan']}, expires: {result['expiresAt']}")
else:
    print(f"Invalid license: {result['error']}")

# Activate a device
client.activate_license('LIFE-XXXX-YYYY-ZZZZ', 'device-123', 'My Computer')

# Check API usage
usage = client.get_usage()
print(f"Used {usage['monthCalls']}/{usage['limit']} calls this month")
```

## API Reference

### `create_client(api_key, base_url=None, **kwargs)`

Creates a new LifeUndo client.

**Parameters:**
- `api_key` (str): Your API key
- `base_url` (str, optional): API base URL (default: https://getlifeundo.com)
- `timeout` (int, optional): Request timeout in seconds (default: 10)
- `retries` (int, optional): Number of retries (default: 3)

### `client.validate_license(key)`

Validates a license key.

**Returns:**
```python
{
    'ok': bool,
    'plan': str,  # optional
    'expiresAt': str,  # optional
    'error': str  # optional
}
```

### `client.activate_license(key, device_id, device_name=None)`

Activates a license on a device.

**Parameters:**
- `key` (str): License key
- `device_id` (str): Unique device identifier
- `device_name` (str, optional): Human-readable device name

### `client.get_usage()`

Gets current API usage statistics.

**Returns:**
```python
{
    'ok': bool,
    'monthCalls': int,
    'limit': int,
    'remaining': int,
    'resetDate': str,
    'error': str  # optional
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