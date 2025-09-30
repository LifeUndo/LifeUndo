'use client';

import { useState } from 'react';
import { fkPublic } from '@/lib/fk-public';
import { FK_PRODUCTS, type FKProductId } from '@/lib/fk-env';

interface FreeKassaButtonProps {
  productId: FKProductId;
  email?: string;
  className?: string;
}

export default function FreeKassaButton({ productId, email, className = '' }: FreeKassaButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const amount = FK_PRODUCTS[productId];
  
  // Показываем кнопку только если FreeKassa включен
  if (!fkPublic.enabled) {
    return (
      <button 
        disabled 
        className={`w-full px-6 py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed ${className}`}
      >
        Оплата через FreeKassa — скоро
      </button>
    );
  }
  
  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments/freekassa/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          amount,
          email: email || '',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.pay_url) {
        // Редирект на FreeKassa
        window.location.href = data.pay_url;
      } else {
        setError(data.error || 'Ошибка создания платежа');
      }
    } catch (err) {
      setError('Ошибка соединения');
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? 'Создание платежа...' : 'Оплатить через FreeKassa'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">
          {error}
        </p>
      )}
      
      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
        <img 
          src="https://cdn.freekassa.net/banners/fk-badge-ru.svg" 
          alt="FreeKassa" 
          className="h-4 w-auto opacity-75"
        />
        <span>Безопасная оплата</span>
      </div>
    </div>
  );
}
