import React from 'react';

export default function PartnersPageEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            White-label / OEM
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Brand GetLifeUndo under your company
          </p>
          
          {/* B2B Disclaimer */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 font-semibold">
              For organizations — <strong>100+ VIP seats</strong>. Templates available upon request.
            </p>
          </div>
          
          {/* TXT Templates Button */}
          <div className="text-center mb-8">
            <a 
              href="/en/legal/downloads"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📄 Download .TXT Templates
            </a>
          </div>
        </div>

        {/* What's included */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">What's included</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Logo/colors/branding; pre-configuration (which "UNDO" types to enable)</li>
              <li>• Activation and license reports (organizations)</li>
              <li>• Optional: private update channel</li>
            </ul>
          </div>
        </div>

        {/* Model */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Model</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• One-time setup fee</li>
              <li>• Subscription: monthly per seat (Team/Org)</li>
              <li>• Legal entities: invoice payment (offer below)</li>
            </ul>
          </div>
        </div>

        {/* Onboarding */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Onboarding (3 steps)</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Brief</h3>
                  <p className="text-gray-300">Logos, colors, domain</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Technical build and test</h3>
                  <p className="text-gray-300">1–3 days</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sign offer / access to reports</h3>
                  <p className="text-gray-300">Legal formalization</p>
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
            Get brief and quote
          </a>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              This is a template. Not a public offer. Final version provided upon request and signed by parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
