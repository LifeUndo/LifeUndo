/* global browser */

// Debug flag for i18n diagnostics (not shipped in production)
const DEBUG_I18N = false;

// Current language state
let currentLang = 'en';

// Translation function wrapper
function t(key, args = []) {
  try {
    return browser.i18n.getMessage(key, args);
  } catch (e) {
    if (DEBUG_I18N) {
      console.warn(`[LifeUndo] Missing i18n key: "${key}"`);
    }
    return key; // Fallback to key if message not found
  }
}

// Get current language from storage or detect from browser
async function getLang() {
  try {
    const stored = await browser.storage.local.get('lang');
    if (stored.lang) {
      currentLang = stored.lang;
      return currentLang;
    }
    
    // Auto-detect from browser language
    const browserLang = (navigator.language || '').toLowerCase();
    currentLang = browserLang.startsWith('ru') ? 'ru' : 'en';
    
    // Save detected language
    await browser.storage.local.set({ lang: currentLang });
    return currentLang;
  } catch (error) {
    console.error('[LifeUndo] Error getting language:', error);
    currentLang = 'en'; // Fallback
    return currentLang;
  }
}

// Set language and save to storage
async function setLang(lang) {
  try {
    currentLang = lang;
    await browser.storage.local.set({ lang: currentLang });
    await applyI18n(currentLang);
  } catch (error) {
    console.error('[LifeUndo] Error setting language:', error);
  }
}

// Apply i18n to all elements
async function applyI18n(lang) {
  try {
    // Set document language
    document.documentElement.lang = lang;
    
    // Apply text content to elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = t(key);
      }
    });
    
    // Apply attributes to elements with data-i18n-attr
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrKey = element.getAttribute('data-i18n-attr');
      const i18nKey = element.getAttribute('data-i18n');
      if (attrKey && i18nKey) {
        element.setAttribute(attrKey, t(i18nKey));
      }
    });
    
    // Apply localized links
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
      const route = element.getAttribute('data-i18n-href');
      if (route) {
        const baseUrl = `https://getlifeundo.com/${lang}`;
        const routes = {
          website: baseUrl,
          privacy: `${baseUrl}/privacy`,
          support: `${baseUrl}/support`,
          license: `${baseUrl}/license`
        };
        if (routes[route]) {
          element.href = routes[route];
        }
      }
    });
    
    // Update version display
    const versionElement = document.getElementById('version');
    if (versionElement) {
      const versionPrefix = t('version_prefix');
      const manifestVersion = browser.runtime.getManifest().version;
      versionElement.textContent = versionPrefix + manifestVersion;
    }
    
    // Update current language display
    const currentLangElement = document.getElementById('current-lang');
    if (currentLangElement) {
      currentLangElement.textContent = lang.toUpperCase();
    }
    
    if (DEBUG_I18N) {
      showI18nDiagnostics(lang);
    }
    
  } catch (error) {
    console.error('[LifeUndo] Error applying i18n:', error);
  }
}

// Format date/time based on current language
function formatDateTime(timestamp) {
  try {
    const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    return new Date(timestamp).toLocaleString(locale);
  } catch (error) {
    console.error('[LifeUndo] Date formatting error:', error);
    return new Date(timestamp).toLocaleString();
  }
}

// Show i18n diagnostics in dev mode
function showI18nDiagnostics(lang) {
  if (!DEBUG_I18N) return;
  
  // Remove existing diagnostics
  const existing = document.getElementById('i18n-debug');
  if (existing) {
    existing.remove();
  }
  
  // Count elements
  const i18nElements = document.querySelectorAll('[data-i18n]').length;
  const attrElements = document.querySelectorAll('[data-i18n-attr]').length;
  const hrefElements = document.querySelectorAll('[data-i18n-href]').length;
  
  // Create diagnostics block
  const debugBlock = document.createElement('div');
  debugBlock.id = 'i18n-debug';
  debugBlock.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #333;
    color: #fff;
    padding: 4px 8px;
    font-size: 11px;
    z-index: 10000;
    border-bottom: 1px solid #666;
  `;
  
  debugBlock.textContent = `i18n Debug: lang=${lang} | elements=${i18nElements} | attrs=${attrElements} | links=${hrefElements}`;
  
  document.body.insertBefore(debugBlock, document.body.firstChild);
}

// Export functions for use in popup.js
window.i18n = {
  getLang,
  setLang,
  applyI18n,
  formatDateTime,
  t,
  currentLang: () => currentLang
};
