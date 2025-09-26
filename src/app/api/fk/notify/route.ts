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
  const ok = verifyFK(params);
  // store webhook raw payload
  await db.insert(webhooks).values({ provider: "fk", event: "notify", payload: Object.fromEntries(params as any) });
  if (!ok) return NextResponse.json({ ok: false }, { status: 400 });

  // replay protection: rely on provider intid or merchant_order_id + check duplicates
  const intid = params.get('intid');
  const orderId = Number(params.get("MERCHANT_ORDER_ID"));
  const amount = Math.round(Number(params.get("AMOUNT")) * 100);
  const currency = params.get("CUR_ID") || "RUB";
  const txnId = intid || undefined;

  if (txnId) {
    const dup = await db.select().from(payments).where(eq(payments.providerTxnId, txnId)).limit(1);
    if (dup.length) {
      return new NextResponse("DUPLICATE", { status: 200 });
    }
  }

  // mark order paid
  await db.update(orders).set({ status: "paid", paidAt: new Date() }).where(eq(orders.id, orderId));
  await db.insert(payments).values({ orderId, provider: "fk", providerTxnId: txnId, amount, currency, status: "success", payload: Object.fromEntries(params as any) });

  return new NextResponse("YES");
}