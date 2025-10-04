import { NextRequest, NextResponse } from 'next/server';
import { PLANS, isValidPlan, getPlanAmount } from '@/config/plans';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    
    // Проверяем валидность плана
    if (!isValidPlan(productId)) {
      return NextResponse.json({ ok: false, error: 'unknown_plan' }, { status: 400 });
    }
    
    const plan = PLANS[productId];
    const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID!;
    const SECRET1 = process.env.FREEKASSA_SECRET1!;
    const AMOUNT = getPlanAmount(productId); // "599.00"
    const ORDER_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const CURRENCY = 'RUB';
    
    // Проверяем конфигурацию
    if (!MERCHANT_ID || !SECRET1) {
      return NextResponse.json({ ok: false, error: 'fk_not_configured' }, { status: 500 });
    }
    
    // Создаем подпись: MERCHANT_ID:AMOUNT:SECRET1:ORDER_ID
    // Важно: AMOUNT должен быть строкой с двумя знаками после точки
    const signatureString = `${MERCHANT_ID}:${AMOUNT}:${SECRET1}:${ORDER_ID}`;
    const SIGN = crypto.createHash('md5').update(signatureString, 'utf8').digest('hex');
    
    // Формируем URL для редиректа
    const qs = new URLSearchParams({
      m: MERCHANT_ID,
      oa: AMOUNT,
      o: ORDER_ID,
      s: SIGN,
      currency: CURRENCY
    });
    
    const pay_url = `${process.env.FREEKASSA_PAYMENT_URL || 'https://pay.freekassa.com/'}?${qs.toString()}`;
    
    // Логируем для отладки (без секретов)
    console.log('FreeKassa payment created:', {
      productId,
      orderId: ORDER_ID,
      amount: AMOUNT,
      currency: CURRENCY,
      signatureString: signatureString.replace(SECRET1, '***'),
      signature: SIGN.substring(0, 8) + '...'
    });
    
    return NextResponse.json({ 
      ok: true, 
      pay_url, 
      orderId: ORDER_ID, 
      productId 
    });
    
  } catch (error) {
    console.error('FreeKassa payment error:', error);
    return NextResponse.json({ ok: false, error: 'payment_creation_failed' }, { status: 500 });
  }
}
