import { db } from '@/db/client';
import { sql } from 'drizzle-orm';
import { formatPrice } from './plans';

export interface Invoice {
  id: string;
  orgId: string;
  subscriptionId: string;
  invoiceNumber: string;
  periodStart: Date;
  periodEnd: Date;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  status: 'draft' | 'open' | 'paid' | 'void';
  issuedAt?: Date;
  paidAt?: Date;
  externalRef?: string;
  createdAt: Date;
  updatedAt: Date;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  sku: string;
  description: string;
  quantity: number;
  unitCents: number;
  amountCents: number;
  createdAt: Date;
}

export async function createInvoice(
  orgId: string,
  subscriptionId: string,
  periodStart: Date,
  periodEnd: Date,
  lines: Array<{
    sku: string;
    description: string;
    quantity: number;
    unitCents: number;
  }>
): Promise<Invoice | null> {
  try {
    // Генерируем номер инвойса
    const invoiceNumberResult = await db.execute(sql`SELECT generate_invoice_number() as invoice_number`);
    const invoiceNumber = (invoiceNumberResult.rows[0] as any).invoice_number;

    // Вычисляем суммы
    const subtotalCents = lines.reduce((sum, line) => sum + (line.quantity * line.unitCents), 0);
    const discountCents = 0; // TODO: реализовать скидки
    const taxCents = 0; // TODO: реализовать налоги
    const totalCents = subtotalCents - discountCents + taxCents;

    // Создаем инвойс
    const invoiceResult = await db.execute(sql`
      INSERT INTO invoices (
        org_id, subscription_id, invoice_number, period_start, period_end,
        subtotal_cents, discount_cents, tax_cents, total_cents, status
      ) VALUES (
        ${orgId}, ${subscriptionId}, ${invoiceNumber}, 
        ${periodStart.toISOString()}, ${periodEnd.toISOString()},
        ${subtotalCents}, ${discountCents}, ${taxCents}, ${totalCents}, 'draft'
      ) RETURNING id
    `);

    const invoiceId = (invoiceResult.rows[0] as any).id;

    // Создаем строки инвойса
    for (const line of lines) {
      const amountCents = line.quantity * line.unitCents;
      
      await db.execute(sql`
        INSERT INTO invoice_lines (
          invoice_id, sku, description, quantity, unit_cents, amount_cents
        ) VALUES (
          ${invoiceId}, ${line.sku}, ${line.description}, 
          ${line.quantity}, ${line.unitCents}, ${amountCents}
        )
      `);
    }

    // Возвращаем созданный инвойс
    return await getInvoiceById(invoiceId);

  } catch (error) {
    console.error('Failed to create invoice:', error);
    return null;
  }
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  try {
    const invoiceResult = await db.execute(sql`
      SELECT 
        id, org_id, subscription_id, invoice_number, period_start, period_end,
        subtotal_cents, discount_cents, tax_cents, total_cents, status,
        issued_at, paid_at, external_ref, created_at, updated_at
      FROM invoices
      WHERE id = ${invoiceId}
      LIMIT 1
    `);

    if (invoiceResult.rows.length === 0) {
      return null;
    }

    const invoice = invoiceResult.rows[0] as any;

    // Получаем строки инвойса
    const linesResult = await db.execute(sql`
      SELECT 
        id, invoice_id, sku, description, quantity, unit_cents, amount_cents, created_at
      FROM invoice_lines
      WHERE invoice_id = ${invoiceId}
      ORDER BY created_at ASC
    `);

    const lines: InvoiceLine[] = linesResult.rows.map(row => {
      const r = row as any;
      return {
        id: r.id,
        invoiceId: r.invoice_id,
        sku: r.sku,
        description: r.description,
        quantity: r.quantity,
        unitCents: r.unit_cents,
        amountCents: r.amount_cents,
        createdAt: new Date(r.created_at),
      };
    });

    return {
      id: invoice.id,
      orgId: invoice.org_id,
      subscriptionId: invoice.subscription_id,
      invoiceNumber: invoice.invoice_number,
      periodStart: new Date(invoice.period_start),
      periodEnd: new Date(invoice.period_end),
      subtotalCents: invoice.subtotal_cents,
      discountCents: invoice.discount_cents,
      taxCents: invoice.tax_cents,
      totalCents: invoice.total_cents,
      status: invoice.status,
      issuedAt: invoice.issued_at ? new Date(invoice.issued_at) : undefined,
      paidAt: invoice.paid_at ? new Date(invoice.paid_at) : undefined,
      externalRef: invoice.external_ref,
      createdAt: new Date(invoice.created_at),
      updatedAt: new Date(invoice.updated_at),
      lines,
    };

  } catch (error) {
    console.error('Failed to get invoice:', error);
    return null;
  }
}

export async function getOrgInvoices(
  orgId: string,
  status?: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ invoices: Invoice[]; total: number }> {
  try {
    let conditions = [sql`org_id = ${orgId}`];
    if (status) {
      conditions.push(sql`status = ${status}`);
    }

    // Получаем инвойсы
    const invoicesResult = await db.execute(sql`
      SELECT 
        id, org_id, subscription_id, invoice_number, period_start, period_end,
        subtotal_cents, discount_cents, tax_cents, total_cents, status,
        issued_at, paid_at, external_ref, created_at, updated_at
      FROM invoices
      WHERE ${sql.join(conditions, sql` AND `)}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Получаем общее количество
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM invoices
      WHERE ${sql.join(conditions, sql` AND `)}
    `);

    const total = Number((countResult.rows[0] as any).total);

    // Получаем строки для каждого инвойса
    const invoices: Invoice[] = [];
    
    for (const invoiceRow of invoicesResult.rows) {
      const invoice = invoiceRow as any;
      
      const linesResult = await db.execute(sql`
        SELECT 
          id, invoice_id, sku, description, quantity, unit_cents, amount_cents, created_at
        FROM invoice_lines
        WHERE invoice_id = ${invoice.id}
        ORDER BY created_at ASC
      `);

      const lines: InvoiceLine[] = linesResult.rows.map(row => {
        const r = row as any;
        return {
          id: r.id,
          invoiceId: r.invoice_id,
          sku: r.sku,
          description: r.description,
          quantity: r.quantity,
          unitCents: r.unit_cents,
          amountCents: r.amount_cents,
          createdAt: new Date(r.created_at),
        };
      });

      invoices.push({
        id: invoice.id,
        orgId: invoice.org_id,
        subscriptionId: invoice.subscription_id,
        invoiceNumber: invoice.invoice_number,
        periodStart: new Date(invoice.period_start),
        periodEnd: new Date(invoice.period_end),
        subtotalCents: invoice.subtotal_cents,
        discountCents: invoice.discount_cents,
        taxCents: invoice.tax_cents,
        totalCents: invoice.total_cents,
        status: invoice.status,
        issuedAt: invoice.issued_at ? new Date(invoice.issued_at) : undefined,
        paidAt: invoice.paid_at ? new Date(invoice.paid_at) : undefined,
        externalRef: invoice.external_ref,
        createdAt: new Date(invoice.created_at),
        updatedAt: new Date(invoice.updated_at),
        lines,
      });
    }

    return { invoices, total };

  } catch (error) {
    console.error('Failed to get org invoices:', error);
    return { invoices: [], total: 0 };
  }
}

export async function finalizeInvoice(invoiceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    if (invoice.status !== 'draft') {
      return { success: false, message: 'Invoice is not in draft status' };
    }

    await db.execute(sql`
      UPDATE invoices 
      SET 
        status = 'open',
        issued_at = now(),
        updated_at = now()
      WHERE id = ${invoiceId}
    `);

    // Логируем финализацию
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${invoice.orgId}, 
        'system', 
        'billing-service', 
        'invoice_finalized', 
        'invoices', 
        ${invoiceId},
        ${JSON.stringify({ 
          invoiceNumber: invoice.invoiceNumber,
          totalCents: invoice.totalCents 
        })}
      )
    `);

    return { success: true, message: 'Invoice finalized' };

  } catch (error: any) {
    console.error('Failed to finalize invoice:', error);
    return { success: false, message: error.message };
  }
}

export async function markInvoicePaid(
  invoiceId: string,
  externalRef?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    if (invoice.status !== 'open') {
      return { success: false, message: 'Invoice is not open for payment' };
    }

    await db.execute(sql`
      UPDATE invoices 
      SET 
        status = 'paid',
        paid_at = now(),
        external_ref = ${externalRef || null},
        updated_at = now()
      WHERE id = ${invoiceId}
    `);

    // Логируем оплату
    await db.execute(sql`
      INSERT INTO audit_log (org_id, actor_type, actor_id, action, target_type, target_id, meta)
      VALUES (
        ${invoice.orgId}, 
        'system', 
        'billing-service', 
        'invoice_paid', 
        'invoices', 
        ${invoiceId},
        ${JSON.stringify({ 
          invoiceNumber: invoice.invoiceNumber,
          totalCents: invoice.totalCents,
          externalRef 
        })}
      )
    `);

    return { success: true, message: 'Invoice marked as paid' };

  } catch (error: any) {
    console.error('Failed to mark invoice as paid:', error);
    return { success: false, message: error.message };
  }
}

export async function generateInvoiceCSV(invoiceId: string): Promise<string | null> {
  try {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      return null;
    }

    const csvLines: string[] = [];
    
    // Заголовок
    csvLines.push('Invoice Number,Period Start,Period End,Status,Total Amount');
    csvLines.push(`${invoice.invoiceNumber},${invoice.periodStart.toISOString().slice(0, 10)},${invoice.periodEnd.toISOString().slice(0, 10)},${invoice.status},${formatPrice(invoice.totalCents)}`);
    csvLines.push(''); // Пустая строка
    
    // Детали строк
    csvLines.push('Line Items');
    csvLines.push('SKU,Description,Quantity,Unit Price,Amount');
    
    for (const line of invoice.lines) {
      csvLines.push(`${line.sku},"${line.description}",${line.quantity},${formatPrice(line.unitCents)},${formatPrice(line.amountCents)}`);
    }
    
    csvLines.push(''); // Пустая строка
    
    // Итоги
    csvLines.push('Summary');
    csvLines.push(`Subtotal,${formatPrice(invoice.subtotalCents)}`);
    csvLines.push(`Discount,${formatPrice(invoice.discountCents)}`);
    csvLines.push(`Tax,${formatPrice(invoice.taxCents)}`);
    csvLines.push(`Total,${formatPrice(invoice.totalCents)}`);

    return csvLines.join('\n');

  } catch (error) {
    console.error('Failed to generate invoice CSV:', error);
    return null;
  }
}


