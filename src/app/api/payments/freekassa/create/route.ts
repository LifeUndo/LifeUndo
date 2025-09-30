import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { amount, email, product } = await req.json();
    
    const merchantId = process.env.FREEKASSA_MERCHANT_ID;
    const secret1 = process.env.FREEKASSA_SECRET1;
    const baseUrl = process.env.FREEKASSA_PAYMENT_URL || 'https://pay.freekassa.ru/';
    
    if (!merchantId || !secret1) {
      return NextResponse.json({ error: 'FreeKassa not configured' }, { status: 500 });
    }
    
    // Генерируем уникальный ID заказа
    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    // Создаем подпись (стандартная схема FreeKassa)
    const signatureString = `${merchantId}:${amount}:${secret1}:${orderId}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    // Формируем URL для редиректа
    const url = new URL(baseUrl);
    url.searchParams.set('m', merchantId);
    url.searchParams.set('oa', String(amount));
    url.searchParams.set('o', orderId);
    url.searchParams.set('s', signature);
    if (email) url.searchParams.set('email', email);
    
    // Логируем для отладки (в продакшене убрать)
    console.log('FreeKassa payment created:', {
      orderId,
      amount,
      email,
      product,
      signature: signature.substring(0, 8) + '...'
    });
    
    return NextResponse.redirect(url.toString(), { status: 302 });
    
  } catch (error) {
    console.error('FreeKassa payment error:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
