import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[LINE Webhook] Received event payload:', JSON.stringify(body, null, 2));

    // Handle LINE Webhook verification ping
    const events = body.events || [];
    for (const event of events) {
      if (event.type === 'message') {
        console.log(`[LINE Bot] Message from ${event.source?.userId}: ${event.message?.text}`);
      }
    }

    return NextResponse.json({ status: 'ok', eventsCount: events.length });
  } catch (err: any) {
    console.error('[LINE Webhook Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'LINE Messaging API Webhook Handler',
    timestamp: new Date().toISOString(),
  });
}

