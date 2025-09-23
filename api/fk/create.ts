// /api/fk/create.ts
// ВАЖНО: После ротации секретов в кабинете FK обновите ENV переменные в Vercel!
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

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
 * ВАЖНО: точная формула подписи должна соответствовать схеме, выбранной в кабинете FK.
 * Наиболее частая для ссылки оплаты:
 * sign = md5(`${merchant_id}:${amount}:${secret1}:${order_id}`)
 * Если в твоей схеме участвует валюта/описание — добавь их в том порядке, как в кабинете.
 */
function buildCreateSignature({
  merchant_id, amount, order_id, secret1,
}: { merchant_id: string; amount: string; order_id: string; secret1: string; }) {
  return md5(`${merchant_id}:${amount}:${secret1}:${order_id}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (allowCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { email, plan, locale } = req.body || {};
    if (!email || !plan) return res.status(400).json({ error: 'email and plan are required' });

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

    // Подпись по выбранной схеме
    const sign = buildCreateSignature({ merchant_id, amount, order_id, secret1 });

    // Ссылка на платёж (вариант с прямым переходом)
    // Базовая форма для новых кабинетов: https://pay.freekassa.ru/?m=<id>&oa=<amount>&o=<order_id>&s=<sign>&currency=<RUB>
    const desc = `LifeUndo ${plan} for ${email}`;
    const params = new URLSearchParams({
      m: merchant_id,
      oa: amount,                         // 2490.00
      o: order_id,
      s: sign,
      currency,
      us_email: email,
      us_plan: plan,
      lang: (locale === 'en' ? 'en' : 'ru'),
      em: email,                          // часть кабинетов показывает в UI
      description: desc                   // если поддерживается
    });

    const url = `https://pay.freekassa.ru/?${params.toString()}`;

    // Логируем без секретов:
    console.log('[FK][create]', { 
      order_id, 
      email: email.replace(/(.{2}).+(@.*)/, '$1***$2'), 
      plan, 
      amount: Number(amount), 
      currency 
    });

    return res.status(200).json({ url, order_id });
  } catch (err: any) {
    console.error('[FK][create][error]', { message: err?.message });
    return res.status(500).json({ error: 'internal_error', message: err?.message || 'unknown' });
  }
}