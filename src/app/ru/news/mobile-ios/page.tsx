export default function MobileIOSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">📱</div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            GetLifeUndo для iOS
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Мобильная версия GetLifeUndo готовится к релизу в App Store
          </p>
        </div>

        {/* Status */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-yellow-200 mb-6 text-center">
              Статус разработки
            </h2>
            <div className="space-y-4 text-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>В разработке — готовим к релизу</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Планируемый релиз — Q1 2025</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>App Store Review — в процессе</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Что будет в мобильной версии
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">📝 Восстановление форм</h3>
                <p className="text-gray-300 text-sm">
                  Автоматическое сохранение текста в полях ввода Safari
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">📋 История буфера</h3>
                <p className="text-gray-300 text-sm">
                  Локальное хранение скопированного текста
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">🔒 100% приватность</h3>
                <p className="text-gray-300 text-sm">
                  Все данные остаются на устройстве
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">⚡ Быстрый доступ</h3>
                <p className="text-gray-300 text-sm">
                  Виджеты и быстрые действия
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notify */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Уведомить о запуске
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Оставьте email, и мы сообщим, когда приложение появится в App Store
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Уведомить о релизе
              </button>
            </form>
          </div>
        </div>

        {/* Links */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ru/downloads"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Скачать для браузера
            </a>
            <a 
              href="https://t.me/GetLifeUndoSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Telegram поддержка
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
