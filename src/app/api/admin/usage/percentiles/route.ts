import { NextResponse } from "next/server";
import { currentTenant } from "@/lib/tenant";
import { getPercentiles, PercentileQuery } from "@/lib/percentiles";

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

export async function GET(req: Request) {
  const tenant = await currentTenant();
  if (!tenant?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const url = new URL(req.url);
  const { from, to } = parseWindow(url);

  const groupBy = (url.searchParams.get('groupBy') || 'none') as 'none' | 'endpoint' | 'statusClass' | 'methodClass';
  const rollup = (url.searchParams.get('rollup') || 'daily') as 'live' | 'daily';

  // Фильтры
  const filters = {
    endpoint: url.searchParams.get('endpoint') || undefined,
    endpointLike: url.searchParams.get('endpointLike') || undefined,
    method: url.searchParams.get('method') || undefined,
    methodClass: url.searchParams.get('methodClass') || undefined,
    status: url.searchParams.get('status') || undefined,
    statusMin: url.searchParams.get('statusMin') ? Number(url.searchParams.get('statusMin')) : undefined,
    statusMax: url.searchParams.get('statusMax') ? Number(url.searchParams.get('statusMax')) : undefined,
    statusClass: url.searchParams.get('statusClass') || undefined,
    durationMin: url.searchParams.get('durationMin') ? Number(url.searchParams.get('durationMin')) : undefined,
    durationMax: url.searchParams.get('durationMax') ? Number(url.searchParams.get('durationMax')) : undefined,
  };

  // Очистка undefined значений
  Object.keys(filters).forEach(key => {
    if ((filters as any)[key] === undefined) {
      delete (filters as any)[key];
    }
  });

  try {
    const query: PercentileQuery = {
      from,
      to,
      groupBy: groupBy === 'none' ? undefined : groupBy,
      rollup,
      filters,
    };

    const result = await getPercentiles(tenant.id, query);

    return NextResponse.json({
      ok: true,
      tenant: tenant.slug,
      query: {
        from: from.toISOString(),
        to: to.toISOString(),
        groupBy: groupBy === 'none' ? null : groupBy,
        rollup,
        filters: Object.keys(filters).length > 0 ? filters : null,
      },
      result,
    });
  } catch (error) {
    console.error('Percentiles API error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

