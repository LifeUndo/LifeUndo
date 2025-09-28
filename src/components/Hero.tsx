import ServiceCard from './ServiceCard';
import GlassCard from './GlassCard';

export default function Hero() {
  return (
    <section className="min-h-[60vh] flex items-center pt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-6/12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            LifeUndo —{' '}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ctrl+Z
            </span>{' '}
            для вашей жизни в сети
          </h1>
          <p className="mt-4 text-white/80">
            Сохраняйте состояния, откатывайте ошибки и возвращайте важные версии мгновенно.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/ru/download" className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600">
              Установить
            </a>
            <a href="/ru/pricing" className="px-4 py-2 rounded border border-white/10">
              Тарифы
            </a>
          </div>
        </div>
        <div className="md:w-6/12 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 h-full">
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold gradient-text mb-2">Сохранение</h4>
                  <p className="text-sm text-white/80">Быстро сохраняет рабочие сеты</p>
                </div>
                <a href="/ru/features" className="inline-block px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-sm mt-4">
                  Подробнее
                </a>
              </GlassCard>
            </div>
            <div className="col-span-1 h-full">
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold gradient-text mb-2">Откат</h4>
                  <p className="text-sm text-white/80">Верните любую версию одним кликом</p>
                </div>
                <a href="/ru/use-cases" className="inline-block px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-sm mt-4">
                  Подробнее
                </a>
              </GlassCard>
            </div>
          </div>
          <GlassCard>
            <div className="text-sm text-white/80">
              Популярные кейсы: студенты, разработчики, блогеры, бухгалтеры.
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
