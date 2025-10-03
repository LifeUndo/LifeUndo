'use client';

import React, { useState, useEffect } from 'react';

export default function DownloadsClient() {
  const [testEmail, setTestEmail] = useState('');
  const [testPlan, setTestPlan] = useState('starter_6m');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [devEnabled, setDevEnabled] = useState<boolean | null>(null);
  const [diagInfo, setDiagInfo] = useState<any>(null);

  // Check dev status and diagnostics
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check dev status
        const statusRes = await fetch('/api/dev/license/status', { cache: 'no-store' });
        const statusData = await statusRes.json();
        setDevEnabled(statusData.enabled);

        // Check diagnostics
        const diagRes = await fetch('/api/dev/diag', { cache: 'no-store' });
        const diagData = await diagRes.json();
        setDiagInfo(diagData);
      } catch (error) {
        console.error('Failed to check dev status:', error);
        setDevEnabled(false);
      }
    };

    checkStatus();
  }, []);

  // Show loading while checking dev status
  if (devEnabled === null) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
        <div className="text-center text-white">
          <p>Checking testing availability...</p>
        </div>
      </div>
    );
  }

  // Show disabled message if not in dev mode
  if (!devEnabled) {
    return (
      <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">⚠️ Тестирование отключено</h2>
        <p className="text-gray-300">
          Активация тестовой лицензии доступна только в Preview/Dev окружении.
        </p>
      </div>
    );
  }

  // Show database warning if no DATABASE_URL (but still show form)
  const showDbWarning = diagInfo && !diagInfo.hasDbUrl;

  const handleGrantTestLicense = async () => {
    if (!testEmail.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');
    setTestResult(null);

    try {
      const r = await fetch('/api/dev/license/grant-ui', { 
        method: 'POST', 
        body: JSON.stringify({ email: testEmail.trim(), plan: testPlan }), 
        headers: { 'Content-Type': 'application/json' }
      });

      if (r.status >= 500) {
        setError('Непредвиденная ошибка. Попробуйте ещё раз.');
        return;
      }

      const data = await r.json();
      
      if (data.ok) {
        setTestResult(data);
      } else {
        // Маппинг кодов ошибок
        if (data.code === 'FORBIDDEN') {
          setError('Dev-режим запрещён в продакшене.');
        } else if (data.code === 'DEV_DISABLED') {
          setError('Включите DEV_SIMULATE_WEBHOOK_ENABLED=true в Preview.');
        } else if (data.code === 'NO_DATABASE_URL') {
          setError('DATABASE_URL не задан в Preview.');
        } else {
          setError('Непредвиденная ошибка. Попробуйте ещё раз.');
        }
      }
    } catch (error) {
      setError('Непредвиденная ошибка. Попробуйте ещё раз.');
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
            Скачать расширение GetLifeUndo
          </h1>
          
          {/* Test License Card - Client-side check */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
            {/* Database warning banner */}
            {showDbWarning && (
              <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-orange-300 mb-2">🗄️ База данных не подключена</h2>
                <p className="text-gray-300 text-sm">
                  Для выдачи тестовых лицензий подключите DATABASE_URL в Preview и примените миграцию.
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-4">🧪 Тестовая активация лицензии</h2>
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
                <label className="block text-white mb-2">Тариф</label>
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
                {isLoading ? 'Granting...' : 'Выдать тестовую лицензию'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300">❌ {error}</p>
              </div>
            )}

            {testResult && (
              <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-lg">
                <h3 className="text-lg font-semibold text-green-300 mb-4">✅ Готово! Лицензия активирована.</h3>
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
        
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Chrome */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chrome</h3>
              <p className="text-gray-300 mb-4">Установить как распакованное расширение</p>
              <a 
                href="chrome://extensions/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all inline-block text-center"
              >
                Получить для Chrome
              </a>
            </div>

            {/* Firefox */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Firefox</h3>
              <p className="text-gray-300 mb-4">Загрузить временное дополнение</p>
              <a 
                href="about:debugging#/runtime/this-firefox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all inline-block text-center"
              >
                Получить для Firefox
              </a>
            </div>

            {/* Edge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Edge</h3>
              <p className="text-gray-300 mb-4">Установить как распакованное расширение</p>
              <a 
                href="edge://extensions/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all inline-block text-center"
              >
                Получить для Edge
              </a>
            </div>
          </div>

          {/* Manual Installation Instructions */}
          <div id="extension-instructions" className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">📦 Ручная установка (Dev)</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chrome/Edge</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Откройте chrome://extensions/</li>
                  <li>2. Включите "Режим разработчика"</li>
                  <li>3. Нажмите "Загрузить распакованное"</li>
                  <li>4. Выберите папку расширения: extension/</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Firefox</h3>
                <ol className="text-gray-300 space-y-2">
                  <li>1. Откройте about:debugging</li>
                  <li>2. Нажмите "Этот Firefox"</li>
                  <li>3. Нажмите "Загрузить временное дополнение…"</li>
                  <li>4. Выберите extension/manifest.json</li>
                </ol>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-300 mb-2">📁 Путь к сборке расширения</h4>
              <p className="text-gray-300 mb-2">
                Файлы расширения находятся в: extension/
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Запустите npm run build:ext для подготовки расширения к установке.
              </p>
              
              <div className="mt-4">
                <a 
                  href="/extension-dev-0.4.0.zip" 
                  download
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  📦 Скачать ZIP расширения
                </a>
                <p className="text-xs text-gray-400 mt-2">
                  Запустите npm run build:ext:zip для создания этого файла
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}