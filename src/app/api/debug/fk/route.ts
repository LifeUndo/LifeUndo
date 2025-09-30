import { NextResponse } from "next/server";
import { FK_ENABLED, FK_MERCHANT_ID, FK_PAYMENT_URL, FK_CONFIGURED } from "@/lib/fk-env";

export async function GET() {
  // Только в Preview/Development — на проде отвечаем 404
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
  if (env === "production") {
    return NextResponse.json({ ok: false, error: "Not available in production" }, { status: 404 });
  }

  const masked = FK_MERCHANT_ID ? FK_MERCHANT_ID.slice(0, 4) + "***" : "";

  return NextResponse.json({
    ok: true,
    env,
    fkEnabled: FK_ENABLED,
    fkConfigured: FK_CONFIGURED,
    merchantIdMasked: masked,
    paymentUrl: FK_PAYMENT_URL,
    timestamp: new Date().toISOString()
  });
}
