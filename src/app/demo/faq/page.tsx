export default function DemoFAQPage() {
  const faqs = [
    {
      question: "Что такое LifeUndo?",
      answer: "LifeUndo — это система защиты от ошибок в цифровом мире. Мы предоставляем инструменты для отката изменений, безопасной отправки писем и аудита действий."
    },
    {
      question: "Как работает Email Safe-Send?",
      answer: "При отправке письма система автоматически ставит его в очередь на указанное время (30-120 секунд). В это время вы можете отменить отправку или внести изменения."
    },
    {
      question: "Что такое Undo Graph?",
      answer: "Undo Graph — это ветвящаяся история всех ваших действий, которая позволяет не только откатывать изменения, но и создавать альтернативные ветки развития событий."
    },
    {
      question: "Безопасны ли мои данные?",
      answer: "Да, мы используем современные методы шифрования и соответствуем требованиям GDPR. Все данные хранятся в зашифрованном виде, а аудит ведется без сохранения персональной информации."
    },
    {
      question: "Можно ли использовать LifeUndo в корпоративной среде?",
      answer: "Да, мы предоставляем корпоративные решения с on-premise развертыванием, расширенным аудитом и white-label возможностями."
    },
    {
      question: "Есть ли API для интеграции?",
      answer: "Да, мы предоставляем REST API и готовые SDK для JavaScript и Python. Также доступны webhooks для интеграции с вашими системами."
    },
    {
      question: "Что включает в себя VIP Lifetime план?",
      answer: "VIP Lifetime предоставляет безлимитное использование всех функций, настраиваемые политики, полную историю действий, white-label возможности и VIP поддержку."
    },
    {
      question: "Можно ли отменить подписку?",
      answer: "Да, вы можете отменить подписку в любое время. При отмене вы сохраняете доступ к функциям до конца оплаченного периода."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">LifeUndo</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                DEMO
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://getlifeundo.com" 
                className="text-sm text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md"
              >
                Основной сайт → getlifeundo.com
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/demo" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Главная
            </a>
            <a href="/demo/features" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Возможности
            </a>
            <a href="/demo/pricing" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Цены
            </a>
            <a href="/demo/faq" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              FAQ
            </a>
            <a href="/demo/contacts" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Контакты
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h1>
          <p className="text-xl text-gray-600">
            Ответы на популярные вопросы о LifeUndo
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6 mb-16">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
          <p className="text-lg mb-6 opacity-90">
            Свяжитесь с нашей командой поддержки
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/demo/contacts" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Связаться с нами
            </a>
            <a 
              href="mailto:support@lifeundo.ru" 
              className="bg-transparent text-white px-6 py-3 rounded-lg font-medium border border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Написать на почту
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LifeUndo</h3>
              <p className="text-gray-400 text-sm">
                Защита от ошибок в цифровом мире
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/demo/features" className="hover:text-white">Возможности</a></li>
                <li><a href="/demo/pricing" className="hover:text-white">Цены</a></li>
                <li><a href="/demo/faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/demo/contacts" className="hover:text-white">Контакты</a></li>
                <li><a href="mailto:support@lifeundo.ru" className="hover:text-white">support@lifeundo.ru</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Основной сайт</h4>
              <p className="text-sm text-gray-400 mb-2">
                Полная версия продукта:
              </p>
              <a 
                href="https://getlifeundo.com" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                getlifeundo.com →
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 LifeUndo. Демо-версия для ознакомления.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
