import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { devices, licenses } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
    const platform = typeof body.platform === 'string' ? body.platform.trim() : '';
    const version = typeof body.version === 'string' ? body.version.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!deviceId || !platform) {
      return NextResponse.json({ error: 'Missing deviceId or platform' }, { status: 400 });
    }

    const now = new Date();

    // Базовая модель ответа по умолчанию (локальный триал на стороне клиента)
    const base = {
      ok: true,
      status: 'trial' as const,
      tier: 'free',
      trialStart: null as string | null,
      trialEnd: null as string | null,
      deviceStatus: 'active' as const,
    };

    // Зарегистрировать/обновить устройство, если БД сконфигурирована
    let userEmail: string | null = email || null;

    try {
      let deviceRow = await db.query.devices.findFirst({
        where: eq(devices.device_id, deviceId),
      });

      if (!deviceRow) {
        const [inserted] = await db
          .insert(devices)
          .values({
            user_email: userEmail || 'unknown@local',
            device_id: deviceId,
            kind: platform,
            created_at: now,
            last_seen_at: now,
          })
          .returning();
        deviceRow = inserted;
      } else {
        const [updated] = await db
          .update(devices)
          .set({
            user_email: userEmail || deviceRow.user_email,
            last_seen_at: now,
          })
          .where(eq(devices.id, deviceRow.id))
          .returning();
        deviceRow = updated;
      }

      if (!userEmail && deviceRow.user_email) {
        userEmail = deviceRow.user_email;
      }
    } catch (e) {
      // Если DATABASE_URL не задана или другая ошибка — просто вернём базовый ответ
      console.warn('[license.validate] DB unavailable, returning base response');
      return NextResponse.json(base);
    }

    // Если есть email — попробовать найти действующую лицензию
    if (!userEmail) {
      return NextResponse.json(base);
    }

    const lic = await db.query.licenses.findFirst({
      where: and(
        eq(licenses.user_email, userEmail),
        gt(licenses.expires_at, now) as any
      ),
    });

    if (!lic) {
      return NextResponse.json(base);
    }

    // Есть действующая лицензия
    const resp = {
      ok: true,
      status: 'active' as const,
      tier: lic.level || 'pro',
      trialStart: null as string | null,
      trialEnd: (lic.expires_at || null) ? lic.expires_at!.toISOString() : null,
      deviceStatus: 'active' as const,
    };

    return NextResponse.json(resp);
  } catch (error) {
    console.error('[license.validate] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// code omitted in chat
