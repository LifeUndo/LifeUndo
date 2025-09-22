const crypto = require('crypto');
const fs = require('fs');

// Создаем VIP лицензию для владельца
const payload = {
  plan: "VIP",
  email: "owner@lifeundo.ru", 
  seats: 999999,
  expires: null, // бессрочно
  scope: "unlimited",
  issued: new Date().toISOString()
};

// Генерируем ключевую пару
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1'
});

// Подписываем
const sign = crypto.createSign('sha256');
sign.update(JSON.stringify(payload));
sign.end();
const signature = sign.sign(privateKey);

// Конвертируем в base64url
const b64url = b => b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// Создаем финальную лицензию
const lic = { ...payload, sig: b64url(signature) };

// Сохраняем
fs.writeFileSync("owner-vip.lifelic", JSON.stringify(lic, null, 2), "utf8");
console.log("✓ owner-vip.lifelic готов");

// Сохраняем публичный ключ в PEM формате
const publicPem = publicKey.export({ type: 'spki', format: 'pem' });
fs.writeFileSync("public.pem", publicPem, "utf8");
console.log("✓ public.pem создан");

console.log("\n📋 Содержимое owner-vip.lifelic:");
console.log(JSON.stringify(lic, null, 2));















