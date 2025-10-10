import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/about`,
      languages: {
        'en': 'https://getlifeundo.com/en/about',
        'ru': 'https://getlifeundo.com/ru/about',
      },
    },
  };
}

export default function AboutPage({ params: { locale } }: Props) {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {t('title')}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              {t('description')}
            </p>

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Наша миссия' : 'Our Mission'}
              </h2>
              <p className="text-gray-700">
                {locale === 'ru' 
                  ? 'Мы верим, что пользователи не должны терять важную информацию из-за случайных действий или технических проблем. GetLifeUndo решает эту проблему, предоставляя простые и надёжные инструменты для восстановления данных.'
                  : 'We believe users shouldn\'t lose important information due to accidental actions or technical issues. GetLifeUndo solves this problem by providing simple and reliable tools for data recovery.'
                }
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Принципы приватности' : 'Privacy Principles'}
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  {locale === 'ru' 
                    ? 'Все данные хранятся локально на вашем устройстве'
                    : 'All data is stored locally on your device'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Никаких облачных синхронизаций по умолчанию'
                    : 'No cloud synchronization by default'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Скриншоты делаются только по явному действию пользователя'
                    : 'Screenshots are taken only by explicit user action'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Никакой телеметрии или отслеживания'
                    : 'No telemetry or tracking'
                  }
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Технологии' : 'Technologies'}
              </h2>
              <p className="text-gray-700 mb-4">
                {locale === 'ru' 
                  ? 'GetLifeUndo построен с использованием современных веб-технологий:'
                  : 'GetLifeUndo is built using modern web technologies:'
                }
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Firefox WebExtensions API (Manifest V2)</li>
                <li>Next.js для веб-сайта</li>
                <li>TypeScript для типобезопасности</li>
                <li>Tailwind CSS для стилизации</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
