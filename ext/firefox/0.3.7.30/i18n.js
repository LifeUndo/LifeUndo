/* global chrome */

// Debug flag for i18n diagnostics (not shipped in production)
const DEBUG_I18N = true; // Enable debug for testing

// Current language state
let currentLang = 'en';

// Get current language from storage with EN default
async function getLang() {
  return new Promise(resolve => {
    chrome.storage.sync.get('lang', data => {
      const lang = data.lang || 'en'; // Default EN
      currentLang = lang;
      console.log('[LifeUndo] Stored language:', lang);
      resolve(lang);
    });
  });
}

// Set language and save to storage with reload
async function setLang(newLang) {
  return new Promise(resolve => {
    chrome.storage.sync.set({lang: newLang}, () => {
      currentLang = newLang;
      console.log('[LifeUndo] Language set to:', newLang);
      location.reload(); // Force reload for popup
      resolve();
    });
  });
}

// Build site URL for footer links
function buildSiteUrl(lang, route) {
  const routes = { 
    website: "", 
    privacy: "privacy", 
    support: "support", 
    license: "license" 
  };
  const path = routes[route] || "";
  return `https://getlifeundo.com/${lang}/${path}`.replace(/\/+$/, '/');
}

// Apply i18n to all elements using chrome.i18n directly
async function applyI18n(lang) {
  try {
    console.log('[LifeUndo] Applying i18n for language:', lang);
    
    // Set document language
    document.documentElement.lang = lang;
    
    // Apply text content to elements with data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    console.log('[LifeUndo] Found', i18nElements.length, 'elements with data-i18n');
    
    i18nElements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        try {
          const translation = chrome.i18n.getMessage(key) || 'Missing: ' + key;
          console.log('[LifeUndo] Translating', key, 'to', translation);
          element.textContent = translation;
        } catch (e) {
          console.error('[LifeUndo] i18n error for key:', key, e);
          element.textContent = 'Missing: ' + key;
        }
      }
    });
    
    // Apply attributes to elements with data-i18n-attr
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrKey = element.getAttribute('data-i18n-attr');
      const i18nKey = element.getAttribute('data-i18n');
      if (attrKey && i18nKey) {
        try {
          const translation = chrome.i18n.getMessage(i18nKey) || 'Missing: ' + i18nKey;
          element.setAttribute(attrKey, translation);
        } catch (e) {
          console.error('[LifeUndo] i18n attr error:', i18nKey, e);
        }
      }
    });
    
    // Apply localized links
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
      const route = element.getAttribute('data-i18n-href');
      if (route) {
        element.href = buildSiteUrl(lang, route);
      }
    });
    
    // Update version display
    const versionElement = document.getElementById('version');
    if (versionElement) {
      const versionPrefix = chrome.i18n.getMessage('version_prefix') || 'v';
      const manifestVersion = chrome.runtime.getManifest().version;
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
  currentLang: () => currentLang
};