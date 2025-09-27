#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки FreeKassa API
 * Использование: 
 *   node test-webhook.js create <api-url> - тест создания платежа
 *   node test-webhook.js notify <webhook-url> - тест webhook
 */

const https = require('https');
const crypto = require('crypto');

// Тестовые данные для webhook
const testWebhookData = {
  merchant_id: 'TEST_MERCHANT',
  order_id: 'LU-TEST-' + Date.now(),
  amount: '1490',
  currency: 'RUB',
  us_email: 'test@example.com',
  us_plan: 'pro_year',
  us_locale: 'ru',
  sign: '' // Будет заполнено ниже
};

// Тестовые данные для создания платежа
const testCreateData = {
  email: 'test@example.com',
  plan: 'pro_year',
  locale: 'ru'
};

// Секретный ключ (для теста)
const secretKey = 'TEST_SECRET_KEY';

// Генерируем подпись для webhook
function generateSignature(data, secret) {
  const base = `${data.merchant_id}:${data.amount}:${data.currency}:${data.order_id}:${secret}`;
  return crypto.createHash('sha256').update(base).digest('hex');
}

// Устанавливаем подпись
testWebhookData.sign = generateSignature(testWebhookData, secretKey);

function makeRequest(url, data, method = 'POST') {
  const postData = JSON.stringify(data);
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testCreatePayment(url) {
  console.log('🚀 Тестируем создание платежа на:', url);
  console.log('📦 Данные:', JSON.stringify(testCreateData, null, 2));
  console.log('---');

  try {
    const response = await makeRequest(url, testCreateData);
    
    console.log(`📊 Статус: ${response.statusCode}`);
    console.log(`📝 Ответ: ${response.data}`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.url && data.order_id) {
        console.log('✅ Создание платежа работает корректно!');
        console.log(`🔗 URL: ${data.url}`);
        console.log(`🆔 Order ID: ${data.order_id}`);
      } else {
        console.log('❌ Неверный формат ответа');
      }
    } else {
      console.log('❌ Создание платежа вернуло ошибку');
    }
  } catch (error) {
    console.error('❌ Ошибка запроса:', error.message);
  }
}

async function testWebhook(url) {
  console.log('🚀 Тестируем webhook на:', url);
  console.log('📦 Данные:', JSON.stringify(testWebhookData, null, 2));
  console.log('🔐 Подпись:', testWebhookData.sign);
  console.log('---');

  try {
    const response = await makeRequest(url, testWebhookData);
    
    console.log(`📊 Статус: ${response.statusCode}`);
    console.log(`📝 Ответ: ${response.data}`);
    
    if (response.statusCode === 200) {
      console.log('✅ Webhook работает корректно!');
    } else {
      console.log('❌ Webhook вернул ошибку');
    }
  } catch (error) {
    console.error('❌ Ошибка запроса:', error.message);
  }
}

// Проверяем аргументы
const command = process.argv[2];
const url = process.argv[3];

if (!command || !url) {
  console.log('Использование:');
  console.log('  node test-webhook.js create <api-url>     - тест создания платежа');
  console.log('  node test-webhook.js notify <webhook-url> - тест webhook');
  console.log('');
  console.log('Примеры:');
  console.log('  node test-webhook.js create https://your-project.vercel.app/api/fk/create');
  console.log('  node test-webhook.js notify https://your-project.vercel.app/api/fk/notify');
  process.exit(1);
}

// Запускаем тест
if (command === 'create') {
  testCreatePayment(url);
} else if (command === 'notify') {
  testWebhook(url);
} else {
  console.log('❌ Неизвестная команда:', command);
  console.log('Используйте: create или notify');
  process.exit(1);
}
