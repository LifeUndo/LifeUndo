'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function PrivacyPage() {
  const { t, locale } = useTranslations();
  
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">
            {t.privacy.title}
          </h1>
          
          <div className="glass-card p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Local Operation</h2>
              <p className="text-gray-300 leading-relaxed">
                {t.privacy.local}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Payment Processing</h2>
              <p className="text-gray-300 leading-relaxed">
                {t.privacy.payments}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Scope</h2>
              <p className="text-gray-300 leading-relaxed">
                {t.privacy.scope}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                {t.privacy.contacts}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Full Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                {t.privacy.full_link}
              </p>
            </section>

            <div className="text-sm text-gray-400 mt-8 pt-6 border-t border-white/10">
              <p>{t.privacy.updated}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}