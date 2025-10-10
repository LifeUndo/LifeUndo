import { NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Creator application schema
const creatorApplySchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Zа-яА-Я\s\-']+$/i),
  email: z.string().email().max(255),
  channel_url: z.string().url().max(500),
  audience: z.enum(['1k-10k', '10k-100k', '100k-1m', '1m+']),
  message: z.string().min(20).max(2000).refine(
    (val) => !/<script|javascript:|on\w+=/i.test(val),
    'Message contains invalid content'
  ),
  locale: z.enum(['en', 'ru']),
  // Honeypot fields
  website: z.string().optional(), // Hidden field for bots
  timestamp: z.number().optional() // Form start time
});

function getRateLimitKey(ip: string): string {
  return `creator:${ip}`;
}

function checkRateLimit(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';
  return clientIP;
}

function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  const allowedOrigins = [
    'https://getlifeundo.com',
    'https://www.getlifeundo.com',
    'http://localhost:3000' // for development
  ];

  return allowedOrigins.some(allowed => 
    origin === allowed || referer?.startsWith(allowed)
  );
}

export async function POST(request: Request) {
  try {
    // CSRF/Origin check
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = creatorApplySchema.parse(body);

    // Honeypot check
    if (validatedData.website) {
      console.warn('[Creator Apply] Honeypot triggered:', { ip: clientIP, website: validatedData.website });
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Timing check (minimum 3 seconds)
    if (validatedData.timestamp) {
      const formTime = Date.now() - validatedData.timestamp;
      if (formTime < 3000) { // 3 seconds minimum
        console.warn('[Creator Apply] Form filled too quickly:', { ip: clientIP, time: formTime });
        return NextResponse.json({ error: 'Form filled too quickly' }, { status: 400 });
      }
    }

    // Log the submission (without sensitive data)
    console.info('[Creator Apply] Application submitted', {
      locale: validatedData.locale,
      emailDomain: validatedData.email.split('@')[1],
      audience: validatedData.audience,
      channelUrl: validatedData.channel_url,
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString(),
      ip: clientIP
    });

    // TODO: Store in database or send to email
    // For now, just log the full application
    console.log('[Creator Apply] Full application:', {
      name: validatedData.name,
      email: validatedData.email,
      channel_url: validatedData.channel_url,
      audience: validatedData.audience,
      message: validatedData.message,
      locale: validatedData.locale
    });

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: validatedData.locale === 'ru' 
        ? 'Заявка получена! Мы свяжемся с вами по e-mail.'
        : 'Application received! We\'ll contact you by email.'
    }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 });
    }

    console.error('[Creator Apply] API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
