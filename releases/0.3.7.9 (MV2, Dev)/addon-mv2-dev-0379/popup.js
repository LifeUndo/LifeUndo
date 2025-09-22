/* LifeUndo — popup.js (0.3.7.9 stable; footer fix + PRO→pricing) */
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const L = {
    ru: {
      whatsNew: "Что нового",
      activatePro: "Активировать PRO",
      activateVip: "Активировать VIP",
      statusTrial: "Бесплатная · Триал",
      statusVip: "VIP активен",
      text: {
        title: "Недавние вводы текста",
        emptyTtl: "Пока пусто",
        emptySub: "Наберите текст на обычной странице и обновите — записи появятся здесь.",
        clear: "Очистить текст",
        copy: "Копировать",
        more: "Показать ещё",
        less: "Свернуть"
      },
      tabs: {
        title: "Недавно закрытые вкладки",
        emptyTtl: "Пока пусто",
        emptySub: "Закройте пару вкладок на обычном сайте — они появятся здесь.",
        restore: "Восстановить"
      },
      clip: {
        title: "История буфера",
        emptyTtl: "Пока пусто",
        emptySub: "Скопируйте 2–3 фрагмента (Ctrl/Cmd+C) — элементы появятся здесь.",
        clear: "Очистить буфер",
        copy: "Копировать",
        more: "Показать ещё",
        less: "Свернуть"
      },
      footer: { website: "Сайт", privacy: "Приватность", support: "Поддержка" },
      wn: [
        "Попап: выравнивание EN/RU/статуса/кнопок и чипа «Что нового».",
        "«Показать ещё» — при переполнении; кнопка под текстом, плавный фейд.",
        "Чип статуса (Триал/PRO/VIP) — всегда в шапке.",
        "Нижние ссылки — нормальная типографика."
      ]
    },
    en: {
      whatsNew: "What’s new",
      activatePro: "Activate PRO",
      activateVip: "Activate VIP",
      statusTrial: "Free · Trial",
      statusVip: "VIP active",
      text: {
        title: "Recent text inputs",
        emptyTtl: "Empty",
        emptySub: "Type on any page and reload — the items will appear here.",
        clear: "Clear text",
        copy: "Copy",
        more: "Show more",
        less: "Show less"
      },
      tabs: {
        title: "Recently closed tabs",
        emptyTtl: "Empty",
        emptySub: "Close a couple of tabs on a normal site — they will appear here.",
        restore: "Restore"
      },
      clip: {
        title: "Clipboard history",
        emptyTtl: "Empty",
        emptySub: "Copy 2–3 fragments (Ctrl/Cmd+C) — the items will appear here.",
        clear: "Clear clipboard",
        copy: "Copy",
        more: "Show more",
        less: "Show less"
      },
      footer: { website: "Website", privacy: "Privacy", support: "Support" },
      wn: [
        "Popup: aligned EN/RU/status/buttons; header chip “What’s new”.",
        "Show more only on overflow; button below text with smooth fade.",
        "Status chip (Trial/PRO/VIP) is always visible in the header.",
        "Footer links are styled properly."
      ]
    }
  };

  // language
  const saved = localStorage.getItem("lu_lang");
  let lang = saved ? saved : ((navigator.language||"en").toLowerCase().startsWith("ru") ? "ru" : "en");

  // version in header
  try {
    const ver = browser.runtime?.getManifest?.().version;
    if (ver) { const v = $(".v"); if (v) v.textContent = "v" + ver; }
  } catch {}

  function applyLangStatic() {
    const d = L[lang];
    $("#whatsnew") && ($("#whatsnew").textContent = d.whatsNew);
    $("#btn-pro") && ($("#btn-pro").textContent = d.activatePro);
    $("#btn-vip") && ($("#btn-vip").textContent = d.activateVip);

    // sections
    [
      ["[data-i18n-text]", d.text, "text"],
      ["[data-i18n-tabs]", d.tabs, "tabs"],
      ["[data-i18n-clip]", d.clip, "clip"]
    ].forEach(([sel, dict, key]) => {
      $$(sel).forEach(sec => {
        sec.querySelector(".title") && (sec.querySelector(".title").textContent = dict.title);
        const empty = $("#empty-" + key);
        if (empty) {
          empty.querySelector(".ttl") && (empty.querySelector(".ttl").textContent = dict.emptyTtl);
          empty.querySelector(".sub") && (empty.querySelector(".sub").textContent = dict.emptySub);
        }
        if (key === "text") { $("#clear-text") && ($("#clear-text").textContent = dict.clear); }
        if (key === "clip") { $("#clear-clip") && ($("#clear-clip").textContent = dict.clear); }
      });
    });

    // footer texts — ВАЖНО: сначала проверяем /support, затем /privacy, иначе website
    const foot = d.footer;
    $$(".footer a").forEach(a => {
      const u = new URL(a.href);
      const p = u.pathname.toLowerCase();
      if (p.includes("/support")) a.textContent = foot.support;
      else if (p.includes("/privacy")) a.textContent = foot.privacy;
      else a.textContent = foot.website; // всё остальное — "Сайт/Website"
    });

    // what's new modal
    $("#wn-title") && ($("#wn-title").textContent = d.whatsNew);
    const wnList = $(".wn .cnt ul") || $("#wn-list");
    if (wnList) {
      wnList.innerHTML = "";
      d.wn.forEach(line => {
        const li = document.createElement("li");
        li.textContent = line;
        wnList.appendChild(li);
      });
    }

    $("#btn-en")?.setAttribute("aria-pressed", String(lang==="en"));
    $("#btn-ru")?.setAttribute("aria-pressed", String(lang==="ru"));
  }

  function relabelListButtons() {
    const d = L[lang];
    $$("#list-text .item, #list-clip .item").forEach(li => {
      const copy = li.querySelector(".copy"); if (copy) copy.textContent = d.text.copy;
      const more = li.querySelector(".more");
      if (more) {
        const expanded = li.classList.contains("expanded");
        more.textContent = expanded ? d.text.less : d.text.more;
      }
    });
    $$("#list-tabs .item").forEach(li => {
      const r = li.querySelector(".restore"); if (r) r.textContent = d.tabs.restore;
    });
  }

  async function updateStatusChip() {
    const chip = $("#status-chip"); if (!chip) return;
    try {
      const { lu_plan } = await browser.storage.local.get("lu_plan");
      chip.textContent = (lu_plan === "vip") ? L[lang].statusVip : L[lang].statusTrial;
    } catch {
      chip.textContent = L[lang].statusTrial;
    }
  }
  browser.storage.onChanged.addListener((ch, area) => {
    if (area === "local" && (ch.lu_plan || ch.lu_license)) updateStatusChip();
  });

  // language toggles
  $("#btn-en")?.addEventListener("click", () => { lang="en"; localStorage.setItem("lu_lang","en"); applyLangStatic(); relabelListButtons(); updateStatusChip(); });
  $("#btn-ru")?.addEventListener("click", () => { lang="ru"; localStorage.setItem("lu_lang","ru"); applyLangStatic(); relabelListButtons(); updateStatusChip(); });

  // modal
  $("#whatsnew")?.addEventListener("click", () => { $("#wn-overlay")?.setAttribute("style","display:flex"); });
  $("#wn-close")?.addEventListener("click", () => { $("#wn-overlay")?.setAttribute("style","display:none"); });
  $("#wn-overlay")?.addEventListener("click", (e) => { if (e.target.id === "wn-overlay") e.currentTarget.style.display = "none"; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#wn-overlay")?.setAttribute("style","display:none"); });

  // ==== PRO / VIP handlers ====

  // VIP → open license.html with current lang
  $("#btn-vip")?.addEventListener("click", async () => {
    try {
      const url = browser.runtime.getURL("license.html?lang=" + (lang || "ru"));
      await browser.tabs.create({ url });
    } catch (e) { console.error("VIP button error:", e); }
  });

  // PRO → pricing page (валидная страница)
  $("#btn-pro")?.addEventListener("click", async () => {
    try {
      const url = "https://lifeundo.ru/pricing/index.html";
      await browser.tabs.create({ url });
    } catch (e) { console.error("PRO button error:", e); }
  });

  // expanders
  function bindExpandable(container) {
    if (!container) return;
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("more")) {
        const li = e.target.closest(".item");
        li.classList.toggle("expanded");
        const d = L[lang];
        e.target.textContent = li.classList.contains("expanded") ? d.text.less : d.text.more;
      }
    });
  }
  bindExpandable($("#list-text"));
  bindExpandable($("#list-clip"));

  // initial lists (if bg provides)
  try {
    browser.runtime.sendMessage({ type: "lu:get-state" }).then(state => {
      if (!state) return;
      const render = (ul, items, type) => {
        if (!ul) return;
        ul.innerHTML = "";
        if (!items || !items.length) { ul.hidden = true; return; }
        ul.hidden = false;
        items.forEach(it => {
          const li = document.createElement("li");
          li.className = "item";
          const time = it.time || "";
          const text = (it.text || it.title || "").toString();
          const d = L[lang];
          li.innerHTML = `
            <div class="meta">${time}</div>
            <div class="txt">${text}</div>
            ${type!=="tabs"
              ? `<div class="more-wrap"><button class="more">${d.text.more}</button></div>`
              : ``}
            <div class="act">
              ${type==="tabs"
                ? `<button class="restore">${d.tabs.restore}</button>`
                : `<button class="copy">${d.text.copy}</button>`}
            </div>`;
          ul.appendChild(li);
        });
      };
      render($("#list-text"), state.texts, "text");
      render($("#list-tabs"), state.tabs, "tabs");
      render($("#list-clip"), state.clip, "clip");
      $("#empty-text") && ($("#empty-text").hidden = !!(state.texts && state.texts.length));
      $("#empty-tabs") && ($("#empty-tabs").hidden = !!(state.tabs && state.tabs.length));
      $("#empty-clip") && ($("#empty-clip").hidden = !!(state.clip && state.clip.length));
    }).catch(()=>{});
  } catch {}

  // init
  applyLangStatic();
  relabelListButtons();
  updateStatusChip();
})();
