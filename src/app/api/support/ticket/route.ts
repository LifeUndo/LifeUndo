import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, order_id, topic, message, plan } = await req.json();
    
    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // TODO: Сохранить в БД
    // await db.supportTicket.create({
    //   data: {
    //     email,
    //     order_id,
    //     plan,
    //     topic,
    //     message,
    //     status: 'open'
    //   }
    // });
    
    console.info('[support.ticket] Created:', { 
      email, 
      order_id, 
      topic, 
      plan, 
      messageLen: message.length 
    });
    
    // TODO: Отправить email уведомление
    // await sendEmail({
    //   to: 'support@lifeundo.ru',
    //   subject: `Support Ticket: ${topic}`,
    //   body: `From: ${email}\nOrder ID: ${order_id}\nPlan: ${plan}\n\n${message}`
    // });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[support.ticket] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

