import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return {
    title: t('title'),
    description: t('free.description'),
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/pricing`,
      languages: {
        'en': 'https://getlifeundo.com/en/pricing',
        'ru': 'https://getlifeundo.com/ru/pricing',
      },
    },
  };
}

export default function PricingPage({ params: { locale } }: Props) {
  const t = useTranslations('pricing');

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600">
              {locale === 'ru' 
                ? 'Простые и честные цены. Все основные функции бесплатны.'
                : 'Simple and honest pricing. All core features are free.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {locale === 'ru' ? 'Рекомендуется' : 'Recommended'}
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('free.title')}
                </h3>
                <p className="text-xl text-gray-600 mb-4">
                  {t('free.description')}
                </p>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  $0
                </div>
                <p className="text-gray-500">
                  {locale === 'ru' ? 'Навсегда' : 'Forever'}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('free.features.0')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('free.features.1')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('free.features.2')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('free.features.3')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('free.features.4')}</span>
                </li>
              </ul>

              <a
                href="/downloads"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-center block hover:bg-green-700 transition-colors"
              >
                {locale === 'ru' ? 'Установить бесплатно' : 'Install for Free'}
              </a>
            </div>

            {/* Pro Plan - Coming Soon */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 relative opacity-75">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {t('pro.description')}
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('pro.title')}
                </h3>
                <p className="text-xl text-gray-600 mb-4">
                  {locale === 'ru' 
                    ? 'Расширенные функции и возможности'
                    : 'Advanced features and capabilities'
                  }
                </p>
                <div className="text-4xl font-bold text-gray-400 mb-2">
                  TBA
                </div>
                <p className="text-gray-500">
                  {locale === 'ru' ? 'Скоро' : 'Coming Soon'}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">{t('pro.features.0')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">{t('pro.features.1')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">{t('pro.features.2')}</span>
                </li>
              </ul>

              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold text-center cursor-not-allowed"
              >
                {locale === 'ru' ? 'Скоро будет доступно' : 'Coming Soon'}
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {locale === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'ru' 
                    ? 'Почему бесплатная версия включает все основные функции?'
                    : 'Why does the free version include all core features?'
                  }
                </h3>
                <p className="text-gray-700">
                  {locale === 'ru' 
                    ? 'Мы верим, что базовые инструменты для восстановления данных должны быть доступны всем. Pro версия будет включать дополнительные функции для продвинутых пользователей.'
                    : 'We believe basic data recovery tools should be available to everyone. Pro version will include additional features for advanced users.'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'ru' 
                    ? 'Когда будет доступна Pro версия?'
                    : 'When will the Pro version be available?'
                  }
                </h3>
                <p className="text-gray-700">
                  {locale === 'ru' 
                    ? 'Мы работаем над Pro версией, но пока сосредоточены на улучшении бесплатной версии. Следите за обновлениями!'
                    : 'We\'re working on the Pro version, but currently focused on improving the free version. Stay tuned for updates!'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'ru' 
                    ? 'Будет ли платная подписка?'
                    : 'Will there be a paid subscription?'
                  }
                </h3>
                <p className="text-gray-700">
                  {locale === 'ru' 
                    ? 'Мы планируем разовые покупки, а не подписки. Один раз купили — пользуетесь навсегда.'
                    : 'We plan one-time purchases, not subscriptions. Buy once, use forever.'
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