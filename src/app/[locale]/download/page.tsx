export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          Скачать LifeUndo
        </h1>
        
        <div className="glass-card p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🦊</div>
            <h2 className="text-2xl font-semibold mb-4">Для Firefox</h2>
            <p className="text-gray-300 mb-6">
              LifeUndo доступен как расширение для браузера Firefox
            </p>
            <a 
              href="https://addons.mozilla.org/firefox/addon/lifeundo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
            >
              Установить для Firefox
            </a>
          </div>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Инструкция по установке</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <h3 className="font-semibold mb-1">Нажмите кнопку "Установить для Firefox"</h3>
                <p className="text-gray-300 text-sm">
                  Вы будете перенаправлены на страницу расширения в Firefox Add-ons
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <h3 className="font-semibold mb-1">Нажмите "Добавить в Firefox"</h3>
                <p className="text-gray-300 text-sm">
                  Подтвердите установку расширения в вашем браузере
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <h3 className="font-semibold mb-1">Настройте расширение</h3>
                <p className="text-gray-300 text-sm">
                  Откройте настройки Firefox и добавьте кнопку LifeUndo на панель инструментов
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Системные требования</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Браузер</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Firefox 78.0 или новее</li>
                <li>• Поддержка WebExtensions API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Операционная система</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Windows 10/11</li>
                <li>• macOS 10.14 или новее</li>
                <li>• Linux (Ubuntu, Fedora, etc.)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-4">Другие браузеры</h2>
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              В настоящее время LifeUndo доступен только для Firefox. 
              Версии для других браузеров находятся в разработке.
            </p>
            <div className="flex justify-center space-x-4 text-gray-400">
              <span className="px-4 py-2 border border-gray-600 rounded-lg">Chrome (скоро)</span>
              <span className="px-4 py-2 border border-gray-600 rounded-lg">Edge (скоро)</span>
              <span className="px-4 py-2 border border-gray-600 rounded-lg">Safari (скоро)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}