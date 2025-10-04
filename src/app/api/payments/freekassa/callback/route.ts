import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    
    const AMOUNT = String(data.get('AMOUNT')); // "149.00"
    const MERCHANT_ID = String(data.get('MERCHANT_ID'));
    const ORDER_ID = String(data.get('MERCHANT_ORDER_ID'));
    const SIGN = String(data.get('SIGN'));
    const SECRET2 = process.env.FREEKASSA_SECRET2!;
    
    // Проверяем конфигурацию
    if (!SECRET2) {
      console.error('FreeKassa SECRET2 not configured');
      return NextResponse.json({ ok: false, error: 'fk_not_configured' }, { status: 500 });
    }
    
    // Проверяем подпись: MERCHANT_ID:AMOUNT:SECRET2:ORDER_ID
    const expected = crypto.createHash('md5').update(`${MERCHANT_ID}:${AMOUNT}:${SECRET2}:${ORDER_ID}`).digest('hex');
    
    if (SIGN.toLowerCase() !== expected.toLowerCase()) {
      console.error('FreeKassa callback signature mismatch:', {
        received: SIGN,
        expected: expected,
        orderId: ORDER_ID
      });
      return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 });
    }
    
    // Логируем успешный callback
    console.log('FreeKassa callback received:', {
      orderId: ORDER_ID,
      amount: AMOUNT,
      merchantId: MERCHANT_ID
    });
    
    // Здесь можно добавить логику для отметки заказа как "оплачен"
    // Например, обновление в базе данных или отправка email с лицензией
    
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('FreeKassa callback error:', error);
    return NextResponse.json({ ok: false, error: 'callback_processing_failed' }, { status: 500 });
  }
}
