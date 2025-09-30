import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { FK_MERCHANT_ID, FK_SECRET2, FK_CONFIGURED } from '@/lib/fk-env';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const merchantId = formData.get('MERCHANT_ID') as string;
    const amount = formData.get('AMOUNT') as string;
    const orderId = formData.get('MERCHANT_ORDER_ID') as string;
    const signature = formData.get('SIGN') as string;
    const status = formData.get('STATUS') as string;
    
    // Проверяем конфигурацию
    if (!FK_CONFIGURED) {
      console.error('FreeKassa SECRET2 not configured');
      return new Response('Configuration error', { status: 500 });
    }
    
    // Проверяем merchant ID
    if (merchantId !== FK_MERCHANT_ID) {
      console.error('FreeKassa merchant ID mismatch');
      return new Response('Invalid merchant', { status: 400 });
    }
    
    // Проверяем подпись (стандартная схема FreeKassa для callback)
    const signatureString = `${merchantId}:${amount}:${FK_SECRET2}:${orderId}`;
    const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('FreeKassa signature mismatch:', {
        received: signature,
        expected: expectedSignature.substring(0, 8) + '...'
      });
      return new Response('Invalid sign', { status: 400 });
    }
    
    // Логируем успешную оплату (без секретов)
    console.log('FreeKassa payment confirmed:', {
      orderId,
      amount,
      status,
      merchantId: merchantId.substring(0, 4) + '***',
      sign_ok: true
    });
    
    // TODO: Здесь добавить логику обновления статуса пользователя
    // Например, активация VIP-статуса, отправка уведомления и т.д.
    
    return new Response('YES', { status: 200 });
    
  } catch (error) {
    console.error('FreeKassa callback error:', error);
    return new Response('Callback processing failed', { status: 500 });
  }
}
