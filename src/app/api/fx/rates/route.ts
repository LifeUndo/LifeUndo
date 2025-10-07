import { NextRequest, NextResponse } from 'next/server';

// Default fallback rates (updated daily)
const DEFAULT_RATES = {
  USD: 0.011,
  EUR: 0.010,
  INR: 0.92,
  CNY: 0.079,
  AED: 0.040
};

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from external API
    const externalRates = await fetchExternalRates();
    
    if (externalRates) {
      return NextResponse.json(externalRates);
    }
    
    // Fallback to default rates
    const fallbackRates = Object.entries(DEFAULT_RATES).map(([currency, rate]) => ({
      currency,
      rate,
      symbol: getCurrencySymbol(currency),
      provider: 'fallback',
      fetched_at: new Date().toISOString()
    }));
    
    return NextResponse.json(fallbackRates);
    
  } catch (error) {
    console.error('Error fetching FX rates:', error);
    
    // Return default rates on error
    const defaultRates = Object.entries(DEFAULT_RATES).map(([currency, rate]) => ({
      currency,
      rate,
      symbol: getCurrencySymbol(currency),
      provider: 'default',
      fetched_at: new Date().toISOString()
    }));
    
    return NextResponse.json(defaultRates);
  }
}

async function fetchExternalRates() {
  try {
    // Try multiple providers for reliability
    const providers = [
      'https://api.exchangerate-api.com/v4/latest/RUB',
      'https://api.fixer.io/latest?base=RUB&access_key=YOUR_API_KEY',
      'https://api.currencylayer.com/live?access_key=YOUR_API_KEY&currencies=USD,EUR,INR,CNY,AED&source=RUB'
    ];
    
    for (const provider of providers) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(provider, {
          headers: {
            'User-Agent': 'LifeUndo/1.0'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return parseRatesFromProvider(data, provider);
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${provider}:`, err);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchExternalRates:', error);
    return null;
  }
}

function parseRatesFromProvider(data: any, provider: string) {
  const rates: any[] = [];
  
  if (provider.includes('exchangerate-api')) {
    // exchangerate-api.com format
    Object.entries(data.rates).forEach(([currency, rate]) => {
      if (['USD', 'EUR', 'INR', 'CNY', 'AED'].includes(currency)) {
        rates.push({
          currency,
          rate: rate as number,
          symbol: getCurrencySymbol(currency),
          provider: 'exchangerate-api',
          fetched_at: new Date().toISOString()
        });
      }
    });
  } else if (provider.includes('fixer')) {
    // fixer.io format
    Object.entries(data.rates).forEach(([currency, rate]) => {
      if (['USD', 'EUR', 'INR', 'CNY', 'AED'].includes(currency)) {
        rates.push({
          currency,
          rate: rate as number,
          symbol: getCurrencySymbol(currency),
          provider: 'fixer',
          fetched_at: new Date().toISOString()
        });
      }
    });
  } else if (provider.includes('currencylayer')) {
    // currencylayer.com format
    Object.entries(data.quotes).forEach(([pair, rate]) => {
      const currency = pair.replace('RUB', '');
      if (['USD', 'EUR', 'INR', 'CNY', 'AED'].includes(currency)) {
        rates.push({
          currency,
          rate: rate as number,
          symbol: getCurrencySymbol(currency),
          provider: 'currencylayer',
          fetched_at: new Date().toISOString()
        });
      }
    });
  }
  
  return rates;
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    CNY: '¥',
    AED: 'د.إ',
    RUB: '₽'
  };
  
  return symbols[currency] || currency;
}


