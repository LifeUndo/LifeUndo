import { SOCIALS } from '@/config/socials';
import { SocialIcon } from '@/components/icons/SocialIcon';

export function SocialBar({ place = 'footer' }: { place?: 'header'|'footer' }) {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(s => {
        const href = s.utm ? `${s.href}${s.href.includes('?') ? '&' : '?'}${s.utm}` : s.href;
        return (
          <a key={s.id} href={href} aria-label={s.label}
             target="_blank" rel="noopener noreferrer me"
             className="text-slate-300/90 hover:text-white transition">
            <SocialIcon name={s.icon} className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
