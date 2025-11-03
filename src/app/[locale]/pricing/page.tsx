import ServiceCard from '@/components/ServiceCard';
import FreeKassaButton from '@/components/payments/FreeKassaButton';
import { PLANS } from '@/config/plans';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params?.locale === 'en' ? 'en' : 'ru';
  const base = 'https://getlifeundo.com';
  const url = `${base}/${locale}/pricing`;
  const other = locale === 'en' ? 'ru' : 'en';
  const title = locale === 'en'
    ? 'Pricing — GetLifeUndo'
    : 'Тарифы — GetLifeUndo';
  const description = locale === 'en'
    ? 'Choose a plan: Pro (monthly), VIP (lifetime), Team (5 seats). 7‑day free trial. Payments via FreeKassa. 100% local.'
    : 'Выберите тариф: Pro (ежемесячно), VIP (навсегда), Team (5 мест). 7‑дней бесплатно. Оплата через FreeKassa. 100% локально.';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ru-RU': `${base}/ru/pricing`,
        'en-US': `${base}/en/pricing`,
      }
    },
    openGraph: {
      url,
      title,
      description,
    },
    twitter: {
      title,
      description,
    }
  };
}

export default function PricingPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale === 'en' ? 'en' : 'ru';

  const txt = locale === 'en'
    ? {
        title: 'Pricing',
        subtitle: 'Choose the plan that fits your needs. All plans include a 7-day free trial.',
        trialTitle: '7-day free trial',
        trialDesc: 'Auto-renewal, you can cancel in one click before the billing date.',
        proDesc: 'Extended features for active users',
        perMonth: 'per month',
        vipDesc: 'Full access to all features forever',
        vipPeriod: 'forever',
        teamDesc: 'Team capabilities and corporate support',
        teamPeriod: 'for 5 seats per month',
        proCta: 'Get Pro',
        vipCta: 'Buy VIP',
        teamCta: 'Order Team',
        payTitle: 'Payment and Security',
        payDesc: 'We accept payments via FreeKassa. Stripe — coming soon. All payments are processed over secure channels.',
        stripeSoon: 'Stripe — coming soon',
        trialNote: '7‑day trial with auto‑renewal. You can cancel anytime before the billing date.',
        faq: 'Frequently Asked Questions',
        q1: 'Can I pay monthly?',
        a1: 'Yes. If the payment fails — try again or choose Starter Bundle (6 months for 3,000 ₽).',
        q2: 'What is the difference between Pro and Free?',
        a2: 'Higher limits, team features and priority support.',
        q3: 'How does the Team account work?',
      }
    : {
        title: 'Тарифы',
        subtitle: 'Выберите подходящий тариф для себя или команды.',
        trialTitle: '7 дней бесплатно',
        trialDesc: 'Автопродление, можно отменить в 1 клик до даты списания.',
        proDesc: 'Расширенные функции для активных пользователей',
        perMonth: 'в месяц',
        vipDesc: 'Полный доступ ко всем функциям навсегда',
        vipPeriod: 'навсегда',
        teamDesc: 'Командные возможности и корпоративная поддержка',
        teamPeriod: 'за 5 мест в месяц',
        proCta: 'Оформить Pro',
        vipCta: 'Купить VIP',
        teamCta: 'Заказать Team',
        payTitle: 'Оплата и безопасность',
        payDesc: 'Принимаем платежи через FreeKassa. Stripe — скоро. Все платежи проходят по защищённым каналам.',
        stripeSoon: 'Stripe — скоро',
        trialNote: 'Пробный период 7 дней с авто‑продлением. Отменить можно в любой момент до даты списания.',
        faq: 'Часто задаваемые вопросы',
        q1: 'Можно ли платить помесячно?',
        a1: 'Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle (6 месяцев за 3 000 ₽).',
        q2: 'Чем Pro отличается от Free?',
        a2: 'Больше лимитов, функции команд и приоритетная поддержка.',
        q3: 'Как работает Team-аккаунт?',
      };

  // Отображаемые суммы и символ валюты
  const isEN = locale === 'en';
  const currencySymbol = isEN ? '$' : '₽';
  const display = {
    pro: isEN ? 7.40 : PLANS.pro_month.amount,
    vip: isEN ? 123.33 : PLANS.vip_lifetime.amount,
    team: isEN ? 36.91 : PLANS.team_5.amount,
  } as const;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "" + (locale === 'en' ? 'Can I pay monthly?' : 'Можно ли платить помесячно?'),
              "acceptedAnswer": {"@type": "Answer", "text": "" + (locale === 'en' ? 'Yes. If the payment fails — try again or choose Starter Bundle (6 months for 3,000 ₽).' : 'Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle (6 месяцев за 3 000 ₽).')}
            },
            {
              "@type": "Question",
              "name": "" + (locale === 'en' ? 'What is the difference between Pro and Free?' : 'Чем Pro отличается от Free?'),
              "acceptedAnswer": {"@type": "Answer", "text": "" + (locale === 'en' ? 'Higher limits, team features and priority support.' : 'Больше лимитов, функции команд и приоритетная поддержка.')}
            },
            {
              "@type": "Question",
              "name": "" + (locale === 'en' ? 'How does the Team account work?' : 'Как работает Team-аккаунт?'),
              "acceptedAnswer": {"@type": "Answer", "text": "" + (locale === 'en' ? 'Bring back lost text and forms — save time and nerves.' : 'Возвращайте потерянный текст и формы — экономьте время и нервы.')}
            }
          ]
        }) }}
      />
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{txt.title}</h1>
        <p className="text-lg text-gray-300">{txt.subtitle}</p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-green-400/40 bg-green-500/10 px-4 py-3 text-left">
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
          <div>
            <div className="font-semibold text-white">{txt.trialTitle}</div>
            <div className="text-sm text-white/80">{txt.trialDesc}</div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <ServiceCard
          icon="⭐"
          title={PLANS.pro_month.label}
          description={txt.proDesc}
          price={`${currencySymbol}${display.pro}`}
          period={txt.perMonth}
          isPopular={true}
          ctaText={txt.proCta}
          ctaLink={`/${locale}/buy?plan=pro`}
          customCTA={<FreeKassaButton plan="pro_month" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />

        <ServiceCard
          icon="👑"
          title={PLANS.vip_lifetime.label}
          description={txt.vipDesc}
          price={`${currencySymbol}${display.vip}`}
          period={txt.vipPeriod}
          ctaText={txt.vipCta}
          ctaLink={`/${locale}/buy?plan=vip`}
          customCTA={<FreeKassaButton plan="vip_lifetime" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />

        <ServiceCard
          icon="👥"
          title={PLANS.team_5.label}
          description={txt.teamDesc}
          price={`${currencySymbol}${display.team}`}
          period={txt.teamPeriod}
          ctaText={txt.teamCta}
          ctaLink={`/${locale}/buy?plan=team`}
          customCTA={<FreeKassaButton plan="team_5" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />}
        />
      </div>

      <section className="max-w-2xl mx-auto mb-12">
        <div className="rounded-xl bg-gradient-to-r from-purple-700/40 to-blue-700/40 border border-white/10 p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">{txt.payTitle}</h3>
          <p className="text-sm text-white/80 mb-4">{txt.payDesc}</p>
          <div className="flex items-center justify-center gap-3">
            <FreeKassaButton plan="pro_month" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" />
            <button type="button" aria-disabled="true" className="px-4 py-2 rounded border border-white/20 text-white/60 cursor-not-allowed" title={txt.stripeSoon}>
              {txt.stripeSoon}
            </button>
          </div>
          <div className="mt-4 text-xs text-white/60">{txt.trialNote}</div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">{txt.faq}</h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{txt.q1}</h3>
              <p className="text-gray-300">{txt.a1}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{txt.q2}</h3>
              <p className="text-gray-300">{txt.a2}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{txt.q3}</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}