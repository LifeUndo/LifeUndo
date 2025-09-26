export default function Home() {
  return (
    <main className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">LifeUndo</h1>
        <p className="text-xl text-gray-600">Управление лицензиями для разработчиков</p>
        <p className="text-gray-500">Безопасная активация, проверка и мониторинг лицензионных ключей</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Для разработчиков</h2>
          <p className="text-gray-600 mb-4">API для интеграции лицензионной проверки в ваши приложения</p>
          <a href="/developers" className="text-blue-600 hover:underline">Документация API →</a>
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Партнерская программа</h2>
          <p className="text-gray-600 mb-4">Реферальные выплаты и White-Label решения</p>
          <a href="/partners" className="text-blue-600 hover:underline">Стать партнером →</a>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          <a href="/status" className="hover:underline">Статус сервисов</a> • 
          <a href="/faq" className="hover:underline ml-2">FAQ</a>
        </p>
      </div>
    </main>
  );
}
