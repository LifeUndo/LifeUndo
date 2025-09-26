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

// защита от CSV-инъекций в Excel (формульные строки)
function csvSafe(s: any) {
  const v = String(s ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

export async function GET(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const url = new URL(req.url);

  const { from, to } = parseWindow(url);

  // ---- Новые фильтры ----
  const statusClass = (url.searchParams.get('statusClass') || '').toLowerCase(); // '2xx' | '3xx' | '4xx' | '5xx'
  const sortBy = (url.searchParams.get('sortBy') || 'ts').toLowerCase();        // 'ts' | 'status' | 'endpoint' | 'method'
  const sortDir = (url.searchParams.get('sortDir') || 'desc').toLowerCase();    // 'asc' | 'desc'
  const gzip = /^(1|true|yes)$/i.test(url.searchParams.get('gzip') || '');

  // НОВОЕ:
  const methodClass = (url.searchParams.get('methodClass') || '').toLowerCase(); // read|write|other
  const durationMin = url.searchParams.get('durationMin');
  const durationMax = url.searchParams.get('durationMax');

  // Уже существующие:
  const endpoint = url.searchParams.get('endpoint');
  const endpointLike = url.searchParams.get('endpointLike');
  const method = url.searchParams.get('method');
  const status = url.searchParams.get('status');
  const statusMin = url.searchParams.get('statusMin');
  const statusMax = url.searchParams.get('statusMax');
  const limit = Math.max(1, Math.min(100000, Number(url.searchParams.get('limit') || 100000)));
  const colsParam = (url.searchParams.get('columns') || '').trim();

  // Белый список столбцов
  const allowed = new Map<string, string>([
    ['ts', 'ts'],
    ['endpoint', "COALESCE(endpoint, path, '')"],
    ['method', "COALESCE(method, '')"],
    ['status', 'COALESCE(status,0)'],
    ['duration_ms', 'duration_ms'],
  ]);
  const selected = (colsParam
    ? colsParam.split(',').map(s => s.trim()).filter(Boolean)
    : ['ts','endpoint','method','status','duration_ms']
  ).filter(c => allowed.has(c));

  const fields = selected.map(c => sql.raw(`${allowed.get(c)} AS "${c}"`));

  // динамические условия
  const conds = [
    sql`tenant_id = ${tenant.id}`,
    sql`ts >= ${from.toISOString()}::timestamptz`,
    sql`ts <= ${to.toISOString()}::timestamptz`,
  ];
  if (endpoint) conds.push(sql`(COALESCE(endpoint,path,'') = ${endpoint})`);
  if (endpointLike) conds.push(sql`(COALESCE(endpoint,path,'') ILIKE ${'%' + endpointLike + '%'})`);
  if (method) conds.push(sql`COALESCE(method,'') = ${method}`);
  if (status) conds.push(sql`COALESCE(status,0) = ${Number(status) || 0}`);
  if (statusMin) conds.push(sql`COALESCE(status,0) >= ${Number(statusMin) || 0}`);
  if (statusMax) conds.push(sql`COALESCE(status,0) <= ${Number(statusMax) || 599}`);

  // Фильтр по статус-классу (2xx/3xx/4xx/5xx)
  const classMap: Record<string, [number, number]> = {
    '2xx': [200, 299],
    '3xx': [300, 399],
    '4xx': [400, 499],
    '5xx': [500, 599],
  };
  if (statusClass in classMap) {
    const [lo, hi] = classMap[statusClass];
    conds.push(sql`COALESCE(status,0) BETWEEN ${lo} AND ${hi}`);
  }

  // метод-класс
  if (methodClass === 'read') {
    conds.push(sql`UPPER(COALESCE(method,'')) IN ('GET','HEAD','OPTIONS')`);
  } else if (methodClass === 'write') {
    conds.push(sql`UPPER(COALESCE(method,'')) IN ('POST','PUT','PATCH','DELETE')`);
  } else if (methodClass === 'other') {
    conds.push(sql`UPPER(COALESCE(method,'')) NOT IN ('GET','HEAD','OPTIONS','POST','PUT','PATCH','DELETE')`);
  }

  // duration фильтры
  if (durationMin) conds.push(sql`COALESCE(duration_ms,0) >= ${Number(durationMin) || 0}`);
  if (durationMax) conds.push(sql`COALESCE(duration_ms,0) <= ${Number(durationMax) || 2147483647}`);

  // Сортировка (строго по белому списку)
  const allowedSorts: Record<string, string> = {
    ts: 'ts',
    status: 'COALESCE(status,0)',
    endpoint: "COALESCE(endpoint, path, '')",
    method: "COALESCE(method, '')",
    duration_ms: 'duration_ms',
  };
  const orderCol = allowedSorts[sortBy] || 'ts';
  const orderDir = sortDir === 'asc' ? 'ASC' : 'DESC';

  // Запрос
  const rows = (await db.execute(sql`
    SELECT ${sql.join(fields, sql`, `)}
    FROM usage_events
    WHERE ${sql.join(conds, sql` AND `)}
    ORDER BY ${sql.raw(orderCol)} ${sql.raw(orderDir)}
    LIMIT ${limit}
  `)).rows as any[];

  // сборка CSV
  const header = selected.join(',');
  const body = rows.map(r =>
    selected.map(k => `"${csvSafe(r[k])}"`).join(',')
  ).join('\n');
  const csv = `${header}\n${body}`;

  const fnBase = `usage_${tenant.slug}_${from.toISOString().slice(0,10)}_${to.toISOString().slice(0,10)}.csv`;

  if (gzip) {
    const gz = zlib.gzipSync(Buffer.from(csv, 'utf8'));
    return new NextResponse(gz, {
      headers: {
        'content-type': 'text/csv',
        'content-encoding': 'gzip',
        'content-disposition': `attachment; filename="${fnBase}.gz"`,
        'cache-control': 'no-store',
      },
    });
  }

  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${fnBase}"`,
      'cache-control': 'no-store',
    },
  });
}
