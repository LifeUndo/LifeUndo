export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            API GetLifeUndo (beta)
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Подключите восстановление форм/буфера в свой продукт
          </p>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Как это работает (вкратце)</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Расширение хранит данные <strong>локально</strong></li>
              <li>• API нужен для валидации лицензий/организаций и событий активаций</li>
              <li>• Мы <strong>не принимаем</strong> и не храним пользовательский текст форм</li>
            </ul>
          </div>
        </div>

        {/* Endpoints */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Публичные эндпоинты (уже есть)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/healthz</div>
                <div className="text-gray-300 text-sm mb-2">Пинг сервера</div>
                <div className="text-gray-300 text-sm">→ 200 OK</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/debug/fk</div>
                <div className="text-gray-300 text-sm mb-2">Диагностика платёжки FreeKassa</div>
                <div className="text-gray-300 text-sm">→ 200 {`{ "ok": true, "merchantIdPresent": true, ... }`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* License Validation (HF2) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Лицензии (HF2 — готовим и включаем завтра)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/license/validate</div>
                <div className="text-gray-300 text-sm mb-2">Body: {`{ "key": "LU-XXXX-XXXX" }`}</div>
                <div className="text-gray-300 text-sm mb-2">Resp 200: {`{ "ok": true, "tier":"pro|vip", "expAt":"2026-01-01T00:00:00Z", "sign":"<HMAC256>" }`}</div>
                <div className="text-gray-300 text-sm mb-2">Сигнатура: HMAC-SHA256(base64) по key|tier|expAt с серверным секретом</div>
                <div className="text-gray-300 text-sm">429 при частом обращении</div>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Веб-хуки (опционально, позже)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/webhooks/payments/fk</div>
                <div className="text-gray-300 text-sm mb-2">События FreeKassa (успех/фейл), idempotent</div>
              </div>
            </div>
          </div>
        </div>

        {/* OpenAPI */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">OpenAPI спецификация</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>Спецификация:</strong> <a href="/api/openapi.yaml" className="text-blue-400 hover:text-blue-300">/api/openapi.yaml</a></p>
              <p><strong>Rate-Limit:</strong> 10 req/min по IP на /api/license/validate</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Безопасность</h2>
            <p className="text-gray-300">
              100% локально, API не передаёт текст форм. Все данные пользователей остаются в их браузере.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Получить API ключи
          </a>
        </div>
      </div>
    </div>
  );
}
