import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const FK_MERCHANT_ID = process.env.FK_MERCHANT_ID!;
const FK_SECRET = process.env.FK_SECRET!;

// Таблица планов в рублях (RU-витрина)
const PLANS = {
  pro_month:     { amount: 149,  currency: 'RUB', label: 'Pro (месяц)' },
  pro_year:      { amount: 1490, currency: 'RUB', label: 'Pro (год)' },
  vip_lifetime:  { amount: 2490, currency: 'RUB', label: 'VIP (Lifetime)' },
  team:          { amount: 150,  currency: 'RUB', label: 'Team (за место, от)' }
} as const;

// ❗ Подставить точную формулу подписи из FreeKassa (проверь в кабинете)
// Ниже — шаблон под sha256(merchant_id:amount:currency:order_id:secret)
function signPayment(merchant_id: string, amount: number, currency: string, order_id: string) {
  const base = `${merchant_id}:${amount}:${currency}:${order_id}:${FK_SECRET}`;
  return crypto.createHash('sha256').update(base).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, plan, locale = 'ru' } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Bad email' });
  }
  if (!plan || !(plan in PLANS)) {
    return res.status(400).json({ error: 'Bad plan' });
  }

  const meta = PLANS[plan as keyof typeof PLANS];
  const order_id = `LU-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const sign = signPayment(FK_MERCHANT_ID, meta.amount, meta.currency, order_id);

  const params = new URLSearchParams({
    merchant_id: FK_MERCHANT_ID,
    amount: String(meta.amount),
    currency: meta.currency,
    order_id,
    sign,
    us_email: email,
    us_plan: String(plan),
    us_locale: String(locale).toLowerCase() === 'en' ? 'en' : 'ru'
  });

  // Уточнить актуальный URL оплаты в FreeKassa (при необходимости заменить)
  const payUrl = `https://pay.freekassa.ru/?${params.toString()}`;

  return res.status(200).json({ url: payUrl, order_id });
}
