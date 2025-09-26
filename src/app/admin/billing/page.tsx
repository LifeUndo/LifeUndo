'use client';

import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';

const fetcher = (url: string) =>
  fetch(url, { headers: { 'cache-control': 'no-cache' } }).then((r) => r.json());

export default function AdminBillingPage() {
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const { data: subscriptionData } = useSWR('/api/admin/subscription', fetcher);
  const { data: limitsData } = useSWR('/api/admin/limits', fetcher);
  const { data: invoicesData } = useSWR('/api/admin/invoices', fetcher);
  const { data: plansData } = useSWR('/api/billing/plans', fetcher);

  const subscription = subscriptionData?.subscription;
  const limits = limitsData?.limits || [];
  const invoices = invoicesData?.invoices || [];
  const plans = plansData?.plans || [];

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

    try {
      const response = await fetch('/api/admin/subscription/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_code: selectedPlan }),
      });

      const result = await response.json();
      if (result.ok) {
        alert('Plan changed successfully!');
        setShowChangePlan(false);
        setSelectedPlan('');
        window.location.reload();
      } else {
        alert(`Failed to change plan: ${result.error}`);
      }
    } catch (error) {
      alert('Error changing plan');
    }
  };

  const formatPrice = (cents: number, currency: string = 'USD') => {
    const amount = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Billing</h1>
        <Link 
          href="/admin"
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Back to Admin
        </Link>
      </div>

      {/* Billing Banner */}
      {(limitsData?.subscription?.isOverLimit || limitsData?.subscription?.isInGrace) && (
        <div className={`p-4 rounded-lg ${limitsData.subscription.isInGrace ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${limitsData.subscription.isInGrace ? 'text-yellow-800' : 'text-red-800'}`}>
                {limitsData.subscription.isInGrace ? 'Grace Period Active' : 'Usage Limit Exceeded'}
              </h3>
              <p className={`text-sm ${limitsData.subscription.isInGrace ? 'text-yellow-700' : 'text-red-700'}`}>
                {limitsData.subscription.isInGrace 
                  ? `Grace period until ${new Date(limitsData.subscription.graceUntil).toLocaleDateString()}`
                  : 'Some features may be limited. Consider upgrading your plan.'
                }
              </p>
            </div>
            <button 
              onClick={() => setShowChangePlan(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
          <div className="mt-4">
            <div className="text-2xl font-bold text-blue-600">{subscription?.plan?.name || 'Loading...'}</div>
            <div className="text-sm text-gray-500">
              {subscription?.plan?.priceCents > 0 
                ? formatPrice(subscription.plan.priceCents, subscription.plan.currency)
                : 'Free'
              } / {subscription?.plan?.billingCycle}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {subscription?.daysUntilRenewal} days until renewal
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Usage Status</h3>
          <div className="mt-4">
            <div className={`text-2xl font-bold ${limitsData?.subscription?.isOverLimit ? 'text-red-600' : 'text-green-600'}`}>
              {limitsData?.subscription?.isOverLimit ? 'Over Limit' : 'Within Limits'}
            </div>
            <div className="text-sm text-gray-500">
              {limits.filter(l => l.isOverLimit).length} quotas exceeded
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">{invoices.length}</div>
            <div className="text-sm text-gray-500">
              {invoices.filter(i => i.status === 'paid').length} paid
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Limits</h3>
        <div className="space-y-4">
          {limits.map((limit: any) => (
            <div key={limit.name} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {limit.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {limit.used} / {limit.limit} used ({limit.window})
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-sm font-medium ${
                  limit.isOverLimit ? 'bg-red-100 text-red-800' :
                  limit.isNearLimit ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {limit.percentage}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    limit.isOverLimit ? 'bg-red-500' :
                    limit.isNearLimit ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(limit.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Invoice #</th>
                <th className="py-2">Period</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((invoice: any) => (
                <tr key={invoice.id} className="border-b">
                  <td className="py-2 font-mono">{invoice.invoiceNumber}</td>
                  <td className="py-2">
                    {new Date(invoice.periodStart).toLocaleDateString()} - {new Date(invoice.periodEnd).toLocaleDateString()}
                  </td>
                  <td className="py-2">{formatPrice(invoice.totalCents, 'USD')}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Link 
                        href={`/api/admin/invoices/${invoice.id}/export.csv`}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        CSV
                      </Link>
                      {invoice.status === 'open' && (
                        <button 
                          onClick={async () => {
                            if (confirm('Mark this invoice as paid?')) {
                              try {
                                const response = await fetch(`/api/admin/invoices/${invoice.id}/mark-paid`, {
                                  method: 'POST',
                                });
                                const result = await response.json();
                                if (result.ok) {
                                  alert('Invoice marked as paid');
                                  window.location.reload();
                                } else {
                                  alert(`Failed: ${result.error}`);
                                }
                              } catch (error) {
                                alert('Error marking invoice as paid');
                              }
                            }
                          }}
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {invoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No invoices found
          </div>
        )}
      </div>

      {/* Change Plan Modal */}
      {showChangePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Change Plan</h3>
            <div className="space-y-3">
              {plans.map((plan: any) => (
                <label key={plan.code} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="plan"
                    value={plan.code}
                    checked={selectedPlan === plan.code}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-500">{plan.description}</div>
                    <div className="text-sm text-blue-600">
                      {plan.priceCents > 0 
                        ? formatPrice(plan.priceCents, plan.currency)
                        : 'Free'
                      } / {plan.billingCycle}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={handleChangePlan}
                disabled={!selectedPlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Change Plan
              </button>
              <button 
                onClick={() => {
                  setShowChangePlan(false);
                  setSelectedPlan('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

