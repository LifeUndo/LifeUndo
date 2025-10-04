import LegalDoc from '@/components/LegalDoc';

export default function ContractPage() {
  return (
    <div>
      <LegalDoc lang="ru" slug="contract" />
      
      {/* B2B Disclaimer */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-yellow-200 mb-4">
                Важная информация
              </h3>
              <div className="text-yellow-200 space-y-2">
                <p>• Для организаций от <strong>100 VIP-подписок</strong></p>
                <p>• Это шаблон договора. Не является публичной офертой</p>
                <p>• Финальная версия предоставляется по запросу и подписывается сторонами</p>
                <p>• Все реквизиты заполняются индивидуально для каждой организации</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
