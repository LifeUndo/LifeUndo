import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRBAC } from "@/lib/rbac/guard";
import { getInvoiceById, finalizeInvoice } from "@/lib/billing/invoice";

export const runtime = 'nodejs';

async function handlePost(
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

    const result = await finalizeInvoice(invoiceId);

    if (!result.success) {
      return NextResponse.json({ 
        ok: false, 
        error: result.message 
      }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: result.message,
      invoiceId,
      status: 'open',
    });

  } catch (error: any) {
    console.error('Failed to finalize invoice:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || 'Failed to finalize invoice' 
    }, { status: 500 });
  }
}

export const POST = withAuthAndRBAC(handlePost, {
  roles: ['admin'],
  requireOrg: true,
});

