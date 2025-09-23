// Тест FreeKassa интеграции
const https = require('https');

async function testFreeKassaIntegration() {
  console.log('🧪 Тестирование FreeKassa интеграции...\n');
  
  // Тестовые данные из файла
  const testData = {
    email: 'test@example.com',
    plan: 'vip_lifetime',
    locale: 'ru'
  };
  
  console.log('📋 Тестовые данные:');
  console.log(`  Email: ${testData.email}`);
  console.log(`  Plan: ${testData.plan}`);
  console.log(`  Locale: ${testData.locale}`);
  
  try {
    console.log('\n🔗 Тестирование /api/fk/create...');
    const response = await fetch('https://lifeundo.ru/api/fk/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://lifeundo.ru'
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`  Статус: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Успешно!');
      console.log(`  Order ID: ${data.order_id}`);
      console.log(`  URL: ${data.url ? 'Сгенерирован' : 'ОТСУТСТВУЕТ'}`);
      
      if (data.url) {
        console.log('\n🔍 Проверка URL:');
        const url = new URL(data.url);
        console.log(`  Домен: ${url.hostname}`);
        console.log(`  Параметры: ${url.searchParams.toString()}`);
        
        // Проверяем обязательные параметры
        const requiredParams = ['m', 'oa', 'o', 's', 'currency'];
        const missingParams = requiredParams.filter(param => !url.searchParams.has(param));
        
        if (missingParams.length === 0) {
          console.log('✅ Все обязательные параметры присутствуют');
        } else {
          console.log(`❌ Отсутствуют параметры: ${missingParams.join(', ')}`);
        }
      }
    } else {
      const errorData = await response.text();
      console.log('❌ Ошибка:');
      console.log(`  ${response.status}: ${errorData}`);
    }
    
  } catch (error) {
    console.log('❌ Ошибка сети:');
    console.log(`  ${error.message}`);
  }
  
  console.log('\n📝 Следующие шаги:');
  console.log('1. Настроить ENV переменные в Vercel:');
  console.log('   FK_MERCHANT_ID=7b11ad5311cc3bbeb608b3cb9c8404a6');
  console.log('   FK_SECRET1=HU/B%o]RgX=Tq@}');
  console.log('   FK_SECRET2=M!{iW=7dr*xua(L');
  console.log('   ALLOWED_ORIGIN=https://lifeundo.ru');
  console.log('   CURRENCY=RUB');
  console.log('');
  console.log('2. В кабинете FreeKassa настроить:');
  console.log('   Notify URL: https://lifeundo.ru/api/fk/notify');
  console.log('   Success URL: https://lifeundo.ru/success.html');
  console.log('   Fail URL: https://lifeundo.ru/fail.html');
  console.log('');
  console.log('3. Протестировать "Проверить статус" в кабинете FK');
  console.log('4. Провести тестовую оплату');
}

testFreeKassaIntegration();
