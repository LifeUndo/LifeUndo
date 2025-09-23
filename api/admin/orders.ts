// /api/admin/orders.ts
// Мини-админ-скрипт для поиска заказов и переотправки ключей
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Простая авторизация (в продакшене заменить на JWT/OAuth)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-secret-key';

function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  if (req.method === 'GET') {
    // Поиск заказа по order_id или email
    const { order_id, email } = req.query;
    
    if (!order_id && !email) {
      return res.status(400).json({ error: 'order_id or email required' });
    }

    // Для MVP: возвращаем заглушку
    // В продакшене здесь будет поиск в KV/DB
    const mockOrder = {
      order_id: order_id || 'LU-1234567890-abc123',
      email: email || 'test@example.com',
      plan: 'vip_lifetime',
      amount: 2490,
      status: 'paid',
      paid_at: new Date().toISOString(),
      intid: '999999'
    };

    return res.status(200).json({
      found: true,
      order: mockOrder
    });
  }

  if (req.method === 'POST') {
    // Переотправка ключа лицензии
    const { order_id, action } = req.body;
    
    if (!order_id || action !== 'resend_license') {
      return res.status(400).json({ error: 'order_id and action=resend_license required' });
    }

    // Для MVP: логируем действие
    console.log('[ADMIN][resend_license]', {
      order_id,
      action: 'resend_license',
      timestamp: new Date().toISOString()
    });

    // В продакшене здесь будет:
    // 1. Поиск заказа в KV/DB
    // 2. Генерация нового ключа лицензии
    // 3. Отправка email с ключом
    // 4. Логирование действия

    return res.status(200).json({
      success: true,
      message: 'License key resent',
      order_id
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
