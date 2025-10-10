/* global browser */

// Debug logging
const dbg = (...args) => console && console.debug('[LU]', ...args);

// Protected pages - don't collect data
const PROTECTED = location.protocol === 'about:' ||
                  location.protocol === 'moz-extension:' ||
                  location.protocol === 'view-source:' ||
                  location.hostname.includes('addons.mozilla.org');

if (PROTECTED) {
  dbg('Protected page detected, skipping data collection');
}

// Debounced saving
const saveDebounced = (() => {
  let timeout;
  return (key, value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => save(key, value), 150);
  };
})();

// Check if value is junk (passwords, files, empty, etc.)
const isJunkValue = (element, text) => {
  if (!element) return true;
  if (element.type === 'password') return true;
  if (element.type === 'hidden') return true;
  if (element.type === 'file') return true;
  if (/password|passwd|pwd/i.test(element.name || '')) return true;
  if (/password|passwd|pwd/i.test(element.id || '')) return true;
  if (element.getAttribute('autocomplete') === 'current-password') return true;
  if (typeof text === 'string' && text.trim().length < 2) return true; // Too short
  if (text && text.startsWith('C:\\fakepath\\')) return true; // File paths
  return false;
};

// Check if element is supported for text capture
const isSupportedElement = (element) => {
  if (!element) return false;
  
  // Input elements
  if (element.tagName === 'INPUT') {
    const supportedTypes = ['text', 'search', 'email', 'url', 'tel', 'number'];
    return supportedTypes.includes(element.type);
  }
  
  // Textarea elements
  if (element.tagName === 'TEXTAREA') {
    return true;
  }
  
  // Contenteditable elements
  if (element.contentEditable === 'true' || element.contentEditable === '') {
    return true;
  }
  
  return false;
};

// Capture text input
function onInputEvent(event) {
  if (PROTECTED) return;
  
  const element = event.target;
  if (!isSupportedElement(element)) return;
  
  let text = '';
  
  if (element.isContentEditable || element.contentEditable === 'true' || element.contentEditable === '') {
    text = (element.innerText || '').trim();
  } else if (element.value !== undefined) {
    text = (element.value || '').trim();
  } else {
    return; // Unknown element type
  }
  
  if (isJunkValue(element, text)) return;
  
  const record = {
    text: text,
    ts: Date.now(),
    origin: location.origin || document.referrer || 'unknown'
  };
  
  dbg('Input captured:', record);
  saveDebounced('lu_inputs', record);
}

// Capture copy event
function onCopy(event) {
  if (PROTECTED) return;
  
  try {
    const selection = (document.getSelection() || '').toString().trim();
    if (!selection || isJunkValue(null, selection)) return; // Check for junk
    
    const record = {
      text: selection,
      ts: Date.now(),
      origin: location.origin || document.referrer || 'unknown'
    };
    
    dbg('Copy captured:', record);
    saveDebounced('lu_clipboard', record);
  } catch (error) {
    console.error('[LifeUndo] Copy error:', error);
  }
}

// Save with limit
async function save(key, record) {
  try {
    const data = await browser.storage.local.get({ [key]: [] });
    const array = Array.isArray(data[key]) ? data[key] : [];
    
    // Add to beginning
    array.unshift(record);
    
    // Limit to 50 items
    const limited = array.slice(0, 50);
    
    await browser.storage.local.set({ [key]: limited });
    dbg('Saved to storage:', key, limited.length, 'items');
  } catch (error) {
    console.error('[LifeUndo] Save error:', error);
  }
}

// MutationObserver for contenteditable elements
const setupMutationObserver = (element) => {
  const observer = new MutationObserver(() => {
    onInputEvent({ target: element });
  });
  observer.observe(element, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  });
};

// Setup event listeners
if (!PROTECTED) {
  // Main input events
  document.addEventListener('input', onInputEvent, true);
  document.addEventListener('keyup', onInputEvent, true); // Backup event
  document.addEventListener('change', onInputEvent, true);
  document.addEventListener('paste', onInputEvent, true); // Backup event
  
  // Copy event
  document.addEventListener('copy', onCopy, true);
  
  // Setup observers for existing contenteditable elements
  document.querySelectorAll('[contenteditable="true"], [contenteditable=""]').forEach(setupMutationObserver);
  
  // Watch for dynamically added contenteditable elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.contentEditable === 'true' || node.contentEditable === '') {
            setupMutationObserver(node);
          }
          // Check child elements
          node.querySelectorAll && node.querySelectorAll('[contenteditable="true"], [contenteditable=""]').forEach(setupMutationObserver);
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  dbg('Content script loaded successfully');
}