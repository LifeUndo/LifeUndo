export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
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
                <span className="text-yellow-600">⚠ Настройка</span>
              </div>
              <div className="flex justify-between">
                <span>FreeKassa:</span>
                <span className="text-yellow-600">⚠ Настройка</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
