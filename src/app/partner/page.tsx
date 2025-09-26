'use client';

import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';

const fetcher = (url: string) =>
  fetch(url, { headers: { 'cache-control': 'no-cache' } }).then((r) => r.json());

export default function PartnerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'usage' | 'branding' | 'webhooks'>('overview');

  const { data: orgData } = useSWR('/api/admin/org', fetcher);
  const { data: apiKeysData } = useSWR('/api/admin/api-keys', fetcher);
  const { data: webhooksData } = useSWR('/api/admin/webhooks', fetcher);
  const { data: usageData } = useSWR('/api/admin/usage/summary', fetcher);

  const org = orgData?.org;
  const apiKeys = apiKeysData?.keys || [];
  const webhooks = webhooksData?.webhooks || [];
  const usage = usageData?.summary;

  const activeKeys = apiKeys.filter((key: any) => key.isActive).length;
  const totalRequests = usage?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {org?.name || 'Partner Portal'}
              </h1>
              <p className="text-sm text-gray-500">
                Organization: {org?.slug || 'default'}
              </p>
            </div>
            <Link 
              href="/admin"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'keys', label: 'API Keys' },
              { id: 'usage', label: 'Usage' },
              { id: 'branding', label: 'Branding' },
              { id: 'webhooks', label: 'Webhooks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab usage={usage} activeKeys={activeKeys} webhooks={webhooks} />}
        {activeTab === 'keys' && <KeysTab apiKeys={apiKeys} />}
        {activeTab === 'usage' && <UsageTab />}
        {activeTab === 'branding' && <BrandingTab org={org} />}
        {activeTab === 'webhooks' && <WebhooksTab webhooks={webhooks} />}
      </div>
    </div>
  );
}

function OverviewTab({ usage, activeKeys, webhooks }: any) {
  const metrics = [
    {
      title: 'Total Requests',
      value: usage?.total || 0,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active API Keys',
      value: activeKeys,
      change: '2 keys',
      changeType: 'neutral' as const,
    },
    {
      title: 'Active Webhooks',
      value: webhooks.filter((w: any) => w.isActive).length,
      change: '1 webhook',
      changeType: 'neutral' as const,
    },
    {
      title: 'Success Rate',
      value: '99.2%',
      change: '+0.3%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className={`text-sm ${
                metric.changeType === 'positive' ? 'text-green-600' :
                (metric.changeType as any) === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/partner?tab=keys"
            onClick={() => (window as any).setActiveTab?.('keys')}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <h4 className="font-medium">Create API Key</h4>
            <p className="text-sm text-gray-600">Generate a new API key for your integrations</p>
          </Link>
          <Link 
            href="/partner?tab=webhooks"
            onClick={() => (window as any).setActiveTab?.('webhooks')}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <h4 className="font-medium">Add Webhook</h4>
            <p className="text-sm text-gray-600">Set up real-time notifications</p>
          </Link>
          <Link 
            href="/partner?tab=usage"
            onClick={() => (window as any).setActiveTab?.('usage')}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <h4 className="font-medium">View Usage</h4>
            <p className="text-sm text-gray-600">Check your API usage and limits</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function KeysTab({ apiKeys }: any) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKey, setNewKey] = useState<any>(null);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const scopes = (formData.get('scopes') as string).split(',').map(s => s.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, scopes }),
      });
      
      const result = await response.json();
      if (result.ok) {
        setNewKey(result.key);
        setShowCreateForm(false);
        window.location.reload(); // Обновляем список
      }
    } catch (error) {
      alert('Failed to create API key');
    }
  };

  if (newKey) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">API Key Created</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This is the only time you'll see the full API key. Copy it now!
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <code className="text-sm font-mono break-all">{newKey.plainKey}</code>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(newKey.plainKey);
            alert('API key copied to clipboard!');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Copy to Clipboard
        </button>
        <button 
          onClick={() => setNewKey(null)}
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create API Key
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Create New API Key</h3>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input 
                type="text" 
                name="name" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Production API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scopes (comma-separated)
              </label>
              <input 
                type="text" 
                name="scopes" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., usage:read,usage:export,webhook:sign"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available scopes: usage:read, usage:export, email:submit, webhook:sign, admin:*
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Key
              </button>
              <button 
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scopes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apiKeys.map((key: any) => (
              <tr key={key.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{key.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {key.scopes.join(', ') || 'No scopes'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    key.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {key.isActive ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(key.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {apiKeys.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No API keys found. Create your first API key to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function UsageTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Usage Analytics</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Usage analytics and export functionality coming soon...</p>
        <Link 
          href="/admin/usage"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Full Usage Dashboard
        </Link>
      </div>
    </div>
  );
}

function BrandingTab({ org }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Branding</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">White-label branding customization coming soon...</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Current Organization</h3>
          <p className="text-sm text-gray-600">Name: {org?.name}</p>
          <p className="text-sm text-gray-600">Slug: {org?.slug}</p>
          <p className="text-sm text-gray-600">Type: {org?.type}</p>
        </div>
      </div>
    </div>
  );
}

function WebhooksTab({ webhooks }: any) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get('url') as string;
    const events = (formData.get('events') as string).split(',').map(s => s.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/admin/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, events }),
      });
      
      const result = await response.json();
      if (result.ok) {
        setShowCreateForm(false);
        window.location.reload(); // Обновляем список
      }
    } catch (error) {
      alert('Failed to create webhook');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Webhooks</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Webhook
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Create New Webhook</h3>
          <form onSubmit={handleCreateWebhook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input 
                type="url" 
                name="url" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://your-app.com/webhook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Events (comma-separated)
              </label>
              <input 
                type="text" 
                name="events" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="email.approved,email.denied,usage.threshold.breach"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available events: email.submitted, email.approved, email.denied, email.sent, usage.threshold.breach
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Webhook
              </button>
              <button 
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {webhooks.map((webhook: any) => (
              <tr key={webhook.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                  {webhook.url}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {webhook.events.slice(0, 2).join(', ')}
                  {webhook.events.length > 2 && ` +${webhook.events.length - 2} more`}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {webhook.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {webhook.lastDeliveryAt ? new Date(webhook.lastDeliveryAt).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/admin/webhooks/${webhook.id}/test`, {
                          method: 'POST',
                        });
                        const result = await response.json();
                        if (result.ok) {
                          alert('Test webhook sent successfully!');
                        } else {
                          alert(`Test failed: ${result.error}`);
                        }
                      } catch (error) {
                        alert('Failed to send test webhook');
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Test
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {webhooks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No webhooks found. Create your first webhook to receive real-time notifications.
          </div>
        )}
      </div>
    </div>
  );
}

