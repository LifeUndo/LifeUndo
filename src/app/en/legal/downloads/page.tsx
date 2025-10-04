import React from 'react';

export default function LegalDownloadsPageEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            Contract Templates for Organizations
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Templates for organizations (<strong>100+ VIP</strong>). TXT files, not a public offer.
          </p>
          
          {/* Disclaimer */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 font-semibold">
              ⚠️ These are templates. Not a public offer. Final version provided upon request and signed by parties.
            </p>
          </div>
        </div>

        {/* Russian Templates */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              🇷🇺 Russian Templates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Публичная оферта</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Template public offer for software license
                </p>
                <a
                  href="/legal/contracts/RU/offer_template.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Скачать .TXT
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Договор B2B</h3>
                <p className="text-gray-300 text-sm mb-4">
                  B2B license agreement for 100+ VIP organizations
                </p>
                <a
                  href="/legal/contracts/RU/contract_b2b_template.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Скачать .TXT
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">DPA</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Data Processing Agreement
                </p>
                <a
                  href="/legal/contracts/RU/dpa_template.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Скачать .TXT
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Политика (краткая)</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Short data processing policy
                </p>
                <a
                  href="/legal/contracts/RU/privacy_processing_short.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Скачать .TXT
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* English Templates */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              🇺🇸 English Templates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Public Offer</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Template public offer for software license
                </p>
                <a
                  href="/legal/contracts/EN/offer_template.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download .TXT
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Corporate Contract</h3>
                <p className="text-gray-300 text-sm mb-4">
                  B2B license agreement for 100+ VIP organizations
                </p>
                <a
                  href="/legal/contracts/EN/contract_b2b_template.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download .TXT
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">DPA</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Data Processing Agreement
                </p>
                <a
                  href="/legal/contracts/EN/dpa_template.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download .TXT
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Processing Policy</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Short data processing policy
                </p>
                <a
                  href="/legal/contracts/EN/privacy_processing_short.txt"
                  download
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download .TXT
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Files */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Additional Files
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">📋 README</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Important information about contract templates folder
                </p>
                <a
                  href="/legal/contracts/README_IMPORTANT.txt"
                  download
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download README
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">🔐 Checksums</h3>
                <p className="text-gray-300 text-sm mb-4">
                  SHA256 checksums of all files
                </p>
                <a
                  href="/legal/contracts/checksums.txt"
                  download
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download Checksums
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Need help with contracts?
            </h3>
            <p className="text-gray-300 mb-6">
              Contact us for final document versions and legal support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@getlifeundo.com"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Email us
              </a>
              <a 
                href="https://t.me/GetLifeUndoSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
