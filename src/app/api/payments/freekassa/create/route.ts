import { NextRequest, NextResponse } from 'next/server';
import { PLANS, isValidPlan, getPlanAmount } from '@/config/plans';
import crypto from 'crypto';

// Фиксированные суммы для всех продуктов (включая специальные)
const PRODUCT_AMOUNTS: Record<string, number> = {
  pro_month: 599.00,
  vip_lifetime: 9990.00,
  team_5: 2990.00,
  starter_6m: 3000.00, // 6 месяцев Pro за 3000₽
} as const;

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    
    // Проверяем валидность продукта
    if (!PRODUCT_AMOUNTS[productId]) {
      console.log('Unknown productId:', productId);
      return NextResponse.json({ ok: false, error: 'unknown_plan' }, { status: 400 });
    }
    
    const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID!;
    const SECRET1 = process.env.FREEKASSA_SECRET1!;
    const AMOUNT = PRODUCT_AMOUNTS[productId].toFixed(2); // "599.00" - строго две цифры
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
      signature: SIGN.substring(0, 8) + '...',
      payUrl: pay_url.substring(0, 50) + '...'
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
