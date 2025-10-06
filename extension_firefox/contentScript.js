// Firefox MV2 content script - Enhanced for 0.3.7.17
// Reliable input/change/copy listeners, password field protection

(function() {
  if (window.hasRunContentScript) {
    return;
  }
  window.hasRunContentScript = true;

  console.log('LifeUndo Content Script Loaded');

  const api = window.browser || window.chrome;

  function isPasswordField(element) {
    if (!element) return false;
    
    // Check type attribute
    if (element.type === 'password' || element.type === 'hidden') {
      return true;
    }
    
    // Check name/id attributes for password-related keywords
    const name = (element.name || '').toLowerCase();
    const id = (element.id || '').toLowerCase();
    const className = (element.className || '').toLowerCase();
    
    const passwordKeywords = ['password', 'passwd', 'pwd', 'secret', 'token', 'key'];
    
    return passwordKeywords.some(keyword => 
      name.includes(keyword) || 
      id.includes(keyword) || 
      className.includes(keyword)
    );
  }

  function saveTextInput(text, url) {
    if (!text || text.trim() === '') return;

    api.storage.local.get(['lu_inputs']).then((data) => {
      const inputs = data.lu_inputs || [];
      const newInput = { 
        text: text.slice(0, 2000), 
        timestamp: Date.now(), 
        url: url || window.location.href 
      };
      
      // Keep only last 20 entries
      const updatedInputs = [newInput, ...inputs].slice(0, 20);
      
      api.storage.local.set({ lu_inputs: updatedInputs });
    }).catch(error => {
      console.error('Error saving text input:', error);
    });
  }

  function saveClipboardText(text) {
    if (!text || text.trim() === '') return;

    api.storage.local.get(['lu_clipboard']).then((data) => {
      const clipboard = data.lu_clipboard || [];
      const newEntry = { 
        text: text.slice(0, 2000), 
        timestamp: Date.now(), 
        url: window.location.href 
      };
      
      // Keep only last 20 entries
      const updatedClipboard = [newEntry, ...clipboard].slice(0, 20);
      
      api.storage.local.set({ lu_clipboard: updatedClipboard });
    }).catch(error => {
      console.error('Error saving clipboard:', error);
    });
  }

  // Input and change event listeners
  document.addEventListener('input', (event) => {
    const target = event.target;
    
    // Skip password fields
    if (isPasswordField(target)) return;
    
    // Handle text inputs and textareas
    if ((target.tagName === 'TEXTAREA' || 
         (target.tagName === 'INPUT' && target.type !== 'password')) && 
        target.value) {
      saveTextInput(target.value);
    }
    
    // Handle contentEditable elements
    if (target.isContentEditable && target.textContent) {
      saveTextInput(target.textContent);
    }
  }, true); // Use capture phase

  document.addEventListener('change', (event) => {
    const target = event.target;
    
    // Skip password fields
    if (isPasswordField(target)) return;
    
    // Handle text inputs and textareas
    if ((target.tagName === 'TEXTAREA' || 
         (target.tagName === 'INPUT' && target.type !== 'password')) && 
        target.value) {
      saveTextInput(target.value);
    }
  }, true); // Use capture phase

  // Copy event listener
  document.addEventListener('copy', (event) => {
    const text = document.getSelection()?.toString() || '';
    if (text) {
      saveClipboardText(text);
    }
  }, true); // Use capture phase

  // Message listener for text restoration
  api.runtime.onMessage.addListener((message) => {
    if (message?.type === 'LU_RESTORE_TEXT') {
      const active = document.activeElement;
      const value = message.payload?.value || '';
      
      if (active && (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement)) {
        active.value = value;
        active.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (active && active.isContentEditable) {
        active.textContent = value;
        active.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

})();




