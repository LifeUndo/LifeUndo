'use client';

import { useState, useEffect } from 'react';

export default function ModernFooter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/LifeUndoSupport', icon: '📱' },
    { name: 'X (Twitter)', href: 'https://x.com/GetLifeUndo', icon: '🐦' },
    { name: 'Reddit', href: 'https://www.reddit.com/r/GetLifeUndo', icon: '🔴' },
    { name: 'YouTube', href: 'https://www.youtube.com/@GetLifeUndo', icon: '📺' },
    { name: 'VK', href: 'https://vk.com/GetLifeUndo', icon: '🔵' },
    { name: 'Dzen', href: 'https://dzen.ru/GetLifeUndo', icon: '🔍' },
    { name: 'Habr', href: 'https://habr.com/ru/users/GetLifeUndo', icon: '💻' },
    { name: 'vc.ru', href: 'https://vc.ru/u/GetLifeUndo', icon: '📊' },
    { name: 'TenChat', href: 'https://tenchat.ru/a/GetLifeUndo', icon: '💬' }
  ];

  const footerLinks = [
    { name: 'Сайт', href: '/' },
    { name: 'Приватность', href: '/privacy' },
    { name: 'Поддержка', href: '/support' },
    { name: 'Лицензия', href: '/license' }
  ];

  return (
    <footer className={`bg-gray-900 border-t border-gray-800 transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-white">LifeUndo</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ctrl+Z для вашей онлайн-жизни. Восстанавливаем любые удаленные данные на любых устройствах.
            </p>
            <div className="flex items-center space-x-2">
              <img 
                src="https://www.free-kassa.ru/img/fk_btn/16.png" 
                alt="FreeKassa" 
                className="h-6"
              />
              <span className="text-sm text-gray-400">Безопасные платежи</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Услуги</h3>
            <ul className="space-y-3">
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Тарифы</a></li>
              <li><a href="/fund" className="text-gray-400 hover:text-white transition-colors">Фонд</a></li>
              <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Поддержка</a></li>
              <li><a href="/download" className="text-gray-400 hover:text-white transition-colors">Скачать</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Компания</h3>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Приватность</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Условия</a></li>
              <li><a href="/license" className="text-gray-400 hover:text-white transition-colors">Лицензия</a></li>
              <li><a href="/contacts" className="text-gray-400 hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Социальные сети</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              <p>Email: <a href="mailto:support@getlifeundo.com" className="text-purple-400 hover:text-purple-300">support@getlifeundo.com</a></p>
              <p className="mt-2">Telegram: <a href="https://t.me/LifeUndoSupport" className="text-purple-400 hover:text-purple-300">@LifeUndoSupport</a></p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2023 LifeUndo. Все права защищены.
            </div>
            <div className="text-gray-400 text-sm">
              Мы отдаём 10% — GetLifeUndo Fund
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
