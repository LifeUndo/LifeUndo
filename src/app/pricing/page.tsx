import ModernHeader from '@/components/ModernHeader';
import ServiceCard from '@/components/ServiceCard';
import ModernFooter from '@/components/ModernFooter';

export default function PricingPage() {
  const services = [
    {
      icon: '🆓',
      title: 'Free',
      description: 'Базовые возможности восстановления данных для личного использования',
      features: [
        'Восстановление вкладок',
        'Базовый буфер обмена',
        'Простое управление',
        'Поддержка сообщества'
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
        'Приоритетная поддержка',
        'Синхронизация между устройствами'
      ],
      price: '149 ₽',
      period: 'в месяц',
      ctaText: 'Оформить Pro',
      ctaLink: '/buy?plan=pro'
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
        'Персональная поддержка',
        'Ранний доступ к новым функциям'
      ],
      price: '2 490 ₽',
      period: 'навсегда',
      isPopular: true,
      ctaText: 'Купить VIP',
      ctaLink: '/buy?plan=vip'
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
        'Dedicated поддержка',
        'API доступ'
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Выберите свой план
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Начните бесплатно или выберите план, который подходит именно вам
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Можно ли изменить план позже?</h3>
              <p className="text-gray-300">Да, вы можете в любой момент перейти на другой план. При переходе на более дорогой план доплата рассчитывается пропорционально.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Что происходит с данными при отмене?</h3>
              <p className="text-gray-300">Ваши данные сохраняются в течение 30 дней после отмены подписки. После этого они удаляются в соответствии с нашей политикой конфиденциальности.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Есть ли скидки для студентов?</h3>
              <p className="text-gray-300">Да, мы предоставляем скидку 50% для студентов при предъявлении студенческого билета. Свяжитесь с нами для получения скидки.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Как работает возврат средств?</h3>
              <p className="text-gray-300">Мы предоставляем полный возврат средств в течение 14 дней после покупки, если вы не удовлетворены сервисом.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Присоединяйтесь к тысячам пользователей, которые уже используют LifeUndo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/download"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Скачать бесплатно
            </a>
            <a
              href="mailto:support@getlifeundo.com"
              className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}