'use client';

import { useState } from 'react';

export default function ReleaseBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 text-center relative">
      <div className="container mx-auto flex items-center justify-center">
        <span className="text-sm font-medium">
          🎉 Релиз 0.3.7.12 — новый платёжный поток, RU/EN локализация, мобильная оптимизация
        </span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Закрыть баннер"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
