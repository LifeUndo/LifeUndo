import { NextRequest } from 'next/server';
import { getSessionFromRequest, getApiKeyFromRequest } from '@/lib/auth/session';

export interface RBACContext {
  user?: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
  };
  org: {
    id: string;
    name: string;
    slug: string;
    type: 'internal' | 'partner' | 'customer';
  } | null;
  membership?: {
    id: string;
    orgId: string;
    userId: string;
    role: 'admin' | 'operator' | 'auditor' | 'partner' | 'viewer';
    status: 'active' | 'invited' | 'disabled';
  };
  apiKey?: {
    org: any;
    scopes: string[];
    rateLimit: number;
    keyId: string;
  };
  actorType: 'user' | 'api' | null;
  isAuthenticated: boolean;
}

export interface RBACOptions {
  roles?: ('admin' | 'operator' | 'auditor' | 'partner' | 'viewer')[];
  scopes?: string[];
  requireOrg?: boolean;
}

export async function requireAuth(req: NextRequest): Promise<RBACContext> {
  // Сначала пробуем API ключ
  const apiKey = await getApiKeyFromRequest(req);
  if (apiKey) {
    return {
      org: apiKey.org || null,
      apiKey: {
        ...apiKey,
        org: apiKey.org || null
      },
      actorType: 'api',
      isAuthenticated: true,
    };
  }

  // Затем пробуем сессию пользователя
  const session = await getSessionFromRequest(req);
  if (session.isAuthenticated && session.user && session.org && session.membership) {
    return {
      user: session.user,
      org: session.org,
      membership: session.membership,
      actorType: 'user',
      isAuthenticated: true,
    };
  }

  return {
    org: null,
    isAuthenticated: false,
    actorType: null,
  };
}

export function requireRole(
  context: RBACContext,
  allowedRoles: ('admin' | 'operator' | 'auditor' | 'partner' | 'viewer')[]
): boolean {
  if (!context.isAuthenticated) {
    return false;
  }

  if (context.actorType === 'api') {
    // API ключи могут иметь любую роль (проверяем через скоупы)
    return true;
  }

  if (context.actorType === 'user' && context.membership) {
    return allowedRoles.includes(context.membership.role);
  }

  return false;
}

export function requireScope(
  context: RBACContext,
  requiredScopes: string[]
): boolean {
  if (!context.isAuthenticated) {
    return false;
  }

  if (context.actorType === 'api' && context.apiKey) {
    const userScopes = context.apiKey.scopes;
    
    // Проверяем каждый требуемый скоуп
    return requiredScopes.every(scope => {
      // Если есть admin:* - разрешено всё
      if (userScopes.includes('admin:*')) {
        return true;
      }
      
      // Точное совпадение
      if (userScopes.includes(scope)) {
        return true;
      }
      
      // Проверяем wildcard (например, usage:* для usage:read)
      const scopeParts = scope.split(':');
      if (scopeParts.length === 2) {
        const wildcardScope = scopeParts[0] + ':*';
        return userScopes.includes(wildcardScope);
      }
      
      return false;
    });
  }

  if (context.actorType === 'user' && context.membership) {
    // Для пользователей проверяем через роли
    const roleScopes = getRoleScopes(context.membership.role);
    return requiredScopes.every(scope => roleScopes.includes(scope) || roleScopes.includes('admin:*'));
  }

  return false;
}

function getRoleScopes(role: string): string[] {
  const roleScopeMap: Record<string, string[]> = {
    admin: ['admin:*'],
    operator: ['usage:read', 'usage:export', 'email:submit', 'email:approve', 'email:deny'],
    auditor: ['usage:read', 'usage:export'],
    partner: ['usage:read', 'usage:export', 'webhook:sign'],
    viewer: ['usage:read'],
  };
  
  return roleScopeMap[role] || [];
}

export function assertOrgContext(context: RBACContext, resourceOrgId: string): boolean {
  if (!context.isAuthenticated || !context.org) {
    return false;
  }
  
  return context.org.id === resourceOrgId;
}

export function withAuthAndRBAC<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<Response>,
  options: RBACOptions = {}
) {
  return async (req: NextRequest, ...args: T): Promise<Response> => {
    const context = await requireAuth(req);
    
    if (!context.isAuthenticated) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (options.requireOrg && !context.org) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Organization context required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (options.roles && !requireRole(context, options.roles)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient role permissions' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (options.scopes && !requireScope(context, options.scopes)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient scope permissions' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Добавляем контекст в request для использования в handler
    (req as any).rbacContext = context;
    
    return handler(req, ...args);
  };
}

// Вспомогательные функции для проверки прав
export function canManageUsers(context: RBACContext): boolean {
  return requireRole(context, ['admin']);
}

export function canManageApiKeys(context: RBACContext): boolean {
  return requireRole(context, ['admin', 'partner']);
}

export function canViewUsage(context: RBACContext): boolean {
  return requireScope(context, ['usage:read']) || requireRole(context, ['admin', 'operator', 'auditor', 'partner', 'viewer']);
}

export function canExportUsage(context: RBACContext): boolean {
  return requireScope(context, ['usage:export']) || requireRole(context, ['admin', 'operator', 'auditor', 'partner']);
}

export function canApproveEmails(context: RBACContext): boolean {
  return requireScope(context, ['email:approve']) || requireRole(context, ['admin', 'operator']);
}

export function canManageWebhooks(context: RBACContext): boolean {
  return requireScope(context, ['webhook:sign']) || requireRole(context, ['admin', 'partner']);
}

