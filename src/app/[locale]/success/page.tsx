'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PaymentData {
  order_id?: string;
  plan?: string;
  amount?: string;
  currency?: string;
  status?: string;
  paid_at?: string;
  email?: string;
  license?: {
    level: string;
    expires_at?: string;
  };
  flags?: Array<{ key: string; expires_at?: string }>;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const orderId = searchParams.get('order_id') || searchParams.get('MERCHANT_ORDER_ID');
  const isTestMode = process.env.NEXT_PUBLIC_IS_TEST_MODE === 'true';
  
  useEffect(() => {
    if (orderId) {
      loadPaymentData();
    }
  }, [orderId]);
  
  async function loadPaymentData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/payment/summary?order_id=${orderId}`);
      const json = await res.json();
      if (json.ok) {
        setData(json);
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'навсегда';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };
  
  const planTitle = (plan?: string) => {
    if (!plan) return 'Pro';
    if (plan === 'starter_6m') return 'Starter Bundle (6 месяцев)';
    if (plan === 'pro_month') return 'Pro (месяц)';
    if (plan === 'vip_lifetime') return 'VIP (навсегда)';
    if (plan === 'team_5') return 'Team (5 мест)';
    return 'Pro';
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {isTestMode && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-lg text-center">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">⚠️ Тестовый режим активирован</p>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Платеж успешно обработан!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Спасибо за покупку GetLifeUndo. Ваша лицензия активирована и готова к использованию.
          </p>

          {/* Payment Details */}
          {loading ? (
            <div className="mb-6 text-gray-500">Загрузка...</div>
          ) : data ? (
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold mb-3 dark:text-white">Детали заказа:</h2>
              <div className="space-y-2 text-sm">
                {data.order_id && (
                  <p className="dark:text-gray-200"><strong>Order ID:</strong> {data.order_id}</p>
                )}
                {data.plan && (
                  <p className="dark:text-gray-200"><strong>План:</strong> {planTitle(data.plan)}</p>
                )}
                {data.license && (
                  <>
                    <p className="dark:text-gray-200">
                      <strong>Уровень:</strong> <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{data.license.level.toUpperCase()}</span>
                    </p>
                    <p className="dark:text-gray-200">
                      <strong>Активна до:</strong> <span className="text-green-600 dark:text-green-400 font-semibold">{formatDate(data.license.expires_at)}</span>
                    </p>
                  </>
                )}
                {data.flags && data.flags.length > 0 && (
                  <p className="dark:text-gray-200">
                    <strong>Бонус:</strong> {data.flags.map(f => f.key).join(', ')} до {formatDate(data.flags[0].expires_at)}
                  </p>
                )}
                {data.email && (
                  <p className="dark:text-gray-200"><strong>Email:</strong> {data.email}</p>
                )}
              </div>
            </div>
          ) : null}

          {/* Next Steps */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Что делать дальше:</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
                <p className="text-gray-700 dark:text-gray-200">Проверьте email — вам отправлено письмо с подтверждением</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
                <p className="text-gray-700 dark:text-gray-200">Откройте расширение GetLifeUndo в браузере</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
                <p className="text-gray-700 dark:text-gray-200">Лицензия активируется автоматически по email</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
                <p className="text-gray-700 dark:text-gray-200">Наслаждайтесь всеми Pro функциями!</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/ru/features${orderId ? `?order_id=${orderId}` : ''}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Узнать о возможностях
            </Link>
            <Link 
              href={`/ru/support${orderId ? `?order_id=${orderId}` : ''}${data?.email ? `&email=${data.email}` : ''}`}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Нужна помощь?
            </Link>
            {orderId && (
              <Link 
                href={`/ru/account?order_id=${orderId}`}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Мой аккаунт
              </Link>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Не получили email с лицензией? Проверьте папку "Спам" или
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="mailto:support@getlifeundo.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                напишите в поддержку
              </a>
              <span className="text-gray-400">•</span>
              <a 
                href="https://t.me/GetLifeUndoSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Telegram поддержка
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/ru" className="hover:text-gray-700 dark:hover:text-gray-300">Главная</Link>
            <Link href="/ru/pricing" className="hover:text-gray-700 dark:hover:text-gray-300">Цены</Link>
            <Link href="/ru/features" className="hover:text-gray-700 dark:hover:text-gray-300">Возможности</Link>
            <Link href="/ru/support" className="hover:text-gray-700 dark:hover:text-gray-300">Поддержка</Link>
            <a href="https://t.me/GetLifeUndo" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-gray-300">Telegram</a>
          </div>
        </div>
      </div>
    </main>
  );
}


