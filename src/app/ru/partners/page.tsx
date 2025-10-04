import React from 'react';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            White-label / OEM
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Брендируйте GetLifeUndo под вашу компанию
          </p>
        </div>
        
        <div className="text-center">
          <a 
            href="mailto:support@getlifeundo.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Получить бриф и расчёт
          </a>
        </div>
      </div>
    </div>
  );
}