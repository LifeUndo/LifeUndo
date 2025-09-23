// utils/correlationId.ts
// Генерация и управление Correlation ID для трассировки

/**
 * Генерирует уникальный Correlation ID
 * Формат: cid-<timestamp>-<random>
 */
export function generateCorrelationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `cid-${timestamp}-${random}`;
}

/**
 * Извлекает IP адрес из запроса (с учётом прокси)
 */
export function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}
