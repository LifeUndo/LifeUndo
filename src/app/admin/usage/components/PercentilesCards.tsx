'use client';

import useSWR from 'swr';
import { useMemo } from 'react';

const fetcher = (url: string) =>
  fetch(url, { headers: { 'cache-control': 'no-cache' } }).then((r) => r.json());

interface PercentileData {
  p50: number | null;
  p95: number | null;
  p99: number | null;
  count: number;
  count_4xx: number;
  count_5xx: number;
}

const WARNING_THRESHOLD = Number(process.env.NEXT_PUBLIC_USAGE_PCTL_WARN_MS || 250);
const CRITICAL_THRESHOLD = Number(process.env.NEXT_PUBLIC_USAGE_PCTL_CRIT_MS || 800);

function getStatusColor(value: number | null): string {
  if (value === null) return 'text-gray-400';
  if (value >= CRITICAL_THRESHOLD) return 'text-red-600';
  if (value >= WARNING_THRESHOLD) return 'text-yellow-600';
  return 'text-green-600';
}

function getStatusBg(value: number | null): string {
  if (value === null) return 'bg-gray-50';
  if (value >= CRITICAL_THRESHOLD) return 'bg-red-50';
  if (value >= WARNING_THRESHOLD) return 'bg-yellow-50';
  return 'bg-green-50';
}

function formatMs(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function PercentilesCards() {
  const { data, error, isLoading } = useSWR('/api/admin/usage/percentiles?days=7', fetcher);

  const percentiles = useMemo((): PercentileData | null => {
    if (!data?.ok || !data.result) return null;
    
    // Если это массив групп, агрегируем
    if (Array.isArray(data.result)) {
      const total = data.result.reduce((acc, group) => ({
        count: acc.count + group.count,
        count_4xx: acc.count_4xx + group.count_4xx,
        count_5xx: acc.count_5xx + group.count_5xx,
        p50: Math.max(acc.p50 || 0, group.p50 || 0),
        p95: Math.max(acc.p95 || 0, group.p95 || 0),
        p99: Math.max(acc.p99 || 0, group.p99 || 0),
      }), { count: 0, count_4xx: 0, count_5xx: 0, p50: 0, p95: 0, p99: 0 });
      
      return total;
    }
    
    return data.result as PercentileData;
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl p-4 shadow bg-white animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !percentiles) {
    return (
      <div className="rounded-2xl p-4 shadow bg-white">
        <div className="text-gray-500">Не удалось загрузить метрики производительности</div>
      </div>
    );
  }

  const errorRate = percentiles.count > 0 
    ? ((percentiles.count_4xx + percentiles.count_5xx) / percentiles.count * 100)
    : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Performance Percentiles (7 дней)</h2>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-4 shadow ${getStatusBg(percentiles.p50)}`}>
          <div className="text-sm text-gray-500">p50 (median)</div>
          <div className={`text-2xl font-bold ${getStatusColor(percentiles.p50)}`}>
            {formatMs(percentiles.p50)}
          </div>
        </div>

        <div className={`rounded-2xl p-4 shadow ${getStatusBg(percentiles.p95)}`}>
          <div className="text-sm text-gray-500">p95</div>
          <div className={`text-2xl font-bold ${getStatusColor(percentiles.p95)}`}>
            {formatMs(percentiles.p95)}
          </div>
        </div>

        <div className={`rounded-2xl p-4 shadow ${getStatusBg(percentiles.p99)}`}>
          <div className="text-sm text-gray-500">p99</div>
          <div className={`text-2xl font-bold ${getStatusColor(percentiles.p99)}`}>
            {formatMs(percentiles.p99)}
          </div>
        </div>

        <div className="rounded-2xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500">Error Rate</div>
          <div className={`text-2xl font-bold ${errorRate > 5 ? 'text-red-600' : errorRate > 1 ? 'text-yellow-600' : 'text-green-600'}`}>
            {errorRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">
            {percentiles.count_4xx + percentiles.count_5xx} / {percentiles.count} calls
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Пороги: Warning ≥ {WARNING_THRESHOLD}ms, Critical ≥ {CRITICAL_THRESHOLD}ms
      </div>
    </div>
  );
}

