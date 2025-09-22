#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки FreeKassa webhook
 * Использование: node test-webhook.js <webhook-url>
 */

const https = require('https');
const crypto = require('crypto');

// Тестовые данные
const testData = {
  merchant_id: 'TEST_MERCHANT',
  order_id: 'LU-TEST-' + Date.now(),
  amount: '1490',
  currency: 'RUB',
  us_email: 'test@example.com',
  us_plan: 'pro_year',
  us_locale: 'ru',
  sign: '' // Будет заполнено ниже
};

// Секретный ключ (для теста)
const secretKey = 'TEST_SECRET_KEY';

// Генерируем подпись
function generateSignature(data, secret) {
  const base = `${data.merchant_id}:${data.amount}:${data.currency}:${data.order_id}:${secret}`;
  return crypto.createHash('sha256').update(base).digest('hex');
}

// Устанавливаем подпись
testData.sign = generateSignature(testData, secretKey);

function testWebhook(url) {
  const postData = JSON.stringify(testData);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🚀 Отправляем тестовый webhook на:', url);
  console.log('📦 Данные:', JSON.stringify(testData, null, 2));
  console.log('🔐 Подпись:', testData.sign);
  console.log('---');

  const req = https.request(url, options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📊 Статус: ${res.statusCode}`);
      console.log(`📝 Ответ: ${data}`);
      
      if (res.statusCode === 200) {
        console.log('✅ Webhook работает корректно!');
      } else {
        console.log('❌ Webhook вернул ошибку');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Ошибка запроса:', error.message);
  });

  req.write(postData);
  req.end();
}

// Проверяем аргументы
const webhookUrl = process.argv[2];
if (!webhookUrl) {
  console.log('Использование: node test-webhook.js <webhook-url>');
  console.log('Пример: node test-webhook.js https://your-project.vercel.app/api/fk/notify');
  process.exit(1);
}

// Запускаем тест
testWebhook(webhookUrl);
