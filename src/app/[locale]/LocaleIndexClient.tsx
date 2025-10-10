'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { SocialBar } from '@/components/SocialBar';
import MobileBadges from '@/components/ui/MobileBadges';

export default function LocaleIndexClient({ params }: { params: { locale: string } }) {
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
          <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
            {t.hero.description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="#install" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              {t.hero.install}
            </a>
            <a 
              href={`/${locale}/pricing`}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              {t.hero.pricing}
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💾</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">{t.hero.saveTitle}</h3>
            <p className="text-gray-300">{t.hero.saveDescription}</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">↶</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">{t.hero.undoTitle}</h3>
            <p className="text-gray-300">{t.hero.undoDescription}</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">{t.hero.learnMore}</h3>
            <p className="text-gray-300">{t.hero.popularCases}</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-12">{t.howItWorks.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">{t.howItWorks.step1Title}</h3>
              <p className="text-gray-300">{t.howItWorks.step1Description}</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">{t.howItWorks.step2Title}</h3>
              <p className="text-gray-300">{t.howItWorks.step2Description}</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">{t.howItWorks.step3Title}</h3>
              <p className="text-gray-300">{t.howItWorks.step3Description}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">{t.cta.ready}</h2>
          <p className="text-xl text-gray-300 mb-8">Ready to get started? Download LifeUndo now and experience the power of Ctrl+Z for your online life.</p>
          <a 
            href="#install"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            {t.cta.download}
          </a>
        </div>
      </div>

      {/* Social Bar */}
      <SocialBar />
      
      {/* Mobile Badges */}
      <MobileBadges />
    </div>
  );
}
