import time
from typing import Optional, Dict, Any
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class LifeUndoConfig:
    def __init__(self, api_key: str, base_url: str = "https://getlifeundo.com", timeout: int = 10, retries: int = 3):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.retries = retries


class LifeUndoClient:
    def __init__(self, config: LifeUndoConfig):
        self.config = config
        self.session = requests.Session()
        
        # Setup retry strategy
        retry_strategy = Retry(
            total=config.retries,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "POST"]
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        # Set default headers
        self.session.headers.update({
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        })

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.config.base_url}{endpoint}"
        
        try:
            response = self.session.request(
                method, 
                url, 
                timeout=self.config.timeout,
                **kwargs
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "ok": False,
                "error": str(e) if hasattr(e, 'message') else 'Network error'
            }

    def validate_license(self, key: str) -> Dict[str, Any]:
        """Validate a license key"""
        return self._request('POST', '/api/v1/licenses/validate', json={'key': key})

    def activate_license(self, key: str, device_id: str, device_name: Optional[str] = None) -> Dict[str, Any]:
        """Activate a license on a device"""
        payload = {'key': key, 'deviceId': device_id}
        if device_name:
            payload['deviceName'] = device_name
        
        return self._request('POST', '/api/v1/licenses/activate', json=payload)

    def get_usage(self) -> Dict[str, Any]:
        """Get API usage statistics"""
        return self._request('GET', '/api/v1/usage')


def create_client(api_key: str, base_url: str = "https://getlifeundo.com", **kwargs) -> LifeUndoClient:
    """Factory function to create a LifeUndo client"""
    config = LifeUndoConfig(api_key, base_url, **kwargs)
    return LifeUndoClient(config)


