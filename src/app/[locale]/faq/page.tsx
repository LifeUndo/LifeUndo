// src/app/faq/page.tsx
export const metadata = { 
  title: "FAQ — LifeUndo",
  description: "Часто задаваемые вопросы о платформе LifeUndo."
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h1>
          <p className="text-xl text-gray-600">Ответы на популярные вопросы о LifeUndo</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Что такое LifeUndo?</h3>
            <p className="text-gray-600">LifeUndo — это платформа для защиты от ошибок в цифровом мире. Мы помогаем разработчикам создавать более надежные приложения, автоматически обнаруживая и предотвращая критические ошибки.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Как работает LifeUndo?</h3>
            <p className="text-gray-600">LifeUndo интегрируется с вашими приложениями через API и отслеживает их состояние в реальном времени. При обнаружении ошибок система автоматически принимает меры для их устранения.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Какие языки программирования поддерживаются?</h3>
            <p className="text-gray-600">LifeUndo поддерживает все основные языки программирования через REST API. Мы предоставляем SDK для JavaScript, Python, Java, C# и других популярных языков.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Как начать использовать LifeUndo?</h3>
            <p className="text-gray-600">Просто зарегистрируйтесь, выберите подходящий тарифный план и интегрируйте наш API в ваше приложение. Мы предоставляем подробную документацию и примеры кода.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Можно ли отменить подписку?</h3>
            <p className="text-gray-600">Да, вы можете отменить подписку в любое время в личном кабинете. При отмене месячной подписки доступ сохраняется до конца текущего периода.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-3">Предоставляется ли техническая поддержка?</h3>
            <p className="text-gray-600">Да, мы предоставляем техническую поддержку для всех пользователей. VIP пользователи получают приоритетную поддержку с гарантированным временем ответа.</p>
          </div>
        </div>
      </div>
    </main>
  );
}