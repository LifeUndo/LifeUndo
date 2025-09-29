import useCasesData from '@/data/use_cases_ru.json';

export default function UseCasesPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Кейсы использования
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Как GetLifeUndo помогает в разных сферах
          </p>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCasesData.map((useCase, index) => (
              <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center mb-4">
                  <span className="text-sm px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                    {useCase.sector}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {useCase.title}
                </h3>
                <p className="text-gray-300">
                  {useCase.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Готовы попробовать?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Присоединяйтесь к тысячам пользователей, которые уже используют GetLifeUndo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/download"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Скачать бесплатно
            </a>
            <a
              href="/pricing"
              className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200"
            >
              Посмотреть тарифы
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
