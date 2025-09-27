// src/app/pricing/page.tsx
import Link from 'next/link';

export const metadata = { 
  title: "Цены — LifeUndo",
  description: "Тарифные планы LifeUndo. Выберите подходящий план для вашего проекта."
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Тарифные планы</h1>
          <p className="text-xl text-gray-600">Выберите план, который подходит именно вам</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* PRO Monthly */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PRO Monthly</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                99₽
                <span className="text-lg font-normal text-gray-500">/месяц</span>
              </div>
              <p className="text-gray-600 mb-6">Идеально для небольших проектов</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1000 проверок в месяц
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Базовая аналитика
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email поддержка
              </li>
            </ul>
            <Link href="/fund" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center">
              Выбрать PRO
            </Link>
          </div>

          {/* VIP Lifetime */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">VIP Lifetime</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                2490₽
                <span className="text-lg font-normal text-gray-500">/навсегда</span>
              </div>
              <p className="text-gray-600 mb-6">Безлимитное использование</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Безлимитные проверки
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Расширенная аналитика
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Приоритетная поддержка
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                API доступ
              </li>
            </ul>
            <Link href="/fund" className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors block text-center">
              Купить VIP
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
