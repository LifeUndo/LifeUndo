import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function checkSMTPHealth(): Promise<{ smtp: boolean; relay: boolean; error?: string }> {
  try {
    // Проверяем SMTP Listener (порт 2525)
    let smtpHealthy = false;
    try {
      const smtpResponse = await fetch('http://localhost:2525/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      smtpHealthy = smtpResponse.ok;
    } catch (smtpError) {
      console.warn('SMTP Listener health check failed:', smtpError);
    }

    // Проверяем Relay Sender через API
    let relayHealthy = false;
    try {
      const relayResponse = await fetch('/api/_health/relay', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      relayHealthy = relayResponse.ok;
    } catch (relayError) {
      console.warn('Email Relay health check failed:', relayError);
    }

    return {
      smtp: smtpHealthy,
      relay: relayHealthy
    };

  } catch (error: any) {
    return {
      smtp: false,
      relay: false,
      error: error.message
    };
  }
}

export async function GET() {
  await requireAdminAuth();

  try {
    const result = await checkSMTPHealth();

    return NextResponse.json({
      ok: true,
      smtp: result.smtp,
      relay: result.relay,
      healthy: result.smtp && result.relay,
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

