import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { licenses } from '@/db/schema';

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

    const rows = await db.query.licenses.findMany({
      limit,
      orderBy: (t: any, helpers: any) => [helpers.asc(t.id)],
    });

    if (format === 'csv') {
      const header = ['id', 'user_email', 'level', 'plan', 'expires_at', 'seats', 'created_at'];
      const lines = [header.join(',')];
      for (const r of rows as any[]) {
        lines.push([
          r.id,
          r.user_email,
          r.level,
          r.plan || '',
          r.expires_at ? new Date(r.expires_at).toISOString() : '',
          r.seats ?? '',
          r.created_at ? new Date(r.created_at).toISOString() : '',
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
      }
      const body = lines.join('\n');
      return new NextResponse(body, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="licenses.csv"',
        },
      });
    }

    return NextResponse.json({ ok: true, items: rows });
  } catch (error) {
    console.error('[admin.exports.licenses] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
