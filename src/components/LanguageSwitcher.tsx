'use client';

import { usePathname, useRouter } from 'next/navigation';

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

  const change = (code: string) => {
    const parts = pathname.split('/');
    parts[1] = code;
    router.push(parts.join('/'));
  };

  return (
    <div className="flex gap-2">
      {LOCALES.map(l => (
        <button 
          key={l.code} 
          onClick={() => change(l.code)}
          className="px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
