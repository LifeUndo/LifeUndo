import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { tenantDomains } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = parseInt(params.id);
    const { domain } = await req.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'domain is required' }, { status: 400 });
    }
    
    const [newDomain] = await db
      .insert(tenantDomains)
      .values({
        tenantId,
        domain
      })
      .returning();
    
    return NextResponse.json({ domain: newDomain });
  } catch (error) {
    console.error('Error adding domain:', error);
    return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = parseInt(params.id);
    
    const domains = await db
      .select()
      .from(tenantDomains)
      .where(eq(tenantDomains.tenantId, tenantId));
    
    return NextResponse.json({ domains });
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 });
  }
}

