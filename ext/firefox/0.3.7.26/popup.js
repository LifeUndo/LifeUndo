/* global browser */

let currentLocale = 'en'; // Default locale

// Function to get messages from _locales
function getMessage(key) {
  try {
    return browser.i18n.getMessage(key);
  } catch (e) {
    console.error(`[LifeUndo] i18n error for key "${key}":`, e);
    return key; // Fallback to key if message not found
  }
}

// Apply translations to elements with data-i18n attribute
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = getMessage(key);
    }
  });
  
  // Update current language display
  document.getElementById('current-lang').textContent = currentLocale.toUpperCase();
  
  // Update version display
  const versionPrefix = getMessage('version_prefix');
  const manifestVersion = browser.runtime.getManifest().version;
  document.getElementById('version').textContent = versionPrefix + manifestVersion;
  
  updateLinks();
}

// Auto-detect and set locale with persistence
async function setInitialLocale() {
  try {
    const storedLocale = await browser.storage.local.get('lang');
    if (storedLocale.lang) {
      currentLocale = storedLocale.lang;
    } else {
      const browserLang = navigator.language.toLowerCase();
      currentLocale = browserLang.startsWith('ru') ? 'ru' : 'en';
      await browser.storage.local.set({ lang: currentLocale });
    }
    
    // Set document language
    document.documentElement.lang = currentLocale;
  } catch (error) {
    console.error('[LifeUndo] Error setting initial locale:', error);
    currentLocale = 'en'; // Fallback
  }
  applyI18n();
}

// Change locale
async function changeLocale(newLocale) {
  currentLocale = newLocale;
  await browser.storage.local.set({ lang: currentLocale });
  document.documentElement.lang = currentLocale;
  applyI18n();
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
      title.textContent = getMessage('trial_soon_title');
      body.textContent = getMessage('trial_soon_body');
    } else if (daysSinceStart >= 7) {
      // Day 7+: Expired
      banner.style.display = 'block';
      banner.classList.add('expired');
      title.textContent = getMessage('trial_expired_title');
      body.textContent = getMessage('trial_expired_body');
    }
  } catch (error) {
    console.error('[LifeUndo] Trial initialization error:', error);
  }
}

// Trial banner handlers
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
    const baseUrl = currentLocale === 'ru' ? 'https://getlifeundo.com/ru' : 'https://getlifeundo.com/en';
    browser.tabs.create({ url: baseUrl + '/pricing' });
  });
}

// Update links based on current locale
async function updateLinks() {
  const baseUrl = currentLocale === 'ru' ? 'https://getlifeundo.com/ru' : 'https://getlifeundo.com/en';
  
  const links = {
    website: baseUrl,
    privacy: baseUrl + '/privacy',
    support: baseUrl + '/support',
    license: baseUrl + '/license'
  };
  
  Object.entries(links).forEach(([key, url]) => {
    const link = document.querySelector(`a[data-k="${key}"]`);
    if (link) {
      link.href = url;
    }
  });
}

// Format date/time based on locale
function formatDateTime(timestamp) {
  try {
    const locale = currentLocale === 'ru' ? 'ru-RU' : 'en-US';
    return new Date(timestamp).toLocaleString(locale);
  } catch (error) {
    console.error('[LifeUndo] Date formatting error:', error);
    return new Date(timestamp).toLocaleString();
  }
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
  sub.textContent = origin + ' • ' + formatDateTime(timestamp);
  
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
  sub.textContent = screenshot.origin + ' • ' + formatDateTime(screenshot.ts);
  
  info.appendChild(title);
  info.appendChild(sub);
  
  item.appendChild(thumb);
  item.appendChild(info);
  
  return item;
}

// Clear list
function clearList(listId) {
  const list = document.getElementById(listId);
  list.innerHTML = '<div class="empty" data-i18n="no_items_yet">No items yet</div>';
}

// Fill list
function fillList(listId, items, clickHandler) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  
  if (!items || items.length === 0) {
    list.innerHTML = '<div class="empty" data-i18n="no_items_yet">No items yet</div>';
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
      w: 0, // Will be filled by image load
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
    await renderData();
    
    console.log('[LifeUndo] Screenshot taken and saved');
  } catch (error) {
    console.error('[LifeUndo] Screenshot error:', error);
  }
}

// Render all data
async function renderData() {
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
          title: tab.title || tab.url || '—',
          url: tab.url,
          ts: tab.lastAccessed || tab.closedAt || Date.now()
        });
      } else if (session.window && session.window.tabs) {
        const tabCount = session.window.tabs.length;
        const windowLabel = getMessage('recently_closed_window_label').replace('{n}', tabCount);
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

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  await setInitialLocale(); // Set locale and apply i18n
  await initTrial(); // Initialize trial logic
  await checkProtectedPage();
  await renderData();
  
  // Language switcher logic
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langSwitcher = document.querySelector('.lang-switcher');
  
  langBtn.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent document click from closing immediately
    langDropdown.classList.toggle('show');
  });
  
  langDropdown.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (event) => {
      const newLang = event.target.getAttribute('data-lang');
      if (newLang) {
        changeLocale(newLang);
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
});