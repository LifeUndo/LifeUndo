'use client';

import { useState, useEffect } from 'react';

interface LatestData {
  version: string;
  publishedAt: string;
  files: {
    firefox?: string;
    win?: string;
    mac?: string;
  };
}

export default function ReleaseBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем latest.json с версионированием для обхода кэша
    const buildId = Date.now();
    fetch(`/app/latest/latest.json?v=${buildId}`)
      .then(res => res.json())
      .then(data => {
        setLatestData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback если файл недоступен
        setLatestData({
          version: '0.3.7.15',
          publishedAt: '2025-10-05T18:00:00Z',
          files: {
            firefox: "https://addons.mozilla.org/firefox/addon/lifeundo/"
          }
        });
        setLoading(false);
      });
  }, []);

  if (!isVisible || loading) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-sky-600 text-white py-2 px-4 text-center relative">
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap pr-12">
        <span className="text-sm font-medium">
          🎉 Релиз {latestData?.version} — новый платёжный поток, RU/EN локализация, мобильная оптимизация
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
