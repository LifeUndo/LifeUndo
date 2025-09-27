'use client';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  const Item = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener" className="mx-2 text-slate-800 hover:underline">{children}</a>
  );
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-5xl p-6 text-center">
        <div className="mb-3">
          <Item href="https://t.me/LifeUndoSupport">Telegram</Item>·
          <Item href="https://x.com/GetLifeUndo">X</Item>·
          <Item href="https://www.reddit.com/r/GetLifeUndo">Reddit</Item>·
          <Item href="https://www.youtube.com/@GetLifeUndo">YouTube</Item>·
          <Item href="https://vc.ru/u/XXXXX">vc.ru</Item>·
          <Item href="https://habr.com/ru/users/XXXXX/">Habr</Item>·
          <Item href="https://tenchat.ru/a/GetLifeUndo">TenChat</Item>·
          <Item href="https://dzen.ru/GetLifeUndo">Dzen</Item>·
          <Item href="https://vk.com/GetLifeUndo">VK</Item>
        </div>
        <div className="mb-3 flex items-center justify-center gap-3">
          <img src="https://www.free-kassa.ru/img/fk_btn/16.png" alt="FreeKassa" className="h-6" />
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-slate-800">
            <span className="font-medium">We give 10%</span> — GetLifeUndo Fund
          </span>
        </div>
        <p className="text-xs text-slate-500">
          © {year} GetLifeUndo. All rights reserved ·{" "}
          <Link href="/en/privacy" className="hover:underline">Privacy</Link> ·{" "}
          <Link href="/en/support" className="hover:underline">Support</Link>
        </p>
      </div>
    </footer>
  );
}
