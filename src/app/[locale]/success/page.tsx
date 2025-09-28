import Link from 'next/link';

export const metadata = { 
  title: "Платеж успешен — LifeUndo",
  description: "Ваш платеж обработан успешно. Спасибо за покупку LifeUndo!"
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Платеж успешно обработан!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Спасибо за покупку LifeUndo. Ваша лицензия активирована и готова к использованию.
          </p>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4">Что делать дальше:</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
                <p className="text-gray-700">Откройте расширение LifeUndo в браузере</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
                <p className="text-gray-700">Перейдите в настройки расширения</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
                <p className="text-gray-700">Введите лицензионный ключ (отправлен на email)</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
                <p className="text-gray-700">Наслаждайтесь всеми Pro функциями!</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/features" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Узнать о возможностях
            </Link>
            <Link 
              href="/support" 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Нужна помощь?
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Не получили email с лицензией? Проверьте папку "Спам" или
            </p>
            <a 
              href="mailto:support@lifeundo.ru" 
              className="text-blue-600 hover:underline text-sm"
            >
              напишите в поддержку
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Главная</Link>
            <Link href="/pricing" className="hover:text-gray-700">Цены</Link>
            <Link href="/features" className="hover:text-gray-700">Возможности</Link>
            <Link href="/support" className="hover:text-gray-700">Поддержка</Link>
            <Link href="/fund" className="hover:text-gray-700">Фонд</Link>
          </div>
        </div>
      </div>
    </main>
  );
}


