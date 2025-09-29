import GlassCard from '@/components/GlassCard';

export default function DownloadPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Скачать GetLifeUndo</h1>
      
      <GlassCard className="space-y-6">
        <p className="text-white/80">
          Расширение GetLifeUndo доступно для установки через официальные магазины расширений.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <a 
            className="btn btn-primary disabled:opacity-60 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center" 
            href="https://addons.mozilla.org/ru/firefox/addon/getlifeundo/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Firefox (AMO)
          </a>
          <button 
            className="btn btn-secondary px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-center" 
            disabled 
            title="Скоро"
          >
            Chrome Web Store — скоро
          </button>
        </div>

        <p className="text-xs opacity-70 mt-2">
          Если вы видите сообщение «дополнение повреждено», значит файл не подписан Mozilla. 
          Для обычной установки дождитесь публикации в AMO.
        </p>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-300 mb-2">Для разработчиков</h3>
          <p className="text-xs text-yellow-200">
            Для установки неподписанного расширения включите в about:config параметр 
            <code className="bg-black/20 px-1 rounded">xpinstall.signatures.required=false</code>
          </p>
        </div>
      </GlassCard>

      <div className="mt-8">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Системные требования</h3>
          <ul className="text-sm text-white/60 list-disc pl-5 space-y-1">
            <li>Firefox 91.0 или новее</li>
            <li>Windows 10/11, macOS 10.15+, Linux</li>
            <li>Разрешение на установку расширений из внешних источников</li>
          </ul>
        </GlassCard>
      </div>
    </section>
  );
}