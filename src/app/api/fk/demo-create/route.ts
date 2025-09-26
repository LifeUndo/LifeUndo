import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Demo FreeKassa API - только для тестирования
// Использует тестовые ключи из FK_MERCHANT_ID.env

function calcMd5(base: string) { 
  return crypto.createHash('md5').update(base).digest('hex'); 
}

function buildCreateSignature({ merchant_id, amount, order_id, secret1, currency }: {
  merchant_id: string;
  amount: string;
  order_id: string;
  secret1: string;
  currency: string;
}) {
  const base = `${merchant_id}:${amount}:${secret1}:${order_id}`;
  return calcMd5(base);
}

function allowCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'https://lifeundo.ru',
    'http://localhost:3000',
    'https://localhost:3000'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Origin');
  
  if (req.method === 'OPTIONS') {
    return true;
  }
  
  return false;
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({});
  
  if (allowCors(req, res)) {
    return res;
  }

  try {
    const body = await req.json();
    const { email, plan, locale = 'ru', honeypot } = body;

    // Honeypot protection
    if (honeypot) {
      return NextResponse.json({ error: 'spam_detected' }, { status: 400 });
    }

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    // Plan pricing (demo prices)
    const planPrices = {
      'pro_monthly': 990.00,
      'vip_lifetime': 2490.00
    };

    const amount = planPrices[plan];
    if (!amount) {
      return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });
    }

    // Demo credentials from FK_MERCHANT_ID.env
    const merchant_id = process.env.FK_MERCHANT_ID || "65875";
    const secret1 = process.env.FK_SECRET1 || "myavF/PTAGmJz,(";
    const currency = process.env.CURRENCY || "RUB";

    // Generate order ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const order_id = `LU-DEMO-${timestamp}-${random}`;

    // Generate correlation ID
    const correlationId = `cid-${timestamp}-${random}`;

    // Build signature
    const sign = buildCreateSignature({ 
      merchant_id, 
      amount: amount.toFixed(2), 
      order_id, 
      secret1, 
      currency 
    });

    // Build payment URL with tracking parameters
    const params = new URLSearchParams({
      m: merchant_id,
      oa: amount.toFixed(2),
      o: order_id,
      s: sign,
      currency,
      us_email: email,
      us_plan: plan,
      us_cid: correlationId,
      lang: locale,
      em: email,
      description: `LifeUndo ${plan} for ${email} (DEMO)`
    });

    const url = `https://pay.freekassa.ru/?${params.toString()}`;

    // Log demo payment creation
    console.log('[FK][DEMO][create]', { 
      order_id, 
      email: email.replace(/(.{2}).+(@.*)/, '$1***$2'), 
      plan, 
      amount, 
      currency,
      correlation_id: correlationId,
      demo_mode: true
    });

    return NextResponse.json({ 
      url, 
      order_id,
      demo_mode: true,
      message: "Демо-режим: платеж создан, но не будет обработан"
    });

  } catch (err: any) {
    console.error('[FK][DEMO][create][error]', { message: err?.message });
    return NextResponse.json({ 
      error: 'internal_error', 
      message: err?.message || 'unknown',
      demo_mode: true
    }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.json({});
  allowCors(req, res);
  return res;
}
