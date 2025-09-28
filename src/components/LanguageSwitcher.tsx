'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const LOCALES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ar', label: 'العربية' },
  { code: 'kk', label: 'KK' },
  { code: 'uz', label: 'UZ' },
  { code: 'az', label: 'AZ' }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = pathname.split('/')[1] || 'ru';
  const currentLabel = LOCALES.find(l => l.code === currentLocale)?.label || 'RU';

  const change = (code: string) => {
    const parts = pathname.split('/');
    parts[1] = code;
    router.push(parts.join('/'));
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop view - always visible */}
      <div className="hidden md:flex gap-1">
        {LOCALES.map(l => (
          <button 
            key={l.code} 
            onClick={() => change(l.code)}
            className={`px-2 py-1 rounded-md border transition-colors text-xs ${
              l.code === currentLocale 
                ? 'border-purple-400 bg-purple-400/20 text-purple-300' 
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Mobile view - dropdown */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs"
        >
          {currentLabel}
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-gray-900 border border-white/10 rounded-md shadow-lg z-50 min-w-[120px]">
            {LOCALES.map(l => (
              <button
                key={l.code}
                onClick={() => change(l.code)}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors first:rounded-t-md last:rounded-b-md ${
                  l.code === currentLocale ? 'text-purple-300 bg-purple-400/20' : ''
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
