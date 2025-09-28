import Link from 'next/link';

export default function ModernFooter() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/brand/getlifeundo-logo.svg" alt="LifeUndo" className="h-8" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Ctrl+Z для вашей онлайн-жизни. Восстанавливаем случайно удаленные данные на любых устройствах в любой точке мира.
            </p>
            
            {/* FreeKassa Badge */}
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/brand/freekassa-badge.svg" 
                alt="FreeKassa" 
                className="h-6 opacity-75 hover:opacity-100 transition-opacity"
              />
              <span className="text-sm text-gray-400">
                Оплата через FreeKassa
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href={process.env.NEXT_PUBLIC_TG_URL || "#"} 
                aria-label="Telegram" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <img src="/brand/tg.svg" alt="Telegram" className="w-6 h-6" />
              </a>
              <a 
                href={process.env.NEXT_PUBLIC_X_URL || "#"} 
                aria-label="X (Twitter)" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <img src="/brand/x.svg" alt="X" className="w-6 h-6" />
              </a>
              <a 
                href={process.env.NEXT_PUBLIC_YT_URL || "#"} 
                aria-label="YouTube" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <img src="/brand/yt.svg" alt="YouTube" className="w-6 h-6" />
              </a>
              <a 
                href={process.env.NEXT_PUBLIC_GH_URL || "#"} 
                aria-label="GitHub" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <img src="/brand/github.svg" alt="GitHub" className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Продукт</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Возможности</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Тарифы</Link></li>
              <li><Link href="/download" className="text-gray-400 hover:text-white transition-colors">Скачать</Link></li>
              <li><Link href="/use-cases" className="text-gray-400 hover:text-white transition-colors">Кейсы</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Компания</h3>
            <ul className="space-y-2">
              <li><Link href="/fund" className="text-gray-400 hover:text-white transition-colors">Фонд</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Поддержка</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Контакты</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Приватность</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Условия</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 LifeUndo. Все права защищены.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}