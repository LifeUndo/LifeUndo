import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, telegram, company, volume, comment, source, type, locale } = body;

    // Basic validation
    if (!company || !volume || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare message for email
    const emailMessage = `
New corporate inquiry from GetLifeUndo website:

Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}
Telegram: ${telegram || 'Not provided'}
Company: ${company}
Volume/MAU: ${volume}
Comment: ${comment}
Source page: ${source}
Locale: ${locale}
Type: ${type || 'corporate_inquiry'}

Timestamp: ${new Date().toISOString()}
    `.trim();

    // Send email (using existing email service or create new one)
    // For now, we'll just log it and return success
    console.log('Corporate inquiry received:', {
      company,
      volume,
      comment,
      source,
      locale,
      timestamp: new Date().toISOString()
    });

    // TODO: Implement actual email sending
    // await sendEmail({
    //   to: 'info@getlifeundo.com',
    //   subject: `Corporate Inquiry from ${company}`,
    //   text: emailMessage
    // });

    // TODO: Implement Telegram notification
    // await sendTelegramNotification({
    //   text: `New corporate inquiry from ${company}: ${comment.substring(0, 100)}...`
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
