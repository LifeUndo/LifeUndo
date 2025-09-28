export default function FeaturesPage() {
  const features = [
    {
      icon: "🔄",
      title: "Откат вкладок",
      description: "Восстановите случайно закрытые вкладки одним кликом"
    },
    {
      icon: "📚",
      title: "Сохранение сессий",
      description: "Сохраняйте наборы вкладок для быстрого доступа"
    },
    {
      icon: "🔍",
      title: "Поиск по истории",
      description: "Найдите нужную вкладку среди сотен закрытых"
    },
    {
      icon: "⚡",
      title: "Быстрая работа",
      description: "Минимальное потребление ресурсов браузера"
    },
    {
      icon: "🔒",
      title: "Безопасность",
      description: "Все данные хранятся локально на вашем устройстве"
    },
    {
      icon: "🎨",
      title: "Настройка",
      description: "Персонализируйте интерфейс под свои потребности"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          Возможности LifeUndo
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Установите расширение</h3>
              <p className="text-gray-300 text-sm">
                Скачайте LifeUndo из Firefox Add-ons и активируйте
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Работайте как обычно</h3>
              <p className="text-gray-300 text-sm">
                Расширение автоматически отслеживает ваши вкладки
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Восстанавливайте легко</h3>
              <p className="text-gray-300 text-sm">
                Нажмите кнопку и верните любую закрытую вкладку
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/ru/download"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Установить расширение
          </a>
        </div>
      </div>
    </div>
  );
}