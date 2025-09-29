export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8">
          Условия использования
        </h1>
        
        <div className="glass-card p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-gray-300 leading-relaxed">
              Настоящие Условия использования регулируют отношения между пользователями 
              и сервисом GetLifeUndo. Используя наш сервис, вы соглашаетесь с данными условиями.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Описание сервиса</h2>
            <p className="text-gray-300 leading-relaxed">
              GetLifeUndo — это расширение для браузера Firefox, которое позволяет восстанавливать 
              случайно закрытые вкладки и управлять историей браузера. Сервис предоставляется 
              "как есть" без гарантий.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Регистрация и аккаунт</h2>
            <p className="text-gray-300 leading-relaxed">
              Для использования полного функционала требуется регистрация. Вы обязуетесь:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Предоставлять достоверную информацию</li>
              <li>Поддерживать актуальность данных</li>
              <li>Нести ответственность за безопасность аккаунта</li>
              <li>Не передавать доступ третьим лицам</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Платные услуги</h2>
            <p className="text-gray-300 leading-relaxed">
              Некоторые функции доступны по подписке:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Pro план: 599 ₽/месяц или 5,990 ₽/год</li>
              <li>VIP план: 9,990 ₽ (пожизненный доступ)</li>
              <li>Team план: 2,990 ₽/месяц за 5 пользователей</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Подписка продлевается автоматически. Отменить можно в любой момент до списания.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Ограничения использования</h2>
            <p className="text-gray-300 leading-relaxed">
              Запрещается:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Использовать сервис в незаконных целях</li>
              <li>Нарушать работу сервиса</li>
              <li>Пытаться получить несанкционированный доступ</li>
              <li>Распространять вредоносное ПО</li>
              <li>Нарушать права интеллектуальной собственности</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Ответственность</h2>
            <p className="text-gray-300 leading-relaxed">
              Мы не несем ответственности за:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Потерю данных пользователей</li>
              <li>Временные сбои в работе сервиса</li>
              <li>Действия третьих лиц</li>
              <li>Ущерб от использования сервиса</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Изменения условий</h2>
            <p className="text-gray-300 leading-relaxed">
              Мы оставляем за собой право изменять данные условия. 
              О существенных изменениях мы уведомим пользователей за 30 дней 
              до вступления в силу новых условий.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Контакты</h2>
              <p className="text-gray-300 leading-relaxed">
                Вопросы по условиям: <a href="mailto:legal@getlifeundo.com">legal@getlifeundo.com</a> ·
                Быстрая связь: <a href="https://t.me/LifeUndoRU" target="_blank" rel="noopener noreferrer">t.me/LifeUndoRU</a>
              </p>
          </section>

          <div className="text-sm text-gray-400 mt-8 pt-6 border-t border-white/10">
            <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}