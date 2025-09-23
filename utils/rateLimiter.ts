// utils/rateLimiter.ts
// Простой rate limiter для защиты от спама

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Простая in-memory реализация (для продакшена заменить на Redis/KV)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Проверяет rate limit для IP адреса
 * @param ip IP адрес клиента
 * @param limit Максимальное количество запросов
 * @param windowMs Окно времени в миллисекундах
 * @returns true если лимит не превышен, false если превышен
 */
export function checkRateLimit(
  ip: string, 
  limit: number = 10, 
  windowMs: number = 60 * 1000 // 1 минута
): boolean {
  const now = Date.now();
  const key = `rate_limit:${ip}`;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Создаём новую запись или сбрасываем истёкшую
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (entry.count >= limit) {
    // Лимит превышен
    return false;
  }
  
  // Увеличиваем счётчик
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return true;
}

/**
 * Очищает старые записи rate limit (вызывать периодически)
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
