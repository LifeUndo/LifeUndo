import Link from 'next/link';

const jsPkg = process.env.NEXT_PUBLIC_SDK_JS_PKG || '@lifeundo/js';
const jsUrl = process.env.NEXT_PUBLIC_SDK_JS_URL || 'https://www.npmjs.com/package/@lifeundo/js';

const pyPkg = process.env.NEXT_PUBLIC_SDK_PY_PKG || 'lifeundo';
const pyUrl = process.env.NEXT_PUBLIC_SDK_PY_URL || 'https://pypi.org/project/lifeundo/';

export const metadata = {
  title: 'Developers — SDK, API, примеры',
  description: 'Интеграция с LifeUndo: SDK для JS/TS и Python, OpenAPI спецификация и лимиты.',
};

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-3xl font-bold">Developers</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">SDK</h2>
        <div className="rounded-2xl p-4 shadow bg-white space-y-4">
          <div>
            <div className="font-semibold">JavaScript / TypeScript</div>
            <div className="text-sm text-gray-600">
              Пакет: <code className="font-mono">{jsPkg}</code>{' '}
              <Link href={jsUrl} className="text-blue-600 underline" target="_blank">
                (npm)
              </Link>
            </div>
            <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-sm">
{`# install
npm i ${jsPkg}

# usage
import { LifeUndo } from '${jsPkg}';

const lu = new LifeUndo({ apiKey: process.env.LIFEUNDO_API_KEY });
const ok = await lu.licenses.validate('YOUR-LICENSE-KEY');
console.log(ok);`}
            </pre>
          </div>

          <div>
            <div className="font-semibold">Python</div>
            <div className="text-sm text-gray-600">
              Пакет: <code className="font-mono">{pyPkg}</code>{' '}
              <Link href={pyUrl} className="text-blue-600 underline" target="_blank">
                (PyPI)
              </Link>
            </div>
            <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-sm">
{`# install
pip install ${pyPkg}

# usage
from lifeundo import LifeUndo

lu = LifeUndo(api_key=os.getenv("LIFEUNDO_API_KEY"))
ok = lu.licenses.validate("YOUR-LICENSE-KEY")
print(ok)`}
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">OpenAPI</h2>
        <div className="rounded-2xl p-4 shadow bg-white">
          <p className="text-sm text-gray-700">
            Спецификация доступна по адресу: <Link href="/openapi.yaml" className="text-blue-600 underline">/openapi.yaml</Link>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Аутентификация и лимиты</h2>
        <div className="rounded-2xl p-4 shadow bg-white space-y-2">
          <p className="text-sm">
            Используйте заголовок: <code className="font-mono">Authorization: Bearer &lt;API_KEY&gt;</code>.
          </p>
          <p className="text-sm">
            Лимиты запросов зависят от тарифа; при превышении вернётся <code>429 Too Many Requests</code>.
          </p>
          <p className="text-xs text-gray-500">
            Для теста можно использовать ключ из админки или локальные переменные окружения.
          </p>
        </div>
      </section>
    </main>
  );
}