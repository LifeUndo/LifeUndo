// Тест подписи FreeKassa
const crypto = require('crypto');

// Данные из вашего файла паролей
const MERCHANT_ID = "54c3ac0581ad5eeac3fbee2ffac83f6c";
const SECRET1 = "ponOk=W5^2W9t][";
const AMOUNT = "599.00";
const ORDER_ID = "1706630400000-test123";

// Формируем строку для подписи
const signatureString = `${MERCHANT_ID}:${AMOUNT}:${SECRET1}:${ORDER_ID}`;
console.log('Signature string:', signatureString);

// Создаем MD5 хеш
const signature = crypto.createHash('md5').update(signatureString).digest('hex');
console.log('MD5 signature:', signature);

// Формируем URL
const url = new URL('https://pay.freekassa.ru/');
url.searchParams.set('m', MERCHANT_ID);
url.searchParams.set('oa', AMOUNT);
url.searchParams.set('o', ORDER_ID);
url.searchParams.set('s', signature);

console.log('Generated URL:', url.toString());
console.log('Parameters:');
console.log('m (merchant):', url.searchParams.get('m'));
console.log('oa (amount):', url.searchParams.get('oa'));
console.log('o (order):', url.searchParams.get('o'));
console.log('s (signature):', url.searchParams.get('s'));
