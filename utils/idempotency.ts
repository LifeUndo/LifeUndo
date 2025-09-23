// utils/idempotency.ts
// Простая идемпотентность для предотвращения дублирования обработки заказов

interface OrderStatus {
  paid: boolean;
  processed_at: string;
  amount: string;
  plan?: string;
  email?: string;
}

/**
 * Проверяет, был ли заказ уже обработан
 * Для MVP используем простую проверку через логи
 * В продакшене можно заменить на Vercel KV или Redis
 */
export async function isOrderProcessed(order_id: string): Promise<boolean> {
  // Для MVP: просто возвращаем false (всегда обрабатываем)
  // В продакшене здесь будет проверка KV/Redis
  return false;
}

/**
 * Отмечает заказ как обработанный
 * Для MVP: просто логируем
 * В продакшене здесь будет запись в KV/Redis с TTL
 */
export async function markOrderProcessed(
  order_id: string, 
  amount: string, 
  plan?: string, 
  email?: string
): Promise<void> {
  // Для MVP: просто логируем
  console.log('[FK][idempotency] Order processed', {
    order_id,
    amount: Number(amount),
    plan,
    email: email ? email.replace(/(.{2}).+(@.*)/, '$1***$2') : undefined,
    processed_at: new Date().toISOString(),
    ttl_days: 30 // TTL для очистки старых записей
  });
  
  // В продакшене здесь будет:
  // await kv.set(`order:${order_id}`, { 
  //   paid: true, 
  //   processed_at: new Date().toISOString(), 
  //   amount, 
  //   plan, 
  //   email 
  // }, { ttl: 30 * 24 * 60 * 60 }); // 30 дней
}

/**
 * Получает статус заказа
 * Для MVP: всегда возвращаем null (не обработан)
 * В продакшене здесь будет чтение из KV/Redis
 */
export async function getOrderStatus(order_id: string): Promise<OrderStatus | null> {
  // Для MVP: всегда возвращаем null
  return null;
}
