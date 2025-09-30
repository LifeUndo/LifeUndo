export default function FundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            Фонд GetLifeUndo
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
              <p className="text-gray-300 leading-relaxed">
                Фонд GetLifeUndo создан для поддержки проектов наших пользователей. 
                Мы верим, что каждый человек может внести вклад в развитие общества, 
                и готовы помочь в реализации ваших идей.
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Финансирование</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы выделяем <span className="text-purple-400 font-semibold">10%</span> от всех доходов 
                GetLifeUndo на поддержку проектов пользователей. Это наш способ вернуть 
                сообществу часть того, что оно дает нам.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Распределение средств</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">40%</div>
                <h3 className="text-lg font-semibold mb-2">Образование</h3>
                <p className="text-gray-300 text-sm">
                  Поддержка образовательных проектов, курсов и исследований
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">30%</div>
                <h3 className="text-lg font-semibold mb-2">Исследования</h3>
                <p className="text-gray-300 text-sm">
                  Финансирование научных исследований и инноваций
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">30%</div>
                <h3 className="text-lg font-semibold mb-2">Социальные проекты</h3>
                <p className="text-gray-300 text-sm">
                  Поддержка социально значимых инициатив
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Как подать заявку</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Подготовьте описание проекта</h3>
                  <p className="text-gray-300 text-sm">
                    Четко опишите цели, задачи и ожидаемые результаты вашего проекта
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Заполните форму заявки</h3>
                  <p className="text-gray-300 text-sm">
                    Укажите контактные данные и выберите подходящую категорию
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Дождитесь рассмотрения</h3>
                  <p className="text-gray-300 text-sm">
                    Мы рассмотрим вашу заявку в течение 5 рабочих дней
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/ru/fund/apply"
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Подать заявку в фонд
            </a>
          </div>
        </div>
    </div>
  );
}