'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import MobileBadges from '@/components/ui/MobileBadges';

interface LatestData {
  version: string;
  publishedAt: string;
  files: {
    firefox?: string;
    win?: string;
    mac?: string;
  };
}

interface DownloadCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
  isAvailable?: boolean;
}

function DownloadCard({ icon, title, description, href, className, isAvailable = true }: DownloadCardProps) {
  if (!isAvailable) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center opacity-50">
        <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-400 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        <div className="bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
          {t.downloads.comingSoon}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <a 
        href={href} 
        className={`font-bold py-2 px-4 rounded-lg transition-colors ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.downloads.download}
      </a>
    </div>
  );
}

interface WhatsNewData {
  version: string;
  items: string[];
}

export default function DownloadsClient() {
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [whatsNewData, setWhatsNewData] = useState<WhatsNewData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslations();

  useEffect(() => {
    // Загружаем latest.json и whats-new.json с версионированием для обхода кэша
    const buildId = Date.now();
    
    Promise.all([
      fetch(`/app/latest/latest.json?v=${buildId}`).then(res => res.json()),
      fetch(`/app/latest/whats-new.json?v=${buildId}`).then(res => res.json())
    ])
    .then(([latest, whatsNew]) => {
      setLatestData(latest);
      setWhatsNewData(whatsNew);
      setLoading(false);
    })
    .catch(() => {
      // Fallback если файлы недоступны
      setLatestData({
        version: '0.3.7.13',
        publishedAt: '2025-10-04T10:00:00Z',
        files: {
          firefox: "https://addons.mozilla.org/firefox/addon/lifeundo/"
        }
      });
      setWhatsNewData({
        version: '0.3.7.13',
        items: [
          'Исправлены ссылки в попапе (Website/Privacy/Support → getlifeundo.com)',
          'Полная синхронизация RU/EN строк',
          'Баннер и шапка — корректные отступы',
          'Кнопки оплаты на сайте активированы'
        ]
      });
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.downloads.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.downloads.subtitle}
          </p>
          
          {/* Version Info */}
          {latestData && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">{t.downloads.currentVersion}</span> {latestData.version}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t.downloads.publishedAt} {new Date(latestData.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {t.downloads.latestVersion}
                  </div>
                </div>
              </div>
              
              {/* What's New */}
              {whatsNewData && whatsNewData.items.length > 0 && (
                <div className="border-t border-white/20 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-3">{t.downloads.whatsNew} {whatsNewData.version}:</h4>
                  <ul className="space-y-2">
                    {whatsNewData.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">•</span>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Chrome */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Chrome"
            description={t.downloads.chrome}
            href="https://chrome.google.com/webstore/detail/getlifeundo/PLACEHOLDER_CHROME_ID"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            isAvailable={false}
          />

          {/* Firefox */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Firefox"
            description={t.downloads.firefox}
            href={latestData?.files.firefox || "https://addons.mozilla.org/firefox/addon/getlifeundo/"}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            isAvailable={!!latestData?.files.firefox}
          />

          {/* Edge */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Edge"
            description={t.downloads.edge}
            href="https://microsoftedge.microsoft.com/addons/detail/getlifeundo/PLACEHOLDER_EDGE_ID"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            isAvailable={false}
          />

          {/* Windows EXE */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Windows"
            description={t.downloads.windows}
            href={latestData?.files.win || "https://cdn.getlifeundo.com/app/latest/undo-setup-latest.exe"}
            className="bg-gray-600 hover:bg-gray-700 text-white"
            isAvailable={!!latestData?.files.win}
          />

          {/* macOS DMG */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="macOS"
            description={t.downloads.macos}
            href={latestData?.files.mac || "https://cdn.getlifeundo.com/app/latest/undo-latest.dmg"}
            className="bg-gray-700 hover:bg-gray-800 text-white"
            isAvailable={!!latestData?.files.mac}
          />

          {/* Android RuStore */}
          <DownloadCard
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            }
            title="Android"
            description={t.downloads.android}
            href="https://www.rustore.ru/catalog/app/PLACEHOLDER_RUSTORE_ID"
            className="bg-green-600 hover:bg-green-700 text-white"
            isAvailable={false}
          />
        </div>

        {/* License Key Input */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            {t.downloads.licenseTitle}
          </h3>
          <p className="text-gray-300 text-center mb-6">
            {t.downloads.licenseDescription}
          </p>
          <div className="flex gap-4">
            <input 
              type="text" 
                placeholder={t.downloads.licensePlaceholder}
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:border-blue-400 focus:outline-none"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              {t.downloads.activate}
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            {t.downloads.featuresTitle}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t.downloads.feature1Title}</h4>
              <p className="text-gray-300">{t.downloads.feature1Description}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t.downloads.feature2Title}</h4>
              <p className="text-gray-300">{t.downloads.feature2Description}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{t.downloads.feature3Title}</h4>
              <p className="text-gray-300">{t.downloads.feature3Description}</p>
            </div>
          </div>
        </div>

        {/* Mobile Apps Announcement */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t.downloads.mobileComingSoon}
            </h3>
            <p className="text-gray-300 mb-8">
              {t.downloads.mobileDescription}
            </p>
            <MobileBadges />
          </div>
        </div>
      </div>
    </div>
  );
}