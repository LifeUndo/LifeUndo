# LifeUndo — выпуск лицензий (VIP/PRO/TEAM), офлайн-подпись

## 1) Генерация ключей (один раз)
```bash
openssl ecparam -name prime256v1 -genkey -noout -out private.pem
openssl ec -in private.pem -pubout -out public.pem
```

## 2) Вставить public.pem в extension_firefox/license.js (константа PUBLIC_KEY_PEM)

## 3) Подписать лицензию (Node.js 18+)

Создай sign-license.js рядом с private.pem:

```js
import { readFileSync, writeFileSync } from "node:fs";
import { createSign, createPrivateKey } from "node:crypto";
const privPem = readFileSync("private.pem","utf8");
const privateKey = createPrivateKey(privPem);
const payload = {
  plan: "VIP",              // "VIP" | "PRO" | "TEAM"
  email: "owner@lifeundo.ru",
  seats: 999999,            // для VIP можно большое число
  expires: null,            // null → бессрочно; или "2026-12-31T00:00:00.000Z"
  scope: "unlimited",
  issued: new Date().toISOString()
};
const unsigned = JSON.stringify(payload);
const sign = createSign("sha256"); sign.update(unsigned); sign.end();
const signature = sign.sign(privateKey); // DER
const b64url = b=>b.toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const lic = { ...payload, sig: b64url(signature) };
writeFileSync("license.lifelic", JSON.stringify(lic,null,2), "utf8");
console.log("✓ license.lifelic готов");
```

Запуск:

```bash
node sign-license.js
```

## 4) Импорт лицензии

Options → «Импортировать .lifelic». Статус отображается из License.humanStatus().

