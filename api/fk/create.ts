// /api/fk/create.ts
// ВАЖНО: После ротации секретов в кабинете FK обновите ENV переменные в Vercel!
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { checkRateLimit } from '../../utils/rateLimiter';
import { generateCorrelationId, getClientIP } from '../../utils/correlationId';

const allowCors = (req: VercelRequest, res: VercelResponse) => {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '600'); // Кеш префлайта для Safari
    res.status(204).end();
    return true;
  }
  return false;
};

function md5(s: string) {
  return crypto.createHash('md5').update(s, 'utf8').digest('hex');
}

/**
 * Формула подписи для FreeKassa (правильный порядок):
 * md5(merchant_id:amount:secret1:currency:order_id)
 * Секрет ПЕРЕД валютой
 */
function buildCreateSignature({
  merchant_id, amount, order_id, secret1, currency
}: { merchant_id: string; amount: string; order_id: string; secret1: string; currency: string; }) {
  return md5(`${merchant_id}:${amount}:${secret1}:${currency}:${order_id}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    // Rate limiting (анти-спам)
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP, 10, 60 * 1000)) { // 10 запросов в минуту
      console.warn('[FK][create] Rate limit exceeded', { ip: clientIP });
      return res.status(429).json({ error: 'Too Many Requests' });
    }

    const { email, plan, locale, honeypot } = req.body || {};
    
    // Honeypot защита от ботов
    if (honeypot) {
      console.warn('[FK][create] Honeypot triggered', { ip: clientIP });
      return res.status(400).json({ error: 'Bad Request' });
    }
    
    if (!email || !plan) return res.status(400).json({ error: 'email and plan are required' });

    // Генерируем Correlation ID для трассировки
    const correlationId = generateCorrelationId();

    // Подбираем сумму по плану (RU-прейскурант из нашего плана)
    // Можно вынести в ENV/JSON.
    const priceMap: Record<string, number> = {
      'pro_month': 149,
      'pro_year': 1490,
      'vip_lifetime': 2490,
    };
    const rub = priceMap[plan];
    if (!rub) return res.status(400).json({ error: 'unknown plan' });

    const merchant_id = process.env.FK_MERCHANT_ID!;
    const secret1 = process.env.FK_SECRET1!;
    const currency = process.env.CURRENCY || 'RUB';

    // Уникальный order_id
    const order_id = `LU-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Сумму в строку с точкой (FK любит 2 знака, но для RUB часто допускает целое)
    const amount = Number(rub).toFixed(2).replace(',', '.');

    // Подпись по выбранной схеме (с валютой)
    const sign = buildCreateSignature({ merchant_id, amount, order_id, secret1, currency });

    // Ссылка на платёж с us_* параметрами для трассировки
    const params = new URLSearchParams({
      m: merchant_id,
      oa: amount,                         // 2490.00
      o: order_id,
      s: sign,
      currency,
      us_email: email,                    // Передаем email для вебхука
      us_plan: plan,                      // Передаем план для валидации
      us_cid: correlationId               // Correlation ID для трассировки
    });

    const url = `https://pay.freekassa.ru/?${params.toString()}`;

    // Логируем без секретов:
    console.log('[FK][create]', { 
      order_id, 
      email: email.replace(/(.{2}).+(@.*)/, '$1***$2'), 
      plan, 
      amount: Number(amount), 
      currency,
      correlation_id: correlationId,
      ip: clientIP
    });

    return res.status(200).json({ url, order_id });
  } catch (err: any) {
    console.error('[FK][create][error]', { message: err?.message });
    return res.status(500).json({ error: 'internal_error', message: err?.message || 'unknown' });
  }
}