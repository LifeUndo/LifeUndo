import { NextResponse } from 'next/server';

export async function GET() {
  const isProd = process.env.VERCEL_ENV === 'production';
  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV ?? 'unknown',
    devEnabled: process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true',
    emailEnabled: process.env.NEXT_EMAIL_ENABLED === 'true',
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    isProd
  });
}
