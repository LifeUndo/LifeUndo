import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://getlifeundo.com/${locale}`,
      languages: {
        'en': 'https://getlifeundo.com/en',
        'ru': 'https://getlifeundo.com/ru',
      },
    },
  };
}

export default function HomePage({ params: { locale } }: Props) {
  const t = useTranslations('home');
  const tNav = useTranslations('navigation');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {t('subtitle')}
          </p>
          <p className="text-lg mb-10 text-blue-200 max-w-3xl mx-auto">
            {t('description')}
          </p>
          
          {/* Screenshots placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-lg font-semibold mb-2">{t('features.textInputs')}</h3>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold mb-2">{t('features.clipboardHistory')}</h3>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold mb-2">{t('features.recentTabs')}</h3>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-lg font-semibold mb-2">{t('features.screenshots')}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          {/* Feature cards with screenshots placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-4">{t('features.textInputs')}</h3>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Восстанавливайте потерянный текст в формах, текстовых полях и комментариях.'
                  : 'Restore lost text in forms, text fields, and comments.'
                }
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
                Screenshot placeholder: Extension popup showing text inputs
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-4">{t('features.clipboardHistory')}</h3>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'История всех скопированных текстов и ссылок.'
                  : 'History of all copied texts and links.'
                }
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
                Screenshot placeholder: Clipboard history in extension
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-2xl font-bold mb-4">{t('features.recentTabs')}</h3>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Быстро возвращайтесь к недавно закрытым вкладкам.'
                  : 'Quickly return to recently closed tabs.'
                }
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
                Screenshot placeholder: Recently closed tabs list
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-4">{t('features.screenshots')}</h3>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Делайте быстрые скриншоты по кнопке или горячей клавише.'
                  : 'Take quick screenshots with button or hotkey.'
                }
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
                Screenshot placeholder: Screenshot capture interface
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {locale === 'ru' ? 'Начните использовать GetLifeUndo' : 'Start using GetLifeUndo'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {locale === 'ru' 
              ? 'Установите расширение Firefox и никогда больше не теряйте данные.'
              : 'Install Firefox extension and never lose data again.'
            }
          </p>
          <a
            href="/downloads"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            {tNav('downloads')}
          </a>
        </div>
      </section>
    </div>
  );
}