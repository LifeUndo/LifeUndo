'use client';

export default function DemoPricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">LifeUndo</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                DEMO
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://getlifeundo.com" 
                className="text-sm text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md"
              >
                Основной сайт → getlifeundo.com
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/demo" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Главная
            </a>
            <a href="/demo/features" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Возможности
            </a>
            <a href="/demo/pricing" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              Цены
            </a>
            <a href="/demo/faq" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              FAQ
            </a>
            <a href="/demo/contacts" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Контакты
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Тарифные планы</h1>
          <p className="text-xl text-gray-600">
            Выберите план, который подходит именно вам
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">FREE</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                0₽
                <span className="text-lg font-normal text-gray-500">/месяц</span>
              </div>
              <p className="text-gray-600 mb-6">Для личного использования</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                До 100 писем в месяц
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Пауза 30 секунд
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Базовые стоп-слова
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                История на 7 дней
              </li>
            </ul>
            <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Текущий план
            </button>
          </div>

          {/* PRO Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-blue-500 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Популярный
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PRO</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                990₽
                <span className="text-lg font-normal text-gray-500">/месяц</span>
              </div>
              <p className="text-gray-600 mb-6">Для профессионалов</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                До 1000 писем в месяц
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Пауза до 120 секунд
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Настраиваемые стоп-слова
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                История на 30 дней
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Приоритетная поддержка
              </li>
            </ul>
            <button 
              onClick={() => alert('Демо-режим: Перейдите на getlifeundo.com для реальной оплаты')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Выбрать PRO
            </button>
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
                Безлимитные письма
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Настраиваемая пауза
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Все стоп-слова и фильтры
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Полная история
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Белый лейбл
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                VIP поддержка
              </li>
            </ul>
            <button 
              onClick={() => alert('Демо-режим: Перейдите на getlifeundo.com для реальной оплаты')}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Купить VIP
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <div id="payment-form" className="hidden bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Оплата</h2>
          <form id="fk-form" className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email для активации
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                Выбранный план
              </label>
              <input
                type="text"
                id="plan"
                name="plan"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Перейти к оплате
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('payment-form').classList.add('hidden')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-yellow-800">Демо-режим</span>
          </div>
          <p className="text-yellow-700">
            Это демо-версия сайта. Для реальной оплаты перейдите на 
            <a href="https://getlifeundo.com" className="font-medium underline ml-1">getlifeundo.com</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LifeUndo</h3>
              <p className="text-gray-400 text-sm">
                Защита от ошибок в цифровом мире
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/demo/features" className="hover:text-white">Возможности</a></li>
                <li><a href="/demo/pricing" className="hover:text-white">Цены</a></li>
                <li><a href="/demo/faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/demo/contacts" className="hover:text-white">Контакты</a></li>
                <li><a href="mailto:support@lifeundo.ru" className="hover:text-white">support@lifeundo.ru</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Основной сайт</h4>
              <p className="text-sm text-gray-400 mb-2">
                Полная версия продукта:
              </p>
              <a 
                href="https://getlifeundo.com" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                getlifeundo.com →
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 LifeUndo. Демо-версия для ознакомления.</p>
          </div>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{
        __html: `
          function handlePayment(plan) {
            const planNames = {
              'pro_monthly': 'PRO (990₽/месяц)',
              'vip_lifetime': 'VIP Lifetime (2490₽/навсегда)'
            };
            
            document.getElementById('plan').value = planNames[plan];
            document.getElementById('payment-form').classList.remove('hidden');
            document.getElementById('payment-form').scrollIntoView({ behavior: 'smooth' });
          }
          
          document.getElementById('fk-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const plan = formData.get('plan').includes('PRO') ? 'pro_monthly' : 'vip_lifetime';
            
            try {
              const response = await fetch('/api/fk/demo-create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Origin': window.location.origin
                },
                body: JSON.stringify({
                  email: email,
                  plan: plan,
                  locale: 'ru',
                  honeypot: ''
                })
              });
              
              const data = await response.json();
              
              if (data.url) {
                // В демо-режиме показываем ссылку вместо перехода
                alert('Демо-режим: Ссылка на оплату: ' + data.url);
                console.log('Payment URL:', data.url);
              } else {
                alert('Ошибка создания платежа: ' + (data.error || 'Неизвестная ошибка'));
              }
            } catch (error) {
              console.error('Payment error:', error);
              alert('Ошибка: ' + error.message);
            }
          });
        `
      }} />
    </div>
  );
}
