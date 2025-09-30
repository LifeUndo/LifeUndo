import Hero from '@/components/Hero';
import FreeKassaBanner from '@/components/FreeKassaBanner';

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-white pt-20">
      <Hero />
      <div className="container mx-auto px-4">
        <UndoSection />
        <FreeKassaBanner />
      </div>
    </main>
  );
}