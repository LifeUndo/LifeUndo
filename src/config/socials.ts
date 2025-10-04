export type SocialId = 'telegram' | 'reddit' | 'vc' | 'habr' | 'x' | 'youtube' | 'github';
export type SocialLink = { id: SocialId; label: string; href: string; icon: SocialId; utm?: string; };

export const SOCIALS: SocialLink[] = [
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/GetLifeUndoSupport', icon: 'telegram', utm: 'utm_source=site&utm_medium=header&utm_campaign=social' },
  { id: 'reddit',   label: 'Reddit',   href: 'https://www.reddit.com/r/GetLifeUndo', icon: 'reddit',   utm: 'utm_source=site&utm_medium=footer&utm_campaign=social' },
  { id: 'vc',       label: 'VC.ru',    href: 'https://vc.ru/u/xxxx-getlifeundo',     icon: 'vc',       utm: 'utm_source=site&utm_medium=footer&utm_campaign=social' },
  { id: 'habr',     label: 'Habr',     href: 'https://habr.com/ru/users/getlifeundo',icon: 'habr',     utm: 'utm_source=site&utm_medium=footer&utm_campaign=social' },
  { id: 'x',        label: 'X',        href: 'https://x.com/GetLifeUndo',            icon: 'x',        utm: 'utm_source=site&utm_medium=footer&utm_campaign=social' },
  { id: 'youtube',  label: 'YouTube',  href: 'https://www.youtube.com/@GetLifeUndo', icon: 'youtube',  utm: 'utm_source=site&utm_medium=footer&utm_campaign=social' },
  { id: 'github',   label: 'GitHub',   href: 'https://github.com/GetLifeUndo',       icon: 'github',   utm: 'utm_source=site&utm_medium=footer&utm_campaign=social' },
];
