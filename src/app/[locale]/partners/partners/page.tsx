import React from 'react';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            White-label / OEM
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Брендируйте GetLifeUndo под вашу компанию
          </p>
          
          {/* B2B Disclaimer */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 font-semibold">
              Для организаций от <strong>100 VIP-подписок</strong>. Предоставляем шаблоны документов по запросу.
            </p>
          </div>
          
          {/* TXT Templates Button */}
          <div className="text-center mb-8">
            <a 
              href="/ru/legal/downloads"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📄 Скачать .TXT-шаблоны
            </a>
          </div>
        </div>

        {/* White-label Packages */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">Пакеты White-label</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* WL-Starter */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Starter</h3>
              <div className="text-2xl font-bold text-green-400 mb-4">100 VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Брендинг + страница скачивания</li>
                <li>• Единый ключ лицензии</li>
                <li>• Базовые настройки</li>
                <li>• Email поддержка</li>
              </ul>
            </div>

            {/* WL-Pro */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Pro</h3>
              <div className="text-2xl font-bold text-blue-400 mb-4">250 VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Отдельный сабдомен</li>
                <li>• Телеметрия по ключам</li>
                <li>• SLA 99.9%</li>
                <li>• Приоритетная поддержка</li>
              </ul>
            </div>

            {/* WL-Enterprise */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Enterprise</h3>
              <div className="text-2xl font-bold text-purple-400 mb-4">1000+ VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Выделенный билд</li>
                <li>• Приватный CDN</li>
                <li>• Кастомные политики</li>
                <li>• Персональный менеджер</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Процесс</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>1. Бриф</strong> → обсуждение требований и технических деталей</p>
              <p><strong>2. Макет</strong> → создание дизайна и брендинга</p>
              <p><strong>3. Тестовый билд</strong> → private AMO/unlisted для тестирования</p>
              <p><strong>4. Пилот</strong> → ограниченное тестирование с командой</p>
              <p><strong>5. Прод</strong> → запуск в продакшн</p>
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Модель</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Разовая настройка (setup fee)</li>
              <li>• Подписка: помесячно по числу мест (Team/Org)</li>
              <li>• Юридические лица: оплата по счёту (оферта ниже)</li>
            </ul>
          </div>
        </div>

        {/* Onboarding */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Онбординг (3 шага)</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Бриф</h3>
                  <p className="text-gray-300">Логотипы, цвета, домен</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Техническая сборка и тест</h3>
                  <p className="text-gray-300">1–3 дня</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Подписание оферты / доступ к отчётам</h3>
                  <p className="text-gray-300">Юридическое оформление</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Получить бриф и расчёт
          </a>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              Это шаблон. Не является публичной офертой. Финальная версия предоставляется по запросу и подписывается сторонами.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}