import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { payments } from '@/db/schema';

function isAdmin(request: NextRequest): boolean {
  const header = request.headers.get('X-Admin-Token');
  const expected = process.env.ADMIN_GRANT_TOKEN;
  const urlToken = request.nextUrl.searchParams.get('token');
  if (!expected) return false;
  return header === expected || urlToken === expected;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const format = (searchParams.get('format') || 'json').toLowerCase();
    const limit = Math.min(parseInt(searchParams.get('limit') || '5000', 10) || 5000, 20000);

    const rows = await db.query.payments.findMany({
      limit,
      orderBy: (t: any, helpers: any) => [helpers.asc(t.id)],
    });

    const mapped = (rows as any[]).map((p) => ({
      id: p.id,
      order_id: p.order_id,
      plan: p.plan,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paid_at: p.paid_at,
      created_at: p.created_at,
    }));

    if (format === 'csv') {
      const header = ['id', 'order_id', 'plan', 'amount', 'currency', 'status', 'paid_at', 'created_at'];
      const lines = [header.join(',')];
      for (const r of mapped as any[]) {
        lines.push([
          r.id,
          r.order_id || '',
          r.plan || '',
          r.amount ?? '',
          r.currency || '',
          r.status || '',
          r.paid_at ? new Date(r.paid_at).toISOString() : '',
          r.created_at ? new Date(r.created_at).toISOString() : '',
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
      }
      const body = lines.join('\n');
      return new NextResponse(body, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="payments.csv"',
        },
      });
    }

    const body = JSON.stringify({ ok: true, items: mapped });
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="payments.json"',
      },
    });
  } catch (error) {
    console.error('[admin.exports.payments] Error:', error);
    const body = JSON.stringify({ ok: false, error: 'Internal server error' });
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="payments-error.json"',
      },
    });
  }
}
