"use client";

import { useEffect, useState } from "react";

export default function AdminOpsConsolePage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("adminToken") || "";
    setHasToken(!!stored);
  }, []);

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 text-sm">
          Ops-консоль (web-клиент)
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Вы находитесь в разделе внутреннего web-клиента устройства. Это тот же клиент,
          что страница <code>/device</code>: он использует общий backend с расширением
          (лицензии, пейринг, короткие коды) и позволяет отлаживать Mesh без нативного
          приложения.
        </p>
        <p className="text-slate-400 max-w-2xl">
          Админ-панель и Ops-консоль разделяют один и тот же <code>X-Admin-Token</code>,
          который вводится один раз на странице входа <code>/admin/login</code> и
          сохраняется в браузере. Сам web-клиент устройства работает по своим API и не
          требует токен в каждом запросе.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Встроенный web-клиент по адресу <code>/device</code>.
          </span>
          {!hasToken && (
            <span className="text-[10px] text-amber-400">
              Для админских API убедитесь, что вы вошли через /admin/login и задали
              X-Admin-Token.
            </span>
          )}
        </div>
        <div className="aspect-[16/9] w-full bg-slate-950">
          <iframe
            src="/device"
            className="w-full h-full border-0"
            title="Device web client"
          />
        </div>
      </div>
    </div>
  );
}
