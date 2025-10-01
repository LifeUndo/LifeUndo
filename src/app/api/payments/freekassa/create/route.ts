import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { FK_MERCHANT_ID, FK_SECRET1, FK_PAYMENT_URL, FK_PRODUCTS, FK_CONFIGURED, FK_CURRENCY } from '@/lib/fk-env';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Проверяем конфигурацию
    if (!FK_CONFIGURED) {
      console.error('FreeKassa not configured');
      return NextResponse.json({ error: 'FreeKassa not configured' }, { status: 500 });
    }
    
    let finalAmount: string;
    let productId: string;
    
    // Поддержка двух форматов запроса:
    // 1. Новый формат: { productId: "getlifeundo_pro", email: "..." }
    // 2. Альтернативный формат: { currency: "RUB", order_id: "100500", description: "Pro plan" }
    if (body.productId) {
      // Новый формат - используем productId
      productId = body.productId;
      if (!FK_PRODUCTS[productId as keyof typeof FK_PRODUCTS]) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
      }
      finalAmount = FK_PRODUCTS[productId as keyof typeof FK_PRODUCTS];
    } else if (body.description) {
      // Альтернативный формат - определяем план по описанию
      const description = body.description.toLowerCase();
      if (description.includes('pro')) {
        productId = 'getlifeundo_pro';
        finalAmount = FK_PRODUCTS.getlifeundo_pro;
      } else if (description.includes('vip')) {
        productId = 'getlifeundo_vip';
        finalAmount = FK_PRODUCTS.getlifeundo_vip;
      } else if (description.includes('team')) {
        productId = 'getlifeundo_team';
        finalAmount = FK_PRODUCTS.getlifeundo_team;
      } else {
        return NextResponse.json({ error: 'Invalid product description' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Missing productId or description' }, { status: 400 });
    }
    
    // Генерируем безопасный ASCII order ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const orderId = `${timestamp}-${random}`;
    
    // Создаем подпись (стандартная схема FreeKassa)
    const signatureString = `${FK_MERCHANT_ID}:${finalAmount}:${FK_SECRET1}:${orderId}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    // Формируем URL для редиректа
    const url = new URL(FK_PAYMENT_URL);
    url.searchParams.set('m', FK_MERCHANT_ID);
    url.searchParams.set('oa', finalAmount);
    url.searchParams.set('o', orderId);
    url.searchParams.set('s', signature);
    url.searchParams.set('currency', FK_CURRENCY); // Используем валюту из конфигурации
    if (body.email) url.searchParams.set('email', body.email);
    
    // Логируем для отладки (без секретов)
    console.log('FreeKassa payment created:', {
      orderId,
      productId,
      amount: finalAmount,
      currency: FK_CURRENCY,
      email: body.email ? 'provided' : 'not provided',
      signature: signature.substring(0, 8) + '...',
      signatureString: `${FK_MERCHANT_ID}:${finalAmount}:${FK_SECRET1.substring(0, 4)}***:${orderId}`,
      url: url.toString()
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
