import { t, getLang, setLang } from './i18n.js';

const AMO_RU = 'https://addons.mozilla.org/ru/firefox/addon/lifeundo/';
const AMO_EN = 'https://addons.mozilla.org/en-US/firefox/addon/lifeundo/';
const SITE = 'https://lifeundo.ru/';
const PRIV = 'https://lifeundo.ru/privacy/';

const TRIAL_DAYS = 7;

async function ensureTrialSeed() {
  // стартуем триал, если нет лицензии и нет отметки
  const st = await browser.storage.local.get(['trialStartedAt', 'license', 'trialUsed']);
  if (!st.license && !st.trialStartedAt) {
    const now = Date.now();
    await browser.storage.local.set({ trialStartedAt: now });
    // синхронизируем флажок в storage.sync (мягкая защита от реинсталла в том же аккаунте)
    await browser.storage.sync.set({ trialSeed: now });
  }
}

function daysLeft(start) {
  const end = start + TRIAL_DAYS * 86400 * 1000;
  const diff = Math.ceil((end - Date.now()) / (86400 * 1000));
  return Math.max(0, diff);
}

async function render() {
  const lang = await getLang();
  const lnkAmo = lang === 'ru' ? AMO_RU : AMO_EN;

  document.getElementById('lbl-inputs').textContent = t('ui_latest_inputs');
  document.getElementById('lbl-tabs').textContent = t('ui_recent_tabs');
  document.getElementById('lbl-clip').textContent = t('ui_clipboard');

  const st = await browser.storage.local.get(['trialStartedAt','license','plan']);
  const trialEl = document.getElementById('trial');

  if (st.license) {
    trialEl.textContent = `${t('opt_current_plan')}: ${st.plan || 'Pro'}`;
  } else if (st.trialStartedAt) {
    const left = daysLeft(st.trialStartedAt);
    trialEl.textContent = left > 0 ? t('ui_trial_days_left', { DAYS: String(left) }) : t('ui_trial_ended');
    if (left <= 0) await browser.storage.local.set({ trialUsed: true }); // отметка
  } else {
    trialEl.textContent = t('ui_trial_days_left', { DAYS: String(TRIAL_DAYS) });
  }

  const up = document.getElementById('btn-upgrade');
  up.textContent = t('ui_upgrade');
  up.onclick = () => browser.runtime.openOptionsPage();

  const ws = document.getElementById('lnk-website');
  ws.textContent = t('ui_website');
  ws.href = SITE;

  const pr = document.getElementById('lnk-privacy');
  pr.textContent = t('ui_privacy');
  pr.href = PRIV;

  const fx = document.getElementById('lnk-firefox');
  fx.textContent = t('ui_firefox');
  fx.href = lnkAmo;

  document.getElementById('lang-en').onclick = () => setLang('en');
  document.getElementById('lang-ru').onclick = () => setLang('ru');
}

(async () => {
  await ensureTrialSeed();
  await render();
})();