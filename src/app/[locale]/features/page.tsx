import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'features' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://getlifeundo.com/${locale}/features`,
      languages: {
        'en': 'https://getlifeundo.com/en/features',
        'ru': 'https://getlifeundo.com/ru/features',
      },
    },
  };
}

export default function FeaturesPage({ params: { locale } }: Props) {
  const t = useTranslations('features');

  const features = [
    {
      icon: '📝',
      title: locale === 'ru' ? 'Восстановление ввода текста' : 'Text Input Recovery',
      description: locale === 'ru' 
        ? 'Автоматически сохраняет текст, который вы вводите в формы, текстовые поля и комментарии. Если страница перезагрузится или вы случайно закроете вкладку, ваш текст не будет потерян.'
        : 'Automatically saves text you type in forms, text fields, and comments. If the page reloads or you accidentally close the tab, your text won\'t be lost.',
      demo: 'Screenshot placeholder: Form with saved text'
    },
    {
      icon: '📋',
      title: locale === 'ru' ? 'История буфера обмена' : 'Clipboard History',
      description: locale === 'ru' 
        ? 'Сохраняет историю всех скопированных текстов и ссылок. Быстро находите и вставляйте ранее скопированный контент.'
        : 'Saves history of all copied texts and links. Quickly find and paste previously copied content.',
      demo: 'Screenshot placeholder: Clipboard history list'
    },
    {
      icon: '🔗',
      title: locale === 'ru' ? 'Недавно закрытые вкладки' : 'Recently Closed Tabs',
      description: locale === 'ru' 
        ? 'Показывает список недавно закрытых вкладок и окон. Быстро возвращайтесь к важным страницам.'
        : 'Shows list of recently closed tabs and windows. Quickly return to important pages.',
      demo: 'Screenshot placeholder: Recently closed tabs'
    },
    {
      icon: '📸',
      title: locale === 'ru' ? 'Быстрые скриншоты' : 'Quick Screenshots',
      description: locale === 'ru' 
        ? 'Делайте скриншоты текущей вкладки по кнопке или горячей клавише Ctrl+Shift+U. Все скриншоты сохраняются локально.'
        : 'Take screenshots of current tab with button or hotkey Ctrl+Shift+U. All screenshots saved locally.',
      demo: 'Screenshot placeholder: Screenshot interface'
    },
    {
      icon: '🌐',
      title: locale === 'ru' ? 'Локализация' : 'Localization',
      description: locale === 'ru' 
        ? 'Полная поддержка русского и английского языков. Интерфейс автоматически адаптируется под язык браузера.'
        : 'Full support for Russian and English languages. Interface automatically adapts to browser language.',
      demo: 'Screenshot placeholder: Language switcher'
    },
    {
      icon: '🔒',
      title: locale === 'ru' ? 'Приватность' : 'Privacy',
      description: locale === 'ru' 
        ? 'Все данные хранятся локально на вашем устройстве. Никаких облачных синхронизаций, никакой телеметрии.'
        : 'All data stored locally on your device. No cloud sync, no telemetry.',
      demo: 'Screenshot placeholder: Privacy settings'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Demo:</p>
                  <div className="bg-white rounded border p-3 text-xs text-gray-400">
                    {feature.demo}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Use Cases Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {locale === 'ru' ? 'Кейсы использования' : 'Use Cases'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Формы и регистрация' : 'Forms and Registration'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {locale === 'ru' 
                    ? 'Заполняете длинную форму регистрации? GetLifeUndo сохранит ваш прогресс, даже если что-то пойдёт не так.'
                    : 'Filling out a long registration form? GetLifeUndo saves your progress even if something goes wrong.'
                  }
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{locale === 'ru' ? 'Автосохранение ввода' : 'Auto-save input'}</li>
                  <li>{locale === 'ru' ? 'Восстановление после перезагрузки' : 'Recovery after reload'}</li>
                  <li>{locale === 'ru' ? 'Защита от случайного закрытия' : 'Protection from accidental close'}</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Исследования и работа' : 'Research and Work'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {locale === 'ru' 
                    ? 'Работаете с множеством вкладок и копируете информацию? GetLifeUndo поможет не потерять важные данные.'
                    : 'Working with many tabs and copying information? GetLifeUndo helps you not lose important data.'
                  }
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{locale === 'ru' ? 'История буфера обмена' : 'Clipboard history'}</li>
                  <li>{locale === 'ru' ? 'Быстрый доступ к закрытым вкладкам' : 'Quick access to closed tabs'}</li>
                  <li>{locale === 'ru' ? 'Скриншоты для документации' : 'Screenshots for documentation'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}