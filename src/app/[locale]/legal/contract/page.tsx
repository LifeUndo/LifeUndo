'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export default function ContractPage() {
  const { locale } = useTranslations();
  
  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-10">
        {/* TXT Templates Button */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <a 
            href={`/${locale}/legal/downloads`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            📄 {locale === 'en' ? 'Download .TXT Templates' : 'Скачать .TXT-шаблоны'}
          </a>
        </div>

        {/* Contract Content */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
                {locale === 'en' ? 'Software Licensing Agreement (B2B)' : 'Договор лицензирования программного обеспечения (B2B)'}
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">
                  {locale === 'en' 
                    ? 'This agreement governs the licensing of GetLifeUndo software to organizations with 100+ VIP seats.'
                    : 'Данный договор регулирует лицензирование программного обеспечения GetLifeUndo организациям от 100+ VIP мест.'
                  }
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '1. Parties' : '1. Стороны'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '1.1. Licensor: LLC "GetLifeUndo", TIN xxx, OGRN xxx, address: xxx.'
                    : '1.1. Лицензиар: ООО «GetLifeUndo», ИНН xxx, ОГРН xxx, адрес: xxx.'
                  }
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '1.2. Licensee: [Organization details to be filled]'
                    : '1.2. Лицензиат: [Реквизиты организации заполняются индивидуально]'
                  }
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '2. License Terms' : '2. Условия лицензии'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '2.1. The Licensor grants the Licensee a non-exclusive license for GetLifeUndo software.'
                    : '2.1. Лицензиар предоставляет Лицензиату неисключительную лицензию на программное обеспечение GetLifeUndo.'
                  }
                </p>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '2.2. License covers 100+ VIP seats as specified in the order.'
                    : '2.2. Лицензия покрывает 100+ VIP мест согласно спецификации заказа.'
                  }
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '3. Payment Terms' : '3. Условия оплаты'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '3.1. Payment is made according to the agreed schedule and pricing.'
                    : '3.1. Оплата производится согласно согласованному графику и ценообразованию.'
                  }
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '4. Support and Maintenance' : '4. Поддержка и сопровождение'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '4.1. Licensor provides technical support and software updates.'
                    : '4.1. Лицензиар предоставляет техническую поддержку и обновления программного обеспечения.'
                  }
                </p>

                <h2 className="text-2xl font-semibold text-white mb-4">
                  {locale === 'en' ? '5. Liability' : '5. Ответственность'}
                </h2>
                <p className="text-gray-300 mb-4">
                  {locale === 'en' 
                    ? '5.1. Licensor liability is limited to the contract value and excludes indirect damages.'
                    : '5.1. Ответственность Лицензиара ограничена стоимостью договора и исключает косвенные убытки.'
                  }
                </p>

                <p className="text-gray-400 text-sm mt-8">
                  <em>{locale === 'en' ? 'Last updated: 2025-10-04' : 'Дата обновления: 2025-10-04'}</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* B2B Disclaimer */}
        <div className="max-w-4xl mx-auto mt-10">
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur p-6">
              <h3 className="text-xl font-semibold text-yellow-200 mb-4">
                {locale === 'en' ? 'Important Information' : 'Важная информация'}
              </h3>
              <div className="text-yellow-200 space-y-2">
                {locale === 'en' ? (
                  <>
                    <p>• For organizations — <strong>100+ VIP seats</strong></p>
                    <p>• This is a contract template. Not a public offer</p>
                    <p>• Final version provided upon request and signed by parties</p>
                    <p>• All details filled individually for each organization</p>
                  </>
                ) : (
                  <>
                    <p>• Для организаций от <strong>100 VIP-подписок</strong></p>
                    <p>• Это шаблон договора. Не является публичной офертой</p>
                    <p>• Финальная версия предоставляется по запросу и подписывается сторонами</p>
                    <p>• Все реквизиты заполняются индивидуально для каждой организации</p>
                  </>
                )}
              </div>
          </div>
        </div>
      </div>
  );
}
