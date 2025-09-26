import { NextRequest } from 'next/server';
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  type: 'internal' | 'partner' | 'customer';
}

export interface Membership {
  id: string;
  orgId: string;
  userId: string;
  role: 'admin' | 'operator' | 'auditor' | 'partner' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
}

export interface SessionContext {
  user?: User;
  org?: Org;
  membership?: Membership;
  isAuthenticated: boolean;
}

// Извлекаем сессию из Basic Auth (временное решение)
export async function getSessionFromRequest(req: NextRequest): Promise<SessionContext> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return { isAuthenticated: false };
    }

    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
    const [email, password] = credentials.split(':');

    // Проверяем Basic Auth (временная реализация)
    const basicAuthUser = process.env.BASIC_AUTH_USER || 'admin';
    const basicAuthPass = process.env.BASIC_AUTH_PASS || 'admin';

    if (email !== basicAuthUser || password !== basicAuthPass) {
      return { isAuthenticated: false };
    }

    // Ищем пользователя в БД или создаем дефолтного
    const userResult = await db.execute(sql`
      SELECT id, email, name, is_active
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `);

    let user: User;
    if (userResult.rows.length === 0) {
      // Создаем дефолтного пользователя
      const newUserResult = await db.execute(sql`
        INSERT INTO users (email, name, is_active)
        VALUES (${email}, ${email}, true)
        RETURNING id, email, name, is_active
      `);
      user = newUserResult.rows[0] as User;
    } else {
      user = userResult.rows[0] as User;
    }

    if (!user.isActive) {
      return { isAuthenticated: false };
    }

    // Получаем организацию и членство
    const membershipResult = await db.execute(sql`
      SELECT 
        m.id, m.org_id, m.user_id, m.role, m.status,
        o.name as org_name, o.slug as org_slug, o.type as org_type
      FROM memberships m
      JOIN orgs o ON m.org_id = o.id
      WHERE m.user_id = ${user.id} AND m.status = 'active'
      ORDER BY m.created_at DESC
      LIMIT 1
    `);

    if (membershipResult.rows.length === 0) {
      // Создаем членство в дефолтной организации
      const defaultOrgResult = await db.execute(sql`
        SELECT id, name, slug, type FROM orgs WHERE slug = 'default' LIMIT 1
      `);
      
      if (defaultOrgResult.rows.length === 0) {
        return { user, isAuthenticated: true };
      }

      const defaultOrg = defaultOrgResult.rows[0] as any;
      await db.execute(sql`
        INSERT INTO memberships (org_id, user_id, role, status)
        VALUES (${defaultOrg.id}, ${user.id}, 'admin', 'active')
        ON CONFLICT (org_id, user_id) DO NOTHING
      `);

      const newMembershipResult = await db.execute(sql`
        SELECT 
          m.id, m.org_id, m.user_id, m.role, m.status,
          o.name as org_name, o.slug as org_slug, o.type as org_type
        FROM memberships m
        JOIN orgs o ON m.org_id = o.id
        WHERE m.org_id = ${defaultOrg.id} AND m.user_id = ${user.id}
        LIMIT 1
      `);

      const membershipData = newMembershipResult.rows[0] as any;
      return {
        user,
        org: {
          id: membershipData.org_id,
          name: membershipData.org_name,
          slug: membershipData.org_slug,
          type: membershipData.org_type,
        },
        membership: {
          id: membershipData.id,
          orgId: membershipData.org_id,
          userId: membershipData.user_id,
          role: membershipData.role,
          status: membershipData.status,
        },
        isAuthenticated: true,
      };
    }

    const membershipData = membershipResult.rows[0] as any;
    return {
      user,
      org: {
        id: membershipData.org_id,
        name: membershipData.org_name,
        slug: membershipData.org_slug,
        type: membershipData.org_type,
      },
      membership: {
        id: membershipData.id,
        orgId: membershipData.org_id,
        userId: membershipData.user_id,
        role: membershipData.role,
        status: membershipData.status,
      },
      isAuthenticated: true,
    };

  } catch (error) {
    console.error('Session extraction error:', error);
    return { isAuthenticated: false };
  }
}

// Извлекаем API ключ из Authorization header
export async function getApiKeyFromRequest(req: NextRequest): Promise<{
  org?: Org;
  scopes: string[];
  rateLimit: number;
  keyId: string;
} | null> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const apiKey = authHeader.slice(7);
    const keyHash = Buffer.from(apiKey, 'utf8').toString('hex'); // Простое хеширование для демо

    const keyResult = await db.execute(sql`
      SELECT 
        ak.id, ak.org_id, ak.scopes, ak.rate_limit_per_min,
        o.name as org_name, o.slug as org_slug, o.type as org_type
      FROM api_keys ak
      JOIN orgs o ON ak.org_id = o.id
      WHERE ak.key_hash = ${keyHash} AND ak.revoked_at IS NULL
      LIMIT 1
    `);

    if (keyResult.rows.length === 0) {
      return null;
    }

    const keyData = keyResult.rows[0] as any;

    // Обновляем last_used_at
    await db.execute(sql`
      UPDATE api_keys 
      SET last_used_at = now() 
      WHERE id = ${keyData.id}
    `);

    return {
      org: {
        id: keyData.org_id,
        name: keyData.org_name,
        slug: keyData.org_slug,
        type: keyData.org_type,
      },
      scopes: keyData.scopes || [],
      rateLimit: keyData.rate_limit_per_min || 120,
      keyId: keyData.id,
    };

  } catch (error) {
    console.error('API key extraction error:', error);
    return null;
  }
}

