// src/app/fund/page.tsx
import Link from 'next/link';

export const metadata = { 
  title: "Финансирование — LifeUndo",
  description: "Поддержите развитие LifeUndo. Тарифные планы и возможности доната."
};

export default function FundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">LifeUndo</Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Главная</Link>
              <Link href="/fund" className="text-blue-600 font-medium">Финансирование</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Поддержите LifeUndo</h1>
          <p className="text-xl text-gray-600 mb-8">Помогите нам развивать платформу для защиты от ошибок в цифровом мире</p>
        </div>

        {/* Pricing Cards */}
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
                1000 писем в месяц
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
                Приоритетная поддержка
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
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
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Купить VIP
            </button>
          </div>
        </div>

        {/* Donation Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Поддержать проект</h2>
          <p className="text-lg text-gray-600 mb-6">
            LifeUndo — это проект с открытым исходным кодом. Ваша поддержка помогает нам развивать платформу и добавлять новые возможности.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Поддержать через PayPal
            </button>
            <button className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Поддержать через ЮMoney
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Что такое LifeUndo?</h3>
              <p className="text-gray-600">LifeUndo — это платформа для защиты от ошибок в цифровом мире. Мы помогаем разработчикам создавать более надежные приложения.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Как работает оплата?</h3>
              <p className="text-gray-600">Оплата происходит через безопасные платежные системы. После оплаты вы получите доступ к выбранному тарифу.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Можно ли отменить подписку?</h3>
              <p className="text-gray-600">Да, вы можете отменить подписку в любое время в личном кабинете.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 LifeUndo. Все права защищены.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/" className="text-gray-400 hover:text-white">Главная</Link>
            <Link href="/fund" className="text-gray-400 hover:text-white">Финансирование</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
