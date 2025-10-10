/* global browser */

// Wait for i18n helper to be available
function waitForI18n() {
  return new Promise((resolve) => {
    const checkI18n = () => {
      if (window.i18n) {
        resolve(window.i18n);
      } else {
        setTimeout(checkI18n, 10);
      }
    };
    checkI18n();
  });
}

// Create list item
function createListItem(text, origin, timestamp) {
  const item = document.createElement('div');
  item.className = 'list-item';
  
  const title = document.createElement('div');
  title.className = 'item-title';
  title.textContent = text;
  
  const sub = document.createElement('div');
  sub.className = 'item-sub';
  sub.textContent = origin + ' • ' + window.i18n.formatDateTime(timestamp);
  
  item.appendChild(title);
  item.appendChild(sub);
  
  return item;
}

// Create screenshot item
function createScreenshotItem(screenshot) {
  const item = document.createElement('div');
  item.className = 'screenshot-item';
  
  const thumb = document.createElement('img');
  thumb.className = 'screenshot-thumb';
  thumb.src = screenshot.dataUrl;
  thumb.alt = 'Screenshot';
  
  const info = document.createElement('div');
  info.className = 'screenshot-info';
  
  const title = document.createElement('div');
  title.className = 'screenshot-title';
  title.textContent = screenshot.title || screenshot.origin || 'Screenshot';
  
  const sub = document.createElement('div');
  sub.className = 'screenshot-sub';
  sub.textContent = screenshot.origin + ' • ' + window.i18n.formatDateTime(screenshot.ts);
  
  info.appendChild(title);
  info.appendChild(sub);
  
  item.appendChild(thumb);
  item.appendChild(info);
  
  return item;
}

// Clear list with localized empty state
function clearList(listId) {
  const list = document.getElementById(listId);
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty';
  emptyDiv.setAttribute('data-i18n', 'no_items_yet');
  emptyDiv.textContent = window.i18n.t('no_items_yet');
  list.innerHTML = '';
  list.appendChild(emptyDiv);
}

// Fill list with localized empty state
function fillList(listId, items, clickHandler) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  
  if (!items || items.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty';
    emptyDiv.setAttribute('data-i18n', 'no_items_yet');
    emptyDiv.textContent = window.i18n.t('no_items_yet');
    list.appendChild(emptyDiv);
    return;
  }
  
  items.forEach(item => {
    let listItem;
    if (listId === 'screenshots') {
      listItem = createScreenshotItem(item);
    } else {
      listItem = createListItem(item.text, item.origin, item.ts);
    }
    listItem.addEventListener('click', () => clickHandler(item));
    list.appendChild(listItem);
  });
}

// Read data from storage
async function readData() {
  try {
    const data = await browser.storage.local.get(['lu_inputs', 'lu_clipboard', 'recentShots']);
    return {
      inputs: data.lu_inputs || [],
      clipboard: data.lu_clipboard || [],
      screenshots: data.recentShots || []
    };
  } catch (error) {
    console.error('[LifeUndo] Error reading data:', error);
    return { inputs: [], clipboard: [], screenshots: [] };
  }
}

// Check if current page is protected
async function checkProtectedPage() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) return;
    
    const url = tabs[0].url;
    const isProtected = url.startsWith('about:') || 
                       url.startsWith('moz-extension:') || 
                       url.startsWith('view-source:') ||
                       url.includes('addons.mozilla.org');
    
    const warning = document.getElementById('env-warning');
    warning.style.display = isProtected ? 'block' : 'none';
  } catch (error) {
    console.error('[LifeUndo] Error checking protected page:', error);
  }
}

// Handle item click
function handleItemClick(item) {
  // Copy to clipboard
  navigator.clipboard.writeText(item.text).then(() => {
    console.log('[LifeUndo] Text copied to clipboard');
  }).catch(err => {
    console.error('[LifeUndo] Failed to copy text:', err);
  });
}

// Handle screenshot click
function handleScreenshotClick(screenshot) {
  // Open screenshot in new tab
  browser.tabs.create({ url: screenshot.dataUrl });
}

// Handle tab click
function handleTabClick(tab) {
  if (tab.url && !tab.url.startsWith('about:') && !tab.url.startsWith('chrome:')) {
    browser.tabs.create({ url: tab.url });
  }
}

// Clear data
async function clearData(key) {
  try {
    await browser.storage.local.set({ [key]: [] });
    console.log(`[LifeUndo] Cleared ${key}`);
  } catch (error) {
    console.error(`[LifeUndo] Error clearing ${key}:`, error);
  }
}

// Take screenshot
async function takeScreenshot() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) return;
    
    const tab = tabs[0];
    const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, {
      format: 'jpeg',
      quality: 60
    });
    
    const screenshot = {
      dataUrl: dataUrl,
      origin: tab.url,
      title: tab.title || 'Screenshot',
      ts: Date.now(),
      w: 0,
      h: 0
    };
    
    // Save to storage
    const data = await browser.storage.local.get({ recentShots: [] });
    const screenshots = data.recentShots || [];
    screenshots.unshift(screenshot);
    
    // Limit to 10 items
    const limited = screenshots.slice(0, 10);
    
    await browser.storage.local.set({ recentShots: limited });
    
    // Refresh display
    await renderAll(window.i18n.currentLang());
    
    console.log('[LifeUndo] Screenshot taken and saved');
  } catch (error) {
    console.error('[LifeUndo] Screenshot error:', error);
  }
}

// Trial logic
async function initTrial() {
  try {
    const trialData = await browser.storage.local.get(['trial_startTs', 'trial_snoozeUntilTs']);
    const now = Date.now();
    
    // Initialize trial start time if not exists
    if (!trialData.trial_startTs) {
      await browser.storage.local.set({ trial_startTs: now });
      return; // Don't show banner on first day
    }
    
    // Check if snoozed
    if (trialData.trial_snoozeUntilTs && now < trialData.trial_snoozeUntilTs) {
      return; // Still snoozed
    }
    
    // Calculate days since trial start
    const daysSinceStart = (now - trialData.trial_startTs) / 86400000;
    
    const banner = document.getElementById('trial-banner');
    const title = document.getElementById('trial-title');
    const body = document.getElementById('trial-body');
    
    if (daysSinceStart >= 6 && daysSinceStart < 7) {
      // Day 6: Soon to expire
      banner.style.display = 'block';
      banner.classList.remove('expired');
      title.textContent = window.i18n.t('trial_soon_title');
      body.textContent = window.i18n.t('trial_soon_body');
    } else if (daysSinceStart >= 7) {
      // Day 7+: Expired
      banner.style.display = 'block';
      banner.classList.add('expired');
      title.textContent = window.i18n.t('trial_expired_title');
      body.textContent = window.i18n.t('trial_expired_body');
    }
  } catch (error) {
    console.error('[LifeUndo] Trial initialization error:', error);
  }
}

// Centralized render all data with full i18n support
async function renderAll(lang) {
  const data = await readData();
  
  fillList('inputs', data.inputs, handleItemClick);
  fillList('clipboard', data.clipboard, handleItemClick);
  fillList('screenshots', data.screenshots, handleScreenshotClick);
  
  // Get recently closed tabs
  try {
    const sessions = await browser.sessions.getRecentlyClosed({ maxResults: 10 });
    const tabs = [];
    
    sessions.forEach(session => {
      if (session.tab) {
        const tab = session.tab;
        tabs.push({
          title: tab.title || tab.url || 'Untitled',
          url: tab.url,
          ts: tab.lastAccessed || tab.closedAt || Date.now()
        });
      } else if (session.window && session.window.tabs) {
        const tabCount = session.window.tabs.length;
        const windowLabel = window.i18n.t('recently_closed_window_label', [String(tabCount)]);
        tabs.push({
          title: windowLabel,
          url: null, // Not clickable
          ts: session.closedAt || Date.now()
        });
      }
    });
    
    fillList('tabs', tabs, handleTabClick);
  } catch (error) {
    console.error('[LifeUndo] Error getting recently closed tabs:', error);
    clearList('tabs');
  }
}

// Setup trial handlers
function setupTrialHandlers() {
  const banner = document.getElementById('trial-banner');
  const closeBtn = document.getElementById('trial-close');
  const buyBtn = document.getElementById('trial-btn');
  
  closeBtn.addEventListener('click', async () => {
    const snoozeUntil = Date.now() + 86400000; // 24 hours
    await browser.storage.local.set({ trial_snoozeUntilTs: snoozeUntil });
    banner.style.display = 'none';
  });
  
  buyBtn.addEventListener('click', () => {
    const lang = window.i18n.currentLang();
    const baseUrl = lang === 'ru' ? 'https://getlifeundo.com/ru' : 'https://getlifeundo.com/en';
    browser.tabs.create({ url: baseUrl + '/pricing' });
  });
}

// Bind UI handlers
function bindUI() {
  // Language switcher logic
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langSwitcher = document.querySelector('.lang-switcher');
  
  langBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    langDropdown.classList.toggle('show');
  });
  
  langDropdown.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', async (event) => {
      const newLang = event.target.getAttribute('data-lang');
      if (newLang) {
        await onLangChange(newLang);
        langDropdown.classList.remove('show');
      }
    });
  });
  
  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!langSwitcher.contains(event.target)) {
      langDropdown.classList.remove('show');
    }
  });
  
  // Setup trial handlers
  setupTrialHandlers();
  
  // Clear buttons
  document.getElementById('clear-inputs').addEventListener('click', async () => {
    await clearData('lu_inputs');
    clearList('inputs');
  });
  
  document.getElementById('clear-clipboard').addEventListener('click', async () => {
    await clearData('lu_clipboard');
    clearList('clipboard');
  });
  
  // Screenshot button
  document.getElementById('take-screenshot').addEventListener('click', takeScreenshot);
  
  // Screenshot CTA button (for protected pages)
  document.getElementById('snap-cta-btn').addEventListener('click', takeScreenshot);
  
  // Handle keyboard command
  browser.commands.onCommand.addListener((command) => {
    if (command === 'take_quick_snap') {
      takeScreenshot();
    }
  });
}

// Handle language change with full re-render
async function onLangChange(newLang) {
  await window.i18n.setLang(newLang); // setLang calls applyI18n internally
  // No need to call renderAll here as setLang already applies i18n
}

// Initialize data and render
async function initDataAndRender(lang) {
  await checkProtectedPage();
  await initTrial();
  await renderAll(lang);
}

// Main initialization function
async function init() {
  try {
    // Wait for i18n helper
    await waitForI18n();
    
    // Step 1: Get language
    const lang = await window.i18n.getLang();
    
    // Step 2: Apply i18n (no rendering before this)
    await window.i18n.applyI18n(lang);
    
    // Step 3: Initialize data and render
    await initDataAndRender(lang);
    
    // Step 4: Bind UI handlers
    bindUI();
    
  } catch (error) {
    console.error('[LifeUndo] Initialization error:', error);
  }
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);