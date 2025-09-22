import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Переменные окружения
const FK_MERCHANT_ID = process.env.FK_MERCHANT_ID!;
const FK_SECRET = process.env.FK_SECRET!;
const FK_ALLOWED_IPS = (process.env.FK_ALLOWED_IPS || '').split(',').map(s => s.trim()).filter(Boolean);

function clientIp(req: VercelRequest): string {
  const h = (s: string) => (req.headers[s] as string) || '';
  return h('x-real-ip') || h('x-forwarded-for')?.split(',')[0]?.trim() || (req.socket as any).remoteAddress || '';
}

// Таблица планов (та же, что в create.ts)
const PLANS = {
  pro_month:     { amount: 149,  currency: 'RUB', label: 'Pro (месяц)' },
  pro_year:      { amount: 1490, currency: 'RUB', label: 'Pro (год)' },
  vip_lifetime:  { amount: 2490, currency: 'RUB', label: 'VIP (Lifetime)' },
  team:          { amount: 150,  currency: 'RUB', label: 'Team (за место, от)' }
} as const;

// Хранилище обработанных заказов (в памяти, позже можно заменить на KV/Blob)
const processedOrders = new Set<string>();

// Проверка подписи FreeKassa (точно такая же формула, как в create.ts)
function verifySignature(payload: Record<string, any>): boolean {
  const crypto = require('crypto');
  const sign = String(payload.sign || payload.signature || '');
  
  // Точная формула: SHA256(merchant_id:amount:currency:order_id:secret)
  const base = `${payload.merchant_id}:${payload.amount}:${payload.currency}:${payload.order_id}:${FK_SECRET}`;
  const digest = crypto.createHash('sha256').update(base).digest('hex');
  
  return digest.toLowerCase() === sign.toLowerCase();
}

// Валидация плана и суммы
function validatePlanAndAmount(plan: string, amount: number, currency: string): boolean {
  if (!plan || !(plan in PLANS)) return false;
  
  const expectedPlan = PLANS[plan as keyof typeof PLANS];
  return expectedPlan.amount === amount && expectedPlan.currency === currency;
}

function jsonLine(o: any) {
  try { return JSON.stringify(o); } catch { return '{}'; }
}

function planLabel(code: string) {
  switch (code) {
    case 'pro_month': return 'Pro (месяц) / Pro (monthly)';
    case 'pro_year': return 'Pro (год) / Pro (yearly)';
    case 'vip_lifetime': return 'VIP (Lifetime)';
    case 'team': return 'Team';
    default: return code || 'Pro';
  }
}

async function sendEmailRU(to: string, data: any) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: { 
      user: process.env.SMTP_USER!, 
      pass: process.env.SMTP_PASS! 
    }
  });

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#0b1020">
      <h2 style="margin:0 0 8px">Оплата получена ✅</h2>
      <p>Заказ <b>${data.order_id}</b> — план: <b>${data.plan_label}</b>, сумма: <b>${data.amount} ${data.currency}</b>.</p>
      <p><b>Что дальше:</b> ключ/лицензия будет выдан(а) в ближайшее время.
         Если письмо с ключом не пришло в течение 1 часа, <a href="https://lifeundo.ru/support/">напишите в поддержку</a>.</p>
      <p>Полезные ссылки: <a href="https://lifeundo.ru/pricing/">Тарифы</a> ·
         <a href="https://lifeundo.ru/support/">Поддержка</a> ·
         <a href="https://lifeundo.ru/fund/">Фонд (10%)</a></p>
      <p>Спасибо, что поддерживаете приватные инструменты!<br>LifeUndo / GetLifeUndo</p>
    </div>
  `;

  const text = `Привет!

Мы получили оплату по заказу ${data.order_id} — план: ${data.plan_label}, сумма: ${data.amount} ${data.currency}.

Что дальше:
— Ключ/лицензия будет выдан(а) в ближайшее время. Если письмо с ключом не пришло в течение 1 часа, просто ответьте на это письмо или напишите в поддержку: https://lifeundo.ru/support/

Полезные ссылки:
— Тарифы: https://lifeundo.ru/pricing/
— Поддержка: https://lifeundo.ru/support/
— О фонде (10%): https://lifeundo.ru/fund/

Спасибо, что поддерживаете приватные инструменты!
LifeUndo / GetLifeUndo`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM!,
    to,
    subject: `LifeUndo — оплата получена (заказ ${data.order_id})`,
    text,
    html
  });
}

async function sendEmailEN(to: string, data: any) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: { 
      user: process.env.SMTP_USER!, 
      pass: process.env.SMTP_PASS! 
    }
  });

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#0b1020">
      <h2 style="margin:0 0 8px">Payment received ✅</h2>
      <p>Order <b>${data.order_id}</b> — plan: <b>${data.plan_label}</b>, amount: <b>${data.amount} ${data.currency}</b>.</p>
      <p><b>What's next:</b> your license/key will be issued shortly.
         If you don't receive it within 1 hour, <a href="https://lifeundo.ru/en/support/">contact support</a>.</p>
      <p>Links: <a href="https://lifeundo.ru/en/pricing/">Pricing</a> ·
         <a href="https://lifeundo.ru/en/support/">Support</a> ·
         <a href="https://lifeundo.ru/en/fund/">10% Fund</a></p>
      <p>Thank you for supporting privacy-first tools!<br>LifeUndo / GetLifeUndo</p>
    </div>
  `;

  const text = `Hi!

We received your payment for order ${data.order_id} — plan: ${data.plan_label}, amount: ${data.amount} ${data.currency}.

What's next:
— Your license/key will be issued shortly. If you don't receive it within 1 hour, reply to this email or contact support: https://lifeundo.ru/en/support/

Useful links:
— Pricing: https://lifeundo.ru/en/pricing/
— Support: https://lifeundo.ru/en/support/
— 10% Fund: https://lifeundo.ru/en/fund/

Thank you for supporting privacy-first tools!
LifeUndo / GetLifeUndo`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM!,
    to,
    subject: `LifeUndo — payment received (order ${data.order_id})`,
    text,
    html
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // 1) IP whitelist (если задан)
  const ip = clientIp(req);
  if (FK_ALLOWED_IPS.length && !FK_ALLOWED_IPS.includes(ip)) {
    console.warn('FK IP blocked:', ip);
    return res.status(403).send('Forbidden');
  }

  const body = req.body || {};
  
  // 2) Базовые проверки
  if (!body.merchant_id || String(body.merchant_id) !== FK_MERCHANT_ID) {
    console.error('Bad merchant ID:', body.merchant_id);
    return res.status(400).send('Bad merchant');
  }
  
  if (!body.order_id || !body.amount || !body.currency) {
    console.error('Missing required fields:', { order_id: body.order_id, amount: body.amount, currency: body.currency });
    return res.status(400).send('Missing fields');
  }

  // 3) Проверка подписи
  const signatureOk = verifySignature(body);

  // 4) Идемпотентность - проверяем, не обрабатывали ли уже этот заказ
  const orderId = String(body.order_id);
  if (processedOrders.has(orderId)) {
    console.log('Order already processed:', orderId);
    return res.status(200).send('OK'); // Уже обработан, возвращаем OK
  }

  // 5) Валидация плана и суммы
  const plan = String(body.us_plan || '');
  const amount = Number(body.amount);
  const currency = String(body.currency);
  
  if (!validatePlanAndAmount(plan, amount, currency)) {
    console.error('Invalid plan/amount for order:', orderId, { plan, amount, currency });
    return res.status(400).send('Invalid plan or amount');
  }

  // 6) Подготовим запись
  const record = {
    ts: new Date().toISOString(),
    provider: 'freekassa',
    merchant_id: String(body.merchant_id),
    order_id: orderId,
    amount,
    currency,
    plan,
    email: String(body.us_email || ''),
    locale: String(body.us_locale || 'ru'),
    signature_ok: signatureOk,
    processed: true,
    raw: body
  };

  try {
    // Логируем запись (позже можно добавить Vercel Blob/KV)
    console.log('FK record:', jsonLine(record));
  } catch (e) {
    console.error('Logging error:', e);
  }

  // Если подпись неверная - возвращаем ошибку
  if (!signatureOk) {
    console.error('Bad signature for order:', orderId);
    return res.status(400).send('Bad signature');
  }

  // Помечаем заказ как обработанный
  processedOrders.add(orderId);

  // 5) Отправляем письмо покупателю
  const email = String(body.us_email || '');
  const locale = String(body.us_locale || 'ru').toLowerCase();
  
  if (email) {
    try {
      const emailData = {
        order_id: String(body.order_id),
        amount: Number(body.amount),
        currency: String(body.currency),
        plan_label: planLabel(String(body.us_plan || ''))
      };
      
      if (locale === 'en') {
        await sendEmailEN(email, emailData);
      } else {
        await sendEmailRU(email, emailData);
      }
      
      console.log('Email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Не прерываем выполнение - письмо не критично
    }
  }

  return res.status(200).send('OK');
}
