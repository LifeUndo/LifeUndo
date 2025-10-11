'use client';
import { useState } from 'react';

interface TwoFAVerifyProps {
  onSuccess: () => void;
  onRecovery: () => void;
}

export default function TwoFAVerify({ onSuccess, onRecovery }: TwoFAVerifyProps) {
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify 2FA');
      }
      
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
          Р”РІСѓС…С„Р°РєС‚РѕСЂРЅР°СЏ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёСЏ
        </h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              Р’РІРµРґРёС‚Рµ 6-Р·РЅР°С‡РЅС‹Р№ РєРѕРґ РёР· РїСЂРёР»РѕР¶РµРЅРёСЏ Р°СѓС‚РµРЅС‚РёС„РёРєР°С‚РѕСЂР°
            </p>
          </div>
          
          <div>
            <label htmlFor="token" className="block text-sm font-medium mb-2">
              РљРѕРґ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>
          
          <button
            onClick={handleVerify}
            disabled={isLoading || token.length !== 6}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'РџСЂРѕРІРµСЂСЏРµРј...' : 'Р’РѕР№С‚Рё'}
          </button>
          
          <div className="text-center">
            <button
              onClick={onRecovery}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              РСЃРїРѕР»СЊР·РѕРІР°С‚СЊ РєРѕРґ РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёСЏ
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

