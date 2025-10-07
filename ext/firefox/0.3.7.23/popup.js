/* global browser */

// Получение локали (по умолчанию ru)
async function getLocale() {
  try {
    const { uiLocale } = await browser.storage.local.get('uiLocale');
    if (uiLocale) return uiLocale;
  } catch (error) {
    console.error('Error getting locale:', error);
  }
  
  const lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return ['en', 'ru', 'hi', 'zh', 'ar', 'kk', 'tr'].includes(lang) ? lang : 'ru';
}

// Открытие новой вкладки
function openTab(url) {
  try {
    browser.tabs.create({ url });
  } catch (error) {
    console.error('Failed to open tab:', error);
  }
}

// Создание элемента списка
function createListItem(text, subtitle) {
  const item = document.createElement('div');
  item.className = 'list-item';
  
  const title = document.createElement('div');
  title.className = 'item-title';
  title.textContent = text;
  item.appendChild(title);
  
  if (subtitle) {
    const sub = document.createElement('div');
    sub.className = 'item-sub';
    sub.textContent = subtitle;
    item.appendChild(sub);
  }
  
  return item;
}

// Очистка списка
function clearList(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

// Заполнение списка
function fillList(container, items, clickHandler) {
  clearList(container);
  
  if (!items || items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No items yet';
    container.appendChild(empty);
    return;
  }
  
  items.slice(0, 10).forEach(item => {
    const listItem = createListItem(item.text, item.origin);
    if (clickHandler) {
      listItem.addEventListener('click', () => clickHandler(item));
    }
    container.appendChild(listItem);
  });
}

// Чтение данных из хранилища
async function readData() {
  try {
    const data = await browser.storage.local.get(['lu_inputs', 'lu_clipboard']);
    const inputs = data.lu_inputs || [];
    const clipboard = data.lu_clipboard || [];
    
    let closedTabs = [];
    try {
      const sessions = await browser.sessions.getRecentlyClosed({ maxResults: 10 });
      closedTabs = sessions
        .filter(session => {
          // Проверяем разные типы сессий
          if (session.tab && session.tab.title && session.tab.url) {
            return true;
          }
          if (session.window && session.window.tabs) {
            return session.window.tabs.some(tab => tab.title && tab.url);
          }
          return false;
        })
        .map(session => {
          // Обрабатываем разные типы сессий
          if (session.tab) {
            return {
              text: session.tab.title,
              origin: session.tab.url,
              ts: session.tab.lastAccessed || Date.now()
            };
          }
          if (session.window && session.window.tabs) {
            const tab = session.window.tabs.find(t => t.title && t.url);
            return {
              text: tab.title,
              origin: tab.url,
              ts: tab.lastAccessed || Date.now()
            };
          }
          return null;
        })
        .filter(item => item !== null);
    } catch (error) {
      console.error('Error getting closed tabs:', error);
    }
    
    return { inputs, clipboard, closedTabs };
  } catch (error) {
    console.error('Error reading data:', error);
    return { inputs: [], clipboard: [], closedTabs: [] };
  }
}

// Проверка защищённой страницы
async function checkProtectedPage() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (currentTab && currentTab.url) {
      const url = currentTab.url;
      const isProtected = url.startsWith('about:') || 
                         url.startsWith('moz-extension:') || 
                         url.startsWith('view-source:') ||
                         url.includes('addons.mozilla.org');
      
      const warning = document.getElementById('env-warning');
      if (warning) {
        warning.style.display = isProtected ? 'block' : 'none';
      }
    }
  } catch (error) {
    console.error('Error checking protected page:', error);
  }
}

// Обновление ссылок
async function updateLinks() {
  const locale = await getLocale();
  const baseUrl = `https://getlifeundo.com/${locale}`;
  
  const links = {
    website: baseUrl,
    privacy: `${baseUrl}/privacy`,
    support: `${baseUrl}/support`,
    license: `${baseUrl}/license`
  };
  
  Object.entries(links).forEach(([key, url]) => {
    const link = document.querySelector(`a[data-k="${key}"]`);
    if (link) {
      link.href = url;
    }
  });
}

// Обработка кликов по элементам
function handleItemClick(item) {
  navigator.clipboard.writeText(item.text).catch(error => {
    console.error('Failed to copy to clipboard:', error);
  });
}

function handleTabClick(item) {
  openTab(item.origin);
}

// Очистка данных
async function clearData(key) {
  try {
    await browser.storage.local.remove(key);
    await renderData();
  } catch (error) {
    console.error(`Error clearing ${key}:`, error);
  }
}

// Отрисовка данных
async function renderData() {
  const { inputs, clipboard, closedTabs } = await readData();
  
  const inputsContainer = document.getElementById('inputs');
  const clipboardContainer = document.getElementById('clipboard');
  const tabsContainer = document.getElementById('tabs');
  
  fillList(inputsContainer, inputs, handleItemClick);
  fillList(clipboardContainer, clipboard, handleItemClick);
  fillList(tabsContainer, closedTabs, handleTabClick);
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
  await checkProtectedPage();
  await updateLinks();
  await renderData();
  
  // Обработчики кнопок очистки
  document.getElementById('clear-inputs').addEventListener('click', () => {
    clearData('lu_inputs');
  });
  
  document.getElementById('clear-clipboard').addEventListener('click', () => {
    clearData('lu_clipboard');
  });
});
