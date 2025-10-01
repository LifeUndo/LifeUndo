import ServiceCard from '@/components/ServiceCard';
import FreeKassaButton from '@/components/payments/FreeKassaButton';
import { fkPublic } from '@/lib/fk-public';
import pricingData from '@/data/pricing_ru.json';

export default function PricingPage() {
  const tiers = pricingData.tiers;
  const bundles = pricingData.bundles;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Выберите свой план
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Начните бесплатно или выберите план, который подходит именно вам
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Free */}
            <ServiceCard
              icon="🆓"
              title={tiers.free.title}
              description="Базовые возможности восстановления данных для личного использования"
              features={tiers.free.limits}
              price="0 ₽"
              period="навсегда"
              ctaText="Начать бесплатно"
              ctaLink="/download"
            />

            {/* Pro */}
            <ServiceCard
              icon="⭐"
              title={tiers.pro.title}
              description="Расширенные возможности для активных пользователей"
              features={[
                'До 100 вкладок',
                'История буфера обмена',
                'Синхронизация между устройствами',
                'Приоритетная поддержка',
                'Экспорт данных'
              ]}
              price="599 ₽"
              period="в месяц"
              isPopular={true}
              ctaText="Оформить Pro"
              ctaLink="/buy?plan=pro"
              customCTA={<FreeKassaButton productId="getlifeundo_pro" />}
            />

            {/* VIP */}
            <ServiceCard
              icon="👑"
              title={tiers.vip.title}
              description="Полный доступ ко всем функциям навсегда"
              features={[
                'Безлимитные вкладки',
                'Все функции Pro',
                'Пожизненная лицензия',
                '10% в GetLifeUndo Fund',
                'Персональная поддержка',
                'Ранний доступ к новым функциям'
              ]}
              price="9 990 ₽"
              period="навсегда"
              ctaText="Купить VIP"
              ctaLink="/buy?plan=vip"
              customCTA={<FreeKassaButton productId="getlifeundo_vip" />}
            />

            {/* Team */}
            <ServiceCard
              icon="👥"
              title={tiers.team.title}
              description="Корпоративные решения для команд"
              features={[
                '5 рабочих мест включено',
                'Централизованное управление',
                'Корпоративная поддержка',
                'Аналитика использования',
                'Интеграция с корпоративными системами'
              ]}
              price="2 990 ₽"
              period="за 5 мест в месяц"
              ctaText="Заказать Team"
              ctaLink="/buy?plan=team"
              customCTA={<FreeKassaButton productId="getlifeundo_team" />}
            />
          </div>

          {/* Starter Bundle */}
          <div className="max-w-md mx-auto mb-12">
            <div className="glass-card p-8 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold">
                ПОПУЛЯРНО
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Starter Bundle
              </h3>
              <p className="text-gray-300 mb-4">
                6 месяцев Pro за 3 000 ₽
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Стабильнее проходит у провайдера. Выгода 594 ₽ за пакет!
              </p>
              <FreeKassaButton productId="starter_6m" />
              <p className="text-xs text-gray-500 mt-3">
                + бонусный флаг starter_bonus на 6 месяцев
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <h3 className="text-xl font-semibold mb-4">Важная информация</h3>
              <ul className="space-y-2 text-gray-300">
                {pricingData.notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">Можно ли платить помесячно?</h3>
              <p className="text-gray-300">
                Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle (6 месяцев за 3 000 ₽).
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">Чем Pro отличается от Free?</h3>
              <p className="text-gray-300">
                Больше лимитов, функции команд и приоритетная поддержка.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">Как работает Team-аккаунт?</h3>
              <p className="text-gray-300">
                5 мест включено, +490 ₽ за дополнительное место.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FK_STATUS: enabled={fkPublic.enabled} env={process.env.VERCEL_ENV} */}
    </div>
  );
}