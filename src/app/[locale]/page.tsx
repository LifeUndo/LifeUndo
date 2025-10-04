'use client';

import React from 'react';

export default function LocaleIndex({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            GetLifeUndo — Ctrl+Z для браузера
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Восстанавливайте случайно удаленные данные, закрытые вкладки и заполненные формы в браузере
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ru/downloads"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Скачать расширение
            </a>
            <a 
              href="/ru/pricing"
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Купить VIP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}