// utils/timingSafeEq.ts
import crypto from 'crypto';

/**
 * Константное сравнение строк для защиты от тайминг-атак
 * Использует crypto.timingSafeEqual для предотвращения утечки информации
 * через время выполнения сравнения
 */
export function timingSafeEq(a: string, b: string): boolean {
  const A = Buffer.from(a, 'utf8');
  const B = Buffer.from(b, 'utf8');
  
  if (A.length !== B.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(A, B);
}
