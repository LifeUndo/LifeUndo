'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const LOCALES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ar', label: 'العربية' },
  { code: 'kk', label: 'KK' },
  { code: 'uz', label: 'UZ' },
  { code: 'az', label: 'AZ' },
];

export default function LanguageSwitcher() {
  // Вариант А: скрываем переключатель пока нет EN контента
  const hasEN = false; // TODO: включим когда будет контент
  if (!hasEN) return null;

  const router = useRouter();
  const pathname = usePathname() || '/ru';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = (() => {
    const seg = pathname.split('/')[1];
    return LOCALES.find(l => l.code === seg) ?? LOCALES[0];
  })();

  const change = (code: string) => {
    const parts = pathname.split('/');
    parts[1] = code;
    const next = parts.join('/') || `/${code}/`;
    setOpen(false);
    router.push(next);
  };

  // закрытие по клику вне
  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown, { passive: true });
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown as any);
      document.removeEventListener('touchstart', onDown as any);
    };
  }, []);

  // закрытие по Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // закрытие при скролле (особенно для iOS Safari)
  useEffect(() => {
    const onScroll = () => setOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // закрытие при смене маршрута
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className="relative">
      {/* Мобилка: одна кнопка с текущим языком */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="md:hidden px-2 py-1 rounded-md border border-white/10 bg-white/5 text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Выбор языка"
      >
        {current.label}
      </button>

      {/* Десктоп: ряд кнопок — как было */}
      <div className="hidden md:flex gap-2">
        {LOCALES.map(l => (
          <button
            key={l.code}
            onClick={() => change(l.code)}
            className={`px-2 py-1 rounded-md border border-white/10 text-sm transition-colors
              ${current.code === l.code ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Dropdown для мобилки — абсолютный, в пределах header, с нормальным z-index */}
      {open && (
        <div
          className="md:hidden absolute right-0 top-9 z-[60] min-w-[8rem]
                     bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-1
                     shadow-lg"
          role="listbox"
        >
          {LOCALES.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm
                ${current.code === l.code ? 'bg-white/10' : 'hover:bg-white/10'}`}
              role="option"
              aria-selected={current.code === l.code}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
