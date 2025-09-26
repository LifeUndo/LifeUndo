import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { getInvoiceById } from "@/lib/billing/invoice";

export const runtime = 'nodejs';

async function handleGet(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = (req as any).rbacContext;
  const org = context.org;
  const invoiceId = params.id;
  
  if (!org) {
    return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 400 });
  }

  try {
    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      return NextResponse.json({ ok: false, error: 'Invoice not found' }, { status: 404 });
    }

    // Проверяем, что инвойс принадлежит организации
    if (invoice.orgId !== org.id) {
      return NextResponse.json({ ok: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      invoice: {
        id: invoice.id,
        orgId: invoice.orgId,
        subscriptionId: invoice.subscriptionId,
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
          invoiceId: line.invoiceId,
          sku: line.sku,
          description: line.description,
          quantity: line.quantity,
          unitCents: line.unitCents,
          amountCents: line.amountCents,
          createdAt: line.createdAt.toISOString(),
        })),
      },
    });

  } catch (error) {
    console.error('Failed to get invoice:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to retrieve invoice' 
    }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'partner'],
  requireOrg: true,
});

