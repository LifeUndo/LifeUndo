'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import PercentilesCards from './components/PercentilesCards';

const fetcher = (url: string) =>
  fetch(url, { headers: { 'cache-control': 'no-cache' } }).then((r) => r.json());

export default function AdminUsagePage() {
  const { data: sum } = useSWR('/api/admin/usage/summary', fetcher);
  const { data: ts } = useSWR('/api/admin/usage/timeseries?days=14', fetcher);
  const { data: lim } = useSWR('/api/admin/limits/summary', fetcher);

  const [qEndpoint, setQEndpoint] = useState('');
  const [qLike, setQLike] = useState('');
  const [qMethod, setQMethod] = useState('');
  const [qStatus, setQStatus] = useState('');
  const [qDays, setQDays] = useState(30);

  const [qClass, setQClass] = useState(''); // '', '2xx','3xx','4xx','5xx'
  const [qSortBy, setQSortBy] = useState<'ts'|'status'|'endpoint'|'method'|'duration_ms'>('ts');
  const [qSortDir, setQSortDir] = useState<'asc'|'desc'>('desc');
  const [qGzip, setQGzip] = useState(true);
  const [qMethodClass, setQMethodClass] = useState<'read'|'write'|'other'|''>('');
  const [qDurMin, setQDurMin] = useState<string>(''); // ms
  const [qDurMax, setQDurMax] = useState<string>('');
  const [qSlowEndpoints, setQSlowEndpoints] = useState(false);
  const [qInstability, setQInstability] = useState(false);

  const total = sum?.total ?? 0;
  const byEndpoint: { endpoint: string; c: number }[] = sum?.byEndpoint ?? [];
  const series: { date: string; count: number }[] =
    (ts?.series ?? []).map((p: any) => ({
      // нормализуем дату в YYYY-MM-DD для оси X
      date: new Date(p.date).toISOString().slice(0, 10),
      count: Number(p.count || p.c || 0),
    }));

  const used = lim?.usedMonth ?? 0;
  const limit = lim?.monthLimit ?? 0;
  const pct = useMemo(() => {
    if (!limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  }, [used, limit]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Usage (14 дней)</h1>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <button onClick={()=>{setQClass('2xx'); setQMethodClass(''); setQSlowEndpoints(false); setQInstability(false);}} className="px-3 py-1.5 rounded-xl bg-green-50">2xx OK</button>
        <button onClick={()=>{setQClass('4xx'); setQMethodClass(''); setQSlowEndpoints(false); setQInstability(false);}} className="px-3 py-1.5 rounded-xl bg-yellow-50">4xx Errors</button>
        <button onClick={()=>{setQClass('5xx'); setQMethodClass(''); setQSlowEndpoints(false); setQInstability(false);}} className="px-3 py-1.5 rounded-xl bg-red-50">5xx Incidents</button>
        <button onClick={()=>{setQClass(''); setQMethodClass('write'); setQSlowEndpoints(false); setQInstability(false);}} className="px-3 py-1.5 rounded-xl bg-blue-50">Write ops</button>
        <button onClick={()=>{setQClass(''); setQMethodClass('read'); setQSlowEndpoints(false); setQInstability(false);}} className="px-3 py-1.5 rounded-xl bg-gray-100">Read ops</button>
        <button onClick={()=>{setQClass(''); setQMethodClass(''); setQSlowEndpoints(true); setQInstability(false); setQDurMin('250'); setQSortBy('duration_ms');}} className="px-3 py-1.5 rounded-xl bg-orange-50">Slow endpoints</button>
        <button onClick={()=>{setQClass('5xx'); setQMethodClass(''); setQSlowEndpoints(false); setQInstability(true); setQDurMin('1000');}} className="px-3 py-1.5 rounded-xl bg-red-100">Instability</button>
      </div>

      <div className="rounded-2xl p-4 shadow bg-white space-y-3">
        <h2 className="text-lg font-semibold">Экспорт CSV — быстрые фильтры</h2>
        <div className="grid md:grid-cols-5 gap-2">
          <input className="px-3 py-2 rounded-xl border" placeholder="endpoint (=)" value={qEndpoint} onChange={e=>setQEndpoint(e.target.value)} />
          <input className="px-3 py-2 rounded-xl border" placeholder="endpointLike (ILIKE)" value={qLike} onChange={e=>setQLike(e.target.value)} />
          <input className="px-3 py-2 rounded-xl border" placeholder="method (GET/POST)" value={qMethod} onChange={e=>setQMethod(e.target.value)} />
          <input className="px-3 py-2 rounded-xl border" placeholder="status (=)" value={qStatus} onChange={e=>setQStatus(e.target.value)} />
          <input className="px-3 py-2 rounded-xl border" type="number" min={1} max={365} placeholder="days" value={qDays} onChange={e=>setQDays(Number(e.target.value||30))} />
        </div>

        <div className="grid md:grid-cols-5 gap-2">
          <select className="px-3 py-2 rounded-xl border" value={qClass} onChange={e=>setQClass(e.target.value)}>
            <option value="">statusClass (все)</option>
            <option value="2xx">2xx</option>
            <option value="3xx">3xx</option>
            <option value="4xx">4xx</option>
            <option value="5xx">5xx</option>
          </select>
          <select className="px-3 py-2 rounded-xl border" value={qSortBy} onChange={e=>setQSortBy(e.target.value as any)}>
            <option value="ts">sortBy=ts</option>
            <option value="status">sortBy=status</option>
            <option value="endpoint">sortBy=endpoint</option>
            <option value="method">sortBy=method</option>
            <option value="duration_ms">sortBy=duration_ms</option>
          </select>
          <select className="px-3 py-2 rounded-xl border" value={qSortDir} onChange={e=>setQSortDir(e.target.value as any)}>
            <option value="desc">sortDir=desc</option>
            <option value="asc">sortDir=asc</option>
          </select>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border">
            <input type="checkbox" checked={qGzip} onChange={e=>setQGzip(e.target.checked)} />
            gzip
          </label>
          <select className="px-3 py-2 rounded-xl border" value={qMethodClass} onChange={e=>setQMethodClass(e.target.value as any)}>
            <option value="">methodClass (all)</option>
            <option value="read">read (GET/HEAD/OPTIONS)</option>
            <option value="write">write (POST/PUT/PATCH/DELETE)</option>
            <option value="other">other</option>
          </select>
        </div>

        <div className="grid md:grid-cols-5 gap-2">
          <input className="px-3 py-2 rounded-xl border" type="number" min={0} placeholder="durationMin (ms)" value={qDurMin} onChange={e=>setQDurMin(e.target.value)} />
          <input className="px-3 py-2 rounded-xl border" type="number" min={0} placeholder="durationMax (ms)" value={qDurMax} onChange={e=>setQDurMax(e.target.value)} />
          <div className="col-span-3"></div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href={`/api/admin/usage/export?days=${qDays}` +
                (qEndpoint?`&endpoint=${encodeURIComponent(qEndpoint)}`:'') +
                (qLike?`&endpointLike=${encodeURIComponent(qLike)}`:'') +
                (qMethod?`&method=${encodeURIComponent(qMethod)}`:'') +
                (qStatus?`&status=${encodeURIComponent(qStatus)}`:'') +
                (qClass?`&statusClass=${encodeURIComponent(qClass)}`:'') +
                (qMethodClass?`&methodClass=${encodeURIComponent(qMethodClass)}`:'') +
                (qDurMin?`&durationMin=${encodeURIComponent(qDurMin)}`:'') +
                (qDurMax?`&durationMax=${encodeURIComponent(qDurMax)}`:'') +
                (qSortBy?`&sortBy=${encodeURIComponent(qSortBy)}`:'') +
                (qSortDir?`&sortDir=${encodeURIComponent(qSortDir)}`:'') +
                (qGzip?`&gzip=1`:'') +
                `&limit=100000&columns=ts,endpoint,method,status,duration_ms`}
            className="inline-block px-3 py-2 rounded-xl shadow bg-gray-100 hover:bg-gray-200"
            title="Batch CSV export"
          >
            CSV {qGzip ? '(gzip)' : ''}
          </a>
          
          <a
            href={`/api/admin/usage/stream?days=${qDays}&format=ndjson` +
                (qEndpoint?`&endpoint=${encodeURIComponent(qEndpoint)}`:'') +
                (qLike?`&endpointLike=${encodeURIComponent(qLike)}`:'') +
                (qMethod?`&method=${encodeURIComponent(qMethod)}`:'') +
                (qStatus?`&status=${encodeURIComponent(qStatus)}`:'') +
                (qClass?`&statusClass=${encodeURIComponent(qClass)}`:'') +
                (qMethodClass?`&methodClass=${encodeURIComponent(qMethodClass)}`:'') +
                (qDurMin?`&durationMin=${encodeURIComponent(qDurMin)}`:'') +
                (qDurMax?`&durationMax=${encodeURIComponent(qDurMax)}`:'') +
                `&gzip=1&limit=10000`}
            className="inline-block px-3 py-2 rounded-xl shadow bg-blue-100 hover:bg-blue-200"
            title="Streaming NDJSON export with pagination"
          >
            Stream NDJSON (gzip)
          </a>

          <a
            href="/api/admin/usage/export?days=7"
            className="inline-block px-3 py-2 rounded-xl shadow bg-gray-100 hover:bg-gray-200"
          >
            CSV (7 дней)
          </a>
          <a
            href="/api/admin/usage/export?days=30"
            className="inline-block px-3 py-2 rounded-xl shadow bg-gray-100 hover:bg-gray-200"
          >
            CSV (30 дней)
          </a>
        </div>
      </div>

      {/* Performance Percentiles */}
      <PercentilesCards />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500">Всего вызовов</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>

        <div className="rounded-2xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500 mb-1">Лимит за месяц</div>
          <div className="text-sm mb-2">
            <span className="font-semibold">{used}</span> из <span className="font-semibold">{limit || '—'}</span>
            {lim?.resetAt && <span className="text-gray-400"> · сброс {new Date(lim.resetAt).toLocaleDateString()}</span>}
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-blue-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="rounded-2xl p-4 shadow bg-white md:col-span-2">
          <div className="text-sm mb-2 text-gray-500">Динамика по дням</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">ТОП эндпоинтов</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Endpoint</th>
              <th className="py-2">Calls</th>
            </tr>
          </thead>
          <tbody>
            {(byEndpoint ?? []).map((r, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 font-mono">{(r as any).endpoint}</td>
                <td className="py-2">{(r as any).c}</td>
              </tr>
            ))}
            {(!byEndpoint || byEndpoint.length === 0) && (
              <tr>
                <td colSpan={2} className="py-4 text-gray-500">
                  Пока нет данных — дерните пару публичных API, и график оживёт.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}