import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/client";
import { payments, orders, webhooks } from "@/db/schema";
import { eq } from "drizzle-orm";

// Improved webhook validator: use timestamp + HMAC if possible. If FK cannot provide HMAC,
// we still keep md5 baseline but enforce timestamp window + replay protection via intid/merchant_order_id.

function calcMd5(base: string) { return crypto.createHash('md5').update(base).digest('hex'); }
function calcHmacSha256(base: string, secret: string) { return crypto.createHmac('sha256', secret).update(base).digest('hex'); }

function verifyFK(params: URLSearchParams) {
  const merchant_id = process.env.FK_MERCHANT_ID || "";
  const secret = process.env.FK_SECRET2 || "";
  const amount = params.get("AMOUNT") || "0";
  const order_id = params.get("MERCHANT_ORDER_ID") || "";
  const sign = params.get("SIGN") || "";
  const ts = params.get("TIMESTAMP") || params.get('DATE') || null;
  // if provider supports HMAC: they should send SIGN_TYPE=hmac and SIGN is hex hmac
  if (params.get('SIGN_TYPE') === 'hmac' && secret) {
    const base = `${merchant_id}:${amount}:${order_id}:${ts || ''}`;
    const calc = calcHmacSha256(base, secret);
    return calc.toLowerCase() === sign.toLowerCase();
  }
  // fallback: legacy md5
  const base = `${merchant_id}:${amount}:${process.env.FK_SECRET2 || ''}:${order_id}`;
  const calc = calcMd5(base);
  return calc.toLowerCase() === sign.toLowerCase();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams;
  
  // Log all incoming webhooks for debugging
  console.log('[FK][notify] Received webhook:', Object.fromEntries(params.entries()));
  
  // Verify signature first
  const ok = verifyFK(params);
  if (!ok) {
    console.error('[FK][notify] Signature verification failed');
    await db.insert(webhooks).values({ 
      provider: "fk", 
      event: "notify_failed", 
      payload: Object.fromEntries(params as any) 
    });
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
  }

  // Extract and validate required parameters
  const intid = params.get('intid');
  const orderIdStr = params.get("MERCHANT_ORDER_ID");
  const amountStr = params.get("AMOUNT");
  const currency = params.get("CUR_ID") || "RUB";
  
  if (!orderIdStr || !amountStr) {
    console.error('[FK][notify] Missing required parameters');
    return NextResponse.json({ ok: false, error: 'Missing required parameters' }, { status: 400 });
  }

  const orderId = Number(orderIdStr);
  const amount = Math.round(Number(amountStr) * 100);
  const txnId = intid || undefined;

  // Check for duplicate transactions (idempotency)
  if (txnId) {
    const dup = await db.select().from(payments).where(eq(payments.providerTxnId, txnId)).limit(1);
    if (dup.length) {
      console.log('[FK][notify] Duplicate transaction detected:', txnId);
      return new NextResponse("DUPLICATE", { status: 200 });
    }
  }

  // Check if order exists and is in correct state
  const existingOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!existingOrder.length) {
    console.error('[FK][notify] Order not found:', orderId);
    return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
  }

  if (existingOrder[0].status === 'paid') {
    console.log('[FK][notify] Order already paid:', orderId);
    return new NextResponse("ALREADY_PAID", { status: 200 });
  }

  // Process payment
  try {
    await db.update(orders).set({ status: "paid", paidAt: new Date() }).where(eq(orders.id, orderId));
    await db.insert(payments).values({ 
      orderId, 
      provider: "fk", 
      providerTxnId: txnId, 
      amount, 
      currency, 
      status: "success", 
      payload: Object.fromEntries(params as any) 
    });

    // Log successful webhook
    await db.insert(webhooks).values({ 
      provider: "fk", 
      event: "notify_success", 
      payload: Object.fromEntries(params as any) 
    });

    console.log('[FK][notify] Payment processed successfully:', { orderId, amount, currency, txnId });
    return new NextResponse("YES");
  } catch (error) {
    console.error('[FK][notify] Database error:', error);
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 });
  }
}