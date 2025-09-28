# E2E Tests Specification

## Обзор

End-to-End тесты для LifeUndo покрывают критически важные пользовательские сценарии, включая триалы, платежи, рассылки и админ-функции.

## Технический стек

- **Framework**: Playwright
- **Language**: TypeScript
- **Database**: PostgreSQL (test database)
- **Queue**: Redis (test instance)
- **Email**: MailHog (local SMTP testing)

## Конфигурация тестов

### Environment Setup
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

### Test Database Setup
```typescript
// tests/setup.ts
import { Pool } from 'pg';

const testDb = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

export async function setupTestDatabase() {
  // Clean test data
  await testDb.query('DELETE FROM newsletter_sent');
  await testDb.query('DELETE FROM newsletter_schedule');
  await testDb.query('DELETE FROM subscriptions');
  await testDb.query('DELETE FROM payments');
  await testDb.query('DELETE FROM accounts');
  
  // Insert test data
  await testDb.query(`
    INSERT INTO accounts (id, email, display_name) VALUES 
    (1, 'test1@example.com', 'Test User 1'),
    (2, 'test2@example.com', 'Test User 2')
  `);
}

export async function cleanupTestDatabase() {
  await testDb.query('DELETE FROM newsletter_sent');
  await testDb.query('DELETE FROM newsletter_schedule');
  await testDb.query('DELETE FROM subscriptions');
  await testDb.query('DELETE FROM payments');
  await testDb.query('DELETE FROM accounts');
}
```

## Тестовые сценарии

### 1. Trial Flow Tests

#### `trial_start_requires_card_and_consent.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Trial Start Flow', () => {
  test('should require payment card and consent', async ({ page }) => {
    await page.goto('/ru/pricing');
    
    // Click Pro plan
    await page.click('[data-testid="pro-plan-button"]');
    
    // Trial modal should appear
    await expect(page.locator('[data-testid="trial-modal"]')).toBeVisible();
    
    // Start button should be disabled initially
    await expect(page.locator('[data-testid="start-trial-button"]')).toBeDisabled();
    
    // Add payment card
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    // Button should still be disabled without consent
    await expect(page.locator('[data-testid="start-trial-button"]')).toBeDisabled();
    
    // Check consent checkbox
    await page.check('[data-testid="consent-checkbox"]');
    
    // Button should now be enabled
    await expect(page.locator('[data-testid="start-trial-button"]')).toBeEnabled();
    
    // Start trial
    await page.click('[data-testid="start-trial-button"]');
    
    // Should redirect to success page
    await expect(page).toHaveURL(/.*success/);
    
    // Should show trial end date
    await expect(page.locator('[data-testid="trial-end-date"]')).toBeVisible();
  });
  
  test('should deny trial for duplicate card', async ({ page }) => {
    // Setup: user with same card already had trial
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO risk_profiles (account_id, card_hash, last_trial_at) 
      VALUES (999, 'duplicate_card_hash', now() - interval '6 months')
    `);
    
    await page.goto('/ru/pricing');
    await page.click('[data-testid="pro-plan-button"]');
    
    // Add duplicate card
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    await page.check('[data-testid="consent-checkbox"]');
    
    await page.click('[data-testid="start-trial-button"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Trial already used');
  });
});
```

#### `trial_end_charge_success.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Trial End Charge', () => {
  test('should charge successfully at trial end', async ({ page }) => {
    // Setup: user with trial ending now
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO subscriptions (id, account_id, plan, status, trial_ends_at, payment_token) 
      VALUES (1, 1, 'pro', 'trial', now() - interval '1 minute', 'tok_test_123')
    `);
    
    // Simulate time passing (trial ended)
    await page.goto('/api/test/time-travel', {
      method: 'POST',
      data: { time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });
    
    // Trigger charge attempt
    await page.goto('/api/test/trigger-charge', {
      method: 'POST',
      data: { subscriptionId: 1 }
    });
    
    // Simulate successful webhook
    await page.goto('/api/payments/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'test_signature' },
      data: {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 59900,
            status: 'succeeded',
            metadata: { subscription_id: '1' }
          }
        }
      }
    });
    
    // Check subscription status
    const subscription = await testDb.query(
      'SELECT status FROM subscriptions WHERE id = 1'
    );
    expect(subscription.rows[0].status).toBe('active');
  });
  
  test('should handle charge failure and retries', async ({ page }) => {
    // Setup: user with trial ending
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO subscriptions (id, account_id, plan, status, trial_ends_at, payment_token) 
      VALUES (2, 2, 'pro', 'trial', now() - interval '1 minute', 'tok_test_fail')
    `);
    
    // Trigger charge attempt
    await page.goto('/api/test/trigger-charge', {
      method: 'POST',
      data: { subscriptionId: 2 }
    });
    
    // Simulate failed webhook
    await page.goto('/api/payments/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'test_signature' },
      data: {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_fail',
            amount: 59900,
            status: 'requires_payment_method',
            metadata: { subscription_id: '2' }
          }
        }
      }
    });
    
    // Check subscription status
    const subscription = await testDb.query(
      'SELECT status, retries_count FROM subscriptions WHERE id = 2'
    );
    expect(subscription.rows[0].status).toBe('past_due');
    expect(subscription.rows[0].retries_count).toBe(1);
    
    // Check retry scheduled
    const retryJob = await redis.lrange('bull:charge-retry:waiting', 0, -1);
    expect(retryJob.length).toBeGreaterThan(0);
  });
});
```

### 2. Newsletter System Tests

#### `newsletter_send_nonduplicate.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Newsletter System', () => {
  test('should send unique templates without duplicates', async ({ page }) => {
    // Setup: user ready for newsletter
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO newsletter_schedule (account_id, active, next_send_at) 
      VALUES (1, true, now() - interval '1 minute')
    `);
    
    // Insert test templates
    await testDb.query(`
      INSERT INTO newsletter_templates (id, slug, title, body, locale) VALUES 
      (1, 'template-1', 'Test Template 1', 'Body 1', 'ru'),
      (2, 'template-2', 'Test Template 2', 'Body 2', 'ru'),
      (3, 'template-3', 'Test Template 3', 'Body 3', 'ru')
    `);
    
    // Trigger newsletter worker
    await page.goto('/api/test/trigger-newsletter-worker', {
      method: 'POST'
    });
    
    // Check that newsletter was sent
    const sent = await testDb.query(
      'SELECT template_id FROM newsletter_sent WHERE account_id = 1'
    );
    expect(sent.rows.length).toBe(1);
    expect([1, 2, 3]).toContain(sent.rows[0].template_id);
    
    // Check next send scheduled
    const schedule = await testDb.query(
      'SELECT next_send_at FROM newsletter_schedule WHERE account_id = 1'
    );
    expect(schedule.rows[0].next_send_at).toBeTruthy();
  });
  
  test('should not send duplicate templates', async ({ page }) => {
    // Setup: user with some templates already sent
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO newsletter_schedule (account_id, active, next_send_at) 
      VALUES (2, true, now() - interval '1 minute')
    `);
    
    await testDb.query(`
      INSERT INTO newsletter_templates (id, slug, title, body, locale) VALUES 
      (4, 'template-4', 'Test Template 4', 'Body 4', 'ru'),
      (5, 'template-5', 'Test Template 5', 'Body 5', 'ru')
    `);
    
    // Mark template 4 as already sent
    await testDb.query(`
      INSERT INTO newsletter_sent (account_id, template_id) VALUES (2, 4)
    `);
    
    // Trigger newsletter worker
    await page.goto('/api/test/trigger-newsletter-worker', {
      method: 'POST'
    });
    
    // Check that only template 5 was sent
    const sent = await testDb.query(
      'SELECT template_id FROM newsletter_sent WHERE account_id = 2 ORDER BY sent_at'
    );
    expect(sent.rows.length).toBe(2);
    expect(sent.rows[0].template_id).toBe(4); // already sent
    expect(sent.rows[1].template_id).toBe(5); // newly sent
  });
  
  test('should stop sending when subscription becomes active', async ({ page }) => {
    // Setup: user with active newsletter schedule
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO newsletter_schedule (account_id, active, next_send_at) 
      VALUES (3, true, now() - interval '1 minute')
    `);
    
    // Activate subscription
    await testDb.query(`
      INSERT INTO subscriptions (account_id, plan, status) 
      VALUES (3, 'pro', 'active')
    `);
    
    // Trigger newsletter worker
    await page.goto('/api/test/trigger-newsletter-worker', {
      method: 'POST'
    });
    
    // Check that newsletter schedule was deactivated
    const schedule = await testDb.query(
      'SELECT active FROM newsletter_schedule WHERE account_id = 3'
    );
    expect(schedule.rows[0].active).toBe(false);
    
    // Check that no newsletter was sent
    const sent = await testDb.query(
      'SELECT COUNT(*) FROM newsletter_sent WHERE account_id = 3'
    );
    expect(parseInt(sent.rows[0].count)).toBe(0);
  });
});
```

### 3. Admin Panel Tests

#### `admin_functionality.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.fill('[data-testid="totp"]', '123456');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL(/.*admin\/dashboard/);
  });
  
  test('should display dashboard metrics', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Check key metrics are displayed
    await expect(page.locator('[data-testid="active-subscriptions"]')).toBeVisible();
    await expect(page.locator('[data-testid="trials"]')).toBeVisible();
    await expect(page.locator('[data-testid="payments-24h"]')).toBeVisible();
    await expect(page.locator('[data-testid="churn-rate"]')).toBeVisible();
    
    // Check charts are rendered
    await expect(page.locator('[data-testid="subscriptions-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
  });
  
  test('should allow manual newsletter sending', async ({ page }) => {
    await page.goto('/admin/newsletters');
    
    // Select template
    await page.selectOption('[data-testid="template-select"]', '1');
    
    // Set filters
    await page.check('[data-testid="filter-trial"]');
    
    // Preview newsletter
    await page.click('[data-testid="preview-button"]');
    await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
    
    // Send newsletter
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
  
  test('should allow granting subscriptions', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Search for test user
    await page.fill('[data-testid="search-input"]', 'test1@example.com');
    await page.click('[data-testid="search-button"]');
    
    // Click on user
    await page.click('[data-testid="user-row-1"]');
    
    // Grant subscription
    await page.click('[data-testid="grant-button"]');
    await page.selectOption('[data-testid="grant-plan"]', 'vip');
    await page.fill('[data-testid="grant-note"]', 'Test grant');
    await page.click('[data-testid="confirm-grant"]');
    
    // Check success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify subscription was created
    const subscription = await testDb.query(
      'SELECT plan FROM subscriptions WHERE account_id = 1'
    );
    expect(subscription.rows[0].plan).toBe('vip');
  });
});
```

### 4. Payment Integration Tests

#### `payment_webhook.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Payment Webhooks', () => {
  test('should handle successful payment webhook', async ({ page }) => {
    // Setup: subscription with pending payment
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO subscriptions (id, account_id, plan, status, payment_token) 
      VALUES (10, 10, 'pro', 'trial', 'tok_test_123')
    `);
    
    // Send webhook
    const response = await page.request.post('/api/payments/webhook', {
      headers: {
        'stripe-signature': 'test_signature',
        'content-type': 'application/json'
      },
      data: {
        id: 'evt_test_123',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 59900,
            currency: 'rub',
            status: 'succeeded',
            metadata: {
              subscription_id: '10'
            }
          }
        }
      }
    });
    
    expect(response.status()).toBe(200);
    
    // Check subscription updated
    const subscription = await testDb.query(
      'SELECT status FROM subscriptions WHERE id = 10'
    );
    expect(subscription.rows[0].status).toBe('active');
    
    // Check payment recorded
    const payment = await testDb.query(
      'SELECT status FROM payments WHERE subscription_id = 10'
    );
    expect(payment.rows[0].status).toBe('succeeded');
  });
  
  test('should handle failed payment webhook', async ({ page }) => {
    // Setup: subscription
    await setupTestDatabase();
    await testDb.query(`
      INSERT INTO subscriptions (id, account_id, plan, status, payment_token) 
      VALUES (11, 11, 'pro', 'trial', 'tok_test_fail')
    `);
    
    // Send failed webhook
    const response = await page.request.post('/api/payments/webhook', {
      headers: {
        'stripe-signature': 'test_signature',
        'content-type': 'application/json'
      },
      data: {
        id: 'evt_test_fail',
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_fail',
            amount: 59900,
            currency: 'rub',
            status: 'requires_payment_method',
            metadata: {
              subscription_id: '11'
            }
          }
        }
      }
    });
    
    expect(response.status()).toBe(200);
    
    // Check subscription status
    const subscription = await testDb.query(
      'SELECT status, retries_count FROM subscriptions WHERE id = 11'
    );
    expect(subscription.rows[0].status).toBe('past_due');
    expect(subscription.rows[0].retries_count).toBe(1);
  });
});
```

### 5. Security Tests

#### `security_tests.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should require authentication for admin endpoints', async ({ page }) => {
    const response = await page.request.get('/admin/users');
    expect(response.status()).toBe(401);
  });
  
  test('should validate webhook signatures', async ({ page }) => {
    const response = await page.request.post('/api/payments/webhook', {
      data: { type: 'test' }
    });
    expect(response.status()).toBe(400);
  });
  
  test('should rate limit API endpoints', async ({ page }) => {
    // Make 100 requests quickly
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(page.request.get('/api/subscription/1'));
    }
    
    const responses = await Promise.all(promises);
    const rateLimited = responses.filter(r => r.status() === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

## Test Utilities

### Helper Functions
```typescript
// tests/utils/test-helpers.ts
export async function createTestUser(email: string) {
  const result = await testDb.query(
    'INSERT INTO accounts (email, display_name) VALUES ($1, $2) RETURNING id',
    [email, 'Test User']
  );
  return result.rows[0].id;
}

export async function createTestSubscription(accountId: number, status: string) {
  await testDb.query(
    `INSERT INTO subscriptions (account_id, plan, status, trial_ends_at) 
     VALUES ($1, 'pro', $2, now() + interval '7 days')`,
    [accountId, status]
  );
}

export async function waitForEmail(email: string, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const emails = await mailhog.getMessages();
    const userEmail = emails.find(e => e.to.includes(email));
    if (userEmail) return userEmail;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Email not received within ${timeout}ms`);
}
```

### Test Data Factory
```typescript
// tests/factories/user-factory.ts
export class UserFactory {
  static async create(options: Partial<UserOptions> = {}) {
    const defaults = {
      email: `test-${Date.now()}@example.com`,
      displayName: 'Test User',
      country: 'RU',
      source: 'site'
    };
    
    const userData = { ...defaults, ...options };
    
    const result = await testDb.query(
      `INSERT INTO accounts (email, display_name, country, source) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userData.email, userData.displayName, userData.country, userData.source]
    );
    
    return result.rows[0];
  }
}

export class SubscriptionFactory {
  static async create(accountId: number, options: Partial<SubscriptionOptions> = {}) {
    const defaults = {
      plan: 'pro',
      status: 'trial',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    const subData = { ...defaults, ...options };
    
    await testDb.query(
      `INSERT INTO subscriptions (account_id, plan, status, trial_ends_at) 
       VALUES ($1, $2, $3, $4)`,
      [accountId, subData.plan, subData.status, subData.trialEndsAt]
    );
  }
}
```

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: lifeundo_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npm run db:migrate:test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/lifeundo_test
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/lifeundo_test
          REDIS_URL: redis://localhost:6379
          BASE_URL: http://localhost:3000
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Performance Tests

### Load Testing
```typescript
// tests/performance/load-tests.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Load Tests', () => {
  test('should handle concurrent trial starts', async ({ browser }) => {
    const contexts = await Promise.all(
      Array(10).fill(0).map(() => browser.newContext())
    );
    
    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );
    
    // Start trials concurrently
    const promises = pages.map(async (page, index) => {
      await page.goto('/ru/pricing');
      await page.click('[data-testid="pro-plan-button"]');
      await page.fill('[data-testid="card-number"]', '4242424242424242');
      await page.fill('[data-testid="card-expiry"]', '12/25');
      await page.fill('[data-testid="card-cvc"]', '123');
      await page.check('[data-testid="consent-checkbox"]');
      await page.click('[data-testid="start-trial-button"]');
      
      return page.waitForURL(/.*success/);
    });
    
    const results = await Promise.all(promises);
    expect(results.length).toBe(10);
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });
});
```

## Monitoring and Reporting

### Test Metrics
- **Test Coverage**: > 90% critical paths
- **Test Execution Time**: < 10 minutes
- **Flaky Test Rate**: < 5%
- **Test Success Rate**: > 95%

### Reporting
- HTML report with screenshots
- Video recordings of failed tests
- Performance metrics
- Coverage reports

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Data Cleanup**: Clean up test data after each test
3. **Realistic Data**: Use realistic test data
4. **Error Scenarios**: Test both success and failure cases
5. **Performance**: Monitor test execution time
6. **Maintenance**: Keep tests up to date with UI changes
