// /api/fk/notify.ts
// ВАЖНО: Notify URL должен указывать на Vercel-домен: https://<project>.vercel.app/api/fk/notify
// ВАЖНО: После ротации секретов обновите ENV переменные в Vercel!
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { timingSafeEq } from '../../utils/timingSafeEq';
import { isOrderProcessed, markOrderProcessed } from '../../utils/idempotency';
import { readBody } from '../../utils/readBody';

function md5(s: string) {
  return crypto.createHash('md5').update(s, 'utf8').digest('hex');
}

/**
 * Формула подписи для notify с учетом валюты:
 * Если есть currency: md5(m:oa:currency:SECRET2:o)
 * Если нет currency: md5(m:oa:SECRET2:o)
 */
function buildNotifySignature({
  merchant_id, amount, order_id, secret2, currency
}: { merchant_id: string; amount: string; order_id: string; secret2: string; currency?: string; }) {
  if (currency) {
    return md5(`${merchant_id}:${amount}:${currency}:${secret2}:${order_id}`);
  } else {
    return md5(`${merchant_id}:${amount}:${secret2}:${order_id}`);
  }
}

function isAllowedIp(ip?: string) {
  const list = (process.env.FK_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!list.length) return true; // если не задано — не ограничиваем
  if (!ip) return false;
  // X-Forwarded-For может содержать список
  const ips = ip.split(',').map(s => s.trim());
  return ips.some(x => list.includes(x));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Поддержка GET/HEAD для кнопки "Проверить статус"
  if (req.method === 'GET' || req.method === 'HEAD') {
    return res.status(200).send('OK');
  }
  
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const fwd = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  if (!isAllowedIp(fwd)) {
    console.warn('[FK][notify] blocked ip', fwd);
    return res.status(403).send('Forbidden');
  }

  try {
    // Универсальный парсер тела (JSON, x-www-form-urlencoded, querystring)
    const body = await readBody(req);

    // Нормализуем ключи (верхний/нижний регистр)
    const pick = (k: string) => body[k] ?? body[k.toUpperCase()] ?? body[k.toLowerCase()];
    const merchant_id = String(pick('MERCHANT_ID') ?? '');
    const amount = String(pick('AMOUNT') ?? '');
    const order_id = String(pick('PAYMENT_ID') ?? pick('order_id') ?? '');
    const sign = String(pick('SIGN') ?? pick('sign') ?? '');
    const currency = String(pick('CURRENCY') ?? pick('currency') ?? '');
    const intid = pick('intid');
    const us_email = pick('us_email');
    const us_plan = pick('us_plan');
    const us_cid = pick('us_cid'); // Correlation ID для трассировки

    if (!merchant_id || !amount || !order_id || !sign) {
      console.warn('[FK][notify] missing fields', req.body);
      return res.status(400).send('Bad Request');
    }
    if (merchant_id !== process.env.FK_MERCHANT_ID) {
      console.warn('[FK][notify] wrong merchant', merchant_id);
      return res.status(400).send('Bad merchant');
    }

    const secret2 = process.env.FK_SECRET2!;
    const expected = buildNotifySignature({ merchant_id, amount, order_id, secret2, currency });

    if (!timingSafeEq(expected.toLowerCase(), sign.toLowerCase())) {
      console.warn('[FK][notify] bad signature', { order_id });
      return res.status(400).send('Bad signature');
    }

    // Валидация суммы (защита от рассинхронизации)
    const priceMap: Record<string, number> = {
      'pro_month': 149,
      'pro_year': 1490,
      'vip_lifetime': 2490,
    };
    const expectedAmount = priceMap[us_plan || ''];
    if (expectedAmount && Number(amount) !== expectedAmount) {
      console.warn('[FK][notify] amount mismatch', { 
        order_id, 
        expected: expectedAmount, 
        received: Number(amount),
        plan: us_plan 
      });
      return res.status(400).send('Bad amount');
    }

    // Идемпотентность: проверяем, не обработан ли уже заказ
    if (await isOrderProcessed(order_id)) {
      console.log('[FK][notify] Already processed', { order_id });
      return res.status(200).send('OK');
    }

    // Отмечаем заказ как обработанный
    await markOrderProcessed(order_id, amount, us_plan, us_email);

    console.log(`[FK][notify] OK order_id=${order_id}`, {
      order_id,
      amount: Number(amount),
      intid,
      plan: us_plan,
      email: us_email ? String(us_email).replace(/(.{2}).+(@.*)/, '$1***$2') : undefined,
      correlation_id: us_cid
    });

    // Здесь: выдать/отправить ключ лицензии на email (MVP: вручную/через Google Sheets),
    // или пометить заказ оплаченным для кабинета.
    // Ответ в формате успеха для FK (обычно 'YES' или 'OK').
    return res.status(200).send('YES');
  } catch (e: any) {
    console.error('[FK][notify][error]', e?.message);
    return res.status(500).send('ERROR');
  }
}