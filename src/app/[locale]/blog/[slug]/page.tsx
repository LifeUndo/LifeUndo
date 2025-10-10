import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: { locale: string; slug: string };
};

// Blog posts data
const blogPosts = {
  'lifeundo-037x-golden-whats-inside': {
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
    },
    content: {
      ru: `
        <h2>Введение</h2>
        <p>LifeUndo 0.3.7.x Golden — это стабильная версия нашего расширения для Firefox, которая включает в себя все основные функции для восстановления потерянных данных в браузере.</p>

        <h2>Основные функции</h2>
        <h3>Восстановление ввода текста</h3>
        <p>GetLifeUndo автоматически сохраняет весь текст, который вы вводите в формы, текстовые поля и комментарии. Если страница перезагрузится или вы случайно закроете вкладку, ваш текст не будет потерян.</p>

        <h3>История буфера обмена</h3>
        <p>Все скопированные тексты и ссылки сохраняются в локальной истории. Вы можете быстро найти и вставить ранее скопированный контент.</p>

        <h3>Недавно закрытые вкладки</h3>
        <p>Быстро возвращайтесь к важным страницам с помощью списка недавно закрытых вкладок и окон.</p>

        <h3>Быстрые скриншоты</h3>
        <p>Делайте скриншоты текущей вкладки по кнопке или горячей клавише Ctrl+Shift+U. Все скриншоты сохраняются локально.</p>

        <h2>Принципы приватности</h2>
        <p>GetLifeUndo разработан с принципом "приватность по умолчанию":</p>
        <ul>
          <li>Все данные хранятся локально на вашем устройстве</li>
          <li>Никаких облачных синхронизаций по умолчанию</li>
          <li>Скриншоты делаются только по явному действию пользователя</li>
          <li>Никакой телеметрии или отслеживания</li>
        </ul>

        <h2>Локализация</h2>
        <p>Полная поддержка русского и английского языков с автоматическим определением языка браузера.</p>

        <h2>Заключение</h2>
        <p>LifeUndo 0.3.7.x Golden — это надёжное решение для восстановления данных в браузере с фокусом на приватность и простоту использования.</p>
      `,
      en: `
        <h2>Introduction</h2>
        <p>LifeUndo 0.3.7.x Golden is a stable version of our Firefox extension that includes all core features for recovering lost browser data.</p>

        <h2>Core Features</h2>
        <h3>Text Input Recovery</h3>
        <p>GetLifeUndo automatically saves all text you type in forms, text fields, and comments. If the page reloads or you accidentally close the tab, your text won't be lost.</p>

        <h3>Clipboard History</h3>
        <p>All copied texts and links are saved in local history. You can quickly find and paste previously copied content.</p>

        <h3>Recently Closed Tabs</h3>
        <p>Quickly return to important pages with a list of recently closed tabs and windows.</p>

        <h3>Quick Screenshots</h3>
        <p>Take screenshots of the current tab with a button or hotkey Ctrl+Shift+U. All screenshots are saved locally.</p>

        <h2>Privacy Principles</h2>
        <p>GetLifeUndo is designed with "privacy by default" principle:</p>
        <ul>
          <li>All data is stored locally on your device</li>
          <li>No cloud synchronization by default</li>
          <li>Screenshots are taken only by explicit user action</li>
          <li>No telemetry or tracking</li>
        </ul>

        <h2>Localization</h2>
        <p>Full support for Russian and English languages with automatic browser language detection.</p>

        <h2>Conclusion</h2>
        <p>LifeUndo 0.3.7.x Golden is a reliable solution for browser data recovery with focus on privacy and ease of use.</p>
      `
    }
  },
  'roadmap-desktop-10-mvp': {
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
    },
    content: {
      ru: `
        <h2>Введение</h2>
        <p>После успешного запуска расширения для Firefox мы работаем над Desktop версией GetLifeUndo 1.0 (MVP), которая будет работать как автономное приложение.</p>

        <h2>Ключевые принципы</h2>
        <h3>Локальность</h3>
        <p>Все данные будут храниться локально на компьютере пользователя. Никаких облачных синхронизаций без явного согласия.</p>

        <h3>Приватность</h3>
        <p>Принцип "приватность по умолчанию" остаётся неизменным. Никакой телеметрии, аналитики или отслеживания.</p>

        <h3>Простота</h3>
        <p>Интуитивный интерфейс, минимальная настройка, работа "из коробки".</p>

        <h2>Планируемые функции MVP</h2>
        <h3>Непрерывные снапшоты текста</h3>
        <p>Автоматическое сохранение всего вводимого текста во всех приложениях и браузерах.</p>

        <h3>Кросс-буфер обмена</h3>
        <p>Универсальная история буфера обмена, работающая между всеми приложениями.</p>

        <h3>Восстановление после краша</h3>
        <p>Автоматическое восстановление данных после неожиданного завершения работы приложений.</p>

        <h3>Локальное хранение</h3>
        <p>Все данные шифруются и хранятся локально с возможностью резервного копирования.</p>

        <h2>Технические детали</h2>
        <h3>Платформы</h3>
        <ul>
          <li>Windows 10/11</li>
          <li>macOS 10.15+</li>
          <li>Linux (Ubuntu, Fedora, Arch)</li>
        </ul>

        <h3>Технологии</h3>
        <ul>
          <li>Electron для кроссплатформенности</li>
          <li>SQLite для локального хранения</li>
          <li>End-to-end шифрование</li>
        </ul>

        <h2>Временные рамки</h2>
        <p>MVP версия планируется к выпуску в Q2 2025 года. Следите за обновлениями в нашем блоге.</p>

        <h2>Как присоединиться</h2>
        <p>Хотите получить ранний доступ? Присоединяйтесь к нашему списку ожидания или станьте партнёром проекта.</p>
      `,
      en: `
        <h2>Introduction</h2>
        <p>After the successful launch of the Firefox extension, we are working on GetLifeUndo Desktop 1.0 (MVP), which will work as a standalone application.</p>

        <h2>Key Principles</h2>
        <h3>Locality</h3>
        <p>All data will be stored locally on the user's computer. No cloud synchronization without explicit consent.</p>

        <h3>Privacy</h3>
        <p>The "privacy by default" principle remains unchanged. No telemetry, analytics, or tracking.</p>

        <h3>Simplicity</h3>
        <p>Intuitive interface, minimal configuration, works "out of the box".</p>

        <h2>Planned MVP Features</h2>
        <h3>Continuous Text Snapshots</h3>
        <p>Automatic saving of all typed text in all applications and browsers.</p>

        <h3>Cross-buffer Clipboard</h3>
        <p>Universal clipboard history working between all applications.</p>

        <h3>Crash Recovery</h3>
        <p>Automatic data recovery after unexpected application termination.</p>

        <h3>Local Storage</h3>
        <p>All data is encrypted and stored locally with backup capability.</p>

        <h2>Technical Details</h2>
        <h3>Platforms</h3>
        <ul>
          <li>Windows 10/11</li>
          <li>macOS 10.15+</li>
          <li>Linux (Ubuntu, Fedora, Arch)</li>
        </ul>

        <h3>Technologies</h3>
        <ul>
          <li>Electron for cross-platform compatibility</li>
          <li>SQLite for local storage</li>
          <li>End-to-end encryption</li>
        </ul>

        <h2>Timeline</h2>
        <p>MVP version is planned for release in Q2 2025. Follow our blog for updates.</p>

        <h2>How to Join</h2>
        <p>Want early access? Join our waitlist or become a project partner.</p>
      `
    }
  }
};

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const post = blogPosts[slug as keyof typeof blogPosts];
  
  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  const typedLocale = locale as 'ru' | 'en';

  return {
    title: post.title[typedLocale],
    description: post.excerpt[typedLocale],
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/blog/${slug}`,
      languages: {
        'en': `https://getlifeundo.com/en/blog/${slug}`,
        'ru': `https://getlifeundo.com/ru/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title[typedLocale],
      description: post.excerpt[typedLocale],
      type: 'article',
      publishedTime: post.date,
      url: `https://getlifeundo.com/${locale}/blog/${slug}`,
      images: [
        {
          url: `https://getlifeundo.com/og-blog-${slug}.png`,
          width: 1200,
          height: 630,
          alt: post.title[typedLocale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title[typedLocale],
      description: post.excerpt[typedLocale],
      images: [`https://getlifeundo.com/og-blog-${slug}.png`],
    },
  };
}

export default function BlogPostPage({ params: { locale, slug } }: Props) {
  const post = blogPosts[slug as keyof typeof blogPosts];
  
  if (!post) {
    notFound();
  }

  const typedLocale = locale as 'ru' | 'en';

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href={`/${locale}`} className="hover:text-gray-700">
                  {locale === 'ru' ? 'Главная' : 'Home'}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-gray-700">
                  {locale === 'ru' ? 'Блог' : 'Blog'}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{post.title[typedLocale]}</li>
            </ol>
          </nav>

          {/* Article header */}
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
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

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title[typedLocale]}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt[typedLocale]}
            </p>
          </header>

          {/* Article content */}
          <article className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: post.content[typedLocale] 
              }}
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-li:mb-2"
            />
          </article>

          {/* Navigation */}
          <nav className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {locale === 'ru' ? 'Назад к блогу' : 'Back to blog'}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                {locale === 'ru' ? 'Связаться с нами' : 'Contact us'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
