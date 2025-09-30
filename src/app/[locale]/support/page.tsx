export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          Поддержка
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-4">Известные проблемы</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-red-300">Платёж не прошёл</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Ограничения платёжного провайдера/банка при суммах &lt; 3000 ₽
                </p>
                <p className="text-gray-400 text-xs">
                  Решение: Повторить платёж, выбрать другой метод или Starter Bundle (6 мес за 3000 ₽)
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-300">Нет кнопки расширения</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Кнопка скрыта в тулбаре Firefox
                </p>
                <p className="text-gray-400 text-xs">
                  Решение: Firefox → Customize Toolbar → перетащить кнопку LifeUndo
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-300">Конфликт с uBlock/NoScript</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Запрет скриптов/доменов блокировщиками
                </p>
                <p className="text-gray-400 text-xs">
                  Решение: Добавить LifeUndo в исключения или разрешить необходимые домены
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Можно ли помесячно?</h3>
                <p className="text-gray-300 text-sm">
                  Да. Если плата не прошла — попробуйте снова или выберите Starter Bundle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Чем Pro отличается от Free?</h3>
                <p className="text-gray-300 text-sm">
                  Больше лимитов, функции команд и приоритетная поддержка.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Team-аккаунт?</h3>
                <p className="text-gray-300 text-sm">
                  5 мест включено, +490 ₽ за дополнительное место.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Статус сервисов</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <h3 className="font-semibold">Веб-сайт</h3>
              <p className="text-gray-300 text-sm">Работает нормально</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <h3 className="font-semibold">Расширение Firefox</h3>
              <p className="text-gray-300 text-sm">Работает нормально</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <h3 className="font-semibold">Платежи</h3>
              <p className="text-gray-300 text-sm">Работает нормально</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a 
              href="/status" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Подробный статус →
            </a>
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold mb-4">Связаться с нами</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Telegram</h3>
              <a 
                href="https://t.me/LifeUndoSupport" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                @LifeUndoSupport
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a 
                href="mailto:support@getlifeundo.com" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                support@getlifeundo.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}