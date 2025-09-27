// src/app/features/page.tsx
export const metadata = { 
  title: "Возможности — LifeUndo",
  description: "Основные возможности платформы LifeUndo для защиты от ошибок в цифровом мире."
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Возможности LifeUndo</h1>
          <p className="text-xl text-gray-600">Защитите свои приложения от ошибок</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">🛡️ Защита от ошибок</h3>
            <p className="text-gray-600">Автоматическое обнаружение и предотвращение критических ошибок в ваших приложениях.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">📊 Мониторинг в реальном времени</h3>
            <p className="text-gray-600">Отслеживайте состояние ваших приложений 24/7 с детальной аналитикой.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">🔧 API интеграция</h3>
            <p className="text-gray-600">Легкая интеграция через REST API для любых языков программирования.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">⚡ Быстрое восстановление</h3>
            <p className="text-gray-600">Автоматическое восстановление после сбоев с минимальным временем простоя.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
