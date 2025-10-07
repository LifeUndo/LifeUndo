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
      emailLen: message.email?.length || 0,
      messageLen: message.message?.length || 0,
      timestamp: new Date().toISOString()
    });

    // Здесь можно добавить отправку на:
    // 1. legal@getlifeundo.com через email API
    // 2. Telegram Bot через webhook
    // 3. Slack/Discord webhook
    // 4. Сохранение в базу данных для обработки

    // Пока просто возвращаем успех
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



