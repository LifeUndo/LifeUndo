// GetLifeUndo Popup Script
console.log('GetLifeUndo popup loaded');

// DOM элементы
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const tabsCount = document.getElementById('tabs-count');
const statesCount = document.getElementById('states-count');
const actionsList = document.getElementById('actions-list');

// Инициализация popup
document.addEventListener('DOMContentLoaded', initPopup);

async function initPopup() {
  console.log('Initializing popup');
  
  // Загружаем данные
  await loadStatus();
  await loadRecentActions();
  
  // Настраиваем обработчики
  setupEventListeners();
}

// Настройка обработчиков событий
function setupEventListeners() {
  undoBtn.addEventListener('click', handleUndo);
  redoBtn.addEventListener('click', handleRedo);
}

// Обработка отмены действия
async function handleUndo() {
  console.log('Undo button clicked');
  
  try {
    // Получаем активную вкладку
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Отправляем сообщение в content script
    await chrome.tabs.sendMessage(tab.id, {
      action: 'undo_action',
      data: {
        url: tab.url,
        timestamp: Date.now()
      }
    });
    
    // Обновляем UI
    showNotification('Действие отменено', 'success');
    await loadRecentActions();
    
  } catch (error) {
    console.error('Error handling undo:', error);
    showNotification('Ошибка отмены действия', 'error');
  }
}

// Обработка повторного действия
async function handleRedo() {
  console.log('Redo button clicked');
  
  try {
    // Получаем активную вкладку
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Отправляем сообщение в content script
    await chrome.tabs.sendMessage(tab.id, {
      action: 'redo_action',
      data: {
        url: tab.url,
        timestamp: Date.now()
      }
    });
    
    // Обновляем UI
    showNotification('Действие повторено', 'success');
    await loadRecentActions();
    
  } catch (error) {
    console.error('Error handling redo:', error);
    showNotification('Ошибка повторения действия', 'error');
  }
}

// Загрузка статуса
async function loadStatus() {
  try {
    // Получаем количество открытых вкладок
    const tabs = await chrome.tabs.query({});
    tabsCount.textContent = tabs.length;
    
    // Получаем количество сохранённых состояний
    const storage = await chrome.storage.local.get();
    const states = Object.keys(storage).filter(key => key.startsWith('state_'));
    statesCount.textContent = states.length;
    
  } catch (error) {
    console.error('Error loading status:', error);
  }
}

// Загрузка последних действий
async function loadRecentActions() {
  try {
    const storage = await chrome.storage.local.get();
    const actions = Object.keys(storage)
      .filter(key => key.startsWith('action_'))
      .map(key => ({
        id: key,
        ...storage[key]
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
    
    renderActions(actions);
    
  } catch (error) {
    console.error('Error loading recent actions:', error);
  }
}

// Отображение действий
function renderActions(actions) {
  if (actions.length === 0) {
    actionsList.innerHTML = `
      <div class="empty-state">
        <p>Пока нет сохранённых действий</p>
      </div>
    `;
    return;
  }
  
  actionsList.innerHTML = actions.map(action => `
    <div class="action-item">
      <span class="action-icon">${getActionIcon(action.type)}</span>
      <span class="action-text">${action.description || action.type}</span>
      <span class="action-time">${formatTime(action.timestamp)}</span>
    </div>
  `).join('');
}

// Получение иконки для типа действия
function getActionIcon(type) {
  const icons = {
    'form': '📝',
    'tab': '📑',
    'navigation': '🧭',
    'input': '⌨️',
    'default': '↶'
  };
  
  return icons[type] || icons.default;
}

// Форматирование времени
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) { // Менее минуты
    return 'только что';
  } else if (diff < 3600000) { // Менее часа
    const minutes = Math.floor(diff / 60000);
    return `${minutes}м назад`;
  } else if (diff < 86400000) { // Менее дня
    const hours = Math.floor(diff / 3600000);
    return `${hours}ч назад`;
  } else {
    const days = Math.floor(diff / 86400000);
    return `${days}д назад`;
  }
}

// Показ уведомления
function showNotification(message, type = 'info') {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Удаляем через 3 секунды
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Добавляем CSS для анимации
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);
