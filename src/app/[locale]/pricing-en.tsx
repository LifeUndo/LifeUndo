import ServiceCard from '@/components/ServiceCard';
import FreeKassaButton from '@/components/payments/FreeKassaButton';
import { fkPublic } from '@/lib/fk-public';
import { PLANS } from '@/config/plans';

export default function PricingPageEN() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-lg text-gray-300">
          Choose the plan that fits your needs. All plans include 7-day free trial.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Free */}
        <ServiceCard
          icon="🆓"
          title="Free"
          description="Basic functionality for getting started"
          features={[
            'Up to 10 tabs',
            'Basic form recovery',
            'Community support',
            '7-day trial of Pro features'
          ]}
          price="Free"
          period="forever"
          ctaText="Get Started"
          ctaLink="/en/downloads"
        />

        {/* Pro */}
        <ServiceCard
          icon="⭐"
          title={PLANS.pro_month.label}
          description="Extended features for active users"
          features={[
            'Up to 100 tabs',
            'Clipboard history',
            'Sync between devices',
            'Priority support',
            'Data export'
          ]}
          price={`${PLANS.pro_month.amount} ₽`}
          period="per month"
          isPopular={true}
          ctaText="Get Pro"
          ctaLink="/buy?plan=pro"
          customCTA={<FreeKassaButton productId="pro_month" />}
        />

        {/* VIP */}
        <ServiceCard
          icon="👑"
          title={PLANS.vip_lifetime.label}
          description="Full access to all features forever"
          features={[
            'Unlimited tabs',
            'All Pro features',
            'Lifetime license',
            '10% to GetLifeUndo Fund',
            'Personal support',
            'Early access to new features'
          ]}
          price={`${PLANS.vip_lifetime.amount} ₽`}
          period="forever"
          ctaText="Buy VIP"
          ctaLink="/buy?plan=vip"
          customCTA={<FreeKassaButton productId="vip_lifetime" />}
        />
      </div>

      {/* Team */}
      <div className="max-w-2xl mx-auto mb-12">
        <ServiceCard
          icon="👥"
          title={PLANS.team_5.label}
          description="Corporate solutions for teams"
          features={[
            '5 seats included',
            'Centralized management',
            'Corporate support',
            'Usage analytics',
            'Integration with corporate systems'
          ]}
          price={`${PLANS.team_5.amount} ₽`}
          period="for 5 seats per month"
          ctaText="Order Team"
          ctaLink="/buy?plan=team"
          customCTA={<FreeKassaButton productId="team_5" />}
        />
      </div>

      {/* FAQ */}
      <section className="bg-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-gray-300">Yes! All paid plans include a 7-day free trial. No credit card required.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-300">Yes, you can cancel your subscription at any time. VIP is a one-time payment.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
            <p className="text-gray-300">Absolutely! All data is stored locally in your browser. We don't collect any personal information.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
