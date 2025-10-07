/* global browser */

// Отладочное логирование
const dbg = (...args) => console && console.debug('[LU]', ...args);

// Защищённые страницы - не пишем и выходим тихо
const PROTECTED = location.protocol === 'about:' ||
                  location.protocol === 'moz-extension:' ||
                  location.protocol === 'view-source:' ||
                  location.hostname.includes('addons.mozilla.org');

if (PROTECTED) {
  dbg('Protected page detected, skipping data collection');
}

// Дебаунс сохранения
const saveDebounced = (() => {
  let timeout;
  return (key, value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => save(key, value), 120);
  };
})();

// Проверка паролей и скрытых полей
const isSecret = (element) => {
  if (!element) return true;
  if (element.type === 'password') return true;
  if (element.type === 'hidden') return true;
  if (element.type === 'file') return true; // Фильтруем file inputs
  if (/password|passwd|pwd/i.test(element.name || '')) return true;
  if (/password|passwd|pwd/i.test(element.id || '')) return true;
  if (element.getAttribute('autocomplete') === 'current-password') return true;
  return false;
};

// Фильтрация мусорных значений
const isJunkValue = (text) => {
  if (!text || typeof text !== 'string') return true;
  
  const trimmed = text.trim();
  if (!trimmed) return true; // Пустые строки
  
  // Фильтруем fakepath
  if (trimmed.startsWith('C:\\fakepath\\')) return true;
  
  // Фильтруем только пробелы
  if (/^\s+$/.test(trimmed)) return true;
  
  return false;
};

// Сбор ввода с улучшенной фильтрацией
function onInput(event) {
  if (PROTECTED) return;
  
  const element = event.target;
  if (!element || isSecret(element)) return;
  
  const text = (element.value || '').trim();
  if (isJunkValue(text)) return;
  
  const record = {
    text: text,
    ts: Date.now(),
    origin: location.origin
  };
  
  dbg('Input captured:', record);
  saveDebounced('lu_inputs', record);
}

// Сбор копирования
function onCopy(event) {
  if (PROTECTED) return;
  
  try {
    const selection = (document.getSelection() || '').toString().trim();
    if (isJunkValue(selection)) return;
    
    const record = {
      text: selection,
      ts: Date.now(),
      origin: location.origin
    };
    
    dbg('Copy captured:', record);
    saveDebounced('lu_clipboard', record);
  } catch (error) {
    console.error('[LifeUndo] Copy error:', error);
  }
}

// Сбор из contenteditable элементов
function onContentEditableChange() {
  if (PROTECTED) return;
  
  const element = document.activeElement;
  if (!element || !element.contentEditable || element.contentEditable !== 'true') return;
  
  const text = element.innerText || element.textContent || '';
  if (isJunkValue(text)) return;
  
  const record = {
    text: text.trim(),
    ts: Date.now(),
    origin: location.origin
  };
  
  dbg('ContentEditable captured:', record);
  saveDebounced('lu_inputs', record);
}

// MutationObserver для contenteditable
let contentEditableObserver = null;

function setupContentEditableObserver() {
  if (PROTECTED) return;
  
  if (contentEditableObserver) {
    contentEditableObserver.disconnect();
  }
  
  contentEditableObserver = new MutationObserver((mutations) => {
    let shouldCapture = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const target = mutation.target;
        if (target.contentEditable === 'true' || 
            target.closest('[contenteditable="true"]')) {
          shouldCapture = true;
        }
      }
    });
    
    if (shouldCapture) {
      onContentEditableChange();
    }
  });
  
  contentEditableObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Сохранение с лимитом
async function save(key, record) {
  try {
    const data = await browser.storage.local.get({ [key]: [] });
    const array = Array.isArray(data[key]) ? data[key] : [];
    
    // Добавляем в начало
    array.unshift(record);
    
    // Ограничиваем до 50 элементов
    const limited = array.slice(0, 50);
    
    await browser.storage.local.set({ [key]: limited });
    dbg('Saved to storage:', key, limited.length, 'items');
  } catch (error) {
    console.error('[LifeUndo] Save error:', error);
  }
}

// Подключение событий
if (!PROTECTED) {
  // Основные события ввода
  document.addEventListener('input', onInput, true);
  document.addEventListener('change', onInput, true);
  document.addEventListener('keyup', onInput, true);
  document.addEventListener('paste', onInput, true);
  
  // События копирования
  document.addEventListener('copy', onCopy, true);
  
  // Настройка наблюдения за contenteditable
  setupContentEditableObserver();
  
  dbg('Content script loaded successfully with enhanced capture');
}