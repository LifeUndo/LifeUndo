import Link from 'next/link';

export const metadata = { 
  title: "GetLifeUndo Fund — LifeUndo",
  description: "10% от выручки LifeUndo идет на поддержку open source проектов и IT-образования. Присоединяйтесь к движению!"
};

export default function FundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header with Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-full text-lg font-medium mb-6">
            <span className="mr-2">💚</span>
            We give 10%
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GetLifeUndo Fund</h1>
          <p className="text-xl text-gray-600 mb-6">10% от чистой выручки LifeUndo идет на поддержку open source проектов и IT-образования</p>
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 text-2xl font-bold">
              <span className="text-gray-600">Ваша покупка</span>
              <span className="text-purple-600">→</span>
              <span className="text-green-600">10% в фонд</span>
              <span className="text-purple-600">→</span>
              <span className="text-blue-600">IT-сообщество</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Fund Info */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-semibold mb-6">О фонде</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">10%</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">10% от выручки</h3>
                  <p className="text-gray-600">Мы направляем 10% от чистой прибыли LifeUndo на поддержку open source проектов и IT-образования.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Прозрачность</h3>
                  <p className="text-gray-600">Все пожертвования публикуются в открытом доступе с подробными отчетами.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Целевое использование</h3>
                  <p className="text-gray-600">Средства идут на конкретные проекты: гранты разработчикам, образовательные программы, инфраструктуру.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-semibold mb-6">Как это работает</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">1</span>
                </div>
                <p className="text-gray-700">Вы покупаете LifeUndo Pro или VIP</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">2</span>
                </div>
                <p className="text-gray-700">Мы автоматически выделяем 10% на фонд</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">3</span>
                </div>
                <p className="text-gray-700">Средства идут на поддержку IT-сообщества</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">4</span>
                </div>
                <p className="text-gray-700">Вы получаете отчет о том, куда пошли ваши деньги</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Поддерживаемые проекты</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">🎓 IT-образование</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Гранты студентам</li>
                <li>• Бесплатные курсы</li>
                <li>• Менторские программы</li>
                <li>• Стажировки в IT</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">💻 Open Source</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Финансирование разработки</li>
                <li>• Инфраструктурные проекты</li>
                <li>• Конференции и митапы</li>
                <li>• Документация и переводы</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">🌍 IT-сообщество</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Локальные сообщества</li>
                <li>• Хакатоны и конкурсы</li>
                <li>• Поддержка начинающих</li>
                <li>• Исследования и инновации</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Наше влияние</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">₽127,000</div>
              <div className="text-gray-600">Выделено в 2024</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">23</div>
              <div className="text-gray-600">Поддержанных проекта</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">450+</div>
              <div className="text-gray-600">Студентов получили гранты</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
              <div className="text-gray-600">Open source проектов</div>
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Отчеты о деятельности</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">📊 Квартальный отчет Q3 2024</h3>
              <p className="text-gray-600 mb-4">Подробный отчет о том, как были потрачены средства фонда в третьем квартале.</p>
              <a href="/reports/q3-2024.pdf" className="text-blue-600 hover:underline font-medium">Скачать PDF →</a>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-3">📈 Годовой отчет 2023</h3>
              <p className="text-gray-600 mb-4">Полный отчет о деятельности фонда за 2023 год с анализом эффективности.</p>
              <a href="/reports/annual-2023.pdf" className="text-blue-600 hover:underline font-medium">Скачать PDF →</a>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
            <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full text-lg font-medium mb-6">
              <span className="mr-2">💚</span>
              We give 10%
            </div>
            <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к движению</h2>
            <p className="text-xl mb-6">Каждая покупка LifeUndo — это вклад в развитие IT-сообщества</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Купить LifeUndo
              </Link>
              <Link href="/support" className="bg-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
                Предложить проект
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}