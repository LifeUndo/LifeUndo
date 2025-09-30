// Service Worker для GetLifeUndo
console.log('GetLifeUndo background script loaded');

// Обработка установки расширения
chrome.runtime.onInstalled.addListener((details) => {
  console.log('GetLifeUndo installed:', details.reason);
  
  if (details.reason === 'install') {
    // Открываем welcome страницу при первой установке
    chrome.tabs.create({
      url: 'https://getlifeundo.com/ru/welcome'
    });
  }
});

// Обработка сообщений от content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'undo_tab':
      handleUndoTab(request.tabId);
      break;
    case 'save_state':
      handleSaveState(request.data);
      break;
    case 'restore_state':
      handleRestoreState(request.stateId);
      break;
    default:
      console.log('Unknown action:', request.action);
  }
  
  sendResponse({ success: true });
});

// Обработка закрытия вкладок
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log('Tab closed:', tabId);
  // Сохраняем состояние закрытой вкладки для возможного восстановления
  saveTabState(tabId);
});

// Функции для работы с состоянием
async function handleUndoTab(tabId) {
  try {
    // Логика восстановления вкладки
    console.log('Undoing tab:', tabId);
    // TODO: Реализовать восстановление вкладки
  } catch (error) {
    console.error('Error undoing tab:', error);
  }
}

async function handleSaveState(data) {
  try {
    // Сохраняем состояние в storage
    await chrome.storage.local.set({
      [`state_${Date.now()}`]: data
    });
    console.log('State saved');
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

async function handleRestoreState(stateId) {
  try {
    // Восстанавливаем состояние из storage
    const result = await chrome.storage.local.get([stateId]);
    console.log('State restored:', result[stateId]);
    // TODO: Реализовать восстановление состояния
  } catch (error) {
    console.error('Error restoring state:', error);
  }
}

async function saveTabState(tabId) {
  try {
    // Получаем информацию о вкладке перед закрытием
    const tab = await chrome.tabs.get(tabId);
    const state = {
      url: tab.url,
      title: tab.title,
      timestamp: Date.now()
    };
    
    // Сохраняем в storage
    await chrome.storage.local.set({
      [`tab_${tabId}`]: state
    });
    
    console.log('Tab state saved:', state);
  } catch (error) {
    console.error('Error saving tab state:', error);
  }
}
