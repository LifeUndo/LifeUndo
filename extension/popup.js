// LifeUndo Popup - v0.3.7.16
// Firefox hotfix: add content script for text input collection

const api = window.browser || window.chrome;

// ==== DOM Elements ====
const btnVip = document.getElementById('btnVip');
const btnPro = document.getElementById('btnPro');
const upgradeBtn = document.getElementById('upgradeBtn');
const vipFile = document.getElementById('vipFile');
const flashEl = document.getElementById('flash');
const planTag = document.getElementById('planLabel');
const whatsNewBtn = document.getElementById('btnWhatsNew');
const wnModal = document.getElementById('wnModal');
const versionTag = document.getElementById('version');

// Lists
const textList = document.getElementById('textList');
const tabList = document.getElementById('tabList');
const clipList = document.getElementById('clipList');
const shotList = document.getElementById('shotList');
const btnMakeShot = document.getElementById('btnMakeShot');

// Pro badges
const textProBadge = document.getElementById('textProBadge');
const tabProBadge = document.getElementById('tabProBadge');
const clipProBadge = document.getElementById('clipProBadge');

// License Modal Elements
const linkLicense = document.getElementById('linkLicense');
const licenseModal = document.getElementById('licenseModal');
const closeLicenseModalBtn = document.getElementById('closeLicenseModal');
const licenseBackdrop = document.getElementById('licenseBackdrop');
const licenseLevel = document.getElementById('licenseLevel');
const licenseExpires = document.getElementById('licenseExpires');
const bonusStatus = document.getElementById('bonusStatus');
const bonusExpires = document.getElementById('bonusExpires');
const resendEmailBtn = document.getElementById('resendEmailBtn');
const openAccountBtn = document.getElementById('openAccountBtn');
const bindEmail = document.getElementById('bindEmail');
const bindOrderId = document.getElementById('bindOrderId');
const bindPurchaseBtn = document.getElementById('bindPurchaseBtn');

// ==== Firefox Detection ====
const IS_FIREFOX = typeof browser !== 'undefined' && /Firefox/i.test(navigator.userAgent);

// ==== I18n ====
let currentLang = 'en';
const i18n = {
  en: {
    badge_free: "Free Version",
    badge_vip: "VIP",
    btn_activate_vip: "Activate VIP",
    btn_vip_active: "VIP active",
    btn_upgrade_pro: "Upgrade to Pro",
    footer_website: "Website",
    footer_privacy: "Privacy", 
    footer_support: "Support",
    footer_license: "License",
    whats_new: "What's new",
    whats_new_title: "What's new (v0.3.7.16)",
    whats_new_points: [
      "Fixed popup links and i18n",
      "Enabled free features for Firefox",
      "Added basic functionality",
      "Improved UI consistency"
    ],
    status_importing: "Importing...",
    status_vip_ok: "VIP activated ✅",
    status_import_err: "Import error: ",
    no_data: "No data yet",
    click_to_restore: "Click to restore",
    clipboard_empty: "Clipboard history will appear here"
  },
  ru: {
    badge_free: "Бесплатная версия",
    badge_vip: "VIP",
    btn_activate_vip: "Активировать VIP",
    btn_vip_active: "VIP активен",
    btn_upgrade_pro: "Перейти на Pro",
    footer_website: "Сайт",
    footer_privacy: "Приватность",
    footer_support: "Поддержка", 
    footer_license: "Лицензия",
    whats_new: "Что нового",
    whats_new_title: "Что нового (v0.3.7.16)",
    whats_new_points: [
      "Исправлены ссылки в попапе и i18n",
      "Включены бесплатные функции для Firefox",
      "Добавлена базовая функциональность",
      "Улучшена консистентность UI"
    ],
    status_importing: "Импорт...",
    status_vip_ok: "VIP активирован ✅",
    status_import_err: "Ошибка импорта: ",
    no_data: "Пока нет данных",
    click_to_restore: "Нажмите для восстановления",
    clipboard_empty: "История буфера появится здесь"
  }
};

// ---- Screenshots ----
async function loadScreenshots() {
  try {
    const res = await api.runtime.sendMessage({ type: 'LU_GET_SCREENSHOTS' });
    const list = res?.list || [];
    if (!shotList) return;
    shotList.textContent = '';
    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'item muted';
      empty.textContent = 'No screenshots yet';
      shotList.appendChild(empty);
      return;
    }
    list.forEach((it, i) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.dataset.index = String(i);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      const img = document.createElement('img');
      img.src = it.dataUrl;
      img.alt = 'shot';
      img.style.width = '128px';
      img.style.borderRadius = '4px';
      img.style.border = '1px solid #333';
      const meta = document.createElement('div');
      meta.className = 'muted';
      meta.textContent = new Date(it.ts || Date.now()).toLocaleString();
      const btnOpen = document.createElement('button');
      btnOpen.textContent = 'Open';
      btnOpen.addEventListener('click', (e) => {
        e.stopPropagation();
        api.tabs.create({ url: it.dataUrl });
      });
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Delete';
      btnDel.addEventListener('click', async (e) => {
        e.stopPropagation();
        const res2 = await api.runtime.sendMessage({ type: 'LU_DELETE_SCREENSHOT', payload: { index: i } });
        if (res2?.ok) loadScreenshots();
      });
      row.appendChild(img);
      row.appendChild(meta);
      row.appendChild(btnOpen);
      row.appendChild(btnDel);
      item.appendChild(row);
      shotList.appendChild(item);
    });
  } catch (e) {
    // silent
  }
}

// Clipboard search
document.getElementById('clipSearch')?.addEventListener('input', (e) => {
  const val = e.target.value || '';
  loadClipboardHistory(val);
});

// Make screenshot
btnMakeShot?.addEventListener('click', async () => {
  try {
    const res = await api.runtime.sendMessage({ type: 'LU_TAKE_SCREENSHOT' });
    if (!res?.ok) throw new Error(res?.reason || 'capture_failed');
    await loadScreenshots();
    flash('Screenshot saved', 'ok');
  } catch (e) {
    flash('Screenshot failed', 'err');
  }
});

// Load and persist clipboard protection settings
(async function initClipboardProtectionSettings() {
  try {
    const { lu_protect_clipboard = false, lu_exclude_domains = '' } = await api.storage.local.get(['lu_protect_clipboard', 'lu_exclude_domains']);
    const chk = document.getElementById('chkProtect');
    const excl = document.getElementById('excludeDomains');
    if (chk) chk.checked = !!lu_protect_clipboard;
    if (excl) excl.value = String(lu_exclude_domains || '');
    chk?.addEventListener('change', async (ev) => {
      await api.storage.local.set({ lu_protect_clipboard: !!ev.target.checked });
      flash(ev.target.checked ? 'Clipboard protection ON' : 'Clipboard protection OFF');
    });
    let saveTimer;
    excl?.addEventListener('input', (ev) => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        await api.storage.local.set({ lu_exclude_domains: String(ev.target.value || '') });
        flash('Excluded domains saved');
      }, 400);
    });
  } catch (_) {}
})();

// ==== Functions ====

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyLang() {
  // Update UI texts
  if (planTag) planTag.textContent = t('badge_free');
  if (btnVip) btnVip.textContent = t('btn_activate_vip');
  if (btnPro) btnPro.textContent = t('btn_upgrade_pro');
  if (whatsNewBtn) whatsNewBtn.textContent = t('whats_new');
  
  // Update footer links
  const linkWebsite = document.getElementById('linkWebsite');
  const linkPrivacy = document.getElementById('linkPrivacy');
  const linkSupport = document.getElementById('linkSupport');
  const linkLicense = document.getElementById('linkLicense');
  
  if (linkWebsite) linkWebsite.textContent = t('footer_website');
  if (linkPrivacy) linkPrivacy.textContent = t('footer_privacy');
  if (linkSupport) linkSupport.textContent = t('footer_support');
  if (linkLicense) linkLicense.textContent = t('footer_license');
  
  // Update What's New modal
  const wnTitle = document.querySelector('#wnModal h3');
  const wnList = document.querySelector('#wnModal ul');
  if (wnTitle) wnTitle.textContent = t('whats_new_title');
  if (wnList) {
    // Clear existing content
    wnList.textContent = '';
    t('whats_new_points').forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      wnList.appendChild(li);
    });
  }
  
  // Refresh VIP UI after language change
  refreshVipUi();
}

function flash(message, type = '') {
  if (!flashEl) return;
  flashEl.textContent = message || '';
  flashEl.className = type ? `flash ${type}` : 'flash';
}

// ---- Session Backups helpers ----
async function loadBackups() {
  try {
    const res = await api.runtime.sendMessage({ type: 'LU_GET_BACKUPS' });
    const backups = res?.backups || [];
    const list = document.getElementById('backupList');
    if (!list) return;
    list.textContent = '';
    if (backups.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'item muted';
      empty.textContent = 'No backups yet';
      list.appendChild(empty);
      return;
    }
    backups.slice(0, 10).forEach((snap, i) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.dataset.index = String(i);
      const title = document.createElement('div');
      title.textContent = new Date(snap.ts || Date.now()).toLocaleString();
      const meta = document.createElement('div');
      meta.className = 'muted';
      const count = (snap.windows || []).reduce((acc, w) => acc + (w.tabs?.length || 0), 0);
      meta.textContent = `${(snap.windows || []).length} windows, ${count} tabs`;
      item.appendChild(title);
      item.appendChild(meta);
      list.appendChild(item);
    });
  } catch (e) {
    flash('Failed to load backups', 'err');
  }
}

async function refreshVipUi() {
  const { lu_plan } = await api.storage.local.get('lu_plan');
  const isVip = lu_plan === 'vip';
  
  if (isVip) {
    setVipUiOn();
  } else {
    setVipUiOff();
  }
}

function setVipUiOn() {
  if (planTag) planTag.textContent = t('badge_vip');
  document.querySelectorAll('.pro').forEach(el => el.style.display = 'none');
  
  if (btnVip) {
    btnVip.textContent = t('btn_vip_active');
    btnVip.classList.add('is-disabled');
    btnVip.disabled = true;
  }
  
  if (btnPro) btnPro.style.display = 'none';
}

function setVipUiOff() {
  if (planTag) planTag.textContent = t('badge_free');
  document.querySelectorAll('.pro').forEach(el => el.style.display = '');
  
  if (btnVip) {
    btnVip.textContent = t('btn_activate_vip');
    btnVip.classList.remove('is-disabled');
    btnVip.disabled = false;
  }
  
  if (btnPro) btnPro.style.display = '';
}

// ==== Firefox Free Features ====
async function loadTextInputs() {
  try {
    const { recentInputs = [] } = await api.storage.local.get('recentInputs');
    
    if (textList) {
      // Clear existing content
      textList.textContent = '';
      
      if (recentInputs.length === 0) {
        const noDataDiv = document.createElement('div');
        noDataDiv.className = 'item muted';
        noDataDiv.textContent = t('no_data');
        textList.appendChild(noDataDiv);
      } else {
        recentInputs.slice(0, 5).forEach((input, i) => {
          const item = document.createElement('div');
          item.className = 'item';
          item.setAttribute('data-index', i);
          
          const textDiv = document.createElement('div');
          textDiv.className = 'mono';
          textDiv.textContent = input.text.substring(0, 50) + (input.text.length > 50 ? '...' : '');
          
          const timeDiv = document.createElement('div');
          timeDiv.className = 'muted';
          timeDiv.textContent = new Date(input.timestamp).toLocaleString();
          
          item.appendChild(textDiv);
          item.appendChild(timeDiv);
          textList.appendChild(item);
        });
      }
    }
  } catch (e) {
    console.error('Error loading text inputs:', e);
    if (textList) {
      textList.textContent = '';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'item muted';
      errorDiv.textContent = t('no_data');
      textList.appendChild(errorDiv);
    }
  }
}

async function loadRecentTabs() {
  try {
    const sessions = await api.sessions.getRecentlyClosed({ maxResults: 5 });
    
    if (tabList) {
      // Clear existing content
      tabList.textContent = '';
      
      if (sessions.length === 0) {
        const noDataDiv = document.createElement('div');
        noDataDiv.className = 'item muted';
        noDataDiv.textContent = t('no_data');
        tabList.appendChild(noDataDiv);
      } else {
        sessions.forEach((session, i) => {
          const item = document.createElement('div');
          item.className = 'item';
          if (session.tab?.sessionId) {
            item.setAttribute('data-session-id', session.tab.sessionId);
          }
          
          const titleDiv = document.createElement('div');
          titleDiv.textContent = session.tab?.title || 'Untitled';
          
          const urlDiv = document.createElement('div');
          urlDiv.className = 'muted';
          urlDiv.textContent = session.tab?.url || '';
          
          item.appendChild(titleDiv);
          item.appendChild(urlDiv);
          tabList.appendChild(item);
        });
      }
    }
  } catch (e) {
    console.error('Error loading recent tabs:', e);
    if (tabList) {
      tabList.textContent = '';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'item muted';
      errorDiv.textContent = t('no_data');
      tabList.appendChild(errorDiv);
    }
  }
}

async function loadClipboardHistory(query = '') {
  try {
    const result = await api.storage.local.get('lu_clipboard_history');
    let clipboardHistory = result.lu_clipboard_history || [];
    const q = String(query || '').toLowerCase();
    if (q) {
      clipboardHistory = clipboardHistory.filter(it => String(it.value || '').toLowerCase().includes(q));
    }
    
    if (clipList) {
      // Clear existing content
      clipList.textContent = '';
      
      if (clipboardHistory.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'item muted';
        emptyDiv.textContent = t('clipboard_empty');
        clipList.appendChild(emptyDiv);
      } else {
        clipboardHistory.slice(0, 5).forEach((item, i) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'item';
          itemDiv.setAttribute('data-index', i);
          
          const textDiv = document.createElement('div');
          textDiv.className = 'mono';
          const val = String(item.value || '');
          textDiv.textContent = val.substring(0, 50) + (val.length > 50 ? '...' : '');
          
          const timeDiv = document.createElement('div');
          timeDiv.className = 'muted';
          const ts = item.ts || item.timestamp || Date.now();
          timeDiv.textContent = new Date(ts).toLocaleString();
          
          itemDiv.appendChild(textDiv);
          itemDiv.appendChild(timeDiv);
          clipList.appendChild(itemDiv);
        });
      }
    }
  } catch (e) {
    console.error('Error loading clipboard history:', e);
    if (clipList) {
      clipList.textContent = '';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'item muted';
      errorDiv.textContent = t('clipboard_empty');
      clipList.appendChild(errorDiv);
    }
  }
}

// ==== Event Handlers ====
async function restoreTab(sessionId) {
  try {
    await api.sessions.restore(sessionId);
    flash('Tab restored!', 'ok');
  } catch (e) {
    console.error('Error restoring tab:', e);
    flash('Failed to restore tab', 'err');
  }
}

// ==== What's New Modal ====
let isModalOpen = false;
function toggleWhatsNew() {
  isModalOpen = !isModalOpen;
  if (wnModal) {
    wnModal.classList.toggle('hidden', !isModalOpen);
  }
}

// ==== Event Listeners ====

// Language switching
document.getElementById('btnEN')?.addEventListener('click', () => {
  currentLang = 'en';
  localStorage.setItem('lu_lang', 'en');
  applyLang();
});

document.getElementById('btnRU')?.addEventListener('click', () => {
  currentLang = 'ru';
  localStorage.setItem('lu_lang', 'ru');
  applyLang();
});

// VIP activation
btnVip?.addEventListener('click', () => {
  if (btnVip.disabled) return;
  vipFile?.click();
});

// VIP file import
vipFile?.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  if (!file) return;
  
  try {
    flash(t('status_importing'));
    const lic = await LicenseCore.importFromFile(file, null);
    flash(t('status_vip_ok'), 'ok');
  } catch (e) {
    console.error('VIP import error:', e);
    flash(t('status_import_err') + e.message, 'err');
  } finally {
    ev.target.value = '';
  }
});

// ===== CSV helpers =====
function csvEscape(val = '') {
  const s = String(val ?? '');
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function csvRowsToBackups(rows) {
  // rows: header + data rows with columns: ts,windowIndex,tabIndex,url,title
  const backupsMap = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length < 5) continue;
    const ts = Number(r[0]) || Date.now();
    const wIdx = Number(r[1]) || 0;
    const tIdx = Number(r[2]) || 0;
    const url = r[3] || '';
    const title = r[4] || '';
    if (!url) continue;
    if (!backupsMap.has(ts)) backupsMap.set(ts, { ts, windows: [] });
    const snap = backupsMap.get(ts);
    while (snap.windows.length <= wIdx) snap.windows.push({ tabs: [] });
    while (snap.windows[wIdx].tabs.length < tIdx) snap.windows[wIdx].tabs.push({ url: '', title: '' });
    snap.windows[wIdx].tabs[tIdx] = { url, title };
  }
  return Array.from(backupsMap.values());
}

function parseCsv(text) {
  // Simple CSV parser supporting quotes
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const out = [];
  for (const line of lines) {
    if (line === '') continue;
    const row = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          row.push(cur);
          cur = '';
        } else {
          cur += ch;
        }
      }
    }
    row.push(cur);
    out.push(row);
  }
  return out;
}

function backupsToCsv(backups = []) {
  const header = ['ts', 'windowIndex', 'tabIndex', 'url', 'title'];
  const rows = [header.join(',')];
  backups.forEach(snap => {
    const ts = snap.ts || Date.now();
    (snap.windows || []).forEach((w, wi) => {
      (w.tabs || []).forEach((t, ti) => {
        const url = csvEscape(t.url || '');
        const title = csvEscape(t.title || '');
        rows.push([ts, wi, ti, url, title].join(','));
      });
    });
  });
  return rows.join('\n');
}

// Export CSV
document.getElementById('btnExportCsv')?.addEventListener('click', async () => {
  try {
    const res = await api.runtime.sendMessage({ type: 'LU_GET_BACKUPS' });
    const backups = res?.backups || [];
    const csv = backupsToCsv(backups);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `lifeundo-backups-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash('Exported CSV', 'ok');
  } catch (e) {
    flash('Export CSV failed', 'err');
  }
});

// Import CSV
document.getElementById('btnImportCsv')?.addEventListener('click', () => {
  document.getElementById('importFileCsv')?.click();
});

document.getElementById('importFileCsv')?.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const rows = parseCsv(text);
    const backups = csvRowsToBackups(rows);
    const res = await api.runtime.sendMessage({ type: 'LU_IMPORT_BACKUPS', payload: { content: JSON.stringify({ backups }), encrypted: false } });
    if (!res?.ok) throw new Error(res?.reason || 'Import failed');
    await loadBackups();
    flash('Imported CSV', 'ok');
  } catch (e) {
    console.error(e);
    flash('Import CSV failed', 'err');
  } finally {
    ev.target.value = '';
  }
});

// Upgrade button
upgradeBtn?.addEventListener('click', () => {
  const locale = currentLang === 'ru' ? 'ru' : 'en';
  api.tabs.create({ url: `https://getlifeundo.com/${locale}/pricing#pro` });
});

// What's New modal
whatsNewBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  toggleWhatsNew();
});

// Close modal on backdrop click or ESC
wnModal?.addEventListener('click', (e) => {
  if (e.target === wnModal) {
    isModalOpen = false;
    wnModal.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isModalOpen) {
    isModalOpen = false;
    if (wnModal) wnModal.classList.add('hidden');
  }
});

// Footer links
document.getElementById('linkWebsite')?.addEventListener('click', (e) => {
  e.preventDefault();
  api.tabs.create({ url: 'https://getlifeundo.com' });
});

document.getElementById('linkPrivacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  const locale = currentLang === 'ru' ? 'ru' : 'en';
  api.tabs.create({ url: `https://getlifeundo.com/${locale}/privacy` });
});

document.getElementById('linkSupport')?.addEventListener('click', (e) => {
  e.preventDefault();
  api.tabs.create({ url: 'https://t.me/GetLifeUndoSupport' });
});

document.getElementById('linkLicense')?.addEventListener('click', (e) => {
  e.preventDefault();
  const locale = currentLang === 'ru' ? 'ru' : 'en';
  api.tabs.create({ url: `https://getlifeundo.com/${locale}/legal/offer` });
});

// Tab list click handlers
tabList?.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item && item.dataset.sessionId) {
    restoreTab(item.dataset.sessionId);
  }
});

// Clipboard list click-to-copy
clipList?.addEventListener('click', async (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  const idx = Number(item.dataset.index || -1);
  if (Number.isNaN(idx) || idx < 0) return;
  try {
    const result = await api.storage.local.get('lu_clipboard_history');
    const arr = result.lu_clipboard_history || [];
    const val = String(arr[idx]?.value || '');
    if (!val) return;
    await navigator.clipboard.writeText(val);
    flash('Copied', 'ok');
  } catch (err) {
    flash('Copy failed', 'err');
  }
});

// Backup list click-to-restore
document.getElementById('backupList')?.addEventListener('click', async (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  const idx = Number(item.dataset.index || -1);
  if (Number.isNaN(idx) || idx < 0) return;
  try {
    const res = await api.runtime.sendMessage({ type: 'LU_GET_BACKUPS' });
    const backups = res?.backups || [];
    const snap = backups[idx];
    if (!snap) return;
    await api.runtime.sendMessage({ type: 'LU_RESTORE_BACKUP', payload: { snapshot: snap } });
    flash('Session restored', 'ok');
  } catch (e1) {
    flash('Restore failed', 'err');
  }
});

// Snapshot now
document.getElementById('btnSnapshot')?.addEventListener('click', async () => {
  try {
    await api.runtime.sendMessage({ type: 'LU_TAKE_SNAPSHOT' });
    await loadBackups();
    flash('Snapshot saved', 'ok');
  } catch (e) {
    flash('Snapshot failed', 'err');
  }
});

// Export backups (optionally encrypted)
document.getElementById('btnExport')?.addEventListener('click', async () => {
  try {
    const pwd = document.getElementById('pwdField')?.value || '';
    const res = await api.runtime.sendMessage({ type: 'LU_EXPORT_BACKUPS', payload: { password: pwd } });
    if (!res?.ok) throw new Error(res?.reason || 'Export failed');
    let content = '';
    if (res.encrypted) {
      content = JSON.stringify({ encrypted: true, iv: res.iv, salt: res.salt, data: res.data });
    } else {
      content = res.data;
    }
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `lifeundo-backups-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash('Exported', 'ok');
  } catch (e) {
    flash('Export failed', 'err');
  }
});

// Import backups
document.getElementById('btnImport')?.addEventListener('click', () => {
  document.getElementById('importFile')?.click();
});

document.getElementById('importFile')?.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    let payload = { content: text, encrypted: false };
    try {
      const obj = JSON.parse(text);
      if (obj && (obj.encrypted || (obj.iv && obj.salt && obj.data))) {
        const pwd = document.getElementById('pwdField')?.value || '';
        payload = { content: obj.data, encrypted: true, iv: obj.iv, salt: obj.salt, password: pwd };
      }
    } catch (_) {}
    const res = await api.runtime.sendMessage({ type: 'LU_IMPORT_BACKUPS', payload });
    if (!res?.ok) throw new Error(res?.reason || 'Import failed');
    await loadBackups();
    flash('Imported', 'ok');
  } catch (e) {
    flash('Import failed', 'err');
  } finally {
    ev.target.value = '';
  }
});

// ==== License Modal Functions ====
function openLicenseModal() {
  licenseModal.classList.remove('hidden');
  loadLicenseStatus();
}

function closeLicenseModal() {
  licenseModal.classList.add('hidden');
}

function loadLicenseStatus() {
  api.storage.local.get(['lu_plan', 'lu_email', 'lu_expires', 'lu_bonus_expires'], (result) => {
    const plan = result.lu_plan || 'free';
    const email = result.lu_email || '';
    const expires = result.lu_expires || '';
    const bonusExpires = result.lu_bonus_expires || '';

    if (licenseLevel) licenseLevel.textContent = plan === 'free' ? 'No active license' : plan.toUpperCase();
    if (licenseExpires) licenseExpires.textContent = expires || '-';
    
    if (bonusExpires && bonusStatus) {
      bonusStatus.style.display = 'block';
      bonusExpires.textContent = bonusExpires;
    } else if (bonusStatus) {
      bonusStatus.style.display = 'none';
    }

    if (email && bindEmail) {
      bindEmail.value = email;
    }
  });
}

function resendActivationEmail() {
  api.storage.local.get(['lu_email'], (result) => {
    const email = result.lu_email;
    if (!email) {
      flash('Please enter your email first', 'err');
      return;
    }

    fetch('https://getlifeundo.com/api/account/resend-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        flash('Activation email sent!', 'ok');
      } else {
        flash('Error: ' + (data.error || 'Unknown error'), 'err');
      }
    })
    .catch(error => {
      flash('Network error: ' + error.message, 'err');
    });
  });
}

function openAccountPage() {
  api.storage.local.get(['lu_email'], (result) => {
    const email = result.lu_email || '';
    const url = `https://getlifeundo.com/ru/account${email ? '?email=' + encodeURIComponent(email) : ''}`;
    api.tabs.create({ url });
  });
}

function bindPurchase() {
  const email = bindEmail.value.trim();
  const orderId = bindOrderId.value.trim();

  if (!email || !orderId) {
    flash('Please enter both email and order ID', 'err');
    return;
  }

  fetch(`https://getlifeundo.com/api/payment/summary?order_id=${encodeURIComponent(orderId)}`)
    .then(response => response.json())
    .then(data => {
      if (data.ok && data.email === email) {
        api.storage.local.set({
          lu_plan: data.level || 'pro',
          lu_email: email,
          lu_expires: data.expires_at || '',
          lu_bonus_expires: data.bonus_expires_at || ''
        });
        
        flash('Purchase bound successfully!', 'ok');
        loadLicenseStatus();
        refreshVipUi();
      } else {
        flash('Order not found or email mismatch', 'err');
      }
    })
    .catch(error => {
      flash('Error: ' + error.message, 'err');
    });
}

// License Modal Event Listeners
linkLicense?.addEventListener('click', (e) => {
  e.preventDefault();
  openLicenseModal();
});

closeLicenseModalBtn?.addEventListener('click', closeLicenseModal);
licenseBackdrop?.addEventListener('click', closeLicenseModal);
resendEmailBtn?.addEventListener('click', resendActivationEmail);
openAccountBtn?.addEventListener('click', openAccountPage);
bindPurchaseBtn?.addEventListener('click', bindPurchase);

// Storage change listener for live VIP updates
api.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.lu_plan) {
    refreshVipUi();
  }
  if (changes.lu_clipboard_history) {
    loadClipboardHistory();
  }
});

// ==== Initialize ====
// Set version in modal
try {
  const v = api.runtime?.getManifest?.()?.version || '';
  if (versionTag) versionTag.textContent = v ? `(v${v})` : '';
} catch {}

// Load saved language
currentLang = localStorage.getItem('lu_lang') || 'en';

// Initialize UI
applyLang();
refreshVipUi();

// Load data
loadClipboardHistory();
loadScreenshots();
// Keep Firefox-specific free features
if (IS_FIREFOX) {
  if (textProBadge) textProBadge.classList.add('hidden');
  if (tabProBadge) tabProBadge.classList.add('hidden');
  if (clipProBadge) clipProBadge.classList.add('hidden');
  loadTextInputs();
  loadRecentTabs();
}