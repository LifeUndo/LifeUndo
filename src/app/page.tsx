import ModernHeader from '@/components/ModernHeader';
import ServiceCard from '@/components/ServiceCard';
import ModernFooter from '@/components/ModernFooter';

export default function HomePage() {
  const services = [
    {
      icon: '🆓',
      title: 'Free',
      description: 'Базовые возможности восстановления данных для личного использования',
      features: [
        'Восстановление вкладок',
        'Базовый буфер обмена',
        'Простое управление'
      ],
      price: '0 ₽',
      period: 'навсегда',
      ctaText: 'Скачать бесплатно',
      ctaLink: '/download'
    },
    {
      icon: '⭐',
      title: 'Pro',
      description: 'Расширенные возможности для активных пользователей',
      features: [
        'Все функции Free',
        'Расширенный буфер обмена',
        'Восстановление форм',
        'Приоритетная поддержка'
      ],
      price: '149 ₽',
      period: 'в месяц',
      ctaText: 'Оформить Pro',
      ctaLink: '/pricing'
    },
    {
      icon: '👑',
      title: 'VIP',
      description: 'Полный доступ ко всем функциям навсегда',
      features: [
        'Все функции Pro',
        'Безлимитные устройства',
        'Пожизненная лицензия',
        '10% в GetLifeUndo Fund',
        'Персональная поддержка'
      ],
      price: '2 490 ₽',
      period: 'навсегда',
      isPopular: true,
      ctaText: 'Купить VIP',
      ctaLink: '/pricing'
    },
    {
      icon: '👥',
      title: 'Team',
      description: 'Корпоративные решения для команд',
      features: [
        'Все функции VIP',
        'Централизованное управление',
        'Отчёты и аналитика',
        'White-label решения',
        'Dedicated поддержка'
      ],
      price: 'от 150 ₽',
      period: 'за место в месяц',
      ctaText: 'Запросить демо',
      ctaLink: 'mailto:support@getlifeundo.com'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Ctrl+Z для вашей онлайн-жизни
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Восстанавливаем любые удаленные данные на любых устройствах в любой точке мира
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/download"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Скачать расширение
              </a>
              <a
                href="/pricing"
                className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200"
              >
                Купить VIP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Что мы восстанавливаем
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📑</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Вкладки</h3>
              <p className="text-gray-400">Мгновенное восстановление случайно закрытых вкладок и окон браузера</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Буфер обмена</h3>
              <p className="text-gray-400">Полная история буфера обмена с возможностью восстановления любого элемента</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Формы и тексты</h3>
              <p className="text-gray-400">Восстановление введенного текста в любых формах, даже после сбоев</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Админка и Team</h3>
              <p className="text-gray-400">Расширенные возможности для команд и администраторов, контроль и аудит</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Наши тарифы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Fund Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Мы отдаём 10% — GetLifeUndo Fund
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Поддерживаем образование, UX и Open Source проекты. Финансирование распределяется ежеквартально.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">40%</div>
              <div className="text-gray-300">Образование</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">30%</div>
              <div className="text-gray-300">UX и доступность</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">30%</div>
              <div className="text-gray-300">Open Source</div>
            </div>
          </div>
          <a
            href="/fund"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Узнать больше о фонде
          </a>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}