'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ru';

  const footerLinks = [
    { name: t('website'), href: `/${locale}` },
    { name: t('downloads'), href: `/${locale}/downloads` },
    { name: t('support'), href: `/${locale}/support` },
    { name: t('contact'), href: `/${locale}/contact` },
    { name: t('privacy'), href: `/${locale}/privacy` },
    { name: t('license'), href: `/${locale}/license` },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🔄</div>
              <span className="text-xl font-bold">GetLifeUndo</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {locale === 'ru' 
                ? 'Ctrl+Z для онлайн жизни. Восстанавливайте потерянные данные, историю буфера обмена и недавно закрытые вкладки.'
                : 'Ctrl+Z for online life. Restore lost data, clipboard history, and recently closed tabs.'
              }
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/getlifeundo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/getlifeundo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Mozilla Add-ons"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  <path d="M8.5 12c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'ru' ? 'Контакты' : 'Contact'}
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:legal@getlifeundo.com"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                legal@getlifeundo.com
              </a>
              <p className="text-gray-400 text-sm">
                {locale === 'ru' 
                  ? 'Техническая поддержка'
                  : 'Technical support'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 GetLifeUndo. {locale === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              {locale === 'ru' 
                ? 'Сделано с ❤️ для приватности пользователей'
                : 'Made with ❤️ for user privacy'
              }
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}