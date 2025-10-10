// Service Worker for Chrome MV3
// Minimal implementation - most logic is in content script and popup

chrome.runtime.onInstalled.addListener((details) => {
  console.log('GetLifeUndo installed:', details.reason);
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRecentlyClosed') {
    chrome.sessions.getRecentlyClosed({ maxResults: 20 })
      .then(sessions => {
        const tabs = sessions
          .filter(session => session.tab && session.tab.title && session.tab.url)
          .map(session => ({
            title: session.tab.title,
            url: session.tab.url,
            timestamp: session.tab.lastAccessed || Date.now()
          }));
        sendResponse({ success: true, tabs });
      })
      .catch(error => {
        console.error('Error getting recently closed tabs:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// Handle tab updates for tracking
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could add analytics or tracking here if needed
    console.log('Tab loaded:', tab.url);
  }
});



