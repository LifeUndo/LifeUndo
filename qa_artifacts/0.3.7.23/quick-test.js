// LifeUndo 0.3.7.23 - Быстрый тест для консоли браузера
// Выполните этот код в консоли DevTools на обычном сайте (НЕ на AMO/about:)

console.log('=== LifeUndo 0.3.7.23 Quick Test ===');

// 1. Проверка загрузки контент-скрипта
console.log('1. Checking content script...');
if (typeof browser !== 'undefined') {
  console.log('✅ Content script loaded');
} else {
  console.log('❌ Content script NOT loaded - reload temporary addon');
}

// 2. Создание тестового поля
console.log('2. Creating test field...');
document.body.insertAdjacentHTML('beforeend', `
  <div id="glu-test" style="position:fixed;top:50px;left:50px;width:300px;height:100px;background:white;border:2px solid red;z-index:9999;padding:10px;">
    <textarea id="glu-textarea" style="width:100%;height:60px;" placeholder="Type test text here"></textarea>
    <button onclick="gluTest()" style="margin-top:5px;">Test Input & Copy</button>
  </div>
`);

// 3. Функция тестирования
window.gluTest = function() {
  const textarea = document.getElementById('glu-textarea');
  const testText = 'GLU test 0.3.7.23 - ' + new Date().toLocaleTimeString();
  
  textarea.value = testText;
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  
  console.log('✅ Test text entered and copied:', testText);
  console.log('📋 Check popup for data collection');
  
  // Автоматически закрываем тестовое поле через 3 секунды
  setTimeout(() => {
    document.getElementById('glu-test').remove();
  }, 3000);
};

console.log('3. Test field created. Click "Test Input & Copy" button');
console.log('4. Then open extension popup and check data');
console.log('5. In popup console, run: browser.storage.local.get(null).then(console.log)');

// 6. Проверка закрытых вкладок
console.log('6. To test closed tabs:');
console.log('   - Open 2-3 tabs');
console.log('   - Close them with X');
console.log('   - Open popup and check "Recently closed tabs"');

// 7. Проверка защищённых страниц
console.log('7. To test protected pages:');
console.log('   - Go to about:addons or addons.mozilla.org');
console.log('   - Open popup');
console.log('   - Should see warning message');

console.log('=== Test Complete ===');
