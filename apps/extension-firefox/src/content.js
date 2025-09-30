// Content Script для GetLifeUndo
console.log('GetLifeUndo content script loaded');

// Инициализация
document.addEventListener('DOMContentLoaded', initGetLifeUndo);

function initGetLifeUndo() {
  console.log('Initializing GetLifeUndo on:', window.location.href);
  
  // Добавляем обработчики для отслеживания изменений
  setupFormTracking();
  setupUndoShortcuts();
}

// Отслеживание изменений в формах
function setupFormTracking() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Сохраняем исходное состояние формы
    const initialState = getFormState(form);
    saveFormState(form, initialState);
    
    // Отслеживаем изменения
    form.addEventListener('input', (e) => {
      const currentState = getFormState(form);
      saveFormState(form, currentState);
    });
    
    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
      console.log('Form submitted:', form);
      // TODO: Реализовать логику отмены отправки
    });
  });
}

// Получение состояния формы
function getFormState(form) {
  const state = {};
  const inputs = form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    if (input.type !== 'password') { // Не сохраняем пароли
      state[input.name || input.id] = input.value;
    }
  });
  
  return state;
}

// Сохранение состояния формы
function saveFormState(form, state) {
  const formId = form.id || form.action || window.location.href;
  
  chrome.runtime.sendMessage({
    action: 'save_state',
    data: {
      type: 'form',
      formId: formId,
      state: state,
      timestamp: Date.now()
    }
  });
}

// Настройка горячих клавиш для отмены
function setupUndoShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Z для отмены действий
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndoAction();
    }
    
    // Ctrl+Shift+Z для повторного действия
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
      e.preventDefault();
      handleRedoAction();
    }
  });
}

// Обработка отмены действия
function handleUndoAction() {
  console.log('Undo action triggered');
  
  chrome.runtime.sendMessage({
    action: 'undo_action',
    data: {
      url: window.location.href,
      timestamp: Date.now()
    }
  });
}

// Обработка повторного действия
function handleRedoAction() {
  console.log('Redo action triggered');
  
  chrome.runtime.sendMessage({
    action: 'redo_action',
    data: {
      url: window.location.href,
      timestamp: Date.now()
    }
  });
}

// Восстановление состояния страницы
function restorePageState(state) {
  console.log('Restoring page state:', state);
  
  if (state.type === 'form') {
    restoreFormState(state.formId, state.state);
  }
}

// Восстановление состояния формы
function restoreFormState(formId, formState) {
  const form = document.getElementById(formId) || 
               document.querySelector(`form[action="${formId}"]`);
  
  if (!form) return;
  
  Object.entries(formState).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"], #${name}`);
    if (input && input.type !== 'password') {
      input.value = value;
    }
  });
  
  console.log('Form state restored');
}

// Экспорт функций для использования в popup
window.GetLifeUndo = {
  restorePageState,
  saveFormState,
  handleUndoAction,
  handleRedoAction
};
