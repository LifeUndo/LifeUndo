'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    
    // Save to cookie
    document.cookie = `lang=${newLocale}; max-age=${365 * 24 * 60 * 60}; path=/`;
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md hover:bg-gray-100"
        aria-label="Language selector"
      >
        <span className="text-lg">🌐</span>
        <span className="uppercase">{locale}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={() => switchLanguage('ru')}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                locale === 'ru' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                locale === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}