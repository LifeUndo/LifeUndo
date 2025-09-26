import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { getInvoiceById, generateInvoiceCSV } from "@/lib/billing/invoice";

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

    const csvContent = await generateInvoiceCSV(invoiceId);

    if (!csvContent) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to generate CSV' 
      }, { status: 500 });
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.csv"`,
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Failed to export invoice CSV:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to export invoice' 
    }, { status: 500 });
  }
}

export const GET = withAuthAndRBAC(handleGet, {
  roles: ['admin', 'partner'],
  requireOrg: true,
});

