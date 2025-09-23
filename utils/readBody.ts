// utils/readBody.ts
import { VercelRequest } from '@vercel/node';

/**
 * Универсальный парсер тела запроса
 * Поддерживает JSON, x-www-form-urlencoded и fallback на querystring
 */
export async function readBody(req: VercelRequest): Promise<Record<string, any>> {
  // Если тело уже распарсено (JSON)
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) {
    return req.body;
  }

  // Читаем сырое тело
  const chunks: Buffer[] = [];
  for await (const c of req) {
    chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
  }
  const raw = Buffer.concat(chunks).toString('utf8') || '';
  const ct = (req.headers['content-type'] || '').toString();

  // Парсим по Content-Type
  if (ct.includes('application/x-www-form-urlencoded')) {
    const p = new URLSearchParams(raw);
    const obj: Record<string, string> = {};
    for (const [k, v] of p) {
      obj[k] = v;
    }
    return obj;
  }

  if (ct.includes('application/json')) {
    try {
      return JSON.parse(raw);
    } catch {
      // fallthrough
    }
  }

  // Последний шанс: попытаться распарсить как querystring
  try {
    const p = new URLSearchParams(raw);
    const obj: Record<string, string> = {};
    for (const [k, v] of p) {
      obj[k] = v;
    }
    return obj;
  } catch {
    // ignore
  }

  return {};
}
