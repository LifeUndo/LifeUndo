// src/app/contacts/page.tsx
export const metadata = { 
  title: "Контакты — GetLifeUndo",
  description: "Свяжитесь с командой GetLifeUndo. Мы всегда готовы помочь."
};

export default function ContactsPage() {
  const items = [
    { label: 'Общие вопросы', value: 'info@getlifeundo.com', href: 'mailto:info@getlifeundo.com' },
    { label: 'Техническая поддержка', value: 'support@getlifeundo.com', href: 'mailto:support@getlifeundo.com' },
    { label: 'Быстрая связь', value: 't.me/GetLifeUndoSupport', href: 'https://t.me/GetLifeUndoSupport' },
    { label: 'Исходный код', value: 'github.com/LifeUndo', href: 'https://github.com/LifeUndo' },
    { label: 'Видео и туториалы', value: 'youtube.com/@GetLifeUndo', href: 'https://youtube.com/@GetLifeUndo' },
  ];

  return (
    <main className="min-h-screen bg-[#0B1220] text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Контакты</h1>
          <p className="text-xl text-gray-300">Свяжитесь с нами любым удобным способом</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-4">{item.label}</h3>
              <a 
                href={item.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/5 rounded-lg border border-gray-800 p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Время ответа</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold">PRO пользователи</h4>
              <p className="text-gray-300">24-48 часов</p>
            </div>
            <div>
              <h4 className="font-semibold">VIP пользователи</h4>
              <p className="text-gray-300">2-8 часов</p>
            </div>
            <div>
              <h4 className="font-semibold">Критические вопросы</h4>
              <p className="text-gray-300">1-4 часа</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}