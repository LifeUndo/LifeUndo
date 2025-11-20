"use client";

export default function AdminExportsPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 text-sm">
          Экспорт данных
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Внутренний раздел для выгрузки данных в CSV/JSON: лицензии, устройства, платежи.
          Сейчас это только каркас интерфейса, без тяжёлой логики. Позже сюда будут
          подключены эндпоинты экспорта.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="font-medium text-slate-100">Лицензии</div>
          <p className="text-slate-400 text-[11px]">
            Выгрузка всех лицензий (email, уровень, план, срок действия, количество мест).
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-400 cursor-not-allowed"
              disabled
            >
              CSV (скоро)
            </button>
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-400 cursor-not-allowed"
              disabled
            >
              JSON (скоро)
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="font-medium text-slate-100">Устройства</div>
          <p className="text-slate-400 text-[11px]">
            Список устройств с device_id, типом (extension/desktop/android/web),
            последней активностью и привязкой к email.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-400 cursor-not-allowed"
              disabled
            >
              CSV (скоро)
            </button>
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-400 cursor-not-allowed"
              disabled
            >
              JSON (скоро)
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="font-medium text-slate-100">Платежи</div>
          <p className="text-slate-400 text-[11px]">
            Платежи и статусы подписки для бухгалтерии/аналитики. Можно будет фильтровать
            по диапазону дат и плану.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-400 cursor-not-allowed"
              disabled
            >
              CSV (скоро)
            </button>
            <button
              className="px-3 h-8 rounded-md bg-slate-800 text-[11px] text-slate-400 cursor-not-allowed"
              disabled
            >
              JSON (скоро)
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 max-w-xl">
        Когда подключим реальные эндпоинты экспорта, здесь появятся активные кнопки,
        параметры фильтрации (диапазон дат, план, статус) и счётчики строк.
      </p>
    </div>
  );
}
