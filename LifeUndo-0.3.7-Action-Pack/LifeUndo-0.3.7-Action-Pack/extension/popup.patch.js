// popup.patch.js — add handlers & live VIP refresh
const btn = document.getElementById('btnActivateVip');
if (btn) {
  btn.addEventListener('click', () => {
    if (browser?.runtime?.openOptionsPage) {
      browser.runtime.openOptionsPage();
    } else {
      browser.runtime.sendMessage({ openOptions: true });
    }
  });
}

function refreshVip(isVip){
  document.querySelectorAll('[data-pro-only]').forEach(el => el.toggleAttribute('disabled', isVip));
  const badge = document.getElementById('vipBadge');
  if (badge) badge.hidden = !isVip;
}

// Initial read
browser.storage.local.get('lu_plan').then(({lu_plan}) => refreshVip(lu_plan === 'vip'));

// Live updates
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.lu_plan) {
    refreshVip(changes.lu_plan.newValue === 'vip');
  }
});
