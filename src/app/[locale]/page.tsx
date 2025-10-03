export default function LocaleIndex() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">GetLifeUndo</h1>
        <p className="text-xl mb-8">Расширение для отката действий в сети</p>
        <a 
          href="/ru/downloads" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-block"
        >
          Скачать расширение
        </a>
      </div>
    </div>
  );
}