import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { currentTenant } from "@/lib/tenant";
import zlib from "zlib";

export const runtime = 'nodejs';

function parseWindow(url: URL) {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (from || to) {
    const fromDt = from ? new Date(from!) : new Date(Date.now() - 30 * 864e5);
    const toDt = to ? new Date(to!) : new Date();
    return { from: fromDt, to: toDt };
  }
  const days = Math.max(1, Math.min(365, Number(url.searchParams.get('days') || 30)));
  return { from: new Date(Date.now() - days * 864e5), to: new Date() };
}

function parseCursor(cursor?: string): { ts?: string; id?: number } {
  if (!cursor) return {};
  try {
    return JSON.parse(cursor);
  } catch {
    return {};
  }
}

function csvSafe(s: any) {
  const v = String(s ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

export async function GET(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const url = new URL(req.url);
  const { from, to } = parseWindow(url);

  const format = (url.searchParams.get('format') || 'ndjson').toLowerCase();
  const cursor = parseCursor(url.searchParams.get('cursor'));
  const limit = Math.max(1, Math.min(10000, Number(url.searchParams.get('limit') || 10000)));
  const gzip = /^(1|true|yes)$/i.test(url.searchParams.get('gzip') || '');

  // Фильтры (как в CSV экспорте)
  const endpoint = url.searchParams.get('endpoint');
  const endpointLike = url.searchParams.get('endpointLike');
  const method = url.searchParams.get('method');
  const methodClass = (url.searchParams.get('methodClass') || '').toLowerCase();
  const status = url.searchParams.get('status');
  const statusMin = url.searchParams.get('statusMin');
  const statusMax = url.searchParams.get('statusMax');
  const statusClass = (url.searchParams.get('statusClass') || '').toLowerCase();
  const durationMin = url.searchParams.get('durationMin');
  const durationMax = url.searchParams.get('durationMax');

  // Условия WHERE
  const conditions = [
    sql`tenant_id = ${tenant.id}`,
    sql`ts >= ${from.toISOString()}::timestamptz`,
    sql`ts <= ${to.toISOString()}::timestamptz`,
  ];

  // Курсор для пагинации
  if (cursor.ts) {
    conditions.push(sql`(ts < ${cursor.ts} OR (ts = ${cursor.ts} AND id < ${cursor.id || 0}))`);
  }

  // Фильтры
  if (endpoint) conditions.push(sql`(COALESCE(endpoint,path,'') = ${endpoint})`);
  if (endpointLike) conditions.push(sql`(COALESCE(endpoint,path,'') ILIKE ${'%' + endpointLike + '%'})`);
  if (method) conditions.push(sql`COALESCE(method,'') = ${method}`);
  if (status) conditions.push(sql`COALESCE(status,0) = ${Number(status) || 0}`);
  if (statusMin) conditions.push(sql`COALESCE(status,0) >= ${Number(statusMin) || 0}`);
  if (statusMax) conditions.push(sql`COALESCE(status,0) <= ${Number(statusMax) || 599}`);
  if (durationMin) conditions.push(sql`COALESCE(duration_ms,0) >= ${Number(durationMin) || 0}`);
  if (durationMax) conditions.push(sql`COALESCE(duration_ms,0) <= ${Number(durationMax) || 2147483647}`);

  // Статус-класс
  const classMap: Record<string, [number, number]> = {
    '2xx': [200, 299],
    '3xx': [300, 399],
    '4xx': [400, 499],
    '5xx': [500, 599],
  };
  if (statusClass in classMap) {
    const [lo, hi] = classMap[statusClass];
    conditions.push(sql`COALESCE(status,0) BETWEEN ${lo} AND ${hi}`);
  }

  // Метод-класс
  if (methodClass === 'read') {
    conditions.push(sql`UPPER(COALESCE(method,'')) IN ('GET','HEAD','OPTIONS')`);
  } else if (methodClass === 'write') {
    conditions.push(sql`UPPER(COALESCE(method,'')) IN ('POST','PUT','PATCH','DELETE')`);
  } else if (methodClass === 'other') {
    conditions.push(sql`UPPER(COALESCE(method,'')) NOT IN ('GET','HEAD','OPTIONS','POST','PUT','PATCH','DELETE')`);
  }

  // Запрос данных
  const rows = await db.execute(sql`
    SELECT 
      id,
      ts,
      COALESCE(endpoint, path, '') AS endpoint,
      COALESCE(method, '') AS method,
      COALESCE(status, 0) AS status,
      duration_ms
    FROM usage_events
    WHERE ${sql.join(conditions, sql` AND `)}
    ORDER BY ts DESC, id DESC
    LIMIT ${limit + 1}
  `);

  const data = rows.rows as any[];
  const hasMore = data.length > limit;
  const chunk = data.slice(0, limit);
  
  let nextCursor: string | undefined;
  if (hasMore && chunk.length > 0) {
    const last = chunk[chunk.length - 1];
    nextCursor = JSON.stringify({ ts: last.ts, id: last.id });
  }

  // Форматирование данных
  let content: string;
  let contentType: string;

  if (format === 'csv') {
    const header = 'ts,endpoint,method,status,duration_ms';
    const body = chunk.map(r => 
      `"${csvSafe(r.ts)}","${csvSafe(r.endpoint)}","${csvSafe(r.method)}",${r.status},${r.duration_ms || ''}`
    ).join('\n');
    content = `${header}\n${body}`;
    contentType = 'text/csv; charset=utf-8';
  } else {
    // NDJSON
    content = chunk.map(r => JSON.stringify({
      ts: r.ts,
      endpoint: r.endpoint,
      method: r.method,
      status: r.status,
      duration_ms: r.duration_ms,
    })).join('\n');
    contentType = 'application/x-ndjson';
  }

  // Gzip если запрошен
  let responseBody: Buffer;
  let contentEncoding: string | undefined;
  
  if (gzip) {
    responseBody = zlib.gzipSync(Buffer.from(content, 'utf8'));
    contentEncoding = 'gzip';
  } else {
    responseBody = Buffer.from(content, 'utf8');
  }

  // Заголовки для стриминга
  const headers = new Headers({
    'content-type': contentType,
    'content-length': responseBody.length.toString(),
    'cache-control': 'no-store',
  });

  if (contentEncoding) {
    headers.set('content-encoding', contentEncoding);
  }

  if (nextCursor) {
    headers.set('x-next-cursor', nextCursor);
  }

  if (hasMore) {
    headers.set('x-has-more', 'true');
  }

  return new NextResponse(responseBody, { headers });
}

