import Link from 'next/link';

export const metadata = { 
  title: "Цены — LifeUndo",
  description: "Выберите подходящий тарифный план LifeUndo. Free, Pro, VIP и Team планы с различными возможностями."
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Тарифные планы</h1>
          <p className="text-xl text-gray-600 mb-6">Выберите план, который подходит именно вам</p>
          
          {/* Currency Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              <button className="px-4 py-2 rounded-md bg-white shadow-sm font-medium text-gray-900">
                RUB ₽
              </button>
              <button className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900">
                USD $
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {/* Free */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                0₽
                <span className="text-lg font-normal text-gray-500">/месяц</span>
              </div>
              <p className="text-gray-600 mb-6">Для ознакомления</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                20 состояний текста
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                10 закрытых вкладок
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                10 элементов буфера
              </li>
            </ul>
            <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Текущий план
            </button>
          </div>

          {/* PRO Monthly */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-blue-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Популярный</span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Monthly</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                149₽
                <span className="text-lg font-normal text-gray-500">/месяц</span>
              </div>
              <p className="text-gray-600 mb-6">Для активных пользователей</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                200 состояний текста
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                50 закрытых вкладок
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                50 элементов буфера
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Локальная статистика
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Экспорт данных
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Купить Pro
            </button>
          </div>

          {/* VIP Lifetime */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">VIP Lifetime</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
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
                Безлимитные состояния
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Все Pro функции
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
                Ранний доступ к новым функциям
              </li>
            </ul>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Купить VIP
            </button>
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Team</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                от 150₽
                <span className="text-lg font-normal text-gray-500">/место/мес</span>
              </div>
              <p className="text-gray-600 mb-6">Для команд и организаций</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Все Pro функции
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Централизованное управление
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Аналитика команды
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Dedicated поддержка
              </li>
            </ul>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Связаться с нами
            </button>
          </div>
        </div>

        {/* FreeKassa Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <img src="https://www.free-kassa.ru/img/fk_btn/1.png" alt="FreeKassa" className="h-6 mr-2" />
            <span className="text-sm text-gray-600">Безопасные платежи через FreeKassa</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Частые вопросы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-2">Можно ли отменить подписку?</h3>
              <p className="text-gray-600">Да, вы можете отменить подписку в любое время. Доступ к Pro функциям сохранится до конца оплаченного периода.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-2">Есть ли пробный период?</h3>
              <p className="text-gray-600">Да, все новые пользователи получают 7-дневный пробный период для тестирования Pro функций.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-2">Безопасны ли мои данные?</h3>
              <p className="text-gray-600">Все данные хранятся локально в вашем браузере. Мы не имеем доступа к вашей информации.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-2">Какие способы оплаты доступны?</h3>
              <p className="text-gray-600">Мы принимаем все основные банковские карты через безопасную платежную систему FreeKassa.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-2">Что такое Lifetime лицензия?</h3>
              <p className="text-gray-600">VIP Lifetime дает вам доступ ко всем функциям навсегда без ежемесячных платежей.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-2">Как активировать лицензию?</h3>
              <p className="text-gray-600">После оплаты вы получите лицензионный ключ на email. Введите его в настройках расширения.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}