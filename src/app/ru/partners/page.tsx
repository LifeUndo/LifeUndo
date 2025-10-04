export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            White-label / OEM
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Брендируйте GetLifeUndo под вашу компанию
          </p>
        </div>

        {/* What's included */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Что входит</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Лого/цвета/название; преднастройки (какие виды «UNDO» включить)</li>
              <li>• Отчёты по активациям и лицензиям (организации)</li>
              <li>• Опционально: приватный канал обновлений</li>
            </ul>
          </div>
        </div>

        {/* Model */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Модель</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Разовая настройка (setup fee)</li>
              <li>• Подписка: помесячно по числу мест (Team/Org)</li>
              <li>• Юридические лица: оплата по счёту (оферта ниже)</li>
            </ul>
          </div>
        </div>

        {/* Onboarding */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Онбординг (3 шага)</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Бриф</h3>
                  <p className="text-gray-300">Логотипы, цвета, домен</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Техническая сборка и тест</h3>
                  <p className="text-gray-300">1–3 дня</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Подписание оферты / доступ к отчётам</h3>
                  <p className="text-gray-300">Юридическое оформление</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Получить бриф и расчёт
          </a>
        </div>
      </div>
    </div>
  );
}
