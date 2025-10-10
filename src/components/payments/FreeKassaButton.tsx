'use client';

import { useState } from 'react';
import { fkPublic } from '@/lib/fk-public';
import { FK_PLANS } from '@/lib/payments/fk-plans';
import { type PlanId } from '@/config/plans';
import { useTranslations } from '@/hooks/useTranslations';

interface FreeKassaButtonProps {
  productId: PlanId | string; // Поддержка старых продуктов и новых планов
  email?: string;
  className?: string;
}

// Фиксированные суммы для FreeKassa
const PRODUCT_AMOUNTS: Record<string, number> = {
  pro_monthly: 599.00,
  vip_lifetime: 9990.00,
  team_5_monthly: 2990.00,
  starter_6m: 3000.00, // 6 месяцев Pro за 3000₽
} as const;

export default function FreeKassaButton({ productId, email, className = '' }: FreeKassaButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();
  
  // Показываем кнопку только если платежи не отключены через ENV переменную
  const paymentsOn = (process.env.NEXT_PUBLIC_PAYMENTS || 'on') !== 'off';
  
  if (!paymentsOn) {
    return (
      <button 
        disabled 
        className={`w-full px-6 py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed ${className}`}
      >
        {t.payments.pay_via_fk} — soon
      </button>
    );
  }
  
  const handlePayment = async () => {
    // Валидация productId
    if (!PRODUCT_AMOUNTS[productId]) {
      setError(t.freekassa.invalidProduct);
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
          productId: productId,
          email: email || '',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.ok && data.pay_url) {
        // Редирект на FreeKassa
        window.location.href = data.pay_url;
      } else {
        setError(data.error === 'invalid_productId' ? t.freekassa.invalidProduct : 
                data.error === 'fk_not_configured' ? t.freekassa.error :
                data.error === 'signature_error' ? t.freekassa.signatureError :
                data.error || t.freekassa.error);
      }
    } catch (err) {
      setError(t.freekassa.error);
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
        {isLoading ? t.freekassa.processing : t.payments.pay_via_fk}
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
        <span>{t.payments.secure_fk}</span>
      </div>
    </div>
  );
}
