'use client';

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { locales } from "@/i18n/config";

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params?.locale as string || "ru";
  
  // Удаляем локаль из пути
  const pathnameWithoutLocale = pathname.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";

  return (
    <div className="flex gap-2">
      {locales.map(locale => {
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={`/${locale}${pathnameWithoutLocale}`}
            className={`px-2 py-1 rounded-md border text-sm font-medium transition-colors ${
              isActive 
                ? "bg-white/10 border-white/20 text-white" 
                : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
