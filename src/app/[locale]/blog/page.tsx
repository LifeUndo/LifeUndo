import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title: locale === 'ru' ? 'Блог GetLifeUndo' : 'GetLifeUndo Blog',
    description: locale === 'ru' 
      ? 'Новости, обновления и статьи о GetLifeUndo - расширении для восстановления данных в браузере.'
      : 'News, updates and articles about GetLifeUndo - browser data recovery extension.',
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/blog`,
      languages: {
        'en': 'https://getlifeundo.com/en/blog',
        'ru': 'https://getlifeundo.com/ru/blog',
      },
    },
  };
}

// Blog posts data
const blogPosts = [
  {
    slug: 'lifeundo-037x-golden-whats-inside',
    title: {
      ru: 'LifeUndo 0.3.7.x Golden — что внутри и почему приватно',
      en: 'LifeUndo 0.3.7.x Golden — what\'s inside and why private'
    },
    excerpt: {
      ru: 'Подробный обзор всех функций GetLifeUndo 0.3.7.x, принципов приватности и локального хранения данных.',
      en: 'Detailed overview of all GetLifeUndo 0.3.7.x features, privacy principles and local data storage.'
    },
    date: '2025-10-07',
    readTime: {
      ru: '5 мин чтения',
      en: '5 min read'
    }
  },
  {
    slug: 'roadmap-desktop-10-mvp',
    title: {
      ru: 'Roadmap Desktop 1.0 (MVP): локально, без облака по умолчанию',
      en: 'Desktop 1.0 (MVP) Roadmap: local, no cloud by default'
    },
    excerpt: {
      ru: 'Планы по разработке Desktop версии GetLifeUndo с фокусом на приватность и локальное хранение.',
      en: 'Plans for GetLifeUndo Desktop version development with focus on privacy and local storage.'
    },
    date: '2025-10-07',
    readTime: {
      ru: '7 мин чтения',
      en: '7 min read'
    }
  }
];

export default function BlogPage({ params: { locale } }: Props) {
  const typedLocale = locale as 'ru' | 'en';
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {locale === 'ru' ? 'Блог' : 'Blog'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Новости, обновления и статьи о GetLifeUndo'
                : 'News, updates and articles about GetLifeUndo'
              }
            </p>
          </div>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <time className="text-sm text-gray-500 mb-2 md:mb-0">
                    {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="text-sm text-gray-500">
                    {post.readTime[typedLocale]}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {post.title[typedLocale]}
                </h2>

                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {post.excerpt[typedLocale]}
                </p>

                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {locale === 'ru' ? 'Читать далее' : 'Read more'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>

          {/* Newsletter signup */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'ru' ? 'Подпишитесь на обновления' : 'Subscribe to Updates'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'ru' 
                ? 'Получайте уведомления о новых статьях и обновлениях GetLifeUndo.'
                : 'Get notifications about new articles and GetLifeUndo updates.'
              }
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {locale === 'ru' ? 'Связаться с нами' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
