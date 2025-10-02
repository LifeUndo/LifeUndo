import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV ?? 'local',
    devEnabled: process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true',
    emailEnabled: process.env.NEXT_EMAIL_ENABLED !== 'false',
    hasDbUrl: !!process.env.DATABASE_URL
  });
}
