'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

export default function DownloadsPage() {
  const t = useTranslations('downloads');
  const locale = useLocale();
  const [waitlistData, setWaitlistData] = useState({
    name: '',
    email: '',
    platform: 'desktop'
  });
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWaitlist(true);
    setWaitlistStatus('idle');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...waitlistData,
          locale: window.location.pathname.split('/')[1] || 'en'
        }),
      });

      if (response.ok) {
        setWaitlistStatus('success');
        setWaitlistData({ name: '', email: '', platform: 'desktop' });
      } else {
        setWaitlistStatus('error');
      }
    } catch (error) {
      setWaitlistStatus('error');
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  const handleWaitlistChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setWaitlistData({
      ...waitlistData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'ru' 
                ? 'Скачайте GetLifeUndo для Firefox или присоединитесь к списку ожидания Desktop версии.'
                : 'Download GetLifeUndo for Firefox or join the waitlist for Desktop version.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Firefox Extension */}
            <div className="bg-white rounded-lg shadow-xl border-2 border-blue-200 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {locale === 'ru' ? 'Доступно сейчас' : 'Available Now'}
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🦊</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('extension.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {t('extension.description')}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Что включено:' : 'What\'s included:'}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {locale === 'ru' ? 'Восстановление ввода текста' : 'Text input recovery'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {locale === 'ru' ? 'История буфера обмена' : 'Clipboard history'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {locale === 'ru' ? 'Недавно закрытые вкладки' : 'Recently closed tabs'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {locale === 'ru' ? 'Быстрые скриншоты' : 'Quick screenshots'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {locale === 'ru' ? 'Локализация RU/EN' : 'RU/EN localization'}
                  </li>
                </ul>
              </div>

              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/getlifeundo/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-center block hover:bg-blue-700 transition-colors text-lg"
              >
                {t('extension.button')}
              </a>

              <p className="text-center text-sm text-gray-500 mt-4">
                {locale === 'ru' 
                  ? 'Требуется Firefox 78 или новее'
                  : 'Requires Firefox 78 or newer'
                }
              </p>
            </div>

            {/* Desktop Version - Coming Soon */}
            <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 p-8 relative opacity-75">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {t('desktop.description')}
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💻</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('desktop.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {locale === 'ru' 
                    ? 'Полнофункциональное десктопное приложение'
                    : 'Full-featured desktop application'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Планируемые функции:' : 'Planned features:'}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {locale === 'ru' ? (
                    <>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.0')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.1')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.2')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.3')}
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.0')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.1')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.2')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-gray-400 mr-2">•</span>
                        {t('desktop.features.3')}
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Waitlist Form */}
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'ru' ? 'Имя' : 'Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={waitlistData.name}
                    onChange={handleWaitlistChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder={locale === 'ru' ? 'Ваше имя' : 'Your name'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={waitlistData.email}
                    onChange={handleWaitlistChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'ru' ? 'Платформа' : 'Platform'}
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={waitlistData.platform}
                    onChange={handleWaitlistChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="desktop">{locale === 'ru' ? 'Desktop (Windows/Mac)' : 'Desktop (Windows/Mac)'}</option>
                    <option value="mobile">{locale === 'ru' ? 'Mobile (iOS/Android)' : 'Mobile (iOS/Android)'}</option>
                  </select>
                </div>

                {waitlistStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm">
                      {locale === 'ru' 
                        ? 'Вы добавлены в список ожидания!'
                        : 'You\'re added to the waitlist!'
                      }
                    </p>
                  </div>
                )}

                {waitlistStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">
                      {locale === 'ru' 
                        ? 'Ошибка при добавлении в список ожидания.'
                        : 'Error adding to waitlist.'
                      }
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingWaitlist}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingWaitlist 
                    ? (locale === 'ru' ? 'Добавляем...' : 'Adding...')
                    : t('desktop.button')
                  }
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                {locale === 'ru' 
                  ? 'Уведомим вас, когда версия будет готова'
                  : 'We\'ll notify you when the version is ready'
                }
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {locale === 'ru' ? 'Почему GetLifeUndo?' : 'Why GetLifeUndo?'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {locale === 'ru' ? 'Приватность' : 'Privacy'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'ru' 
                    ? 'Все данные хранятся локально на вашем устройстве'
                    : 'All data stored locally on your device'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {locale === 'ru' ? 'Быстрота' : 'Speed'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'ru' 
                    ? 'Мгновенный доступ к восстановленным данным'
                    : 'Instant access to recovered data'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {locale === 'ru' ? 'Простота' : 'Simplicity'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'ru' 
                    ? 'Простой и интуитивный интерфейс'
                    : 'Simple and intuitive interface'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}