import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function checkFreeKassaHealth(): Promise<{ callback: boolean; webhook: boolean; error?: string }> {
  try {
    // Проверяем конфигурацию FreeKassa
    const merchantId = process.env.FK_MERCHANT_ID;
    const secret = process.env.FK_SECRET1 || process.env.FK_SECRET2;
    
    const hasConfig = !!(merchantId && secret);

    // Проверяем доступность callback endpoint
    let webhookHealthy = false;
    try {
      const webhookResponse = await fetch('/api/fk/notify', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      webhookHealthy = webhookResponse.status !== 404;
    } catch (webhookError) {
      console.warn('FreeKassa webhook health check failed:', webhookError);
    }

    return {
      callback: hasConfig,
      webhook: webhookHealthy
    };

  } catch (error: any) {
    return {
      callback: false,
      webhook: false,
      error: error.message
    };
  }
}

export async function GET(req: NextRequest) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await checkFreeKassaHealth();

    return NextResponse.json({
      ok: true,
      callback: result.callback,
      webhook: result.webhook,
      healthy: result.callback && result.webhook,
      error: result.error,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}

