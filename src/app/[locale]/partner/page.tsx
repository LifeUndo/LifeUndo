import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title: locale === 'ru' ? 'Партнёрская программа GetLifeUndo' : 'GetLifeUndo Partnership Program',
    description: locale === 'ru' 
      ? 'Присоединяйтесь к партнёрской программе GetLifeUndo. Получите ранний доступ, реферальные проценты и эксклюзивные материалы.'
      : 'Join GetLifeUndo partnership program. Get early access, referral commissions, and exclusive materials.',
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/partner`,
      languages: {
        'en': 'https://getlifeundo.com/en/partner',
        'ru': 'https://getlifeundo.com/ru/partner',
      },
    },
  };
}

export default function PartnerPage({ params: { locale } }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {locale === 'ru' ? 'Партнёрская программа' : 'Partnership Program'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'ru' 
                ? 'Сотрудничайте с GetLifeUndo и получайте выгоду от продвижения нашего продукта.'
                : 'Partner with GetLifeUndo and benefit from promoting our product.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Partnership Types */}
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Контент-партнёры' : 'Content Partners'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Блогеры, YouTube каналы, Telegram чаты о продуктивности и приватности.'
                  : 'Bloggers, YouTube channels, Telegram chats about productivity and privacy.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>• {locale === 'ru' ? 'Ранний доступ к функциям' : 'Early access to features'}</li>
                <li>• {locale === 'ru' ? 'Эксклюзивные материалы' : 'Exclusive materials'}</li>
                <li>• {locale === 'ru' ? 'Реферальные проценты' : 'Referral commissions'}</li>
              </ul>
              <Link
                href={`/${locale}/creator/apply`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {locale === 'ru' ? 'Подать заявку' : 'Apply'}
              </Link>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <div className="text-4xl mb-4">🤝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Технические партнёры' : 'Technical Partners'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Разработчики расширений, интеграции с браузерами, API партнёрства.'
                  : 'Extension developers, browser integrations, API partnerships.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>• {locale === 'ru' ? 'API доступ' : 'API access'}</li>
                <li>• {locale === 'ru' ? 'Техническая поддержка' : 'Technical support'}</li>
                <li>• {locale === 'ru' ? 'Совместная разработка' : 'Co-development'}</li>
              </ul>
              <Link
                href={`/${locale}/contact`}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {locale === 'ru' ? 'Связаться' : 'Contact'}
              </Link>
            </div>

            <div className="bg-purple-50 rounded-lg p-8">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Корпоративные партнёры' : 'Enterprise Partners'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Компании, которые хотят интегрировать GetLifeUndo в свои решения.'
                  : 'Companies looking to integrate GetLifeUndo into their solutions.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>• {locale === 'ru' ? 'Корпоративные лицензии' : 'Enterprise licenses'}</li>
                <li>• {locale === 'ru' ? 'Кастомизация' : 'Customization'}</li>
                <li>• {locale === 'ru' ? 'Приоритетная поддержка' : 'Priority support'}</li>
              </ul>
              <Link
                href={`/${locale}/contact`}
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {locale === 'ru' ? 'Обсудить' : 'Discuss'}
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {locale === 'ru' ? 'Преимущества партнёрства' : 'Partnership Benefits'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-blue-500 mr-4 mt-1">🚀</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'ru' ? 'Ранний доступ' : 'Early Access'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Получайте новые версии и функции раньше всех остальных пользователей.'
                        : 'Get new versions and features before all other users.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-green-500 mr-4 mt-1">💰</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'ru' ? 'Монетизация' : 'Monetization'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Получайте процент от каждого приведённого пользователя после запуска Pro версии.'
                        : 'Get commission from every referred user after Pro version launch.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-purple-500 mr-4 mt-1">🎨</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'ru' ? 'Эксклюзивные материалы' : 'Exclusive Materials'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Брендированные скриншоты, демо-видео, пресс-релизы для вашего контента.'
                        : 'Branded screenshots, demo videos, press releases for your content.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-orange-500 mr-4 mt-1">📢</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {locale === 'ru' ? 'Взаимная реклама' : 'Mutual Promotion'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Мы будем упоминать вас в наших каналах и соцсетях.'
                        : 'We will mention you in our channels and social media.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {locale === 'ru' ? 'Требования к партнёрам' : 'Partner Requirements'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Контент-партнёры' : 'Content Partners'}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {locale === 'ru' ? 'Аудитория от 1K подписчиков' : 'Audience of 1K+ subscribers'}
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {locale === 'ru' ? 'Регулярный контент о продуктивности/приватности' : 'Regular content about productivity/privacy'}
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {locale === 'ru' ? 'Положительная репутация в сообществе' : 'Positive reputation in the community'}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Технические партнёры' : 'Technical Partners'}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' ? 'Опыт разработки расширений браузера' : 'Experience in browser extension development'}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' ? 'Техническое понимание WebExtensions API' : 'Technical understanding of WebExtensions API'}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' ? 'Готовность к совместной разработке' : 'Willingness for co-development'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {locale === 'ru' ? 'Готовы стать партнёром?' : 'Ready to become a partner?'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {locale === 'ru' 
                ? 'Присоединяйтесь к нашей экосистеме и получайте выгоду от сотрудничества.'
                : 'Join our ecosystem and benefit from collaboration.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/creator/apply`}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {locale === 'ru' ? 'Подать заявку' : 'Submit Application'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                {locale === 'ru' ? 'Связаться с нами' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
