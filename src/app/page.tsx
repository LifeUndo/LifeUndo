import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">LifeUndo</Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-blue-600 font-medium">Главная</Link>
              <Link href="/features" className="text-gray-600 hover:text-gray-900">Возможности</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Цены</Link>
              <Link href="/fund" className="text-gray-600 hover:text-gray-900">Финансирование</Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">API Docs</Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
              <Link href="/contacts" className="text-gray-600 hover:text-gray-900">Контакты</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LifeUndo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Управление лицензиями для разработчиков
          </p>
          <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Статус системы</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API:</span>
                <span className="text-green-600">✓ Работает</span>
              </div>
              <div className="flex justify-between">
                <span>База данных:</span>
                <span className="text-green-600">✓ Подключена</span>
              </div>
              <div className="flex justify-between">
                <span>FreeKassa:</span>
                <span className="text-green-600">✓ Настроена</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/features" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Узнать больше
            </Link>
            <Link href="/pricing" className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Выбрать план
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
