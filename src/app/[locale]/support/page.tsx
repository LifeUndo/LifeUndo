'use client';

import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const FAQ = [
  {
    q: "Не пришло письмо с лицензией. Что делать?",
    a: "Проверьте папку «Спам», вкладку «Промоакции» и корректность email в заказе. Если письма нет — отправьте нам тикет с указанием order_id, мы вышлем ключ повторно."
  },
  {
    q: "Как активировать Pro?",
    a: "Откройте расширение GetLifeUndo → Настройки → Лицензия → Вставьте ключ. После активации перезапустите браузер."
  },
  {
    q: "Что такое Starter Bundle?",
    a: "Это пакет: Pro на 6 месяцев + бонусный флаг 'starter_bonus' на тот же срок. Дата окончания отображается в настройках аккаунта."
  },
  {
    q: "Можно вернуть деньги?",
    a: "Мы придерживаемся честной политики возврата в разумных случаях. Опишите ситуацию в тикете, укажите email и order_id — разберёмся."
  },
  {
    q: "Можно сменить тариф?",
    a: "Да. Напишите нам, укажите текущий план и желаемый. Мы предложим наиболее выгодный вариант."
  }
];

export default function SupportPage() {
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id') || '';
  const plan = searchParams.get('plan') || '';
  const email = searchParams.get('email') || '';

  const [form, setForm] = useState({
    email: email,
    order_id: order_id,
    topic: "general",
    message: ""
  });
  const [sent, setSent] = useState(false);
  const submitDisabled = useMemo(() => !form.email || !form.message, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan })
      });
      if (res.ok) setSent(true);
    } catch { /* no-op */ }
  }

  return (
    <>
      <Head>
        <title>Поддержка — GetLifeUndo</title>
        <meta name="description" content="Поддержка пользователей GetLifeUndo. Ответы на частые вопросы и форма для связи со службой поддержки." />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Поддержка</h1>

        {(process.env.NEXT_PUBLIC_IS_TEST_MODE === "true") && (
          <div className="mb-6 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-yellow-200">
            Тестовый режим активирован. Вопросы по оплате — указывайте order_id: <strong>{order_id || "—"}</strong>.
          </div>
        )}

        <section className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Частые вопросы</h2>
            <ul className="space-y-4">
              {FAQ.map((item, i) => (
                <li key={i}>
                  <p className="font-medium text-white">{item.q}</p>
                  <p className="text-gray-300 mt-1">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Написать в поддержку</h2>
            {sent ? (
              <div className="rounded-xl bg-emerald-400/10 border border-emerald-400/30 p-4 text-emerald-200">
                Спасибо! Мы получили вашу заявку и ответим на email {form.email}.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">Order ID</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                    value={form.order_id}
                    onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                    placeholder="например, S6M-172... или PROM-1759..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">Тема</label>
                  <select
                    className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  >
                    <option value="general">Вопрос по работе</option>
                    <option value="payment">Оплата и лицензия</option>
                    <option value="refund">Возврат / обмен</option>
                    <option value="bug">Баг / ошибка</option>
                    <option value="feature">Предложение по фиче</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">Сообщение</label>
                  <textarea
                    className="w-full min-h-[120px] rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-white"
                    placeholder="Опишите ситуацию. Можно добавить скриншоты ссылками."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button 
                  disabled={submitDisabled} 
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Отправить заявку
                </button>

                <div className="text-sm text-gray-400">
                  Или напишите на{" "}
                  <a 
                    className="underline text-indigo-300 hover:text-indigo-200" 
                    href={`mailto:support@getlifeundo.com?subject=Покупка%20%23${form.order_id || order_id || ""}`}
                  >
                    support@getlifeundo.com
                  </a>
                  .
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
