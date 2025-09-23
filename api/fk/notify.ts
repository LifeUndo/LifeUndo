// /api/fk/notify.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

function md5(s: string) {
  return crypto.createHash('md5').update(s, 'utf8').digest('hex');
}

/**
 * Для notify обычно требуется:
 * md5(`${merchant_id}:${amount}:${secret2}:${order_id}`)
 * НО! Ориентируйся на «Секретное слово 2» и порядок полей из кабинета FK.
 */
function buildNotifySignature({
  merchant_id, amount, order_id, secret2,
}: { merchant_id: string; amount: string; order_id: string; secret2: string; }) {
  return md5(`${merchant_id}:${amount}:${secret2}:${order_id}`);
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
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const fwd = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  if (!isAllowedIp(fwd)) {
    console.warn('[FK][notify] blocked ip', fwd);
    return res.status(403).send('Forbidden');
  }

  try {
    const {
      MERCHANT_ID, AMOUNT, intid, SIGN, PAYMENT_ID, // частые имена из FK
      // Параллельно прими наши кастомные (если FK присылает их как us_*):
      us_email, us_plan,
    } = req.body || {};

    // Нормализуем (FK иногда шлёт в другом регистре)
    const merchant_id = String(MERCHANT_ID ?? req.body?.merchant_id ?? '');
    const amount = String(AMOUNT ?? req.body?.amount ?? '');
    const order_id = String(PAYMENT_ID ?? req.body?.order_id ?? '');
    const sign = String(SIGN ?? req.body?.sign ?? '');

    if (!merchant_id || !amount || !order_id || !sign) {
      console.warn('[FK][notify] missing fields', req.body);
      return res.status(400).send('Bad Request');
    }
    if (merchant_id !== process.env.FK_MERCHANT_ID) {
      console.warn('[FK][notify] wrong merchant', merchant_id);
      return res.status(400).send('Bad merchant');
    }

    const secret2 = process.env.FK_SECRET2!;
    const expected = buildNotifySignature({ merchant_id, amount, order_id, secret2 });

    if (expected.toLowerCase() !== sign.toLowerCase()) {
      console.warn('[FK][notify] bad signature', { order_id });
      return res.status(400).send('Bad signature');
    }

    // Идемпотентность: храним статус order_id где-то (kv/db); для MVP — просто лог
    console.log('[FK][notify] OK', {
      order_id,
      amount,
      intid,
      plan: us_plan,
      emailMasked: us_email ? String(us_email).replace(/(.{2}).+(@.*)/, '$1***$2') : undefined
    });

    // Здесь: выдать/отправить ключ лицензии на email (MVP: вручную/через Google Sheets),
    // или пометить заказ оплаченным для кабинета.
    // Ответ в формате успеха для FK (обычно 'YES' или 'OK').
    return res.status(200).send('OK');
  } catch (e: any) {
    console.error('[FK][notify][error]', e?.message);
    return res.status(500).send('ERROR');
  }
}