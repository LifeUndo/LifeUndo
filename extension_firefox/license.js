// license.js
export const TRIAL_DAYS = 7;

// ВСТАВЬ свой publicKey в формате JWK (P-256, ES256)
const PUBLIC_JWK = {
  "crv": "P-256",
  "kty": "EC",
  "x": "REPLACE_ME_X",
  "y": "REPLACE_ME_Y",
  "ext": true
};

// токен — это base64(JSON) + "." + base64(signature)
// JSON: { plan:"Pro|Team", email:"a@b", issued: epochMs, expires: epochMs, seats?: number }
export async function verifyToken(tokenOrFile) {
  const { payload, sig } = parseToken(tokenOrFile);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('jwk', PUBLIC_JWK, { name:'ECDSA', namedCurve:'P-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify({ name:'ECDSA', hash:'SHA-256' }, key, sig, enc.encode(payload.raw));
  if (!ok) throw new Error('bad-sign');

  const now = Date.now();
  if (payload.data.expires && now > payload.data.expires) throw new Error('expired');

  return {
    token: tokenOrFile,
    plan: payload.data.plan || 'Pro',
    email: payload.data.email || ''
  };
}

export function daysLeft(startEpoch) {
  const end = startEpoch + TRIAL_DAYS * 86400 * 1000;
  const diff = Math.ceil((end - Date.now()) / (86400 * 1000));
  return Math.max(0, diff);
}

function parseToken(s) {
  // поддержка «лицфайла» вида:
  // -----BEGIN LIFEUNDO LICENSE-----\n<token>\n-----END LIFEUNDO LICENSE-----
  const trimmed = s.replace(/-----BEGIN LIFEUNDO LICENSE-----/g,'')
                   .replace(/-----END LIFEUNDO LICENSE-----/g,'')
                   .trim();

  const [p, b64sig] = trimmed.split('.');
  if (!p || !b64sig) throw new Error('bad-token');

  const rawJson = atob(p);
  const data = JSON.parse(rawJson);
  const sig = base64ToBytes(b64sig);
  return { payload:{ data, raw: rawJson }, sig };
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
  return arr;
}
