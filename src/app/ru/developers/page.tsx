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
            <h2 className="text-2xl font-semibold text-white mb-6">Эндпоинты (черновик, REST)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/v1/licenses/verify</div>
                <div className="text-gray-300 text-sm mb-2">Authorization: Bearer &lt;api_key&gt;</div>
                <div className="text-gray-300 text-sm mb-2">Body: {`{ "licenseKey": "GLU-XXXX-..." }`}</div>
                <div className="text-gray-300 text-sm">→ 200 {`{ "ok": true, "plan": "pro|team|vip", "seatsLeft": 12 }`}</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/v1/undo/restore</div>
                <div className="text-gray-300 text-sm mb-2">Authorization: Bearer &lt;api_key&gt;</div>
                <div className="text-gray-300 text-sm mb-2">Body: {`{ "clientId": "uuid", "scope": "forms|clipboard|tabs" }`}</div>
                <div className="text-gray-300 text-sm">→ 202 {`{ "ok": true, "accepted": true }`}</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/v1/events?from=...&to=...</div>
                <div className="text-gray-300 text-sm mb-2">Authorization: Bearer &lt;api_key&gt;</div>
                <div className="text-gray-300 text-sm">→ 200 {`{ "items":[{ "ts":"...", "type":"activation|restore", "clientId":"..." }]}`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth & Limits */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Аутентификация и ограничения</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>Аутентификация:</strong> Authorization: Bearer &lt;api_key&gt;</p>
              <p><strong>Rate limit:</strong> 60 req/min/IP (по умолчанию)</p>
              <p><strong>Статус:</strong> Closed beta. Получите ключи: support@getlifeundo.com или t.me/GetLifeUndoSupport</p>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Пример (cURL)</h2>
            <div className="bg-black/20 rounded-lg p-4">
              <pre className="text-gray-300 text-sm overflow-x-auto">
{`curl -H "Authorization: Bearer $KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"licenseKey":"GLU-TEST-123"}' \\
     https://getlifeundo.com/api/v1/licenses/verify`}
              </pre>
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
