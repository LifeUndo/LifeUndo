import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createPayment } from '@/app/api/payments/freekassa/create/route';
import { GET as debugInfo } from '@/app/api/debug/fk/route';

// Mock crypto for consistent testing
const mockCrypto = {
  createHash: vi.fn(() => ({
    update: vi.fn(() => ({
      digest: vi.fn(() => 'a1b2c3d4e5f6789012345678901234ab')
    }))
  }))
};

vi.mock('crypto', () => mockCrypto);

// Mock environment for testing
vi.mock('@/lib/fk-env', () => ({
  FK_ENABLED: true,
  FK_MERCHANT_ID: 'test-merchant-id',
  FK_SECRET1: 'test-secret1',
  FK_SECRET2: 'test-secret2',
  FK_PAYMENT_URL: 'https://pay.freekassa.ru/',
  FK_CONFIGURED: true,
  FK_PRODUCTS: {
    getlifeundo_pro: "599.00",
    getlifeundo_vip: "9990.00",
    getlifeundo_team: "2990.00"
  }
}));

describe('FreeKassa API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/payments/freekassa/create', () => {
    it('should create payment for valid product ID', async () => {
      const request = new NextRequest('http://localhost/api/payments/freekassa/create', {
        method: 'POST',
        body: JSON.stringify({
          productId: 'getlifeundo_pro',
          email: 'test@example.com'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await createPayment(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.pay_url).toContain('https://pay.freekassa.ru/');
      expect(data.pay_url).toContain('m=test-merchant-id');
      expect(data.pay_url).toContain('oa=599.00');
      expect(data.pay_url).toContain('currency=RUB');
      expect(data.order_id).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should reject invalid product ID', async () => {
      const request = new NextRequest('http://localhost/api/payments/freekassa/create', {
        method: 'POST',
        body: JSON.stringify({
          productId: 'invalid_product',
          email: 'test@example.com'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await createPayment(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid product ID');
    });

    it('should handle missing product ID', async () => {
      const request = new NextRequest('http://localhost/api/payments/freekassa/create', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await createPayment(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid product ID');
    });

    it('should work without email', async () => {
      const request = new NextRequest('http://localhost/api/payments/freekassa/create', {
        method: 'POST',
        body: JSON.stringify({
          productId: 'getlifeundo_vip'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await createPayment(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.pay_url).toContain('oa=9990.00');
    });
  });

  describe('GET /api/debug/fk', () => {
    it('should return debug information in preview environment', async () => {
      // Mock preview environment
      vi.stubEnv('VERCEL_ENV', 'preview');

      const response = await debugInfo();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.fkEnabled).toBe(true);
      expect(data.fkConfigured).toBe(true);
      expect(data.merchantIdMasked).toBe('test***');
      expect(data.paymentUrl).toBe('https://pay.freekassa.ru/');
      expect(data.products).toHaveProperty('getlifeundo_pro');
      expect(data.products).toHaveProperty('getlifeundo_vip');
      expect(data.products).toHaveProperty('getlifeundo_team');
      expect(data.timestamp).toBeDefined();
    });

    it('should return 404 in production environment', async () => {
      // Mock production environment
      vi.stubEnv('VERCEL_ENV', 'production');

      const response = await debugInfo();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.ok).toBe(false);
      expect(data.error).toBe('Not available in production');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost/api/payments/freekassa/create', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await createPayment(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Payment creation failed');
    });
  });
});
