/* global browser */

// Получить локаль пользователя
async function getLocale() {
  try {
    const { uiLocale } = await browser.storage.local.get('uiLocale');
    if (uiLocale) return uiLocale;
  } catch (e) {}
  const l = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return ['en', 'ru', 'hi', 'zh', 'ar'].includes(l) ? l : 'en';
}

// Открыть ссылку в новой вкладке
async function open(url) {
  try {
    await browser.tabs.create({ url });
  } catch (e) {
    console.error('Failed to open tab:', e);
  }
}

// Проверить Firefox
async function isFirefox() {
  try {
    const info = await (browser.runtime.getBrowserInfo?.() || Promise.resolve(null));
    return !!info && /firefox|gecko/i.test(`${info.name} ${info.vendor || ''}`);
  } catch {
    return /firefox/i.test(navigator.userAgent);
  }
}

function el(q) { return document.querySelector(q); }
function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

function li(text, sub) {
  const li = document.createElement('li');
  const t = document.createElement('div');
  t.textContent = text;
  t.className = 'item-title';
  li.appendChild(t);
  if (sub) {
    const s = document.createElement('div');
    s.textContent = sub;
    s.className = 'item-sub';
    li.appendChild(s);
  }
  return li;
}

async function readLists() {
  const res = await browser.storage.local.get(['lu_inputs', 'lu_clipboard']);
  const inputs = res.lu_inputs || [];
  const clip = res.lu_clipboard || [];
  let closed = [];
  try {
    const rc = await browser.sessions.getRecentlyClosed({ maxResults: 20 }) || [];
    closed = rc.filter(x => x.tab && x.tab.title && x.tab.url)
      .map(x => ({ title: x.tab.title, url: x.tab.url, ts: x.tab.lastAccessed || Date.now() }));
  } catch (e) { closed = []; }
  return { inputs, clip, closed };
}

function renderList(rootSel, items, map) {
  const root = el(rootSel);
  if (!root) return;
  clear(root);
  if (!items.length) {
    root.appendChild(li('—', ''));
    return;
  }
  items.forEach((it) => root.appendChild(map(it)));
}

// Показать напоминание о PRO/VIP (локально, без телеметрии)
async function showUpgradeReminder(locale) {
  try {
    const storage = await browser.storage.local.get(['installTime', 'upgradeHintDismissed']);
    
    // Установить время установки если его нет
    if (!storage.installTime) {
      await browser.storage.local.set({ installTime: Date.now() });
      return;
    }
    
    // Показать напоминание если прошло ≥ 7 дней и не было отклонено
    const daysSinceInstall = (Date.now() - storage.installTime) / (24 * 3600 * 1000);
    const shouldShow = !storage.upgradeHintDismissed && daysSinceInstall >= 7;
    
    if (shouldShow) {
      const reminder = document.createElement('div');
      reminder.className = 'upgrade-reminder';
      reminder.style.cssText = `
        margin: 6px 0; padding: 12px; background: #1e3a8a; border-radius: 8px; 
        border: 1px solid #3b82f6; font-size: 14px; line-height: 1.4;
      `;
      
      const texts = {
        en: 'Enjoying LifeUndo? Unlock PRO/VIP features →',
        ru: 'Нравится LifeUndo? Разблокируйте PRO/VIP →',
        hi: 'LifeUndo पसंद आ रहा है? PRO/VIP अनलॉक करें →',
        zh: '喜欢 LifeUndo？解锁 PRO/VIP 功能 →',
        ar: 'تستمتع بـ LifeUndo؟ افتح ميزات PRO/VIP →'
      };
      
      reminder.innerHTML = `
        <div style="color: #dbeafe; display: flex; align-items: center; justify-content: space-between;">
          <span>${texts[locale] || texts.en}</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button id="upgradeBtn" style="
              background: #3b82f6; color: white; border: none; padding: 4px 12px; 
              border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;
            ">Upgrade</button>
            <button id="dismissBtn" style="
              background: transparent; color: #94a3b8; border: none; cursor: pointer; 
              font-size: 16px; padding: 0; width: 20px; height: 20px;
            ">×</button>
          </div>
        </div>
      `;
      
      // Вставить после заголовка
      const header = el('#version');
      if (header && header.parentNode) {
        header.parentNode.insertBefore(reminder, header.nextSibling);
      }
      
      // Обработчики событий
      reminder.querySelector('#upgradeBtn').onclick = async (e) => {
        e.preventDefault();
        await open(`https://getlifeundo.com/${locale}/pricing`);
      };
      
      reminder.querySelector('#dismissBtn').onclick = async () => {
        await browser.storage.local.set({ upgradeHintDismissed: true });
        reminder.remove();
      };
    }
  } catch (e) {
    console.error('Failed to show upgrade reminder:', e);
  }
}

async function renderUI() {
  const ff = await isFirefox();
  const locale = await getLocale();
  
  // заголовок
  const badge = el('#version');
  if (badge) badge.textContent = ff ? 'Free Version (Firefox)' : 'Free Version';

  // показать блоки, убрать «PRO»
  document.querySelectorAll('[data-pro]').forEach(n => n.removeAttribute('data-pro'));

  const { inputs, clip, closed } = await readLists();
  renderList('#inputs', inputs, it => li(it.text, new Date(it.ts).toLocaleString()));
  renderList('#clipboard', clip, it => li(it.text, new Date(it.ts).toLocaleString()));
  renderList('#tabs', closed, it => li(it.title, it.url));

  // Обновить ссылки с учетом локали
  const links = {
    website: `https://getlifeundo.com/${locale}`,
    privacy: `https://getlifeundo.com/${locale}/privacy`,
    support: `https://getlifeundo.com/${locale}/support`,
    license: `https://getlifeundo.com/${locale}/license`
  };

  // Обновить все ссылки в навигации
  document.querySelectorAll('nav a').forEach(a => {
    const text = a.textContent.trim().toLowerCase();
    const linkMap = {
      'website': links.website,
      'privacy': links.privacy,
      'support': links.support,
      'license': links.license
    };
    
    if (linkMap[text]) {
      a.href = linkMap[text];
    }
  });

  // Обновить кнопку "Activate VIP"
  const activateBtn = el('#activate');
  if (activateBtn) {
    activateBtn.onclick = async (e) => {
      e.preventDefault();
      await open(`https://getlifeundo.com/${locale}/pricing`);
    };
  }

  // Показать напоминание о PRO/VIP (неблокирующе)
  setTimeout(() => showUpgradeReminder(locale), 100);
}

document.addEventListener('DOMContentLoaded', renderUI);