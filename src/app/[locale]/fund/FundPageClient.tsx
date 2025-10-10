'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function FundPageClient({ params }: { params: { locale: string } }) {
  const { t } = useTranslations();
  return (
    <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            {t.fund.what_is_glu}
          </h1>
          <div className="prose prose-lg mx-auto text-gray-300">
            <p className="text-xl leading-relaxed mb-8">
              {t.fund.what_is_glu_body}
            </p>
            
            <h2 className="text-3xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed mb-8">
              We dedicate 10% of net revenue to digital literacy & safety initiatives.
            </p>
            
            <h2 className="text-3xl font-bold text-white mb-6">
              Grants & Partnerships
            </h2>
            <p className="text-lg leading-relaxed mb-8">
              We co-fund public education projects, workshops and research focused on safer daily computing.
            </p>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Thank You
              </h3>
              <p className="text-lg text-gray-300">
                Your support helps us develop the project and make it better for all users.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
