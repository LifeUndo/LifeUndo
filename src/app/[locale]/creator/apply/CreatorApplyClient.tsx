'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function CreatorApplyClient({ params }: { params: { locale: string } }) {
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            Creator Program Application
          </h1>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Join Our Creator Program</h2>
            <p className="text-gray-300 mb-6">
              Are you a content creator, blogger, or influencer? Join our Creator Program and help us spread the word about LifeUndo while earning rewards.
            </p>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="">Select platform</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="blog">Blog</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Audience Size</label>
                <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="">Select audience size</option>
                  <option value="1k-10k">1K - 10K</option>
                  <option value="10k-100k">10K - 100K</option>
                  <option value="100k-1m">100K - 1M</option>
                  <option value="1m+">1M+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Tell us about yourself and why you'd like to join our Creator Program..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
