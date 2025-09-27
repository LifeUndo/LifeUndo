import Link from 'next/link';

export const metadata = { 
  title: "Поддержка — LifeUndo",
  description: "Получите помощь по LifeUndo. Техническая поддержка, FAQ и контакты."
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Поддержка LifeUndo</h1>
          <p className="text-xl text-gray-600">Мы поможем вам с любыми вопросами</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Quick Help */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">🚀 Быстрая помощь</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Telegram поддержка</h3>
                <p className="text-gray-600 mb-3">Мгновенная помощь в чате</p>
                <a 
                  href="https://t.me/LifeUndoSupport" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Написать в Telegram
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email поддержка</h3>
                <p className="text-gray-600 mb-3">Подробные вопросы</p>
                <a 
                  href="mailto:support@lifeundo.ru"
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  support@lifeundo.ru
                </a>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">❓ Частые вопросы</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Как восстановить текст?</h3>
                <p className="text-gray-600">LifeUndo автоматически сохраняет последние 20 (Free) или 200 (Pro) состояний текста в формах.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Где мои данные?</h3>
                <p className="text-gray-600">Все данные хранятся локально в вашем браузере. Ничего не отправляется в интернет.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Как активировать Pro?</h3>
                <p className="text-gray-600">Купите лицензию на странице <Link href="/pricing" className="text-blue-600 hover:underline">Цены</Link> и активируйте её в настройках расширения.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">📚 Документация</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/docs" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold mb-2">API Документация</h3>
              <p className="text-gray-600 text-sm">Полное описание API для разработчиков</p>
            </Link>
            <Link href="/faq" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold mb-2">FAQ</h3>
              <p className="text-gray-600 text-sm">Ответы на частые вопросы</p>
            </Link>
            <Link href="/features" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold mb-2">Возможности</h3>
              <p className="text-gray-600 text-sm">Что умеет LifeUndo</p>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold mb-4">📞 Контакты</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Техническая поддержка</h3>
              <div className="space-y-2 text-gray-600">
                <p>📱 Telegram: <a href="https://t.me/LifeUndoSupport" className="text-blue-600 hover:underline">@LifeUndoSupport</a></p>
                <p>📧 Email: <a href="mailto:support@lifeundo.ru" className="text-blue-600 hover:underline">support@lifeundo.ru</a></p>
                <p>⏰ Время ответа: до 24 часов</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Бизнес вопросы</h3>
              <div className="space-y-2 text-gray-600">
                <p>📧 Email: <a href="mailto:hello@lifeundo.ru" className="text-blue-600 hover:underline">hello@lifeundo.ru</a></p>
                <p>🤝 Партнерство: <a href="/partners" className="text-blue-600 hover:underline">Страница партнеров</a></p>
                <p>💰 Фонд: <a href="/fund" className="text-blue-600 hover:underline">GetLifeUndo Fund</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

