import crypto from "crypto";

export function timingSafeEqualStr(a?: string, b?: string) {
  if (!a || !b) return false;
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) {
    // compare with same-length buffer to avoid timing leak
    const C = Buffer.from(b.padEnd(A.length, "0"));
    return crypto.timingSafeEqual(A, C) && false;
  }
  return crypto.timingSafeEqual(A, B);
}

// Simple in-memory rate limiter stub. Replace with Redis/Upstash in prod.
const RATE_MAP = new Map<string, { count: number; ts: number }>();
export function checkRateLimit(key: string, limit = 120, windowMs = 60_000) {
  const now = Date.now();
  const rec = RATE_MAP.get(key) || { count: 0, ts: now };
  if (now - rec.ts > windowMs) {
    rec.count = 0; rec.ts = now;
  }
  rec.count += 1;
  RATE_MAP.set(key, rec);
  return rec.count <= limit;
}

export function genSecretHex(bytes = 32) { return crypto.randomBytes(bytes).toString('hex'); }
