export default function DemoPage() {
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
            <a href="/demo" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              Главная
            </a>
            <a href="/demo/features" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LifeUndo
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Жизнь с кнопкой "Отменить"
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
            Защитите себя от ошибок в письмах, постах и файлах. 
            Откатывайте изменения, настраивайте политики отправки и ведите аудит действий.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/demo/pricing" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Попробовать бесплатно
            </a>
            <a 
              href="/demo/features" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Узнать больше
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Email Safe-Send</h3>
            <p className="text-gray-600">
              Пауза перед отправкой писем (30-120 сек), проверка на стоп-слова, второй обзор важных сообщений.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Undo Graph</h3>
            <p className="text-gray-600">
              Ветвящаяся история изменений с возможностью мягкого отката и повторного применения действий.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Аудит и политики</h3>
            <p className="text-gray-600">
              Полный аудит действий: кто/что/когда, экспорт без PII, настраиваемые политики отправки.
            </p>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Как это работает</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Настройте правила</h3>
              <p className="text-gray-600 mb-4">
                Определите, какие письма требуют дополнительной проверки, установите время паузы и стоп-слова.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <code className="text-sm text-gray-800">
                  Пауза: 60 секунд<br/>
                  Стоп-слова: "срочно", "немедленно"<br/>
                  Проверка: письма с вложениями
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">2. Отправляйте безопасно</h3>
              <p className="text-gray-600 mb-4">
                При отправке письма система автоматически применит ваши правила и даст время на размышление.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700">Письмо в очереди отправки...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Готовы попробовать?</h2>
          <p className="text-xl mb-8 opacity-90">
            Начните с бесплатного плана и защитите себя от ошибок уже сегодня
          </p>
          <a 
            href="/demo/pricing" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Выбрать план
          </a>
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
