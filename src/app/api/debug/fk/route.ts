import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID;
    const SECRET1 = process.env.FREEKASSA_SECRET1;
    const SECRET2 = process.env.FREEKASSA_SECRET2;
    const PAYMENT_URL = process.env.FREEKASSA_PAYMENT_URL;
    const FK_ENABLED = process.env.NEXT_PUBLIC_FK_ENABLED;
    
    const fkEnabled = FK_ENABLED === 'true';
    const merchantIdPresent = !!MERCHANT_ID;
    const secret1Present = !!SECRET1;
    const secret2Present = !!SECRET2;
    const paymentUrlPresent = !!PAYMENT_URL;
    
    return NextResponse.json({
      ok: true,
      fkEnabled,
      merchantIdPresent,
      secret1Present,
      secret2Present,
      paymentUrlPresent,
      paymentUrl: PAYMENT_URL || 'https://pay.fk.money/',
      // Не возвращаем секреты и ID для безопасности
      merchantIdMasked: MERCHANT_ID ? `${MERCHANT_ID.substring(0, 3)}***` : null
    });
    
  } catch (error) {
    console.error('FreeKassa debug error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'debug_failed' 
    }, { status: 500 });
  }
}