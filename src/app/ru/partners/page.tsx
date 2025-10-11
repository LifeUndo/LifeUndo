import React from 'react';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            White-label / OEM
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Р‘СЂРµРЅРґРёСЂСѓР№С‚Рµ GetLifeUndo РїРѕРґ РІР°С€Сѓ РєРѕРјРїР°РЅРёСЋ
          </p>
          
          {/* B2B Disclaimer */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 font-semibold">
              Р”Р»СЏ РѕСЂРіР°РЅРёР·Р°С†РёР№ РѕС‚ <strong>100 VIP-РїРѕРґРїРёСЃРѕРє</strong>. РџСЂРµРґРѕСЃС‚Р°РІР»СЏРµРј С€Р°Р±Р»РѕРЅС‹ РґРѕРєСѓРјРµРЅС‚РѕРІ РїРѕ Р·Р°РїСЂРѕСЃСѓ.
            </p>
          </div>
          
          {/* TXT Templates Button */}
          <div className="text-center mb-8">
            <a 
              href="/ru/legal/downloads"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              рџ“„ РЎРєР°С‡Р°С‚СЊ .TXT-С€Р°Р±Р»РѕРЅС‹
            </a>
          </div>
        </div>

        {/* White-label Packages */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">РџР°РєРµС‚С‹ White-label</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* WL-Starter */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Starter</h3>
              <div className="text-2xl font-bold text-green-400 mb-4">100 VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>вЂў Р‘СЂРµРЅРґРёРЅРі + СЃС‚СЂР°РЅРёС†Р° СЃРєР°С‡РёРІР°РЅРёСЏ</li>
                <li>вЂў Р•РґРёРЅС‹Р№ РєР»СЋС‡ Р»РёС†РµРЅР·РёРё</li>
                <li>вЂў Р‘Р°Р·РѕРІС‹Рµ РЅР°СЃС‚СЂРѕР№РєРё</li>
                <li>вЂў Email РїРѕРґРґРµСЂР¶РєР°</li>
              </ul>
            </div>

            {/* WL-Pro */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Pro</h3>
              <div className="text-2xl font-bold text-blue-400 mb-4">250 VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>вЂў РћС‚РґРµР»СЊРЅС‹Р№ СЃР°Р±РґРѕРјРµРЅ</li>
                <li>вЂў РўРµР»РµРјРµС‚СЂРёСЏ РїРѕ РєР»СЋС‡Р°Рј</li>
                <li>вЂў SLA 99.9%</li>
                <li>вЂў РџСЂРёРѕСЂРёС‚РµС‚РЅР°СЏ РїРѕРґРґРµСЂР¶РєР°</li>
              </ul>
            </div>

            {/* WL-Enterprise */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WL-Enterprise</h3>
              <div className="text-2xl font-bold text-purple-400 mb-4">1000+ VIP</div>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>вЂў Р’С‹РґРµР»РµРЅРЅС‹Р№ Р±РёР»Рґ</li>
                <li>вЂў РџСЂРёРІР°С‚РЅС‹Р№ CDN</li>
                <li>вЂў РљР°СЃС‚РѕРјРЅС‹Рµ РїРѕР»РёС‚РёРєРё</li>
                <li>вЂў РџРµСЂСЃРѕРЅР°Р»СЊРЅС‹Р№ РјРµРЅРµРґР¶РµСЂ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">РџСЂРѕС†РµСЃСЃ</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>1. Р‘СЂРёС„</strong> в†’ РѕР±СЃСѓР¶РґРµРЅРёРµ С‚СЂРµР±РѕРІР°РЅРёР№ Рё С‚РµС…РЅРёС‡РµСЃРєРёС… РґРµС‚Р°Р»РµР№</p>
              <p><strong>2. РњР°РєРµС‚</strong> в†’ СЃРѕР·РґР°РЅРёРµ РґРёР·Р°Р№РЅР° Рё Р±СЂРµРЅРґРёРЅРіР°</p>
              <p><strong>3. РўРµСЃС‚РѕРІС‹Р№ Р±РёР»Рґ</strong> в†’ private AMO/unlisted РґР»СЏ С‚РµСЃС‚РёСЂРѕРІР°РЅРёСЏ</p>
              <p><strong>4. РџРёР»РѕС‚</strong> в†’ РѕРіСЂР°РЅРёС‡РµРЅРЅРѕРµ С‚РµСЃС‚РёСЂРѕРІР°РЅРёРµ СЃ РєРѕРјР°РЅРґРѕР№</p>
              <p><strong>5. РџСЂРѕРґ</strong> в†’ Р·Р°РїСѓСЃРє РІ РїСЂРѕРґР°РєС€РЅ</p>
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">РњРѕРґРµР»СЊ</h2>
            <ul className="space-y-4 text-gray-300">
              <li>вЂў Р Р°Р·РѕРІР°СЏ РЅР°СЃС‚СЂРѕР№РєР° (setup fee)</li>
              <li>вЂў РџРѕРґРїРёСЃРєР°: РїРѕРјРµСЃСЏС‡РЅРѕ РїРѕ С‡РёСЃР»Сѓ РјРµСЃС‚ (Team/Org)</li>
              <li>вЂў Р®СЂРёРґРёС‡РµСЃРєРёРµ Р»РёС†Р°: РѕРїР»Р°С‚Р° РїРѕ СЃС‡С‘С‚Сѓ (РѕС„РµСЂС‚Р° РЅРёР¶Рµ)</li>
            </ul>
          </div>
        </div>

        {/* Onboarding */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">РћРЅР±РѕСЂРґРёРЅРі (3 С€Р°РіР°)</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Р‘СЂРёС„</h3>
                  <p className="text-gray-300">Р›РѕРіРѕС‚РёРїС‹, С†РІРµС‚Р°, РґРѕРјРµРЅ</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">РўРµС…РЅРёС‡РµСЃРєР°СЏ СЃР±РѕСЂРєР° Рё С‚РµСЃС‚</h3>
                  <p className="text-gray-300">1вЂ“3 РґРЅСЏ</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">РџРѕРґРїРёСЃР°РЅРёРµ РѕС„РµСЂС‚С‹ / РґРѕСЃС‚СѓРї Рє РѕС‚С‡С‘С‚Р°Рј</h3>
                  <p className="text-gray-300">Р®СЂРёРґРёС‡РµСЃРєРѕРµ РѕС„РѕСЂРјР»РµРЅРёРµ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            РџРѕР»СѓС‡РёС‚СЊ Р±СЂРёС„ Рё СЂР°СЃС‡С‘С‚
          </a>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              Р­С‚Рѕ С€Р°Р±Р»РѕРЅ. РќРµ СЏРІР»СЏРµС‚СЃСЏ РїСѓР±Р»РёС‡РЅРѕР№ РѕС„РµСЂС‚РѕР№. Р¤РёРЅР°Р»СЊРЅР°СЏ РІРµСЂСЃРёСЏ РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµС‚СЃСЏ РїРѕ Р·Р°РїСЂРѕСЃСѓ Рё РїРѕРґРїРёСЃС‹РІР°РµС‚СЃСЏ СЃС‚РѕСЂРѕРЅР°РјРё.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
