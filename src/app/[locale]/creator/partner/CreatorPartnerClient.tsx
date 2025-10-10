'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function CreatorPartnerClient({ params }: { params: { locale: string } }) {
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            Creator Partnership
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Partnership Benefits</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Commission on referrals
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Early access to new features
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Marketing materials
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Requirements</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">•</span>
                  Active content creation
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">•</span>
                  Engaged audience
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">•</span>
                  Quality content standards
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">•</span>
                  Regular collaboration
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href={`/${params.locale}/creator/apply`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all inline-block"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
