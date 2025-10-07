import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, locale, timestamp, userAgent } = await request.json();

    // Валидация
    if (!message || !locale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Логируем сообщение
    console.info('[Assistant] message sent', { 
      locale, 
      messageLen: message.length || 0,
      timestamp: new Date().toISOString(),
      userAgent: userAgent?.substring(0, 100) || 'unknown'
    });

    // TODO: Реальная отправка на legal@getlifeundo.com
    // Пока логируем для отладки
    console.log('Message content:', message);
    console.log('Target email: legal@getlifeundo.com');
    console.log('Locale:', locale);

    // Возвращаем успех
    return NextResponse.json({ 
      success: true, 
      message: 'Message received successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}



