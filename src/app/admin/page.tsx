import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Админка</h1>
      <ul className="list-disc list-inside space-y-1">
        <li><Link className="text-blue-600 underline" href="/admin/status">Статус / баннер</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/emails">Email-шаблоны</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/keys">API ключ</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/usage">Usage дашборд (экспорт CSV)</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/email">Email Pause</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/billing">Billing</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/system-health">System Health</Link></li>
        <li><Link className="text-blue-600 underline" href="/partner">Partner Portal</Link></li>
      </ul>
    </div>
  );
}
