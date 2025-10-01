import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface LifeUndoConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface LicenseValidation {
  ok: boolean;
  plan?: string;
  expiresAt?: string;
  error?: string;
}

export interface LicenseActivation {
  ok: boolean;
  plan?: string;
  expiresAt?: string;
  error?: string;
}

export interface UsageStats {
  ok: boolean;
  monthCalls: number;
  limit: number;
  remaining: number;
  resetDate: string;
  error?: string;
}

export class LifeUndoClient {
  private client: AxiosInstance;
  private retries: number;

  constructor(config: LifeUndoConfig) {
    this.retries = config.retries || 3;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://getlifeundo.com',
      timeout: config.timeout || 10000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  private async withRetry<T>(fn: () => Promise<AxiosResponse<T>>): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < this.retries; i++) {
      try {
        const response = await fn();
        return response.data;
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on 4xx errors (except 429)
        if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
          throw error;
        }
        
        // Exponential backoff
        if (i < this.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError!;
  }

  async validateLicense(key: string): Promise<LicenseValidation> {
    try {
      return await this.withRetry(() =>
        this.client.post('/api/v1/licenses/validate', { key })
      );
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Network error'
      };
    }
  }

  async activateLicense(key: string, deviceId: string, deviceName?: string): Promise<LicenseActivation> {
    try {
      return await this.withRetry(() =>
        this.client.post('/api/v1/licenses/activate', { 
          key, 
          deviceId, 
          deviceName 
        })
      );
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Network error'
      };
    }
  }

  async getUsage(): Promise<UsageStats> {
    try {
      return await this.withRetry(() =>
        this.client.get('/api/v1/usage')
      );
    } catch (error: any) {
      return {
        ok: false,
        monthCalls: 0,
        limit: 0,
        remaining: 0,
        resetDate: '',
        error: error.response?.data?.error || 'Network error'
      };
    }
  }
}

// Factory function for easier usage
export function createClient(config: LifeUndoConfig): LifeUndoClient {
  return new LifeUndoClient(config);
}










