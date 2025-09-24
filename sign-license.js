import { readFileSync, writeFileSync } from "node:fs";
import { createSign, createPrivateKey } from "node:crypto";

// Генерируем приватный ключ если его нет
const crypto = require('crypto');
const fs = require('fs');

// Создаем приватный ключ
const { execSync } = require('child_process');
try {
  execSync('openssl ecparam -name prime256v1 -genkey -noout -out private.pem');
  console.log('✓ Приватный ключ создан');
} catch (err) {
  console.log('Приватный ключ уже существует');
}

// Читаем приватный ключ
const privPem = readFileSync("private.pem", "utf8");
const privateKey = createPrivateKey(privPem);

// Создаем VIP лицензию для владельца
const payload = {
  plan: "VIP",
  email: "owner@lifeundo.ru",
  seats: 999999,
  expires: null, // бессрочно
  scope: "unlimited",
  issued: new Date().toISOString()
};

// Подписываем
const unsigned = JSON.stringify(payload);
const sign = createSign("sha256");
sign.update(unsigned);
sign.end();
const signature = sign.sign(privateKey);

// Конвертируем в base64url
const b64url = b => b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// Создаем финальную лицензию
const lic = { ...payload, sig: b64url(signature) };

// Сохраняем
writeFileSync("owner-vip.lifelic", JSON.stringify(lic, null, 2), "utf8");
console.log("✓ owner-vip.lifelic готов");

// Также создаем публичный ключ
const { execSync } = require('child_process');
execSync('openssl ec -in private.pem -pubout -out public.pem');
console.log("✓ public.pem создан");





















