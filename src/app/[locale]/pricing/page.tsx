import ServiceCard from '@/components/ServiceCard';
import FreeKassaButton from '@/components/payments/FreeKassaButton';
import { PLANS } from '@/config/plans';
import pricingData from '@/data/pricing_ru.json';

export default function PricingPage() {
  const tiers = pricingData.tiers;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Тарифы</h1>
        <p className="text-lg text-gray-300">Выберите подходящий тариф. Все платные планы с 7-дневным пробным периодом.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <ServiceCard
          icon="⭐"
          title={tiers.pro.title}
          description="Расширенные функции для активных пользователей"
          price={`${PLANS.pro_month.amount} ₽`}
          period="в месяц"
          isPopular={true}
          ctaText="Оформить Pro"
          ctaLink="/buy?plan=pro"
          customCTA={<FreeKassaButton plan="pro_month" />}
        />

        <ServiceCard
          icon="👑"
          title={tiers.vip.title}
          description="Полный доступ ко всем функциям навсегда"
          price={`${PLANS.vip_lifetime.amount} ₽`}
          period="навсегда"
          ctaText="Купить VIP"
          ctaLink="/buy?plan=vip"
          customCTA={<FreeKassaButton plan="vip_lifetime" />}
        />

        <ServiceCard
          icon="👥"
          title={tiers.team.title}
          description="Командные возможности и корпоративная поддержка"
          price={`${PLANS.team_5.amount} ₽`}
          period="за 5 мест в месяц"
          ctaText="Заказать Team"
          ctaLink="/buy?plan=team"
          customCTA={<FreeKassaButton plan="team_5" />}
        />
      </div>

      <section className="max-w-md mx-auto mb-12">
        <div className="glass-card p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Starter Bundle</h3>
          <p className="text-gray-300 mb-2">6 месяцев Pro за 3 000 ₽</p>
          <p className="text-sm text-gray-400 mb-6">Стабильнее проходит у провайдера. Выгода 594 ₽ за пакет!</p>
          <FreeKassaButton plan="starter_6m" />
          <p className="text-xs text-gray-500 mt-3">+ бонусный флаг starter_bonus на 6 месяцев</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Часто задаваемые вопросы</h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">Можно ли платить помесячно?</h3>
              <p className="text-gray-300">Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle (6 месяцев за 3 000 ₽).</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">Чем Pro отличается от Free?</h3>
              <p className="text-gray-300">Больше лимитов, функции команд и приоритетная поддержка.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">Как работает Team-аккаунт?</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}