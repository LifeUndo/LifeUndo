import React from 'react';

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
            РџРѕРґРєР»СЋС‡РёС‚Рµ РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ С„РѕСЂРј/Р±СѓС„РµСЂР° РІ СЃРІРѕР№ РїСЂРѕРґСѓРєС‚
          </p>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">РљР°Рє СЌС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚ (РІРєСЂР°С‚С†Рµ)</h2>
            <ul className="space-y-4 text-gray-300">
              <li>вЂў Р Р°СЃС€РёСЂРµРЅРёРµ С…СЂР°РЅРёС‚ РґР°РЅРЅС‹Рµ <strong>Р»РѕРєР°Р»СЊРЅРѕ</strong></li>
              <li>вЂў API РЅСѓР¶РµРЅ РґР»СЏ РІР°Р»РёРґР°С†РёРё Р»РёС†РµРЅР·РёР№/РѕСЂРіР°РЅРёР·Р°С†РёР№ Рё СЃРѕР±С‹С‚РёР№ Р°РєС‚РёРІР°С†РёР№</li>
              <li>вЂў РњС‹ <strong>РЅРµ РїСЂРёРЅРёРјР°РµРј</strong> Рё РЅРµ С…СЂР°РЅРёРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёР№ С‚РµРєСЃС‚ С„РѕСЂРј</li>
            </ul>
          </div>
        </div>

        {/* Endpoints */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">РџСѓР±Р»РёС‡РЅС‹Рµ СЌРЅРґРїРѕРёРЅС‚С‹ (СѓР¶Рµ РµСЃС‚СЊ)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/healthz</div>
                <div className="text-gray-300 text-sm mb-2">РџРёРЅРі СЃРµСЂРІРµСЂР°</div>
                <div className="text-gray-300 text-sm">в†’ 200 OK</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">GET /api/debug/fk</div>
                <div className="text-gray-300 text-sm mb-2">Р”РёР°РіРЅРѕСЃС‚РёРєР° РїР»Р°С‚С‘Р¶РєРё FreeKassa</div>
                <div className="text-gray-300 text-sm">в†’ 200 {`{ "ok": true, "merchantIdPresent": true, ... }`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* License Validation (HF2) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Р›РёС†РµРЅР·РёРё (HF2 вЂ” РіРѕС‚РѕРІРёРј Рё РІРєР»СЋС‡Р°РµРј Р·Р°РІС‚СЂР°)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/license/validate</div>
                <div className="text-gray-300 text-sm mb-2">Body: {`{ "key": "LU-XXXX-XXXX" }`}</div>
                <div className="text-gray-300 text-sm mb-2">Resp 200: {`{ "ok": true, "tier":"pro|vip", "expAt":"2026-01-01T00:00:00Z", "sign":"<HMAC256>" }`}</div>
                <div className="text-gray-300 text-sm mb-2">РЎРёРіРЅР°С‚СѓСЂР°: HMAC-SHA256(base64) РїРѕ key|tier|expAt СЃ СЃРµСЂРІРµСЂРЅС‹Рј СЃРµРєСЂРµС‚РѕРј</div>
                <div className="text-gray-300 text-sm">429 РїСЂРё С‡Р°СЃС‚РѕРј РѕР±СЂР°С‰РµРЅРёРё</div>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Р’РµР±-С…СѓРєРё (РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ, РїРѕР·Р¶Рµ)</h2>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 font-mono text-sm mb-2">POST /api/webhooks/payments/fk</div>
                <div className="text-gray-300 text-sm mb-2">РЎРѕР±С‹С‚РёСЏ FreeKassa (СѓСЃРїРµС…/С„РµР№Р»), idempotent</div>
              </div>
            </div>
          </div>
        </div>

        {/* OpenAPI */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">OpenAPI СЃРїРµС†РёС„РёРєР°С†РёСЏ</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>РЎРїРµС†РёС„РёРєР°С†РёСЏ:</strong> <a href="/api/openapi.yaml" className="text-blue-400 hover:text-blue-300">/api/openapi.yaml</a></p>
              <p><strong>Rate-Limit:</strong> 10 req/min РїРѕ IP РЅР° /api/license/validate</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Р‘РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ</h2>
            <p className="text-gray-300">
              100% Р»РѕРєР°Р»СЊРЅРѕ, API РЅРµ РїРµСЂРµРґР°С‘С‚ С‚РµРєСЃС‚ С„РѕСЂРј. Р’СЃРµ РґР°РЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ РѕСЃС‚Р°СЋС‚СЃСЏ РІ РёС… Р±СЂР°СѓР·РµСЂРµ.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            РџРѕР»СѓС‡РёС‚СЊ API РєР»СЋС‡Рё
          </a>
        </div>
      </div>
    </div>
  );
}

