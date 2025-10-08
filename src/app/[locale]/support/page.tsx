import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'support' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/support`,
      languages: {
        'en': 'https://getlifeundo.com/en/support',
        'ru': 'https://getlifeundo.com/ru/support',
      },
    },
  };
}

export default function SupportPage({ params: { locale } }: Props) {
  const t = useTranslations('support');

  const faqs = [
    {
      question: locale === 'ru' ? 'Как установить GetLifeUndo?' : 'How to install GetLifeUndo?',
      answer: locale === 'ru' 
        ? 'Перейдите на страницу "Скачать" и нажмите "Получить на AMO". Расширение будет установлено автоматически.'
        : 'Go to the "Downloads" page and click "Get on AMO". The extension will be installed automatically.'
    },
    {
      question: locale === 'ru' ? 'Безопасно ли расширение?' : 'Is the extension safe?',
      answer: locale === 'ru' 
        ? 'Да, GetLifeUndo полностью безопасен. Все данные хранятся локально на вашем устройстве, никаких облачных синхронизаций.'
        : 'Yes, GetLifeUndo is completely safe. All data is stored locally on your device, no cloud synchronization.'
    },
    {
      question: locale === 'ru' ? 'Почему не сохраняются данные на некоторых сайтах?' : 'Why don\'t data save on some websites?',
      answer: locale === 'ru' 
        ? 'Некоторые сайты (about:, moz-extension:, AMO) защищены от записи данных. Это нормальное поведение для безопасности.'
        : 'Some websites (about:, moz-extension:, AMO) are protected from data writing. This is normal behavior for security.'
    },
    {
      question: locale === 'ru' ? 'Как изменить язык интерфейса?' : 'How to change interface language?',
      answer: locale === 'ru' 
        ? 'Нажмите на глобус 🌐 в правом верхнем углу popup и выберите RU или EN.'
        : 'Click the globe 🌐 in the top right corner of the popup and select RU or EN.'
    },
    {
      question: locale === 'ru' ? 'Где хранятся мои данные?' : 'Where are my data stored?',
      answer: locale === 'ru' 
        ? 'Все данные хранятся в локальном хранилище Firefox. Никакие данные не передаются в интернет.'
        : 'All data is stored in Firefox\'s local storage. No data is transmitted to the internet.'
    },
    {
      question: locale === 'ru' ? 'Как очистить сохранённые данные?' : 'How to clear saved data?',
      answer: locale === 'ru' 
        ? 'В popup расширения нажмите кнопки "Очистить" под соответствующими разделами.'
        : 'In the extension popup, click the "Clear" buttons under the respective sections.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 rounded-lg p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {locale === 'ru' ? 'Связаться с нами' : 'Contact Us'}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">📧</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">legal@getlifeundo.com</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {locale === 'ru' 
                          ? 'Для технической поддержки'
                          : 'For technical support'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">🕒</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Время ответа' : 'Response Time'}
                      </h3>
                      <p className="text-gray-600">
                        {locale === 'ru' ? '24-48 часов' : '24-48 hours'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">🌐</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Языки' : 'Languages'}
                      </h3>
                      <p className="text-gray-600">Русский, English</p>
                    </div>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-center block hover:bg-blue-700 transition-colors"
                >
                  {locale === 'ru' ? 'Написать письмо' : 'Send Email'}
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {locale === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}
              </h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Troubleshooting */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {locale === 'ru' ? 'Решение проблем' : 'Troubleshooting'}
                </h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Расширение не работает' : 'Extension not working'}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>{locale === 'ru' ? 'Перезагрузите Firefox' : 'Restart Firefox'}</li>
                    <li>{locale === 'ru' ? 'Проверьте, что расширение включено' : 'Check that extension is enabled'}</li>
                    <li>{locale === 'ru' ? 'Обновите до последней версии' : 'Update to latest version'}</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Данные не сохраняются' : 'Data not saving'}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>{locale === 'ru' ? 'Убедитесь, что вы не на защищённой странице' : 'Make sure you\'re not on a protected page'}</li>
                    <li>{locale === 'ru' ? 'Проверьте разрешения расширения' : 'Check extension permissions'}</li>
                    <li>{locale === 'ru' ? 'Очистите кеш браузера' : 'Clear browser cache'}</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Производительность' : 'Performance'}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>{locale === 'ru' ? 'Ограничьте количество сохранённых элементов' : 'Limit number of saved items'}</li>
                    <li>{locale === 'ru' ? 'Регулярно очищайте старые данные' : 'Regularly clear old data'}</li>
                    <li>{locale === 'ru' ? 'Закройте неиспользуемые вкладки' : 'Close unused tabs'}</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}