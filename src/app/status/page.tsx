import { db } from "@/db/client";
import { statusBanners, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentTenant } from "@/lib/tenant";

export default async function Status() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.4.0";
  const t = await currentTenant();
  
  if (!t) {
    return (
      <main style={{padding: 24}}>
        <h1>Status</h1>
        <p>Tenant not found</p>
      </main>
    );
  }
  
  const rows = await db
    .select()
    .from(statusBanners)
    .where(eq(statusBanners.tenantId, t.id))
    .limit(1);
  
  const b = rows[0];
  
  return (
    <main style={{padding: 24}}>
      <h1>Status</h1>
      <p style={{opacity:.7}}>App version: {version}</p>
      {b?.active ? (
        <div style={{border: "1px solid #ddd", padding: 16, marginTop: 12}}>
          <strong>{b.title}</strong>
          <p>{b.message}</p>
        </div>
      ) : (
        <p>All systems nominal.</p>
      )}
    </main>
  );
}
