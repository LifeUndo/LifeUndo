import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { FK_MERCHANT_ID, FK_SECRET1, FK_PAYMENT_URL, FK_CONFIGURED, FK_CURRENCY } from '@/lib/fk-env';
import { FK_PLANS, getPlan, getOrderPrefix, type PlanId } from '@/lib/payments/fk-plans';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Проверяем конфигурацию
    if (!FK_CONFIGURED) {
      console.error('FreeKassa not configured');
      return NextResponse.json({ error: 'FreeKassa not configured' }, { status: 500 });
    }
    
    // Получаем план из запроса
    const { plan, email } = body;
    
    if (!plan) {
      return NextResponse.json({ error: 'Missing plan parameter' }, { status: 400 });
    }
    
    // Проверяем валидность плана
    const planConfig = getPlan(plan);
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    
    const { amount: finalAmount, currency } = planConfig;
    
    // Генерируем order ID с префиксом плана
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const prefix = getOrderPrefix(plan as PlanId);
    const orderId = `${prefix}-${timestamp}-${random}`;
    
    // Создаем подпись (исправленная схема FreeKassa по ответу поддержки)
    // Правильный порядок: MERCHANT_ID:AMOUNT:SECRET1:CURRENCY:ORDER_ID
    const signatureString = `${FK_MERCHANT_ID}:${finalAmount}:${FK_SECRET1}:${FK_CURRENCY}:${orderId}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');
    
    // Формируем URL для редиректа
    const url = new URL(FK_PAYMENT_URL);
    url.searchParams.set('m', FK_MERCHANT_ID);
    url.searchParams.set('oa', finalAmount);
    url.searchParams.set('o', orderId);
    url.searchParams.set('s', signature);
    url.searchParams.set('currency', currency);
    if (email) url.searchParams.set('email', email);
    
    // Логируем для отладки (без секретов) + аналитика
    console.log('FreeKassa payment created:', {
      plan,
      orderId,
      amount: finalAmount,
      currency,
      email: email ? 'provided' : 'not provided',
      signature: signature.substring(0, 8) + '...'
    });
    
    // TODO: Добавить аналитику
    // analytics.track('purchase_redirect_fk', { plan, order_id: orderId, amount: finalAmount, currency });
    
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
