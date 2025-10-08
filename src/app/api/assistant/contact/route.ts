import { NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in-memory, для продакшена лучше Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Zа-яА-Я\s\-']+$/i),
  email: z.string().email().max(255),
  message: z.string().min(10).max(5000).refine(
    (val) => !/<script|javascript:|on\w+=/i.test(val),
    'Message contains invalid content'
  ),
  locale: z.enum(['en', 'ru']),
  // Honeypot fields
  website: z.string().optional(), // Hidden field for bots
  timestamp: z.number().optional() // Form start time
});

function getRateLimitKey(ip: string): string {
  return `contact:${ip}`;
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
    const validatedData = contactSchema.parse(body);

    // Honeypot check
    if (validatedData.website) {
      console.warn('[Contact] Honeypot triggered:', { ip: clientIP, website: validatedData.website });
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Timing check (minimum 3 seconds)
    if (validatedData.timestamp) {
      const formTime = Date.now() - validatedData.timestamp;
      if (formTime < 3000) { // 3 seconds minimum
        console.warn('[Contact] Form filled too quickly:', { ip: clientIP, time: formTime });
        return NextResponse.json({ error: 'Form filled too quickly' }, { status: 400 });
      }
    }

    // Log the submission (without sensitive data)
    console.info('[Contact] Form submitted', {
      locale: validatedData.locale,
      emailDomain: validatedData.email.split('@')[1],
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString(),
      ip: clientIP
    });

    // TODO: Send email to legal@getlifeundo.com
    // For now, just log the full message for debugging
    console.log('[Contact] Full message:', {
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      locale: validatedData.locale
    });

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: validatedData.locale === 'ru' 
        ? 'Сообщение получено. Ответ придёт на e-mail.'
        : 'Message received. We\'ll reply by email.'
    }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 });
    }

    console.error('[Contact] API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}



