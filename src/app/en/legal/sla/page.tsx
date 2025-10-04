export default function SLAPageEN() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              SLA (basic)
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-white mb-4">Availability</h2>
              <p className="text-gray-300 mb-4">
                Website: hosted on Vercel (their SLA).
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Support</h2>
              <p className="text-gray-300 mb-4">
                Critical incidents (payment/access): response ≤ 4h during business hours.
              </p>
              <p className="text-gray-300 mb-4">
                Support channel: support@getlifeundo.com.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Maintenance</h2>
              <p className="text-gray-300 mb-4">
                We notify ≥ 24h in advance.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Data Export</h2>
              <p className="text-gray-300 mb-4">
                Payment data — upon organization request.
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
