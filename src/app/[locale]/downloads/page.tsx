'use client';

import React, { useState } from 'react';

export default function DownloadsPage() {
  const [testEmail, setTestEmail] = useState('');
  const [testPlan, setTestPlan] = useState('starter_6m');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Check if we're in Preview/Dev environment
  const isDevMode = process.env.NODE_ENV === 'development' || 
                   (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));

  const handleGrantTestLicense = async () => {
    if (!testEmail.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');
    setTestResult(null);

    try {
      const response = await fetch('/api/dev/license/grant-ui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail.trim(),
          plan: testPlan
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setTestResult(data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (error) {
      setError('Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const openAccount = () => {
    if (testResult?.email) {
      window.open(`/ru/account?email=${encodeURIComponent(testResult.email)}`, '_blank');
    }
  };

  const openExtensionInstructions = () => {
    // Scroll to extension instructions
    document.getElementById('extension-instructions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Download LifeUndo Extension
          </h1>
          
          {/* Test License Card - Only in Preview/Dev */}
          {isDevMode ? (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">🧪 Test License Activation</h2>
              <p className="text-gray-300 mb-6">
                Test the full license flow without any payment. Perfect for development and testing.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Plan</label>
                  <select
                    value={testPlan}
                    onChange={(e) => setTestPlan(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="starter_6m">Starter Bundle (6 months)</option>
                    <option value="pro_month">Pro Monthly</option>
                    <option value="vip_lifetime">VIP Lifetime</option>
                    <option value="team_5">Team (5 seats)</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleGrantTestLicense}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Granting...' : 'Grant Test License'}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300">❌ {error}</p>
                </div>
              )}

              {testResult && (
                <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-300 mb-4">✅ Test License Granted!</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-white">Order ID:</strong>
                      <p className="text-gray-300 font-mono">{testResult.order_id}</p>
                    </div>
                    <div>
                      <strong className="text-white">Level:</strong>
                      <p className="text-gray-300">{testResult.level?.toUpperCase()}</p>
                    </div>
                    <div>
                      <strong className="text-white">Expires:</strong>
                      <p className="text-gray-300">{new Date(testResult.expires_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <strong className="text-white">Plan:</strong>
                      <p className="text-gray-300">{testResult.plan}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={openAccount}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      Open Account
                    </button>
                    <button
                      onClick={openExtensionInstructions}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
                    >
                      Extension Instructions
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">⚠️ Testing Disabled</h2>
              <p className="text-gray-300">
                Test license activation is only available in Preview/Development environment.
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Chrome */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chrome</h3>
              <p className="text-gray-300 mb-4">Install as unpacked extension</p>
              <button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                onClick={() => window.open('chrome://extensions/', '_blank')}
              >
                Get for Chrome
              </button>
            </div>

            {/* Firefox */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Firefox</h3>
              <p className="text-gray-300 mb-4">Load temporary add-on</p>
              <button 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                onClick={() => window.open('about:debugging#/runtime/this-firefox', '_blank')}
              >
                Get for Firefox
              </button>
            </div>

            {/* Edge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Edge</h3>
              <p className="text-gray-300 mb-4">Install as unpacked extension</p>
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                onClick={() => window.open('edge://extensions/', '_blank')}
              >
                Get for Edge
              </button>
            </div>
          </div>

          {/* Manual Installation Instructions */}
          <div id="extension-instructions" className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">📦 Manual Installation (Dev)</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chrome/Edge</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Open <code className="bg-gray-800 px-2 py-1 rounded">chrome://extensions/</code></li>
                  <li>2. Enable "Developer mode"</li>
                  <li>3. Click "Load unpacked"</li>
                  <li>4. Select the extension folder: <code className="bg-gray-800 px-2 py-1 rounded">extension/</code></li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Firefox</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Open <code className="bg-gray-800 px-2 py-1 rounded">about:debugging</code></li>
                  <li>2. Click "This Firefox"</li>
                  <li>3. Click "Load Temporary Add-on…"</li>
                  <li>4. Select <code className="bg-gray-800 px-2 py-1 rounded">extension/manifest.json</code></li>
                </ol>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-300 mb-2">📁 Extension Build Path</h4>
              <p className="text-gray-300 mb-2">
                The extension files are located in: <code className="bg-gray-800 px-2 py-1 rounded">extension/</code>
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Run <code className="bg-gray-800 px-2 py-1 rounded">npm run build:ext</code> to prepare the extension for installation.
              </p>
              
              {isDevMode && (
                <div className="mt-4">
                  <a 
                    href="/extension-dev-0.4.0.zip" 
                    download
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    📦 Download Extension ZIP
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Run <code className="bg-gray-800 px-1 py-0.5 rounded">npm run build:ext:zip</code> to generate this file
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}