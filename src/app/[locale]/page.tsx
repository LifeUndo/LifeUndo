'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { SocialBar } from '@/components/SocialBar';

export default function LocaleIndex({ params }: { params: { locale: string } }) {
  const { t, locale } = useTranslations();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`/${locale}/downloads`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              {t.hero.cta_primary}
            </a>
            <a 
              href={`/${locale}/features`}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              {t.hero.cta_secondary}
            </a>
          </div>
          
        </div>

        {/* How it works - 3 steps */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            {t.howItWorks.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t.howItWorks.step1.title}</h3>
              <p className="text-gray-300">
                {t.howItWorks.step1.description}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t.howItWorks.step2.title}</h3>
              <p className="text-gray-300">
                {t.howItWorks.step2.description}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t.howItWorks.step3.title}</h3>
              <p className="text-gray-300">
                {t.howItWorks.step3.description}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t.cta.ready}
            </h3>
            <p className="text-gray-300 mb-6">
              {locale === 'en' ? '7 days free. No limits, no subscriptions.' : '7 дней бесплатно. Без лимитов, без подписок.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`/${locale}/downloads`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {locale === 'en' ? 'Download free' : 'Скачать бесплатно'}
              </a>
              <a 
                href={`/${locale}/pricing`}
                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {locale === 'en' ? 'View pricing' : 'Посмотреть тарифы'}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Apps Announcement */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {locale === 'en' ? 'Mobile Apps Coming Soon' : 'Мобильные приложения скоро'}
            </h3>
            <p className="text-gray-300 mb-8">
              {locale === 'en' 
                ? 'GetLifeUndo will be available on iOS, Android, and RuStore in Q1 2025' 
                : 'GetLifeUndo будет доступен на iOS, Android и RuStore в Q1 2025'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`/${locale}/news/mobile-ios`}
                className="inline-block"
              >
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12" />
              </a>
              <a 
                href={`/${locale}/news/mobile-android`}
                className="inline-block"
              >
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-12" />
              </a>
              <a 
                href={`/${locale}/news/rustore`}
                className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="text-lg">RuStore</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}