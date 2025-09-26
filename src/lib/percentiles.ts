import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export interface PercentileResult {
  p50: number | null;
  p95: number | null;
  p99: number | null;
  count: number;
  count_4xx: number;
  count_5xx: number;
}

export interface PercentileGroup extends PercentileResult {
  group_key: string;
  group_value: string;
}

export interface PercentileQuery {
  from: Date;
  to: Date;
  groupBy?: 'endpoint' | 'statusClass' | 'methodClass';
  rollup?: 'live' | 'daily';
  filters?: {
    endpoint?: string;
    endpointLike?: string;
    method?: string;
    methodClass?: string;
    status?: string;
    statusMin?: number;
    statusMax?: number;
    statusClass?: string;
    durationMin?: number;
    durationMax?: number;
  };
}

export async function getPercentiles(
  tenantId: string,
  query: PercentileQuery
): Promise<PercentileResult | PercentileGroup[]> {
  const { from, to, groupBy, rollup = 'daily', filters = {} } = query;
  
  // Базовые условия
  const conditions = [
    sql`tenant_id = ${tenantId}`,
    sql`ts >= ${from.toISOString()}::timestamptz`,
    sql`ts <= ${to.toISOString()}::timestamptz`,
    sql`duration_ms IS NOT NULL`,
  ];

  // Фильтры
  if (filters.endpoint) {
    conditions.push(sql`(COALESCE(endpoint,path,'') = ${filters.endpoint})`);
  }
  if (filters.endpointLike) {
    conditions.push(sql`(COALESCE(endpoint,path,'') ILIKE ${'%' + filters.endpointLike + '%'})`);
  }
  if (filters.method) {
    conditions.push(sql`COALESCE(method,'') = ${filters.method}`);
  }
  if (filters.status) {
    conditions.push(sql`COALESCE(status,0) = ${Number(filters.status) || 0}`);
  }
  if (filters.statusMin) {
    conditions.push(sql`COALESCE(status,0) >= ${Number(filters.statusMin) || 0}`);
  }
  if (filters.statusMax) {
    conditions.push(sql`COALESCE(status,0) <= ${Number(filters.statusMax) || 599}`);
  }
  if (filters.durationMin) {
    conditions.push(sql`duration_ms >= ${Number(filters.durationMin) || 0}`);
  }
  if (filters.durationMax) {
    conditions.push(sql`duration_ms <= ${Number(filters.durationMax) || 2147483647}`);
  }

  // Method class filter
  if (filters.methodClass === 'read') {
    conditions.push(sql`UPPER(COALESCE(method,'')) IN ('GET','HEAD','OPTIONS')`);
  } else if (filters.methodClass === 'write') {
    conditions.push(sql`UPPER(COALESCE(method,'')) IN ('POST','PUT','PATCH','DELETE')`);
  } else if (filters.methodClass === 'other') {
    conditions.push(sql`UPPER(COALESCE(method,'')) NOT IN ('GET','HEAD','OPTIONS','POST','PUT','PATCH','DELETE')`);
  }

  // Status class filter
  if (filters.statusClass) {
    const classMap: Record<string, [number, number]> = {
      '2xx': [200, 299],
      '3xx': [300, 399],
      '4xx': [400, 499],
      '5xx': [500, 599],
    };
    if (filters.statusClass in classMap) {
      const [lo, hi] = classMap[filters.statusClass];
      conditions.push(sql`COALESCE(status,0) BETWEEN ${lo} AND ${hi}`);
    }
  }

  if (rollup === 'daily' && !groupBy) {
    // Агрегированные персентили за период
    const result = await db.execute(sql`
      SELECT 
        percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY duration_ms) AS p99,
        COUNT(*) AS count,
        COUNT(*) FILTER (WHERE COALESCE(status,0) BETWEEN 400 AND 499) AS count_4xx,
        COUNT(*) FILTER (WHERE COALESCE(status,0) BETWEEN 500 AND 599) AS count_5xx
      FROM usage_events
      WHERE ${sql.join(conditions, sql` AND `)}
    `);

    return result.rows[0] as PercentileResult;
  } else if (rollup === 'daily' && groupBy) {
    // Группированные персентили из материализованного вью
    let groupField: string;
    let groupAlias: string;
    
    switch (groupBy) {
      case 'endpoint':
        groupField = 'endpoint';
        groupAlias = 'endpoint';
        break;
      case 'statusClass':
        groupField = 'status_class';
        groupAlias = 'status_class';
        break;
      case 'methodClass':
        groupField = 'method_class';
        groupAlias = 'method_class';
        break;
      default:
        throw new Error(`Unknown groupBy: ${groupBy}`);
    }

    const result = await db.execute(sql`
      SELECT 
        ${sql.raw(groupField)} AS group_value,
        SUM(calls) AS count,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY p50) AS p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY p95) AS p95,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY p99) AS p99,
        SUM(count_4xx) AS count_4xx,
        SUM(count_5xx) AS count_5xx
      FROM mv_usage_pXX_daily
      WHERE d >= ${from.toISOString().slice(0, 10)}::date
        AND d <= ${to.toISOString().slice(0, 10)}::date
      GROUP BY ${sql.raw(groupField)}
      ORDER BY p95 DESC NULLS LAST
      LIMIT 50
    `);

    return result.rows.map(row => ({
      group_key: groupAlias,
      group_value: (row as any).group_value,
      p50: (row as any).p50,
      p95: (row as any).p95,
      p99: (row as any).p99,
      count: (row as any).count,
      count_4xx: (row as any).count_4xx,
      count_5xx: (row as any).count_5xx,
    })) as PercentileGroup[];
  } else {
    // Live агрегация для небольших выборок
    let groupField: string;
    let groupAlias: string;
    
    switch (groupBy) {
      case 'endpoint':
        groupField = "COALESCE(endpoint, path, '')";
        groupAlias = 'endpoint';
        break;
      case 'statusClass':
        groupField = `CASE 
          WHEN COALESCE(status, 0) BETWEEN 200 AND 299 THEN '2xx'
          WHEN COALESCE(status, 0) BETWEEN 300 AND 399 THEN '3xx'
          WHEN COALESCE(status, 0) BETWEEN 400 AND 499 THEN '4xx'
          WHEN COALESCE(status, 0) BETWEEN 500 AND 599 THEN '5xx'
          ELSE 'other'
        END`;
        groupAlias = 'status_class';
        break;
      case 'methodClass':
        groupField = `CASE 
          WHEN UPPER(COALESCE(method, '')) IN ('GET','HEAD','OPTIONS') THEN 'read'
          WHEN UPPER(COALESCE(method, '')) IN ('POST','PUT','PATCH','DELETE') THEN 'write'
          ELSE 'other'
        END`;
        groupAlias = 'method_class';
        break;
      default:
        throw new Error(`Unknown groupBy: ${groupBy}`);
    }

    const result = await db.execute(sql`
      SELECT 
        ${sql.raw(groupField)} AS group_value,
        COUNT(*) AS count,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY duration_ms) AS p99,
        COUNT(*) FILTER (WHERE COALESCE(status,0) BETWEEN 400 AND 499) AS count_4xx,
        COUNT(*) FILTER (WHERE COALESCE(status,0) BETWEEN 500 AND 599) AS count_5xx
      FROM usage_events
      WHERE ${sql.join(conditions, sql` AND `)}
      GROUP BY ${sql.raw(groupField)}
      ORDER BY p95 DESC NULLS LAST
      LIMIT 50
    `);

    return result.rows.map(row => ({
      group_key: groupAlias,
      group_value: (row as any).group_value,
      p50: (row as any).p50,
      p95: (row as any).p95,
      p99: (row as any).p99,
      count: (row as any).count,
      count_4xx: (row as any).count_4xx,
      count_5xx: (row as any).count_5xx,
    })) as PercentileGroup[];
  }
}

