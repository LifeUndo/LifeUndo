import { NextRequest, NextResponse } from 'next/server';
import { PLANS, isValidPlan, getPlanAmount } from '@/config/plans';
import crypto from 'crypto';

// Совместимость: план → productId
const PLAN_TO_PRODUCT: Record<string, string> = {
  pro_month: 'PROM',
  vip_lifetime: 'VIPL',
  team_5: 'TEAM5',
  starter_6m: 'S6M',
};

// Фиксированные суммы по productId (строго две цифры при форматировании)
const PRODUCT_AMOUNTS: Record<string, number> = {
  PROM: 599.00,
  VIPL: 9990.00,
  TEAM5: 2990.00,
  S6M: 3000.00,
} as const;

export async function POST(req: NextRequest) {
  try {
    // Разбор входа с совместимостью (plan или productId)
    const body = await req.json().catch(() => ({} as any));
    const planRaw = body?.plan;
    const productIdRaw = body?.productId;
    const plan = typeof planRaw === 'string' ? planRaw.trim() : undefined;
    const productId = typeof productIdRaw === 'string' ? productIdRaw.trim() : undefined;

    // Включение по флагу (прод/превью одинаково)
    const fkEnabled = String(process.env.NEXT_PUBLIC_FK_ENABLED || '').toLowerCase() === 'true';
    if (!fkEnabled) {
      return NextResponse.json({ ok: false, error: 'fk-disabled' }, { status: 400 });
    }

    // Вычисляем productId по плану, если он не передан
    const effectiveProductId = productId || (plan ? PLAN_TO_PRODUCT[plan] : undefined);

    // Валидация входа
    if (!effectiveProductId) {
      return NextResponse.json(
        { ok: false, error: plan ? 'invalid_plan' : 'invalid_productId' },
        { status: 400 }
      );
    }
    if (!PRODUCT_AMOUNTS[effectiveProductId]) {
      return NextResponse.json({ ok: false, error: 'invalid_productId' }, { status: 400 });
    }

    const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID!;
    const SECRET1 = process.env.FREEKASSA_SECRET1!;
    const AMOUNT = PRODUCT_AMOUNTS[effectiveProductId].toFixed(2); // "599.00" - строго две цифры
    const ORDER_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const CURRENCY = 'RUB';

    // Подпись (без раскрытия деталей в логах)
    const signatureString = `${MERCHANT_ID}:${AMOUNT}:${SECRET1}:${ORDER_ID}`;
    const SIGN = crypto.createHash('md5').update(signatureString, 'utf8').digest('hex');

    // Формируем URL для редиректа
    const qs = new URLSearchParams({
      m: MERCHANT_ID,
      oa: AMOUNT,
      o: ORDER_ID,
      s: SIGN,
      currency: CURRENCY,
    });

    const pay_url = `${process.env.FREEKASSA_PAYMENT_URL || 'https://pay.freekassa.net/'}?${qs.toString()}`;

    // Логируем для отладки (без секретов)
    console.log('FreeKassa payment created:', {
      productId: effectiveProductId,
      orderId: ORDER_ID,
      amount: AMOUNT,
      currency: CURRENCY,
      signatureString: signatureString.replace(SECRET1, '***'),
      signature: SIGN.substring(0, 8) + '...',
      payUrl: pay_url.substring(0, 50) + '...',
    });

    return NextResponse.json({
      ok: true,
      pay_url,
      orderId: ORDER_ID,
      productId: effectiveProductId,
    });
  } catch (error) {
    console.error('FreeKassa payment error:', error);
    return NextResponse.json({ ok: false, error: 'payment_creation_failed' }, { status: 500 });
  }
}

