import LegalDoc from '@/components/LegalDoc';

export default function ContractPageEN() {
  return (
    <div>
      <LegalDoc lang="en" slug="offer" />
      
      {/* B2B Disclaimer */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-yellow-200 mb-4">
                Important Information
              </h3>
              <div className="text-yellow-200 space-y-2">
                <p>• For organizations — <strong>100+ VIP seats</strong></p>
                <p>• This is a contract template. Not a public offer</p>
                <p>• Final version provided upon request and signed by parties</p>
                <p>• All details filled individually for each organization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
