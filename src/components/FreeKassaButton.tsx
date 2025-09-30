'use client';

import { useState } from 'react';

interface FreeKassaButtonProps {
  plan: string;
  amount: number;
  email?: string;
  className?: string;
}

export default function FreeKassaButton({ plan, amount, email, className = '' }: FreeKassaButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEnabled = process.env.NEXT_PUBLIC_FK_ENABLED === 'true';
  
  const handlePayment = async () => {
    if (!isEnabled) {
      setError('Оплата временно недоступна');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments/freekassa/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email: email || '',
          product: plan,
        }),
      });
      
      if (response.ok) {
        // Редирект произойдет автоматически через NextResponse.redirect
        window.location.href = response.url;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка создания платежа');
      }
    } catch (err) {
      setError('Ошибка соединения');
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isEnabled) {
    return (
      <button 
        disabled 
        className={`w-full px-6 py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed ${className}`}
      >
        Оплата через FreeKassa — скоро
      </button>
    );
  }
  
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
