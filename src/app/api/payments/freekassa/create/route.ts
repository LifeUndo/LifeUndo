import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { FK_MERCHANT_ID, FK_SECRET1, FK_PAYMENT_URL, FK_PRODUCTS, FK_CONFIGURED } from '@/lib/fk-env';

export async function POST(req: Request) {
  try {
    const { productId, amount, email } = await req.json();
    
    // Проверяем конфигурацию
    if (!FK_CONFIGURED) {
      console.error('FreeKassa not configured');
      return NextResponse.json({ error: 'FreeKassa not configured' }, { status: 500 });
    }
    
    // Проверяем продукт
    if (!productId || !FK_PRODUCTS[productId as keyof typeof FK_PRODUCTS]) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    
    // Используем сумму из конфигурации
    const finalAmount = FK_PRODUCTS[productId as keyof typeof FK_PRODUCTS];
    
    // Генерируем уникальный ID заказа
    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    // Создаем подпись (стандартная схема FreeKassa)
    const signatureString = `${FK_MERCHANT_ID}:${finalAmount}:${FK_SECRET1}:${orderId}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    // Формируем URL для редиректа
    const url = new URL(FK_PAYMENT_URL);
    url.searchParams.set('m', FK_MERCHANT_ID);
    url.searchParams.set('oa', String(finalAmount));
    url.searchParams.set('o', orderId);
    url.searchParams.set('s', signature);
    if (email) url.searchParams.set('email', email);
    
    // Логируем для отладки (без секретов)
    console.log('FreeKassa payment created:', {
      orderId,
      productId,
      amount: finalAmount,
      email: email ? 'provided' : 'not provided',
      signature: signature.substring(0, 8) + '...'
    });
    
    return NextResponse.json({ 
      ok: true,
      pay_url: url.toString(),
      order_id: orderId 
    });
    
  } catch (error) {
    console.error('FreeKassa payment error:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
