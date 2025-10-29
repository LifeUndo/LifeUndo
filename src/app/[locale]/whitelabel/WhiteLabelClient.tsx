'use client';

import { useTranslations } from "@/hooks/useTranslations";
import Link from "next/link";

export default function WhiteLabelClient({ locale }: { locale: string }) {
  const { t } = useTranslations();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold">{t.wlPage.h1}</h1>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="bg-gray-800/50 p-5 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">{t.wlPage.introTitle}</h2>
          <ul className="space-y-2 list-disc ml-5">
            {t.wlPage.introList.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="bg-gray-800/50 p-5 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">{t.wlPage.modelsTitle}</h2>
          <ul className="space-y-2 list-disc ml-5">
            {t.wlPage.models.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-gray-800/50 p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-3">{t.wlPage.howTitle}</h2>
        <ol className="space-y-2 list-decimal ml-5">
          {t.wlPage.howSteps.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ol>
      </section>

      <section className="bg-gray-800/50 p-5 rounded-xl">
        <p className="mb-3">{t.wlPage.cta}</p>
        <Link href={`/${locale}/support`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Support
        </Link>
      </section>
    </main>
  );
}
