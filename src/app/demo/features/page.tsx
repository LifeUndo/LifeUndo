export default function DemoFeaturesPage() {
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
            <a href="/demo/features" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              Возможности
            </a>
            <a href="/demo/pricing" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Возможности LifeUndo</h1>
          <p className="text-xl text-gray-600">
            Полный набор инструментов для защиты от ошибок
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Email Safe-Send */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Email Safe-Send</h3>
            <p className="text-gray-600 mb-6">
              Пауза перед отправкой писем с возможностью отмены. Настраиваемое время ожидания от 30 до 120 секунд.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Настраиваемая пауза</li>
              <li>• Проверка на стоп-слова</li>
              <li>• Второй обзор важных писем</li>
              <li>• Уведомления о готовности</li>
            </ul>
          </div>

          {/* Undo Graph */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Undo Graph</h3>
            <p className="text-gray-600 mb-6">
              Ветвящаяся история изменений с возможностью мягкого отката и повторного применения действий.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Ветвящаяся история</li>
              <li>• Мягкий откат</li>
              <li>• Повторное применение</li>
              <li>• Визуализация изменений</li>
            </ul>
          </div>

          {/* Policies & Filters */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Политики и фильтры</h3>
            <p className="text-gray-600 mb-6">
              Настраиваемые правила для автоматической проверки контента перед отправкой.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Стоп-слова и фразы</li>
              <li>• Проверка вложений</li>
              <li>• Анализ тональности</li>
              <li>• Кастомные правила</li>
            </ul>
          </div>

          {/* Audit & Compliance */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Аудит и соответствие</h3>
            <p className="text-gray-600 mb-6">
              Полный аудит действий с возможностью экспорта данных для соответствия требованиям.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Кто/что/когда</li>
              <li>• Экспорт без PII</li>
              <li>• Соответствие GDPR</li>
              <li>• Отчеты для аудита</li>
            </ul>
          </div>

          {/* API & SDK */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">API и SDK</h3>
            <p className="text-gray-600 mb-6">
              Интеграция с вашими приложениями через REST API и готовые SDK для популярных языков.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• REST API</li>
              <li>• JavaScript SDK</li>
              <li>• Python SDK</li>
              <li>• Webhooks</li>
            </ul>
          </div>

          {/* White Label */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">White Label</h3>
            <p className="text-gray-600 mb-6">
              Решения под вашим брендом для корпоративных клиентов и партнеров.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Собственный брендинг</li>
              <li>• Кастомные домены</li>
              <li>• Приватные инстансы</li>
              <li>• Техническая поддержка</li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Для кого подходит LifeUndo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">👤 Личные пользователи</h3>
              <p className="text-gray-600 mb-4">
                Защититесь от ошибок в личной переписке, социальных сетях и важных документах.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Проверка важных писем</li>
                <li>• Защита от случайной отправки</li>
                <li>• История изменений</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">🏢 Команды и SMB</h3>
              <p className="text-gray-600 mb-4">
                Откат действий команды, аудит изменений и настройка политик для всей организации.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Командные политики</li>
                <li>• Аудит действий</li>
                <li>• Централизованное управление</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">🏛️ Госсектор и корпорации</h3>
              <p className="text-gray-600 mb-4">
                Соответствие требованиям аудита, политики отправки и on-premise решения.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Соответствие стандартам</li>
                <li>• On-premise развертывание</li>
                <li>• Расширенный аудит</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">🤝 Партнеры и интеграторы</h3>
              <p className="text-gray-600 mb-4">
                White-label решения, SDK для интеграции и партнерская программа.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• White-label решения</li>
                <li>• API и SDK</li>
                <li>• Партнерские выплаты</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Готовы попробовать?</h2>
          <p className="text-xl mb-8 opacity-90">
            Начните с бесплатного плана и защитите себя от ошибок уже сегодня
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/demo/pricing" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Выбрать план
            </a>
            <a 
              href="https://getlifeundo.com" 
              className="bg-transparent text-white px-8 py-3 rounded-lg font-medium border border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Полная версия
            </a>
          </div>
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
    </div>
  );
}
