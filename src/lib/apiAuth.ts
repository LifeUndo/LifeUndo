import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { apiKeys } from "@/db/schema";
import crypto from "crypto";

export async function verifyApiKey(header?: string){
  if(!header?.startsWith('Bearer ')) return null;
  const raw = header.slice(7);
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const rows = await db.select().from(apiKeys).where(eq(apiKeys.hash, hash)).limit(1);
  return rows[0] || null;
}


