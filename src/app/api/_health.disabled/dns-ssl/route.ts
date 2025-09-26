import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function checkDNSAndSSL(domain: string): Promise<{ dns: boolean; ssl: boolean; error?: string }> {
  try {
    // DNS проверка через внешний сервис
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`, {
      headers: { 'Accept': 'application/dns-json' }
    });
    
    const dnsData = await dnsResponse.json();
    const hasValidDNS = dnsData.Answer && dnsData.Answer.length > 0;

    // SSL проверка
    let sslValid = false;
    try {
      const sslResponse = await fetch(`https://${domain}`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(10000) // 10 секунд таймаут
      });
      sslValid = sslResponse.ok;
    } catch (sslError) {
      console.warn(`SSL check failed for ${domain}:`, sslError);
    }

    return {
      dns: hasValidDNS,
      ssl: sslValid,
    };

  } catch (error: any) {
    return {
      dns: false,
      ssl: false,
      error: error.message
    };
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Domain is required' 
      }, { status: 400 });
    }

    const result = await checkDNSAndSSL(domain);

    return NextResponse.json({
      ok: true,
      domain,
      dns: result.dns,
      ssl: result.ssl,
      healthy: result.dns && result.ssl,
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

