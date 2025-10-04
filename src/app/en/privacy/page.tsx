export default function PrivacyPageEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              Privacy Policy (summary)
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                The extension works locally; no telemetry.
              </p>
              <p className="text-gray-300 mb-4">
                Payment data is processed by the payment provider.
              </p>
              <p className="text-gray-300 mb-4">
                Contacts: support@getlifeundo.com.
              </p>
              <p className="text-gray-300 mb-4">
                Full RU policy: /ru/privacy (EN extended version coming next).
              </p>

              <p className="text-gray-400 text-sm mt-8">
                <em>Updated: 2025-10-04</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
