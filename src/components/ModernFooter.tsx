'use client';

import Link from 'next/link';
import { SocialIcon } from './icons/SocialIcon';
import { useTranslations } from '@/hooks/useTranslations';

interface ModernFooterProps {
  locale?: string;
}

export default function ModernFooter({ locale = 'ru' }: ModernFooterProps) {
  const { t } = useTranslations();
  
  const product = [
    { title: t.footer.features, href: `/${locale}/features` },
    { title: t.footer.pricing, href: `/${locale}/pricing` },
    { title: t.footer.downloads, href: `/${locale}/downloads` },
    { title: t.footer.cases, href: `/${locale}/use-cases` },
  ];

  const company = [
    { title: t.footer.fund, href: `/${locale}/fund` },
    { title: t.footer.support, href: `/${locale}/support` },
    { title: t.footer.contacts, href: `/${locale}/contacts` },
    { title: t.footer.privacy, href: `/${locale}/privacy` },
  ];

  const legal = [
    { title: t.footer.offer, href: `/${locale}/legal/offer` },
    { title: t.footer.sla, href: `/${locale}/legal/sla` },
    { title: t.footer.contract, href: `/${locale}/legal/contract` },
    { title: t.footer.dpa, href: `/${locale}/legal/dpa` },
    { title: t.footer.policy, href: `/${locale}/legal/pdp` },
    { title: t.footer.downloadsTxt, href: `/${locale}/legal/downloads` },
  ];

  const socials: Array<{ name: string; href: string; icon: 'telegram'|'x'|'reddit'|'youtube'|'github'|'vcru'|'habr' }> = [
    { name: 'Telegram', href: 'https://t.me/GetLifeUndo', icon: 'telegram' },
    { name: 'X (Twitter)', href: 'https://x.com/GetLifeUndo', icon: 'x' },
    { name: 'Reddit', href: 'https://www.reddit.com/r/GetLifeUndo', icon: 'reddit' },
    { name: 'YouTube', href: 'https://www.youtube.com/@GetLifeUndo', icon: 'youtube' },
    { name: 'GitHub', href: 'https://github.com/LifeUndo', icon: 'github' },
    { name: 'VC.ru', href: 'https://vc.ru/id5309084', icon: 'vcru' },
    { name: 'Habr', href: 'https://habr.com/ru/users/GetLifeUndo25/', icon: 'habr' },
  ];

  return (
    <footer className="bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.product}</h3>
            <ul className="space-y-2">
              {product.map(item => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.company}</h3>
            <ul className="space-y-2">
              {company.map(item => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2">
              {legal.map(item => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brand Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-3">
              <img src="/brand/getlifeundo-round.png" alt="GetLifeUndo" className="h-8 w-8 rounded-full" />
              <div>
                <p className="text-gray-400 text-sm max-w-md">
                  {t.footer.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <img 
                    src="/brand/freekassa-badge.svg" 
                    alt="FreeKassa" 
                    className="h-5 opacity-75 hover:opacity-100 transition-opacity"
                  />
                  <span className="text-xs text-gray-500">
                    {t.footer.paymentNote}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socials.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  aria-label={social.name} 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon name={social.icon} className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-gray-400 text-sm text-center">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}