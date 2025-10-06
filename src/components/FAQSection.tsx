'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function FAQSection() {
  const { t } = useTranslations();
  
  const faqs = [
    {
      question: t.faq.paymentFailed.question,
      answer: t.faq.paymentFailed.answer
    },
    {
      question: t.faq.downloadExtension.question,
      answer: t.faq.downloadExtension.answer
    },
    {
      question: t.faq.activateLicense.question,
      answer: t.faq.activateLicense.answer
    },
    {
      question: t.faq.isSafe.question,
      answer: t.faq.isSafe.answer
    },
    {
      question: t.faq.mobileSupport.question,
      answer: t.faq.mobileSupport.answer
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
          {t.faq.title}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                {faq.question}
              </h3>
              <p className="text-gray-300">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
