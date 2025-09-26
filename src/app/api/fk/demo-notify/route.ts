import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Demo FreeKassa Notify - только для тестирования
// Логирует уведомления, но не обрабатывает реальные платежи

function calcMd5(base: string) { 
  return crypto.createHash('md5').update(base).digest('hex'); 
}

function verifyFK(params: URLSearchParams) {
  const merchant_id = process.env.FK_MERCHANT_ID || "65875";
  const secret = process.env.FK_SECRET2 || "2aqzSYf?29aO-w6";
  const amount = params.get("AMOUNT") || "0";
  const order_id = params.get("MERCHANT_ORDER_ID") || "";
  const sign = params.get("SIGN") || "";
  
  // Demo mode - always return true for testing
  if (order_id.includes('DEMO')) {
    console.log('[FK][DEMO][notify] Skipping signature verification for demo order:', order_id);
    return true;
  }
  
  // Real signature verification for non-demo orders
  const base = `${merchant_id}:${amount}:${secret}:${order_id}`;
  const calc = calcMd5(base);
  return calc.toLowerCase() === sign.toLowerCase();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams;
  
  // Log all notify attempts
  console.log('[FK][DEMO][notify] Received webhook:', Object.fromEntries(params));
  
  const ok = verifyFK(params);
  
  if (!ok) {
    console.log('[FK][DEMO][notify] Signature verification failed');
    return NextResponse.json({ ok: false, demo_mode: true }, { status: 400 });
  }

  const orderId = params.get("MERCHANT_ORDER_ID");
  const amount = params.get("AMOUNT");
  const currency = params.get("CUR_ID") || "RUB";
  const txnId = params.get('intid');

  // Demo mode - just log, don't process
  if (orderId && orderId.includes('DEMO')) {
    console.log('[FK][DEMO][notify] Demo payment processed:', {
      order_id: orderId,
      amount,
      currency,
      txn_id: txnId,
      demo_mode: true
    });
    
    return new NextResponse("YES (DEMO)", { status: 200 });
  }

  // For real orders, return success but don't process in demo
  console.log('[FK][DEMO][notify] Real order received but not processed in demo mode:', {
    order_id: orderId,
    amount,
    currency,
    txn_id: txnId
  });

  return new NextResponse("YES (DEMO - NOT PROCESSED)", { status: 200 });
}

export async function POST(req: NextRequest) {
  // Handle POST requests the same way as GET
  return GET(req);
}
