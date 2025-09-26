'use client';

import { useState } from 'react';

export default function AdminKeysPage() {
  const [loading, setLoading] = useState(false);
  const [masked, setMasked] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [freshKey, setFreshKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/keys', { cache: 'no-store' });
      const j = await r.json();
      if (j?.ok) {
        setMasked(j.key?.mask ?? null);
        setCreated(j.key?.createdAt ?? null);
      }
    } finally { setLoading(false); }
  }

  async function rotate() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/keys', { method: 'POST' });
      const j = await r.json();
      if (j?.ok && j.apiKey) {
        setFreshKey(j.apiKey); // показать ТОЛЬКО один раз
        setMasked(`••••${j.last4}`);
        setCreated(new Date().toISOString());
      }
    } finally { setLoading(false); }
  }

  async function revoke() {
    if (!confirm('Деактивировать текущий ключ? Клиенты с этим ключом перестанут проходить авторизацию.')) return;
    setLoading(true);
    try {
      const r = await fetch('/api/admin/keys', { method: 'DELETE' });
      const j = await r.json();
      if (j?.ok) {
        setMasked(null);
        setCreated(null);
        setFreshKey(null);
        alert('Ключ деактивирован. При необходимости сгенерируйте новый.');
      }
    } finally { setLoading(false); }
  }

  async function revokeAll() {
    if (!confirm('ДЕЙСТВИТЕЛЬНО отключить ВСЕ ключи? Интеграции начнут получать 401/403.')) return;
    setLoading(true);
    try {
      const r = await fetch('/api/admin/keys/revoke-all', { method: 'POST' });
      const j = await r.json();
      if (j?.ok) {
        setMasked(null); setCreated(null); setFreshKey(null);
        alert('Все ключи деактивированы. Сгенерируйте новый.');
      }
    } finally { setLoading(false); }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert('API ключ скопирован');
    } catch { alert('Не удалось скопировать'); }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">API ключ</h1>

      <div className="rounded-2xl p-4 shadow bg-white space-y-3">
        <div className="text-sm text-gray-600">Текущий активный ключ (mask):</div>
        <div className="font-mono text-lg">{masked ?? '—'}</div>
        <div className="text-xs text-gray-500">Создан: {created ?? '—'}</div>

        <div className="flex flex-wrap gap-2">
          <button onClick={load} disabled={loading} className="px-3 py-2 rounded-xl shadow bg-gray-100">
            Обновить
          </button>
          <button onClick={rotate} disabled={loading} className="px-3 py-2 rounded-xl shadow bg-blue-50">
            Ротировать ключ
          </button>
          <button onClick={revoke} disabled={loading || !masked} className="px-3 py-2 rounded-xl shadow bg-red-100">
            Revoke (деактивировать)
          </button>
          <button onClick={revokeAll} disabled={loading} className="px-3 py-2 rounded-xl shadow bg-red-200">
            Revoke ALL (аварийно)
          </button>
        </div>

        {freshKey && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-50">
            <div className="text-sm font-semibold mb-1">Новый ключ (показывается один раз):</div>
            <div className="font-mono break-all">{freshKey}</div>
            <div className="mt-2">
              <button onClick={() => copy(freshKey)} className="px-3 py-2 rounded-xl shadow bg-yellow-100">
                Копировать
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Храните ключ в секьюрном хранилище. После закрытия страницы полный ключ больше не будет отображаться.
      </p>
    </div>
  );
}
