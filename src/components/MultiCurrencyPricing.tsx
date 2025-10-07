'use client';

import { useState, useEffect } from 'react';

interface FXRate {
  currency: string;
  rate: number;
  symbol: string;
}

interface MultiCurrencyPricingProps {
  rubPrice: number;
  locale: string;
  fxMode?: 'liberal' | 'floor';
}

const CURRENCY_CONFIG = {
  USD: { symbol: '$', step: 1 },
  EUR: { symbol: '€', step: 1 },
  INR: { symbol: '₹', step: 10 },
  CNY: { symbol: '¥', step: 1 },
  AED: { symbol: 'د.إ', step: 1 },
  RUB: { symbol: '₽', step: 10 }
};

const COUNTRY_FLOORS = {
  US: { USD: 5.00 },
  IN: { INR: 400.00 },
  CN: { CNY: 35.00 },
  AE: { AED: 18.00 },
  RU: { RUB: 300.00 }
};

export default function MultiCurrencyPricing({ 
  rubPrice, 
  locale, 
  fxMode = 'liberal' 
}: MultiCurrencyPricingProps) {
  const [fxRates, setFxRates] = useState<FXRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFXRates();
  }, []);

  const fetchFXRates = async () => {
    try {
      // Try to fetch from external API first
      const response = await fetch('/api/fx/rates');
      if (response.ok) {
        const rates = await response.json();
        setFxRates(rates);
      } else {
        // Fallback to cached/default rates
        setFxRates(getDefaultRates());
      }
    } catch (err) {
      console.warn('Failed to fetch FX rates, using defaults:', err);
      setFxRates(getDefaultRates());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRates = (): FXRate[] => [
    { currency: 'USD', rate: 0.011, symbol: '$' },
    { currency: 'EUR', rate: 0.010, symbol: '€' },
    { currency: 'INR', rate: 0.92, symbol: '₹' },
    { currency: 'CNY', rate: 0.079, symbol: '¥' },
    { currency: 'AED', rate: 0.040, symbol: 'د.إ' }
  ];

  const roundUp = (amount: number, step: number): number => {
    return Math.ceil(amount / step) * step;
  };

  const getDisplayPrice = (currency: string, rate: number): number => {
    const convertedPrice = rubPrice * rate;
    const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
    
    if (!config) return convertedPrice;
    
    return roundUp(convertedPrice, config.step);
  };

  const applyFloorPricing = (currency: string, price: number): number => {
    if (fxMode !== 'floor') return price;
    
    const countryCode = locale.split('-')[1] || 'US';
    const floorData = COUNTRY_FLOORS[countryCode as keyof typeof COUNTRY_FLOORS];
    if (!floorData) return price;
    
    const floor = floorData[currency as keyof typeof floorData];
    if (!floor) return price;
    
    // If price is 10%+ below floor, adjust to floor
    if (price < floor * 0.9) {
      return floor;
    }
    
    return price;
  };

  const getLocalCurrency = (): string => {
    const countryCode = locale.split('-')[1] || 'US';
    const currencyMap: Record<string, string> = {
      'US': 'USD',
      'IN': 'INR', 
      'CN': 'CNY',
      'AE': 'AED',
      'RU': 'RUB'
    };
    return currencyMap[countryCode] || 'USD';
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-400">
        Loading pricing...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-gray-400">
        ≈ {rubPrice} ₽
      </div>
    );
  }

  const localCurrency = getLocalCurrency();
  const localRate = fxRates.find(rate => rate.currency === localCurrency);
  
  if (!localRate) {
    return (
      <div className="text-sm text-gray-400">
        ≈ {rubPrice} ₽
      </div>
    );
  }

  const displayPrice = getDisplayPrice(localCurrency, localRate.rate);
  const finalPrice = applyFloorPricing(localCurrency, displayPrice);
  const config = CURRENCY_CONFIG[localCurrency as keyof typeof CURRENCY_CONFIG];

  return (
    <div className="text-sm text-gray-400">
      <div>
        ≈ {finalPrice} {config?.symbol || localCurrency}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Payment charged in RUB
      </div>
      {fxMode === 'floor' && finalPrice !== displayPrice && (
        <div className="text-xs text-yellow-400 mt-1">
          Floor pricing applied
        </div>
      )}
    </div>
  );
}


