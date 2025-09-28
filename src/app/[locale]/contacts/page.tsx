// src/app/contacts/page.tsx
export const metadata = { 
  title: "Контакты — LifeUndo",
  description: "Свяжитесь с командой LifeUndo. Мы всегда готовы помочь."
};

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Контакты</h1>
          <p className="text-xl text-gray-600">Свяжитесь с нами любым удобным способом</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-4">📧 Email</h3>
            <p className="text-gray-600 mb-2">Общие вопросы:</p>
            <a href="mailto:info@lifeundo.com" className="text-blue-600 hover:underline">info@lifeundo.com</a>
            <p className="text-gray-600 mb-2 mt-4">Техническая поддержка:</p>
            <a href="mailto:support@lifeundo.com" className="text-blue-600 hover:underline">support@lifeundo.com</a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-4">💬 Telegram</h3>
            <p className="text-gray-600 mb-2">Быстрая связь:</p>
            <a href="https://t.me/lifeundo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@lifeundo</a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-4">🐙 GitHub</h3>
            <p className="text-gray-600 mb-2">Исходный код:</p>
            <a href="https://github.com/LifeUndo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/LifeUndo</a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-4">📺 YouTube</h3>
            <p className="text-gray-600 mb-2">Видео и туториалы:</p>
            <a href="https://youtube.com/lifeundo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">youtube.com/lifeundo</a>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm border p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Время ответа</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900">PRO пользователи</h4>
              <p className="text-gray-600">24-48 часов</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">VIP пользователи</h4>
              <p className="text-gray-600">2-8 часов</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Критические вопросы</h4>
              <p className="text-gray-600">1-4 часа</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
