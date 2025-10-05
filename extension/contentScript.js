// LifeUndo Content Script - v0.3.7.15
// Firefox: collect text input for popup display

const api = window.browser || window.chrome;

// Store recent inputs
let recentInputs = [];

// Listen for input events
function handleInput(event) {
  const target = event.target;
  
  // Skip password fields
  if (target.type === 'password') return;
  
  // Skip if no text content
  if (!target.value || target.value.trim().length === 0) return;
  
  // Skip very short inputs
  if (target.value.length < 3) return;
  
  // Create input record
  const inputRecord = {
    text: target.value,
    timestamp: Date.now(),
    url: window.location.href,
    selector: getSelector(target)
  };
  
  // Add to recent inputs (keep last 20)
  recentInputs.unshift(inputRecord);
  recentInputs = recentInputs.slice(0, 20);
  
  // Save to storage
  saveToStorage();
}

// Get CSS selector for element
function getSelector(element) {
  if (element.id) return `#${element.id}`;
  if (element.className) return `.${element.className.split(' ')[0]}`;
  return element.tagName.toLowerCase();
}

// Save to browser storage
async function saveToStorage() {
  try {
    await api.storage.local.set({ recentInputs });
  } catch (e) {
    console.error('LifeUndo: Failed to save inputs:', e);
  }
}

// Load from storage on startup
async function loadFromStorage() {
  try {
    const result = await api.storage.local.get('recentInputs');
    if (result.recentInputs) {
      recentInputs = result.recentInputs;
    }
  } catch (e) {
    console.error('LifeUndo: Failed to load inputs:', e);
  }
}

// Initialize
function init() {
  // Load existing data
  loadFromStorage();
  
  // Listen for input events
  document.addEventListener('input', handleInput, true);
  
  // Listen for textarea changes
  document.addEventListener('change', handleInput, true);
  
  console.log('LifeUndo content script loaded');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}