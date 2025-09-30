import Link from 'next/link';

interface ModernFooterProps {
  locale?: string;
}

export default function ModernFooter({ locale = 'ru' }: ModernFooterProps) {
  const nav = [
    { title: 'Возможности', href: `/${locale}/features` },
    { title: 'Тарифы', href: `/${locale}/pricing` },
    { title: 'Скачать', href: `/${locale}/download` },
    { title: 'Кейсы', href: `/${locale}/use-cases` },
  ];

  const company = [
    { title: 'Фонд', href: `/${locale}/fund` },
    { title: 'Поддержка', href: `/${locale}/support` },
    { title: 'Контакты', href: `/${locale}/contacts` },
    { title: 'Приватность', href: `/${locale}/privacy` },
    { title: 'Условия', href: `/${locale}/terms` },
  ];

  const socials = [
    { name: 'Telegram', href: 'https://t.me/LifeUndoSupport', icon: '/brand/tg.svg' },
    { name: 'X', href: 'https://x.com/GetLifeUndo', icon: '/brand/x.svg' },
    { name: 'YouTube', href: 'https://www.youtube.com/@GetLifeUndo', icon: '/brand/yt.svg' },
    { name: 'GitHub', href: 'https://github.com/LifeUndo', icon: '/brand/github.svg' },
    { name: 'VC.ru', href: 'https://vc.ru/id5309084', icon: '/brand/vc.svg' },
    { name: 'Reddit', href: 'https://www.reddit.com/user/LifeUndo/', icon: '/brand/reddit.svg' },
    { name: 'Habr', href: 'https://habr.com', icon: '/brand/habr.svg' },
    { name: 'TenChat', href: 'https://tenchat.ru/', icon: '/brand/tenchat.svg' },
  ];
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/brand/getlifeundo-round.png" alt="GetLifeUndo" className="h-8 w-8 rounded-full" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Ctrl+Z для вашей онлайн-жизни. Восстанавливаем случайно удаленные данные на любых устройствах в любой точке мира.
            </p>
            
            {/* FreeKassa Badge */}
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://cdn.freekassa.net/banners/fk-badge-ru.svg" 
                alt="FreeKassa" 
                className="h-6 opacity-75 hover:opacity-100 transition-opacity"
              />
              <span className="text-sm text-gray-400">
                Оплата через FreeKassa
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 flex-wrap">
              {socials.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  aria-label={social.name} 
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={social.icon} alt={social.name} className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Продукт</h3>
            <ul className="space-y-2">
              {nav.map(item => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Компания</h3>
            <ul className="space-y-2">
              {company.map(item => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 GetLifeUndo. Все права защищены.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white text-sm transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white text-sm transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}