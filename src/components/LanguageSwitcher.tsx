'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath, SUPPORTED, type Locale } from "@/utils/i18nPath";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] as Locale || 'ru';
  
  const localeNames = {
    en: 'English',
    ru: 'Русский', 
    hi: 'हिन्दी',
    zh: '中文',
    ar: 'العربية',
    kk: 'Қазақша',
    tr: 'Türkçe'
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
        title="Select language"
      >
        <span className="text-lg">🌐</span>
        <span className="text-sm font-medium">{currentLocale.toUpperCase()}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-white/20 rounded-lg shadow-lg z-50 min-w-[160px]">
          {SUPPORTED.map(locale => (
            <Link
              key={locale}
              href={switchLocalePath(pathname, locale)}
              className={`block px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                locale === currentLocale 
                  ? "bg-white/10 text-white" 
                  : "text-gray-300"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {localeNames[locale]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}