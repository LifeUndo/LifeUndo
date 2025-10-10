import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'license' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/license`,
      languages: {
        'en': 'https://getlifeundo.com/en/license',
        'ru': 'https://getlifeundo.com/ru/license',
      },
    },
  };
}

export default function LicensePage({ params: { locale } }: Props) {
  const t = useTranslations('license');

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

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'ru' ? 'Лицензионное соглашение GetLifeUndo' : 'GetLifeUndo License Agreement'}
              </h2>
              
              <p className="text-gray-700 mb-6">
                {locale === 'ru' 
                  ? 'Настоящее лицензионное соглашение регулирует использование программного обеспечения GetLifeUndo.'
                  : 'This license agreement governs the use of GetLifeUndo software.'
                }
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '1. Предоставление лицензии' : '1. License Grant'}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === 'ru' 
                  ? 'Вам предоставляется неисключительная, не передаваемая лицензия на использование GetLifeUndo в соответствии с условиями настоящего соглашения.'
                  : 'You are granted a non-exclusive, non-transferable license to use GetLifeUndo in accordance with the terms of this agreement.'
                }
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '2. Разрешённое использование' : '2. Permitted Use'}
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>
                  {locale === 'ru' 
                    ? 'Установка и использование GetLifeUndo на ваших устройствах'
                    : 'Install and use GetLifeUndo on your devices'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Восстановление и управление локально сохранёнными данными'
                    : 'Recovery and management of locally saved data'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Использование в личных и коммерческих целях'
                    : 'Use for personal and commercial purposes'
                  }
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '3. Ограничения' : '3. Restrictions'}
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>
                  {locale === 'ru' 
                    ? 'Запрещается обратная инженерия, декомпиляция или дизассемблирование'
                    : 'No reverse engineering, decompilation, or disassembly'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Запрещается распространение без письменного разрешения'
                    : 'No distribution without written permission'
                  }
                </li>
                <li>
                  {locale === 'ru' 
                    ? 'Запрещается использование в незаконных целях'
                    : 'No use for illegal purposes'
                  }
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '4. Приватность и данные' : '4. Privacy and Data'}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === 'ru' 
                  ? 'GetLifeUndo хранит все данные локально на вашем устройстве. Никакие данные не передаются третьим лицам без вашего явного согласия.'
                  : 'GetLifeUndo stores all data locally on your device. No data is transmitted to third parties without your explicit consent.'
                }
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '5. Отказ от гарантий' : '5. Disclaimer of Warranties'}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === 'ru' 
                  ? 'Программное обеспечение предоставляется "как есть" без каких-либо гарантий. Мы не гарантируем, что GetLifeUndo будет работать без ошибок.'
                  : 'Software is provided "as is" without any warranties. We do not guarantee that GetLifeUndo will work without errors.'
                }
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '6. Ограничение ответственности' : '6. Limitation of Liability'}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === 'ru' 
                  ? 'В максимальной степени, разрешённой законом, мы не несём ответственности за любые косвенные, случайные или последующие убытки.'
                  : 'To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages.'
                }
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? '7. Изменения соглашения' : '7. Agreement Changes'}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === 'ru' 
                  ? 'Мы оставляем за собой право изменять условия настоящего соглашения. Продолжение использования GetLifeUndo после изменений означает согласие с новыми условиями.'
                  : 'We reserve the right to modify the terms of this agreement. Continued use of GetLifeUndo after changes constitutes agreement to new terms.'
                }
              </p>

              <div className="border-t border-gray-200 pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  {locale === 'ru' 
                    ? 'Последнее обновление: 7 октября 2025'
                    : 'Last updated: October 7, 2025'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {locale === 'ru' 
                    ? 'По вопросам лицензирования обращайтесь: legal@getlifeundo.com'
                    : 'For licensing questions contact: legal@getlifeundo.com'
                  }
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'ru' ? 'Уведомление о приватности' : 'Privacy Notice'}
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  {locale === 'ru' 
                    ? 'GetLifeUndo разработан с принципом "приватность по умолчанию". Все функции работают локально, без передачи данных в интернет.'
                    : 'GetLifeUndo is designed with "privacy by default" principle. All features work locally without transmitting data to the internet.'
                  }
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {locale === 'ru' ? 'Что мы НЕ собираем:' : 'What we do NOT collect:'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>{locale === 'ru' ? 'Персональные данные' : 'Personal data'}</li>
                    <li>{locale === 'ru' ? 'Историю браузера' : 'Browser history'}</li>
                    <li>{locale === 'ru' ? 'Телеметрию' : 'Telemetry'}</li>
                    <li>{locale === 'ru' ? 'Аналитику использования' : 'Usage analytics'}</li>
                    <li>{locale === 'ru' ? 'IP-адреса' : 'IP addresses'}</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {locale === 'ru' ? 'Что хранится локально:' : 'What is stored locally:'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>{locale === 'ru' ? 'Текст введённый в формы' : 'Text entered in forms'}</li>
                    <li>{locale === 'ru' ? 'История буфера обмена' : 'Clipboard history'}</li>
                    <li>{locale === 'ru' ? 'Список недавно закрытых вкладок' : 'Recently closed tabs list'}</li>
                    <li>{locale === 'ru' ? 'Скриншоты (по запросу)' : 'Screenshots (on request)'}</li>
                    <li>{locale === 'ru' ? 'Настройки языка' : 'Language settings'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Вопросы по лицензии?' : 'License Questions?'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ru' 
                  ? 'Если у вас есть вопросы по лицензионному соглашению, свяжитесь с нами.'
                  : 'If you have questions about the license agreement, please contact us.'
                }
              </p>
              <a
                href="/contact"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {locale === 'ru' ? 'Связаться с нами' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}