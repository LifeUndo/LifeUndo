import Hero from '@/components/Hero';

function UndoSection() {
  return (
    <section className="mt-12 grid gap-6 md:grid-cols-3">
      <div className="p-5 rounded-2xl bg-white/5">
        <h3 className="text-lg font-semibold mb-2">Что такое Undo?</h3>
        <p className="text-sm opacity-80">
          В компьютере Ctrl + Z отменяет последнее действие. Мы переносим идею «отката» в реальную жизнь: 
          восстанавливаем доступы, удалённые данные и шаги, о которых вы можете пожалеть.
        </p>
      </div>
      <div className="p-5 rounded-2xl bg-white/5">
        <h3 className="text-lg font-semibold mb-2">Где это работает?</h3>
        <p className="text-sm opacity-80">
          Браузер, почта, облака и соцсети. Начинаем с браузерного расширения и аккаунтов, затем добавим мобильное приложение.
        </p>
      </div>
      <div className="p-5 rounded-2xl bg-white/5">
        <h3 className="text-lg font-semibold mb-2">Зачем это нужно?</h3>
        <p className="text-sm opacity-80">
          Чтобы экономить время, нервы и деньги, когда что-то пошло не так. Наши инструменты помогут быстро «откатить» шаги.
        </p>
      </div>
    </section>
  );
}

function FreeKassaBanner() {
  return (
    <section className="mt-16 py-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-y border-white/10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/brand/freekassa-badge.svg" 
              alt="FreeKassa" 
              className="h-8 opacity-90"
            />
            <div className="text-left">
              <h3 className="text-lg font-semibold">Оплата через FreeKassa</h3>
              <p className="text-sm text-gray-400">Удобные способы оплаты для пользователей из России и СНГ</p>
            </div>
          </div>
          <a 
            href="/ru/pricing" 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Посмотреть тарифы
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-white pt-20">
      <Hero />
      <div className="container mx-auto px-4">
        <UndoSection />
      </div>
      <FreeKassaBanner />
    </main>
  );
}