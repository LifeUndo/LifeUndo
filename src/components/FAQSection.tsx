export default function FAQSection() {
  const faqs = [
    {
      question: "Оплата не прошла — что делать?",
      answer: "Проверьте баланс карты и попробуйте снова. Если проблема повторяется, обратитесь в поддержку с номером заказа."
    },
    {
      question: "Где скачать расширение?",
      answer: "Перейдите на страницу /downloads и выберите ваш браузер. Firefox доступен в AMO, Chrome и Edge — скоро."
    },
    {
      question: "Как активировать Pro/VIP лицензию?",
      answer: "После оплаты лицензия активируется автоматически. Если не сработало, введите ключ лицензии в расширении."
    },
    {
      question: "Безопасно ли это?",
      answer: "Да, все данные хранятся локально в вашем браузере. Мы не собираем телеметрию и не передаём данные третьим лицам."
    },
    {
      question: "Работает ли на мобильных устройствах?",
      answer: "Пока только браузерные расширения. Мобильное приложение для Android планируется в дорожной карте."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
          Часто задаваемые вопросы
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
