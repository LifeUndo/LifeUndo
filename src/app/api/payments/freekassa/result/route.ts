import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const merchantId = formData.get('MERCHANT_ID') as string;
    const amount = formData.get('AMOUNT') as string;
    const orderId = formData.get('MERCHANT_ORDER_ID') as string;
    const signature = formData.get('SIGN') as string;
    const status = formData.get('STATUS') as string;
    
    const secret2 = process.env.FREEKASSA_SECRET2;
    
    if (!secret2) {
      console.error('FreeKassa SECRET2 not configured');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }
    
    // Проверяем подпись (стандартная схема FreeKassa для callback)
    const signatureString = `${merchantId}:${amount}:${secret2}:${orderId}`;
    const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('FreeKassa signature mismatch:', {
        received: signature,
        expected: expectedSignature.substring(0, 8) + '...'
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Логируем успешную оплату
    console.log('FreeKassa payment confirmed:', {
      orderId,
      amount,
      status,
      merchantId
    });
    
    // TODO: Здесь добавить логику обновления статуса пользователя
    // Например, активация VIP-статуса, отправка уведомления и т.д.
    
    return NextResponse.json({ status: 'OK' });
    
  } catch (error) {
    console.error('FreeKassa callback error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}
