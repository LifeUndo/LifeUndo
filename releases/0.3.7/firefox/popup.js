/* ===== i18n ===== */
const I18N = {
  en: {
    free: "Free Version",
    whatsNew: "What's new",
    wnItems: [
      "VIP activation from popup",
      "Stable RU/EN switching",
      "UI polish",
    ],
    feature1: "Latest text inputs",
    feature2: "Recently closed tabs",
    feature3: "Clipboard history",
    activateVip: "Activate VIP",
    vipActive: "VIP active",
    upgrade: "Upgrade to Pro",
    website: "Website",
    privacy: "Privacy",
    support: "Support",
    license: "License",
    importing: "Importing…",
    vipOk: "VIP activated ✅",
    vipErrPref: "Import error: ",
  },
  ru: {
    free: "Бесплатная версия",
    whatsNew: "Что нового",
    wnItems: [
      "Активация VIP из попапа",
      "Стабильный RU/EN переключатель",
      "Полировка UI",
    ],
    feature1: "Недавние вводы текста",
    feature2: "Недавно закрытые вкладки",
    feature3: "История буфера",
    activateVip: "Активировать VIP",
    vipActive: "VIP активен",
    upgrade: "Перейти на Pro",
    website: "Сайт",
    privacy: "Приватность",
    support: "Поддержка",
    license: "Лицензия",
    importing: "Импорт…",
    vipOk: "VIP активирован ✅",
    vipErrPref: "Ошибка импорта: ",
  },
};

function getLang() {
  return localStorage.getItem("lu_lang") || "en";
}
function setLang(l) {
  localStorage.setItem("lu_lang", l);
  applyI18n();
}

/* ===== UI refs ===== */
const btnEN = document.getElementById("btnEN");
const btnRU = document.getElementById("btnRU");
const planLabel = document.getElementById("planLabel");
const tFeature1 = document.getElementById("tFeature1");
const tFeature2 = document.getElementById("tFeature2");
const tFeature3 = document.getElementById("tFeature3");
const btnVip = document.getElementById("btnVip");
const btnPro = document.getElementById("btnPro");
const flashEl = document.getElementById("flash");

const linkWebsite = document.getElementById("linkWebsite");
const linkPrivacy = document.getElementById("linkPrivacy");
const linkSupport = document.getElementById("linkSupport");
const linkLicense = document.getElementById("linkLicense");

const whatsNew = document.getElementById("whatsNew");
const wnModal = document.getElementById("wnModal");
const wnClose = document.getElementById("wnClose");
const wnTitle = document.getElementById("wnTitle");
const wnList = document.getElementById("wnList");

/* ===== i18n apply ===== */
function applyI18n() {
  const l = getLang();
  const m = I18N[l];

  planLabel.textContent = m.free;
  whatsNew.textContent = m.whatsNew;
  tFeature1.textContent = m.feature1;
  tFeature2.textContent = m.feature2;
  tFeature3.textContent = m.feature3;
  btnVip.textContent = m.activateVip;
  btnPro.textContent = m.upgrade;

  // футер
  linkWebsite.textContent = m.website;
  linkPrivacy.textContent = m.privacy;
  linkSupport.textContent = m.support;
  linkLicense.textContent = m.license;

  // what's new
  wnTitle.textContent = `${m.whatsNew} (v0.3.7)`;
  wnList.innerHTML = "";
  m.wnItems.forEach((txt) => {
    const li = document.createElement("li");
    li.textContent = txt;
    wnList.appendChild(li);
  });
}

/* ===== helpers ===== */
function flash(text, cls) {
  flashEl.textContent = text || "";
  flashEl.className = cls || "";
  if (text) setTimeout(() => (flashEl.textContent = ""), 5000);
}
function setVipUI() {
  const l = getLang();
  btnVip.disabled = true;
  btnVip.classList.add("is-disabled");
  btnVip.textContent = I18N[l].vipActive;
  planLabel.textContent = "VIP";
  document.querySelectorAll(".pro").forEach((el) => (el.style.display = "none"));
  btnPro.style.display = "none";
}
function setFreeUI() {
  const l = getLang();
  btnVip.disabled = false;
  btnVip.classList.remove("is-disabled");
  btnVip.textContent = I18N[l].activateVip;
  planLabel.textContent = I18N[l].free;
  document.querySelectorAll(".pro").forEach((el) => (el.style.display = ""));
  btnPro.style.display = "";
}

/* ===== events ===== */
btnEN.addEventListener("click", () => setLang("en"));
btnRU.addEventListener("click", () => setLang("ru"));

btnPro.addEventListener("click", () =>
  window.open("https://lifeundo.ru/#pricing", "_blank")
);

// Перенаправляем на страницу options.html
btnVip.addEventListener("click", () => {
    browser.tabs.create({
        url: 'options.html'
    });
});


/* what's new */
whatsNew.addEventListener("click", () => {
  wnModal.showModal();
});
wnClose.addEventListener("click", () => wnModal.close());
wnModal.addEventListener("click", (e) => {
  if (e.target === wnModal) wnModal.close();
});

/* storage watcher — живое переключение */
browser.storage.onChanged.addListener((changes) => {
  if (changes.lu_plan) {
    const newVal = changes.lu_plan.newValue;
    if (newVal === "vip") setVipUI();
    else setFreeUI();
  }
});

/* init */
applyI18n();
(async () => {
  const st = await browser.storage.local.get(["lu_plan"]);
  if (st.lu_plan === "vip") setVipUI();
  else setFreeUI();

  // ссылки
  linkWebsite.href = "https://lifeundo.ru";
  linkPrivacy.href = "https://lifeundo.ru/privacy/";
  linkSupport.href = "https://t.me/LifeUndo";
  linkLicense.href = "options.html";
})();