'use client';

import Link from 'next/link';

export default function FreeKassaBanner() {
  return (
    <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <img
            src="https://cdn.freekassa.net/banners/fk-badge-ru.svg"
            alt="FreeKassa"
            className="h-12 w-auto"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-semibold text-white mb-2">
            Безопасная оплата через FreeKassa
          </h3>
          <p className="text-gray-300 mb-4">
            Принимаем карты, электронные деньги и другие способы оплаты. 
            Все платежи защищены современными методами шифрования.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              href="/ru/pricing"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Посмотреть тарифы
            </Link>
            <a
              href="https://freekassa.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-purple-500/30 hover:border-purple-500 text-purple-300 hover:text-purple-200 rounded-lg font-medium transition-colors"
            >
              Узнать больше о FreeKassa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
