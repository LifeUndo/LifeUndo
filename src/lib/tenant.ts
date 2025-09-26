import { db } from "@/db/client";
import { tenants, tenantDomains } from "@/db/schema";
import { eq } from "drizzle-orm";

// Simple in-memory cache for tenant resolution
const tenantCache = new Map<string, number>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

export async function resolveTenant(host: string): Promise<number | null> {
  try {
    // Remove port if present
    const cleanHost = host.split(':')[0].toLowerCase();
    
    // Check cache first
    const now = Date.now();
    if (tenantCache.has(cleanHost)) {
      const timestamp = cacheTimestamps.get(cleanHost) || 0;
      if (now - timestamp < CACHE_TTL) {
        return tenantCache.get(cleanHost)!;
      }
    }
    
    // Check environment mapping first
    const tenantMap = process.env.TENANT_MAP_JSON;
    if (tenantMap) {
      try {
        const mapping = JSON.parse(tenantMap);
        if (mapping[cleanHost]) {
          const tenantSlug = mapping[cleanHost];
          const [tenant] = await db
            .select({ id: tenants.id })
            .from(tenants)
            .where(eq(tenants.slug, tenantSlug))
            .limit(1);
          
          if (tenant) {
            tenantCache.set(cleanHost, tenant.id);
            cacheTimestamps.set(cleanHost, now);
            return tenant.id;
          }
        }
      } catch (error) {
        console.error('Error parsing TENANT_MAP_JSON:', error);
      }
    }
    
    // Find tenant by domain in database
    const [domainRecord] = await db
      .select({ tenantId: tenantDomains.tenantId })
      .from(tenantDomains)
      .where(eq(tenantDomains.domain, cleanHost))
      .limit(1);
    
    if (domainRecord) {
      tenantCache.set(cleanHost, domainRecord.tenantId);
      cacheTimestamps.set(cleanHost, now);
      return domainRecord.tenantId;
    }
    
    // Fallback to default tenant
    const defaultSlug = process.env.TENANT_DEFAULT_SLUG || 'lifeundo';
    const [defaultTenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.slug, defaultSlug))
      .limit(1);
    
    const tenantId = defaultTenant?.id || null;
    if (tenantId) {
      tenantCache.set(cleanHost, tenantId);
      cacheTimestamps.set(cleanHost, now);
    }
    
    return tenantId;
  } catch (error) {
    console.error('Error resolving tenant:', error);
    return null;
  }
}

export async function getTenantConfig(tenantId: number) {
  try {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);
    
    return tenant || null;
  } catch (error) {
    console.error('Error getting tenant config:', error);
    return null;
  }
}

export async function currentTenant() {
  // This would typically get tenant from request context
  // For now, return default tenant
  try {
    const defaultSlug = process.env.TENANT_DEFAULT_SLUG || 'lifeundo';
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, defaultSlug))
      .limit(1);
    
    return tenant || null;
  } catch (error) {
    console.error('Error getting current tenant:', error);
    return null;
  }
}
