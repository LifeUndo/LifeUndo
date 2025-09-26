'use client';

import { useState, useEffect } from 'react';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastCheck: Date;
  details?: string;
}

export default function SystemHealthPage() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checks = [
    {
      name: 'DNS/SSL Vercel',
      endpoint: 'https://getlifeundo.com',
      check: async () => {
        try {
          const response = await fetch('/api/_health/dns-ssl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: 'getlifeundo.com' })
          });
          return response.ok;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'Cloudflare Proxy',
      endpoint: 'https://getlifeundo.com',
      check: async () => {
        try {
          const response = await fetch('https://getlifeundo.com', { method: 'HEAD' });
          return response.headers.get('cf-cache-status') !== null;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'Database',
      endpoint: '/api/_health/db',
      check: async () => {
        try {
          const response = await fetch('/api/_health/db');
          return response.ok;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'FreeKassa Webhook',
      endpoint: '/api/fk/notify',
      check: async () => {
        try {
          const response = await fetch('/api/_health/freekassa');
          return response.ok;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'SMTP Relay',
      endpoint: 'SMTP :2525',
      check: async () => {
        try {
          const response = await fetch('/api/_health/smtp');
          return response.ok;
        } catch {
          return false;
        }
      }
    }
  ];

  useEffect(() => {
    const runHealthChecks = async () => {
      setIsLoading(true);
      const results: HealthCheck[] = [];

      for (const check of checks) {
        try {
          const isHealthy = await check.check();
          results.push({
            name: check.name,
            status: isHealthy ? 'healthy' : 'error',
            message: isHealthy ? 'Operational' : 'Service unavailable',
            lastCheck: new Date(),
            details: check.endpoint
          });
        } catch (error) {
          results.push({
            name: check.name,
            status: 'error',
            message: `Error: ${error}`,
            lastCheck: new Date(),
            details: check.endpoint
          });
        }
      }

      setHealthChecks(results);
      setIsLoading(false);
    };

    runHealthChecks();
    
    // Проверяем каждые 30 секунд
    const interval = setInterval(runHealthChecks, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const healthyCount = healthChecks.filter(h => h.status === 'healthy').length;
  const totalCount = healthChecks.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">System Health</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Overall Status</h2>
            <p className="text-sm text-gray-600">
              {healthyCount} of {totalCount} services operational
            </p>
          </div>
          <div className={`text-2xl font-bold ${
            healthyCount === totalCount ? 'text-green-600' : 
            healthyCount > totalCount / 2 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {healthyCount === totalCount ? '🟢 All Systems Go' : 
             healthyCount > totalCount / 2 ? '🟡 Degraded' : '🔴 Critical'}
          </div>
        </div>
      </div>

      {/* Individual Checks */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Running health checks...</p>
          </div>
        ) : (
          healthChecks.map((check, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(check.status)}</span>
                  <div>
                    <h3 className="font-medium">{check.name}</h3>
                    <p className="text-sm text-gray-600">{check.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                    {check.status.toUpperCase()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {check.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {check.lastCheck.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Quick Actions</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Refresh All
          </button>
          <button 
            onClick={() => window.open('/api/_health/db', '_blank')}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            DB Health
          </button>
          <button 
            onClick={() => window.open('https://getlifeundo.com', '_blank')}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Live Site
          </button>
        </div>
      </div>
    </div>
  );
}

