export default function SLAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              SLA (базовый)
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-white mb-4">Доступность</h2>
              <p className="text-gray-300 mb-4">
                Витрина: хостится на Vercel (их SLA).
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Поддержка</h2>
              <p className="text-gray-300 mb-4">
                Критические инциденты (платёж/доступ): реакция ≤ 4 ч в рабочее время.
              </p>
              <p className="text-gray-300 mb-4">
                Канал поддержки: support@getlifeundo.com.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Плановые работы</h2>
              <p className="text-gray-300 mb-4">
                Уведомляем ≥ 24 ч.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Экспорт данных</h2>
              <p className="text-gray-300 mb-4">
                По платежам — по запросу организации.
              </p>

              <p className="text-gray-400 text-sm mt-8">
                <em>Дата обновления: 2025-10-04</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
