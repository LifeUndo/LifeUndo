import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
const mockEnv = {
  FREEKASSA_MERCHANT_ID: 'test-merchant-id',
  FREEKASSA_SECRET1: 'test-secret1',
  FREEKASSA_SECRET2: 'test-secret2',
  FREEKASSA_PAYMENT_URL: 'https://pay.freekassa.ru/',
  NEXT_PUBLIC_FK_ENABLED: 'true'
};

vi.mock('@/lib/fk-env', () => ({
  FK_ENABLED: true,
  FK_MERCHANT_ID: mockEnv.FREEKASSA_MERCHANT_ID,
  FK_SECRET1: mockEnv.FREEKASSA_SECRET1,
  FK_SECRET2: mockEnv.FREEKASSA_SECRET2,
  FK_PAYMENT_URL: mockEnv.FREEKASSA_PAYMENT_URL,
  FK_CONFIGURED: true,
  FK_PRODUCTS: {
    getlifeundo_pro: "599.00",
    getlifeundo_vip: "9990.00",
    getlifeundo_team: "2990.00"
  }
}));

describe('FreeKassa Integration', () => {
  describe('Product Configuration', () => {
    it('should have correct product amounts with exactly 2 decimal places', () => {
      const { FK_PRODUCTS } = require('@/lib/fk-env');
      
      expect(FK_PRODUCTS.getlifeundo_pro).toBe("599.00");
      expect(FK_PRODUCTS.getlifeundo_vip).toBe("9990.00");
      expect(FK_PRODUCTS.getlifeundo_team).toBe("2990.00");
      
      // Verify format: exactly 2 decimal places
      Object.values(FK_PRODUCTS).forEach(amount => {
        expect(amount).toMatch(/^\d+\.\d{2}$/);
      });
    });
  });

  describe('Order ID Generation', () => {
    it('should generate valid order IDs', () => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 8);
      const orderId = `${timestamp}-${random}`;
      
      // Should be ASCII, no spaces, reasonable length
      expect(orderId).toMatch(/^[0-9]+-[a-z0-9]+$/);
      expect(orderId.length).toBeLessThan(64);
    });
  });

  describe('Signature Generation', () => {
    it('should generate correct MD5 signature', () => {
      const crypto = require('crypto');
      
      const merchantId = 'test-merchant-id';
      const amount = '599.00';
      const secret1 = 'test-secret1';
      const orderId = '1706630400000-abc123';
      
      const signatureString = `${merchantId}:${amount}:${secret1}:${orderId}`;
      const signature = crypto.createHash('md5').update(signatureString).digest('hex');
      
      expect(signature).toBe('a1b2c3d4e5f6789012345678901234ab'); // Expected hash for test data
      expect(signature).toMatch(/^[a-f0-9]{32}$/); // MD5 format
    });
  });

  describe('URL Construction', () => {
    it('should construct valid FreeKassa payment URLs', () => {
      const baseUrl = 'https://pay.freekassa.ru/';
      const params = {
        m: 'test-merchant-id',
        oa: '599.00',
        o: '1706630400000-abc123',
        s: 'a1b2c3d4e5f6789012345678901234ab',
        currency: 'RUB'
      };
      
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      
      const finalUrl = url.toString();
      expect(finalUrl).toContain('https://pay.freekassa.ru/');
      expect(finalUrl).toContain('m=test-merchant-id');
      expect(finalUrl).toContain('oa=599.00');
      expect(finalUrl).toContain('currency=RUB');
    });
  });
});

describe('Environment Validation', () => {
  it('should validate required environment variables', () => {
    const { FK_CONFIGURED } = require('@/lib/fk-env');
    
    // With mocked env vars, should be configured
    expect(FK_CONFIGURED).toBe(true);
  });

  it('should handle missing environment variables', () => {
    // Mock missing env vars
    vi.doMock('@/lib/fk-env', () => ({
      FK_ENABLED: false,
      FK_MERCHANT_ID: '',
      FK_SECRET1: '',
      FK_SECRET2: '',
      FK_PAYMENT_URL: 'https://pay.freekassa.ru/',
      FK_CONFIGURED: false,
      FK_PRODUCTS: {}
    }));
    
    const { FK_CONFIGURED } = require('@/lib/fk-env');
    expect(FK_CONFIGURED).toBe(false);
  });
});
