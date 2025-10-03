import ModernHeader from '@/components/ModernHeader';
import ModernFooter from '@/components/ModernFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">
            Политика конфиденциальности
          </h1>
          
          <div className="glass-card p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
              <p className="text-gray-300 leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки персональных данных 
                пользователей сервиса GetLifeUndo. Мы серьезно относимся к защите вашей конфиденциальности 
                и обеспечиваем безопасность ваших данных.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Сбор информации</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы собираем только необходимую информацию для предоставления наших услуг:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Email адрес для регистрации и уведомлений</li>
                <li>Информация о браузере и устройстве</li>
                <li>Данные об использовании расширения</li>
                <li>Платежная информация (обрабатывается через защищенные PSP)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Использование данных</h2>
              <p className="text-gray-300 leading-relaxed">
                Ваши данные используются исключительно для:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Предоставления услуг GetLifeUndo</li>
                <li>Обработки платежей и подписок</li>
                <li>Отправки важных уведомлений</li>
                <li>Улучшения качества сервиса</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Защита данных</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы применяем современные методы защиты данных:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Шифрование данных при передаче и хранении</li>
                <li>Регулярные аудиты безопасности</li>
                <li>Ограниченный доступ к персональным данным</li>
                <li>Соответствие международным стандартам безопасности</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Ваши права</h2>
              <p className="text-gray-300 leading-relaxed">
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Получить информацию о ваших данных</li>
                <li>Исправить неточную информацию</li>
                <li>Удалить ваши данные</li>
                <li>Ограничить обработку данных</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Контакты</h2>
              <p className="text-gray-300 leading-relaxed">
                По вопросам конфиденциальности: <a href="mailto:privacy@getlifeundo.com">privacy@getlifeundo.com</a> ·
                Быстрая связь: <a href="https://t.me/GetLifeUndoSupport" target="_blank" rel="noopener noreferrer">t.me/GetLifeUndoSupport</a>
              </p>
            </section>

            <div className="text-sm text-gray-400 mt-8 pt-6 border-t border-white/10">
              <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}