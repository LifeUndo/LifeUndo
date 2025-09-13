import { t, getLang, setLang } from './i18n.js';
import { verifyToken, daysLeft, TRIAL_DAYS } from './license.js';

const CHECKOUT_EN = 'https://lifeundo.gumroad.com/l/lifeundo-pro?variant=Pro';
const CHECKOUT_RU = 'https://lifeundo.gumroad.com/l/lifeundo-pro?locale=ru&variant=Pro';

async function fillTexts() {
  document.title = t('opt_title');
  document.getElementById('opt-title').textContent = t('opt_title');
  document.getElementById('h-import').textContent = t('opt_import_license');
  document.getElementById('lbl-token').textContent = t('opt_paste_token');
  document.getElementById('btn-verify').textContent = t('opt_verify');
  document.getElementById('h-buy').textContent = t('opt_buy');
  document.getElementById('hint').textContent = t('checkout_hint');
  document.getElementById('open-checkout').textContent = t('opt_open_checkout');

  const lang = await getLang();
  document.getElementById('lang').value = lang;

  const st = await browser.storage.local.get(['trialStartedAt','license','plan','email']);
  const planLine = document.getElementById('plan-line');
  const trialLine = document.getElementById('trial-line');

  if (st.license) {
    planLine.textContent = `${t('opt_current_plan')}: ${st.plan || 'Pro'} (${st.email || ''})`;
    trialLine.textContent = '';
  } else if (st.trialStartedAt) {
    const left = daysLeft(st.trialStartedAt);
    trialLine.textContent = left > 0 ? `${t('opt_trial_left')}: ${left}` : t('ui_trial_ended');
    planLine.textContent = `${t('opt_current_plan')}: ${t('opt_plan_free')}`;
  } else {
    planLine.textContent = `${t('opt_current_plan')}: ${t('opt_plan_free')}`;
    trialLine.textContent = `${t('opt_trial_left')}: ${TRIAL_DAYS}`;
  }

  const checkout = document.getElementById('checkout');
  checkout.src = (lang === 'ru') ? CHECKOUT_RU : CHECKOUT_EN;
}

async function importFile(file) {
  const txt = await file.text();
  await verifyAndStore(txt);
}

async function verifyAndStore(txt) {
  const st = document.getElementById('status');
  try {
    const info = await verifyToken(txt.trim());
    await browser.storage.local.set({ license: info.token, plan: info.plan, email: info.email, licenseExp: info.expires });
    st.textContent = t('opt_status_valid');
    st.className = 'ok';
    await fillTexts();
  } catch (e) {
    st.textContent = t('opt_status_invalid');
    st.className = 'bad';
    console.error(e);
  }
}

document.getElementById('file').addEventListener('change', (e) => {
  const f = e.target.files?.[0];
  if (f) importFile(f);
});

document.getElementById('btn-verify').onclick = async () => {
  const txt = document.getElementById('ta').value;
  await verifyAndStore(txt);
};

document.getElementById('open-checkout').onclick = async () => {
  const lang = await getLang();
  const url = (lang === 'ru') ? CHECKOUT_RU : CHECKOUT_EN;
  document.getElementById('checkout').src = url;
};

document.getElementById('lang').onchange = async (e) => {
  await setLang(e.target.value);
};

fillTexts();