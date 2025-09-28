import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';

export const metadata = {
  title: 'Политика конфиденциальности — LifeUndo',
  description: 'Как мы обрабатываем данные пользователей LifeUndo.',
  alternates: { canonical: 'https://lifeundo.ru/privacy' }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <ModernHeader />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-gray-300">
              Как мы обрабатываем ваши персональные данные
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Общие положения</h2>
              <p className="text-gray-300 leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сервиса LifeUndo (далее — «Сервис»).
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Используя наш Сервис, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Какие данные мы собираем</h2>
              <h3 className="text-xl font-medium mb-3 text-blue-300">2.1 Персональные данные</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Email адрес</strong> — для создания аккаунта и отправки ключей лицензии</li>
                <li><strong>Платежная информация</strong> — обрабатывается через FreeKassa, мы не храним данные карт</li>
                <li><strong>IP адрес</strong> — для обеспечения безопасности и аналитики</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-blue-300">2.2 Технические данные</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Информация о браузере и устройстве</li>
                <li>Данные о восстановленных файлах (локально на вашем устройстве)</li>
                <li>Логи использования функций Сервиса</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Как мы используем ваши данные</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Предоставление услуг восстановления данных</li>
                <li>Отправка ключей лицензии и уведомлений</li>
                <li>Улучшение качества Сервиса</li>
                <li>Обеспечение безопасности и предотвращение мошенничества</li>
                <li>Соблюдение правовых обязательств</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Передача данных третьим лицам</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Платежных систем (FreeKassa) — для обработки платежей</li>
                <li>Провайдеров услуг — для технической поддержки Сервиса</li>
                <li>Правовых требований — при необходимости соблюдения закона</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Защита данных</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Мы применяем современные методы защиты данных:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Шифрование данных при передаче (HTTPS)</li>
                <li>Безопасное хранение на защищенных серверах</li>
                <li>Ограниченный доступ к персональным данным</li>
                <li>Регулярное обновление систем безопасности</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Ваши права</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Получить информацию о ваших данных</li>
                <li>Исправить неточные данные</li>
                <li>Удалить ваши данные</li>
                <li>Ограничить обработку данных</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Контакты</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                По вопросам обработки персональных данных обращайтесь:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Email: <a href="mailto:legal@getlifeundo.com" className="text-purple-400 hover:text-purple-300">legal@getlifeundo.com</a></li>
                <li>Telegram: <a href="https://t.me/LifeUndoSupport" className="text-purple-400 hover:text-purple-300">@LifeUndoSupport</a></li>
              </ul>
            </section>

            <div className="bg-gray-700/50 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-400 text-center">
                <strong>Важно:</strong> Данная Политика конфиденциальности не является юридической консультацией. При возникновении вопросов обращайтесь к квалифицированному юристу.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ModernFooter />
    </div>
  );
}
