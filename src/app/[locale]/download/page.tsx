import GlassCard from '@/components/GlassCard';

export default function DownloadPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Скачать LifeUndo</h1>
      
      <GlassCard className="space-y-4">
        <p className="text-white/80">
          Расширение распространяется напрямую. Файл подписан Mozilla (AMO), но публичной витрины нет.
        </p>

        {/* Unlisted/self-hosted вариант */}
        <a
          className="inline-block px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-opacity"
          href="/downloads/lifeundo-0.3.7.12.xpi"
        >
          Скачать .xpi (Firefox)
        </a>

        <ul className="text-sm text-white/60 list-disc pl-5 space-y-1">
          <li>Откройте файл в Firefox для установки.</li>
          <li>Если блокируется — проверьте настройки разрешений установки расширений.</li>
          <li>После установки расширение появится в списке дополнений Firefox.</li>
        </ul>
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