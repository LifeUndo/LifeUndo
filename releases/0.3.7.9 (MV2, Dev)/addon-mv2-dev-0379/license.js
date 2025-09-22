/* LifeUndo — license.js (RU/EN demo; writes lu_plan & lu_license) */
(async () => {
  const $ = s => document.querySelector(s);

  // lang from ?lang= or localStorage
  const qp = new URLSearchParams(location.search);
  const lang = (qp.get("lang") || localStorage.getItem("lu_lang") || (navigator.language||"en")).toLowerCase().startsWith("ru") ? "ru" : "en";

  const L = {
    ru: {
      title:"Лицензия",
      lead:"Демо-активация для проверки UX (без криптографии). Введите ключ или нажмите «Симулировать VIP».",
      activate:"Активировать VIP",
      simulate:"Симулировать VIP",
      back:"Вернуться",
      remove:"Удалить ключ",
      ph:"Вставьте лицензионный ключ…",
      okImport:"Лицензия импортирована.",
      okSim:"VIP активирован (симуляция). Откройте попап — статус обновится.",
      okRemove:"Ключ удалён. Попап вернётся к Триалу.",
      bad:"Неверный формат лицензии. Ожидается JSON (.lifelic)."
    },
    en: {
      title:"License",
      lead:"Demo activation for UX (no cryptography). Paste key or press “Simulate VIP”.",
      activate:"Activate VIP",
      simulate:"Simulate VIP",
      back:"Return",
      remove:"Remove key",
      ph:"Paste license key…",
      okImport:"License imported.",
      okSim:"VIP activated (simulation). Open popup — status will update.",
      okRemove:"Key removed. Popup will return to Trial.",
      bad:"Invalid license format. Expected JSON (.lifelic)."
    }
  }[lang];

  // apply texts
  document.documentElement.lang = lang;
  $("#ttl").textContent = L.title;
  $("#lead").textContent = L.lead;
  $("#btn-activate").textContent = L.activate;
  $("#btn-simulate").textContent = L.simulate;
  $("#btn-return").textContent = L.back;
  $("#btn-remove").textContent = L.remove;
  $("#inp").placeholder = L.ph;

  const setStatus = (txt, cls) => { const s=$("#status"); s.textContent = txt; s.className = "note " + (cls||""); };

  // helpers
  const savePlan = async (plan, lic) => {
    await browser.storage.local.set({ lu_plan: plan, lu_license: lic||null });
    // дёрнем слушателей в попапе
    try { await browser.runtime.sendMessage({ type: "license-updated" }); } catch{}
  };

  // Activate VIP from pasted JSON
  $("#btn-activate").addEventListener("click", async () => {
    try {
      const raw = ($("#inp").value || "").trim();
      const lic = JSON.parse(raw);
      // минимальная проверка
      if (!lic || !lic.license || lic.license.plan !== "vip") throw new Error("bad");
      await savePlan("vip", lic);
      setStatus(L.okImport, "ok");
    } catch {
      setStatus(L.bad, "err");
    }
  });

  // Simulate VIP (no crypto)
  $("#btn-simulate").addEventListener("click", async () => {
    const lic = { license:{ plan:"vip", issued_to:"demo", expiry:"2099-12-31" }, simulated:true };
    await savePlan("vip", lic);
    setStatus(L.okSim, "ok");
  });

  // Remove key (back to trial)
  $("#btn-remove").addEventListener("click", async () => {
    await savePlan("trial", null);
    setStatus(L.okRemove, "ok");
  });

  // Return (close tab if possible)
  $("#btn-return").addEventListener("click", () => { window.close(); });
})();
