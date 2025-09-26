import { NextRequest, NextResponse } from "next/server";
import { currentTenant } from "@/lib/tenant";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenant = await currentTenant();
    if (!tenant?.id) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 400 });
    }

    const emailId = params.id;

    // Проверяем существование и статус письма
    const emailCheck = await db.execute(sql`
      SELECT id, status, tenant_id 
      FROM email_outbox 
      WHERE id = ${emailId} AND tenant_id = ${tenant.id}
    `);

    if (emailCheck.rows.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Email not found' 
      }, { status: 404 });
    }

    const email = emailCheck.rows[0] as any;
    
    if (email.status !== 'HOLD') {
      return NextResponse.json({ 
        ok: false, 
        error: `Email is not in HOLD status (current: ${email.status})` 
      }, { status: 400 });
    }

    // Обновляем статус на APPROVED
    const result = await db.execute(sql`
      UPDATE email_outbox 
      SET 
        status = 'APPROVED',
        approved_by = ${tenant.id},
        approved_at = now(),
        updated_at = now()
      WHERE id = ${emailId} AND tenant_id = ${tenant.id}
      RETURNING id, status, approved_at
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to approve email' 
      }, { status: 500 });
    }

    const updatedEmail = result.rows[0] as any;

    // Логируем действие в audit_log (если таблица существует)
    try {
      await db.execute(sql`
        INSERT INTO audit_log (tenant_id, action, resource_type, resource_id, details, created_at)
        VALUES (
          ${tenant.id}, 
          'email_approved', 
          'email_outbox', 
          ${emailId},
          ${JSON.stringify({ emailId, status: 'APPROVED' })},
          now()
        )
      `);
    } catch (auditError) {
      // Игнорируем ошибки audit_log
      console.warn('Failed to log email approval:', auditError);
    }

    return NextResponse.json({
      ok: true,
      emailId,
      status: updatedEmail.status,
      approvedAt: updatedEmail.approved_at,
    });

  } catch (error) {
    console.error('Email approve error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

