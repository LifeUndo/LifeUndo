import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { tenants, tenantDomains } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const tenantList = await db
      .select({
        id: tenants.id,
        slug: tenants.slug,
        name: tenants.name,
        primaryColor: tenants.primaryColor,
        createdAt: tenants.createdAt,
        domains: tenantDomains.domain
      })
      .from(tenants)
      .leftJoin(tenantDomains, eq(tenants.id, tenantDomains.tenantId));
    
    // Group domains by tenant
    const grouped = tenantList.reduce((acc, row) => {
      const existing = acc.find(t => t.id === row.id);
      if (existing) {
        if (row.domains) existing.domains.push(row.domains);
      } else {
        acc.push({
          id: row.id,
          slug: row.slug,
          name: row.name,
          primaryColor: row.primaryColor,
          createdAt: row.createdAt,
          domains: row.domains ? [row.domains] : []
        });
      }
      return acc;
    }, [] as any[]);
    
    return NextResponse.json({ tenants: grouped });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, name, theme, primaryColor, domains = [] } = await req.json();
    
    if (!slug || !name) {
      return NextResponse.json({ error: 'slug and name are required' }, { status: 400 });
    }
    
    // Create tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        slug,
        name,
        theme: theme || {},
        primaryColor: primaryColor || '#0066CC'
      })
      .returning();
    
    // Add domains if provided
    if (domains.length > 0) {
      await db
        .insert(tenantDomains)
        .values(
          domains.map((domain: string) => ({
            tenantId: tenant.id,
            domain
          }))
        );
    }
    
    return NextResponse.json({ 
      tenant: {
        ...tenant,
        domains
      }
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
  }
}

