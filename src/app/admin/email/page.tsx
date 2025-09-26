'use client';

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const fetcher = (url: string) =>
  fetch(url, { headers: { 'cache-control': 'no-cache' } }).then((r) => r.json());

export default function AdminEmailPage() {
  const [status, setStatus] = useState('');
  const [days, setDays] = useState(7);
  const [hasAttachments, setHasAttachments] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'deny'>('approve');

  const queryParams = new URLSearchParams();
  if (status) queryParams.set('status', status);
  if (days) queryParams.set('days', days.toString());
  if (hasAttachments) queryParams.set('hasAttachments', hasAttachments);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/email?${queryParams.toString()}`,
    fetcher
  );

  const emails = data?.emails || [];
  const pagination = data?.pagination;

  const statusCounts = useMemo(() => {
    const counts = { HOLD: 0, APPROVED: 0, DENIED: 0, SENT: 0, FAILED: 0, EXPIRED: 0 };
    emails.forEach((email: any) => {
      counts[email.status as keyof typeof counts]++;
    });
    return counts;
  }, [emails]);

  async function handleApprove(emailId: string) {
    try {
      const response = await fetch(`/api/admin/email/${emailId}/approve`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.ok) {
        mutate(); // Обновляем список
      } else {
        alert(`Failed to approve: ${result.error}`);
      }
    } catch (error) {
      alert('Error approving email');
    }
  }

  async function handleDeny(emailId: string) {
    const reason = prompt('Reason for denial:') || 'Manually denied';
    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/email/${emailId}/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const result = await response.json();
      
      if (result.ok) {
        mutate(); // Обновляем список
      } else {
        alert(`Failed to deny: ${result.error}`);
      }
    } catch (error) {
      alert('Error denying email');
    }
  }

  async function handleRetry(emailId: string) {
    try {
      const response = await fetch(`/api/admin/email/${emailId}/retry`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.ok) {
        mutate(); // Обновляем список
        alert('Email queued for retry');
      } else {
        alert(`Failed to retry: ${result.error}`);
      }
    } catch (error) {
      alert('Error retrying email');
    }
  }

  async function handleForceSend(emailId: string) {
    if (!confirm('Force send this email immediately? This bypasses normal retry logic.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/email/${emailId}/force-send`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.ok) {
        mutate(); // Обновляем список
        alert(result.message);
      } else {
        alert(`Failed to force send: ${result.error}`);
      }
    } catch (error) {
      alert('Error force sending email');
    }
  }

  async function handleBulkAction() {
    if (selectedEmails.length === 0) {
      alert('No emails selected');
      return;
    }

    const action = bulkAction === 'approve' ? 'approve' : 'deny';
    const confirmMessage = `Are you sure you want to ${action} ${selectedEmails.length} emails?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      const promises = selectedEmails.map(emailId => {
        const endpoint = action === 'approve' 
          ? `/api/admin/email/${emailId}/approve`
          : `/api/admin/email/${emailId}/deny`;
        
        return fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: action === 'deny' ? JSON.stringify({ reason: 'Bulk denial' }) : undefined,
        });
      });

      await Promise.all(promises);
      setSelectedEmails([]);
      mutate();
    } catch (error) {
      alert(`Error performing bulk ${action}`);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'DENIED': return 'bg-red-100 text-red-800';
      case 'SENT': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Email Pause</h1>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Email Pause</h1>
        <div className="text-red-500">Error loading emails: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Email Pause</h1>
        <Link 
          href="/admin/email/rules" 
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Manage Rules
        </Link>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div 
            key={status}
            className={`p-3 rounded-xl cursor-pointer transition-colors ${
              status === status ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatus(status === status ? '' : status)}
          >
            <div className="text-sm text-gray-500">{status}</div>
            <div className="text-2xl font-bold">{count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="">All Status</option>
          <option value="HOLD">HOLD</option>
          <option value="APPROVED">APPROVED</option>
          <option value="DENIED">DENIED</option>
          <option value="SENT">SENT</option>
          <option value="FAILED">FAILED</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>

        <select 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 border rounded-xl"
        >
          <option value={1}>Last 24h</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>

        <select 
          value={hasAttachments} 
          onChange={(e) => setHasAttachments(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="">All</option>
          <option value="true">With Attachments</option>
          <option value="false">No Attachments</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div className="flex gap-2 items-center bg-blue-50 p-3 rounded-xl">
          <span>{selectedEmails.length} selected</span>
          <select 
            value={bulkAction} 
            onChange={(e) => setBulkAction(e.target.value as 'approve' | 'deny')}
            className="px-3 py-1 border rounded"
          >
            <option value="approve">Approve</option>
            <option value="deny">Deny</option>
          </select>
          <button 
            onClick={handleBulkAction}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Execute
          </button>
          <button 
            onClick={() => setSelectedEmails([])}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
      )}

      {/* Email List */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox"
                    checked={selectedEmails.length === emails.length && emails.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmails(emails.map((email: any) => email.id));
                      } else {
                        setSelectedEmails([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email: any) => (
                <tr key={email.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmails([...selectedEmails, email.id]);
                        } else {
                          setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {new Date(email.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{email.from}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      {email.to.slice(0, 2).join(', ')}
                      {email.to.length > 2 && ` +${email.to.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{email.subject}</td>
                  <td className="px-4 py-3 text-xs">
                    {formatSize(email.totalSizeBytes)}
                    {email.attachmentCount > 0 && ` (${email.attachmentCount} files)`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(email.status)}`}>
                      {email.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {email.status === 'HOLD' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleApprove(email.id)}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => handleDeny(email.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                    {email.status === 'APPROVED' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleForceSend(email.id)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          title="Force send immediately"
                        >
                          ⚡
                        </button>
                      </div>
                    )}
                    {email.status === 'FAILED' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleRetry(email.id)}
                          className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                          title="Retry sending"
                        >
                          🔄
                        </button>
                        <button 
                          onClick={() => handleForceSend(email.id)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          title="Force send immediately"
                        >
                          ⚡
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {emails.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No emails found matching your filters
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.hasMore && (
        <div className="text-center">
          <button 
            onClick={() => mutate()}
            className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
