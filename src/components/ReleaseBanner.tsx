'use client';

import { useState } from 'react';

export default function ReleaseBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-sky-600 text-white py-2 px-4 text-center relative">
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap pr-12">
        <span className="text-sm font-medium">
          🎉 Релиз 0.3.7.12 — новый платёжный поток, RU/EN локализация, мобильная оптимизация
        </span>
        <a 
          href="/ru/downloads" 
          className="text-white underline underline-offset-2 hover:text-gray-200 transition-colors"
        >
          Скачать
        </a>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors opacity-80 hover:opacity-100"
          aria-label="Закрыть баннер"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
