import Link from "next/link";
export default function Partners(){
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Партнёрская программа GetLifeUndo</h1>
      <p>Расширяйтесь вместе с нами: API для интеграций, реферальные выплаты, White‑Label для OEM/агентств.</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Форматы сотрудничества</h2>
        <ul className="list-disc pl-6">
          <li><strong>API</strong>: проверка лицензий, активации, Webhook‑уведомления об оплатах.</li>
          <li><strong>Referral</strong>: 20% rev‑share на первых 12 месяцев (по умолчанию).</li>
          <li><strong>White‑Label</strong>: ваш домен/бренд, наши бэкенд‑сервисы.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Документация</h2>
        <ul className="list-disc pl-6">
          <li><Link href="/developers">Старт для разработчиков</Link></li>
          <li><a href="/openapi.yaml">OpenAPI 3.0 (YAML)</a></li>
          <li><Link href="/faq">FAQ</Link></li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Тарифы для партнёров (API)</h2>
        <table className="min-w-full border">
          <thead><tr><th className="border p-2">План</th><th className="border p-2">Вызовов/мес</th><th className="border p-2">Цена</th><th className="border p-2">Overage</th></tr></thead>
          <tbody>
            <tr><td className="border p-2">Dev (free)</td><td className="border p-2">10k</td><td className="border p-2">0 ₽</td><td className="border p-2">н/д</td></tr>
            <tr><td className="border p-2">Pro</td><td className="border p-2">250k</td><td className="border p-2">3 990 ₽</td><td className="border p-2">0.02 ₽/call</td></tr>
            <tr><td className="border p-2">Team</td><td className="border p-2">1 млн</td><td className="border p-2">12 900 ₽</td><td className="border p-2">0.015 ₽/call</td></tr>
            <tr><td className="border p-2">Enterprise</td><td className="border p-2">по запросу</td><td className="border p-2">—</td><td className="border p-2">индивидуально</td></tr>
          </tbody>
        </table>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">White‑Label</h2>
        <p>Деплой под вашим брендом: тема, логотип, домен, кастомные планы, отдельные ключи шифрования и сегмент БД.</p>
        <ul className="list-disc pl-6">
          <li>Стартовый сетап: от 50 000 ₽ разово.</li>
          <li>SLA/поддержка: от 15 000 ₽/мес.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Контакты</h2>
        <p>Email: partners@getlifeundo.com • Telegram: @LifeUndoPartners</p>
      </section>
    </main>
  );
}


