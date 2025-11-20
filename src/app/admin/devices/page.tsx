'use client';

import { useEffect, useState } from 'react';

interface DeviceRow {
  id: number;
  user_email: string;
  device_id: string;
  kind: string;
  label: string | null;
  created_at: string;
  last_seen_at: string | null;
}

export default function AdminDevicesPage() {
  const [items, setItems] = useState<DeviceRow[]>([]);
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  async function load() {
    if (!adminToken) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (email) qs.set('email', email);
      if (kind) qs.set('kind', kind);
      const res = await fetch('/api/admin/devices?' + qs.toString(), {
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } finally {
      setLoading(false);
    }
  }

  async function mutate(id: number, action: 'disable' | 'enable' | 'setLabel' | 'delete', extra?: { label?: string }) {
    if (!adminToken) return;
    const body: any = { id, action };
    if (action === 'setLabel' && typeof extra?.label === 'string') {
      body.label = extra.label;
    }
    const res = await fetch('/api/admin/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(body),
    });
    if (res.ok) load();
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('adminToken') || '';
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (adminToken) load();
  }, [adminToken]);

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-xs">
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">Устройства</h1>
        <p className="text-slate-400 max-w-2xl">
          Раздел для просмотра устройств, привязанных к лицензиям, и базовых операций
          (отключение, включение, метки, удаление). Для API-запросов используется заголовок
          <code className="mx-1">X-Admin-Token</code>, который вводится один раз на странице
          входа <code>/admin/login</code> и сохраняется в браузере.
        </p>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">X-Admin-Token</label>
          <input
            type="password"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[260px]"
            value={adminToken}
            onChange={(e) => {
              const v = e.target.value;
              setAdminToken(v);
              window.localStorage.setItem('adminToken', v);
            }}
          />
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">Email</label>
          <input
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[220px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-xs text-slate-400">
          <label className="mb-1">Тип устройства</label>
          <input
            placeholder="extension / desktop / android"
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-w-[200px]"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>
        <button
          onClick={load}
          className="h-8 px-3 rounded-md bg-indigo-600 text-xs font-medium hover:bg-indigo-500 disabled:opacity-60"
          disabled={loading || !adminToken}
        >
          {loading ? 'Загрузка…' : 'Обновить'}
        </button>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="px-2 py-2 text-left">ID</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Device ID</th>
              <th className="px-2 py-2 text-left">Kind</th>
              <th className="px-2 py-2 text-left">Label</th>
              <th className="px-2 py-2 text-left">Created</th>
              <th className="px-2 py-2 text-left">Last seen</th>
              <th className="px-2 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-900/60">
                <td className="px-2 py-1">{it.id}</td>
                <td className="px-2 py-1">{it.user_email}</td>
                <td className="px-2 py-1 font-mono text-[11px]">{it.device_id}</td>
                <td className="px-2 py-1">{it.kind}</td>
                <td className="px-2 py-1">{it.label || '-'}</td>
                <td className="px-2 py-1">{it.created_at}</td>
                <td className="px-2 py-1">{it.last_seen_at || '-'}</td>
                <td className="px-2 py-1 space-x-1">
                  <button
                    onClick={() => mutate(it.id, 'disable')}
                    className="px-2 py-1 rounded bg-slate-800 text-[11px] hover:bg-slate-700"
                  >
                    Отключить
                  </button>
                  <button
                    onClick={() => mutate(it.id, 'enable')}
                    className="px-2 py-1 rounded bg-emerald-700 text-[11px] hover:bg-emerald-600"
                  >
                    Включить
                  </button>
                  <button
                    onClick={() => {
                      const next = window.prompt('Новая метка устройства', it.label || '') || '';
                      mutate(it.id, 'setLabel', { label: next });
                    }}
                    className="px-2 py-1 rounded bg-sky-700 text-[11px] hover:bg-sky-600"
                  >
                    Метка
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить устройство из списка? Это не сотрёт данные на стороне клиента.')) {
                        mutate(it.id, 'delete');
                      }
                    }}
                    className="px-2 py-1 rounded bg-red-700 text-[11px] hover:bg-red-600"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// code omitted in chat
