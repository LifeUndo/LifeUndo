'use client';

import { useTranslations } from '@/hooks/useTranslations';
import Link from 'next/link';

export default function LicensePage() {
  const { t, locale } = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {t.license.title}
          </h1>
          <p className="text-lg text-gray-300">
            {t.license.intro}
          </p>
        </header>

        {/* Free Version */}
        <section className="mb-10 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-blue-400">
            {t.license.freeTitle}
          </h2>
          <p className="text-gray-300">
            {t.license.freeDesc}
          </p>
        </section>

        {/* PRO/VIP */}
        <section className="mb-10 p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-3 text-purple-400">
            {t.license.proTitle}
          </h2>
          <p className="text-gray-300">
            {t.license.proDesc}
          </p>
          <Link 
            href={`/${locale}/pricing`}
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            {t.license.pricingLink}
          </Link>
        </section>

        {/* Terms */}
        <section className="mb-10 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-gray-100">
            {t.license.termsTitle}
          </h2>
          <p className="text-gray-300 mb-4">
            {t.license.termsDesc}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href={`/${locale}/privacy`}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {t.license.privacyLink}
            </Link>
            <Link 
              href={`/${locale}/support`}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {t.license.supportLink}
            </Link>
          </div>
        </section>

        {/* Back to home */}
        <div className="text-center">
          <Link 
            href={`/${locale}`}
            className="text-gray-400 hover:text-gray-200 transition"
          >
            ← {locale === 'ru' ? 'На главную' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
