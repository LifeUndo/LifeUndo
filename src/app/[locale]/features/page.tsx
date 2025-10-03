import Head from "next/head";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>Возможности — GetLifeUndo</title>
        <meta name="description" content="Что умеет GetLifeUndo: расширенная история буфера обмена, восстановление закрытых вкладок и сессий, экспорт, безопасность и ещё десятки удобных функций." />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Возможности GetLifeUndo</h1>
          <p className="text-lg text-gray-300">
            «Ctrl+Z» для онлайн-жизни: восстанавливайте потерянный текст, вкладки, историю буфера,
            быстрые заметки и целые рабочие сессии — аккуратно и безопасно.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-3">Что входит в <span className="text-indigo-300">Pro</span></h2>
            <ul className="space-y-2 list-disc ml-5 text-gray-300">
              <li>История буфера обмена: до <strong>50</strong> последних элементов с быстрым поиском</li>
              <li>«Отмена» для закрытых вкладок и сессий</li>
              <li>Автосохранение полей ввода (формы, посты, комментарии)</li>
              <li>Экспорт данных (JSON/CSV), локальный бэкап</li>
              <li>Приоритетная поддержка</li>
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-3">Почему это безопасно</h2>
            <ul className="space-y-2 list-disc ml-5 text-gray-300">
              <li>Локальное хранение по умолчанию, шифрование при синхронизации</li>
              <li>Гранулярные разрешения: только то, что действительно нужно</li>
              <li>Опции авто-очистки и ручного удаления следов</li>
              <li>Прозрачная политика: никакой продажи данных</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl p-6 bg-white/5 border border-white/10 mb-12">
          <h2 className="text-xl font-semibold mb-3">Как начать</h2>
          <ol className="list-decimal ml-5 space-y-2 text-gray-300">
            <li>Установите расширение для браузера (Chrome / Firefox / Edge)</li>
            <li>Откройте настройки расширения и активируйте лицензию</li>
            <li>Включите автосохранение полей и историю буфера</li>
            <li>Проверьте «панель отмены» на часто используемых сайтах</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://chrome.google.com/webstore/detail/getlifeundo/placeholder" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors" target="_blank" rel="noopener noreferrer">
              Скачать для Chrome
            </a>
            <a href="https://addons.mozilla.org/firefox/addon/getlifeundo/" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition-colors" target="_blank" rel="noopener noreferrer">
              Для Firefox
            </a>
            <a href="https://microsoftedge.microsoft.com/addons/detail/getlifeundo/placeholder" className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
              Для Edge
            </a>
            <Link href="/ru/support" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-colors">
              Нужна помощь?
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Автосохранение форм</h3>
            <p className="text-gray-300">
              Защититесь от случайного обновления страницы и вылета браузера — текст не потеряется.
            </p>
          </div>
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Умная история</h3>
            <p className="text-gray-300">
              Фильтры по сайту, дате и типу: текст, ссылка, заметка, фрагмент.
            </p>
          </div>
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Экспорт & перенос</h3>
            <p className="text-gray-300">
              Выгрузите данные, перенесите профиль или создайте бэкап в один клик.
            </p>
          </div>
        </section>

        <footer className="text-center">
          <Link href="/ru/pricing" className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 inline-block transition-colors">
            Выбрать тариф
          </Link>
        </footer>
      </main>
    </>
  );
}
