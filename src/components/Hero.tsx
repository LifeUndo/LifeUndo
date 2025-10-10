'use client';

import ServiceCard from './ServiceCard';
import GlassCard from './GlassCard';
import { useTranslations } from '@/hooks/useTranslations';

export default function Hero() {
  const { t, locale } = useTranslations();
  return (
    <section className="min-h-[60vh] flex items-center pt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-6/12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            GetLifeUndo —{' '}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ctrl+Z
            </span>{' '}
            {t.hero.subtitle}
          </h1>
          <p className="mt-4 text-white/80">
            {t.hero.description}
          </p>
          <div className="mt-6 flex gap-3">
            <a href={`/${locale}/download`} className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600">
              {t.hero.install}
            </a>
            <a href={`/${locale}/pricing`} className="px-4 py-2 rounded border border-white/10">
              {t.hero.pricing}
            </a>
          </div>
        </div>
        <div className="md:w-6/12 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 h-full">
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold gradient-text mb-2">{t.hero.saveTitle}</h4>
                  <p className="text-sm text-white/80">{t.hero.saveDescription}</p>
                </div>
                <a href={`/${locale}/features`} className="inline-block px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-sm mt-4">
                  {t.hero.learnMore}
                </a>
              </GlassCard>
            </div>
            <div className="col-span-1 h-full">
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold gradient-text mb-2">{t.hero.undoTitle}</h4>
                  <p className="text-sm text-white/80">{t.hero.undoDescription}</p>
                </div>
                <a href={`/${locale}/use-cases`} className="inline-block px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-sm mt-4">
                  {t.hero.learnMore}
                </a>
              </GlassCard>
            </div>
          </div>
          <GlassCard>
            <div className="text-sm text-white/80">
              {t.hero.popularCases}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
