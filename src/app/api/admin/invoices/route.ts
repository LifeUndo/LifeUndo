import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { getOrgInvoices } from "@/lib/billing/invoice";

export const runtime = 'nodejs';

async function handleGet(req: NextRequest) {
  const context = (req as any).rbacContext;
  const org = context.org;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = Math.min(Number(url.searchParams.get('limit') || 50), 100);
    const offset = Number(url.searchParams.get('offset') || 0);

    const { invoices, total } = await getOrgInvoices(org.id, status || undefined, limit, offset);

    return NextResponse.json({
      ok: true,
      org: org.slug,
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        periodStart: invoice.periodStart.toISOString(),
        periodEnd: invoice.periodEnd.toISOString(),
        subtotalCents: invoice.subtotalCents,
        discountCents: invoice.discountCents,
        taxCents: invoice.taxCents,
        totalCents: invoice.totalCents,
        status: invoice.status,
        issuedAt: invoice.issuedAt?.toISOString(),
        paidAt: invoice.paidAt?.toISOString(),
        externalRef: invoice.externalRef,
        createdAt: invoice.createdAt.toISOString(),
        updatedAt: invoice.updatedAt.toISOString(),
        lines: invoice.lines.map(line => ({
          id: line.id,
          sku: line.sku,
          description: line.description,
          quantity: line.quantity,
          unitCents: line.unitCents,
          amountCents: line.amountCents,
        })),
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error) {
    console.error('Failed to get invoices:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to retrieve invoices' 
    }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'partner'],
  requireOrg: true,
});

