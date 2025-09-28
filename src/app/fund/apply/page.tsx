import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';

export const metadata = {
  title: 'Заявка в GetLifeUndo Fund',
  description: 'Подать заявку на грант из фонда LifeUndo.',
  alternates: { canonical: 'https://lifeundo.ru/fund/apply' }
};

export default function FundApplyPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <ModernHeader />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Подать заявку в GetLifeUndo Fund
            </h1>
            <p className="text-xl text-gray-300">
              Получите финансирование для вашего проекта в области образования, UX или Open Source
            </p>
          </div>

          {/* Fund Info */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">О GetLifeUndo Fund</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Мы отдаём 10% от чистой выручки на поддержку проектов в трёх ключевых областях:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">40%</div>
                <div className="text-gray-300">Образование</div>
                <div className="text-sm text-gray-400 mt-2">Школы, университеты, образовательные программы</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">30%</div>
                <div className="text-gray-300">UX и доступность</div>
                <div className="text-sm text-gray-400 mt-2">Улучшение пользовательского опыта</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">30%</div>
                <div className="text-gray-300">Open Source</div>
                <div className="text-sm text-gray-400 mt-2">Поддержка открытых проектов</div>
              </div>
            </div>
            <p className="text-gray-300 text-center">
              Финансирование распределяется ежеквартально. Отчёты публикуются ежегодно.
            </p>
          </div>

          {/* Application Form */}
          <div className="bg-gray-800/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">Форма заявки</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="applicantName" className="block text-sm font-medium text-gray-300 mb-2">
                    ФИО заявителя *
                  </label>
                  <input
                    type="text"
                    id="applicantName"
                    name="applicantName"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email адрес *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="ivan@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                  Организация/Проект
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Название организации или проекта"
                />
              </div>

              <div>
                <label htmlFor="projectCategory" className="block text-sm font-medium text-gray-300 mb-2">
                  Категория проекта *
                </label>
                <select
                  id="projectCategory"
                  name="projectCategory"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Выберите категорию</option>
                  <option value="education">Образование (школы, университеты)</option>
                  <option value="ux">UX и доступность</option>
                  <option value="opensource">Open Source</option>
                </select>
              </div>

              <div>
                <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-300 mb-2">
                  Название проекта *
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Краткое название проекта"
                />
              </div>

              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-2">
                  Описание проекта *
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  required
                  rows={6}
                  placeholder="Опишите цели, задачи и ожидаемые результаты проекта"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-300 mb-2">
                    Запрашиваемая сумма (₽) *
                  </label>
                  <input
                    type="number"
                    id="requestedAmount"
                    name="requestedAmount"
                    required
                    min="1000"
                    max="1000000"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label htmlFor="projectTimeline" className="block text-sm font-medium text-gray-300 mb-2">
                    Сроки реализации проекта
                  </label>
                  <input
                    type="text"
                    id="projectTimeline"
                    name="projectTimeline"
                    placeholder="Например: 6 месяцев, с января по июнь 2025"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-300 mb-2">
                  Дополнительная контактная информация
                </label>
                <textarea
                  id="contactInfo"
                  name="contactInfo"
                  rows={3}
                  placeholder="Telegram, телефон, социальные сети"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    required
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                    Я согласен с <a href="/privacy" target="_blank" className="text-purple-400 hover:text-purple-300">Политикой конфиденциальности</a> и <a href="/terms" target="_blank" className="text-purple-400 hover:text-purple-300">Условиями использования</a> *
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeProcessing"
                    name="agreeProcessing"
                    required
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeProcessing" className="text-sm text-gray-300">
                    Я даю согласие на обработку персональных данных для рассмотрения заявки *
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="noConflict"
                    name="noConflict"
                    required
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="noConflict" className="text-sm text-gray-300">
                    Я подтверждаю отсутствие конфликта интересов и аффилированности с GetLifeUndo *
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      </main>

      <ModernFooter />
    </div>
  );
}
