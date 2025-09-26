import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export interface EmailMessage {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  textContent?: string;
  htmlContent?: string;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }>;
}

export interface EmailRule {
  id: string;
  tenantId: string;
  enabled: boolean;
  name: string;
  priority: number;
  matchFrom?: string;
  matchTo?: string;
  matchSubject?: string;
  matchDomain?: string;
  maxRecipients?: number;
  minSizeMb?: number;
  maxSizeMb?: number;
  hasAttachments?: boolean;
  action: 'AUTO_HOLD' | 'AUTO_ALLOW' | 'AUTO_DENY';
  reason: string;
}

export interface RuleResult {
  matched: boolean;
  rule?: EmailRule;
  action: 'AUTO_HOLD' | 'AUTO_ALLOW' | 'AUTO_DENY';
  reason?: string;
}

export async function evaluateEmailRules(
  tenantId: string,
  message: EmailMessage
): Promise<RuleResult> {
  // Получаем активные правила для арендатора, отсортированные по приоритету
  const rules = await db.execute(sql`
    SELECT id, tenant_id, enabled, name, priority,
           match_from, match_to, match_subject, match_domain,
           max_recipients, min_size_mb, max_size_mb, has_attachments,
           action, reason
    FROM email_rules
    WHERE tenant_id = ${tenantId} AND enabled = true
    ORDER BY priority ASC, created_at ASC
  `);

  const allRecipients = [...message.to, ...(message.cc || []), ...(message.bcc || [])];
  const totalSizeBytes = (message.attachments || []).reduce((sum, att) => sum + att.sizeBytes, 0);
  const totalSizeMb = totalSizeBytes / (1024 * 1024);

  // Проверяем правила по приоритету
  for (const rule of rules.rows) {
    const r = rule as any;
    
    // Проверка match_from
    if (r.match_from && !matchPattern(message.from, r.match_from)) {
      continue;
    }

    // Проверка match_to (любой получатель должен совпадать)
    if (r.match_to && !allRecipients.some(to => matchPattern(to, r.match_to))) {
      continue;
    }

    // Проверка match_subject
    if (r.match_subject && !matchPattern(message.subject, r.match_subject)) {
      continue;
    }

    // Проверка match_domain
    if (r.match_domain && !allRecipients.some(to => matchDomain(to, r.match_domain))) {
      continue;
    }

    // Проверка max_recipients
    if (r.max_recipients && allRecipients.length > r.max_recipients) {
      continue;
    }

    // Проверка min_size_mb
    if (r.min_size_mb && totalSizeMb < r.min_size_mb) {
      continue;
    }

    // Проверка max_size_mb
    if (r.max_size_mb && totalSizeMb > r.max_size_mb) {
      continue;
    }

    // Проверка has_attachments
    if (r.has_attachments !== null) {
      const hasAttachments = (message.attachments || []).length > 0;
      if (r.has_attachments !== hasAttachments) {
        continue;
      }
    }

    // Правило сработало
    return {
      matched: true,
      rule: {
        id: r.id,
        tenantId: r.tenant_id,
        enabled: r.enabled,
        name: r.name,
        priority: r.priority,
        matchFrom: r.match_from,
        matchTo: r.match_to,
        matchSubject: r.match_subject,
        matchDomain: r.match_domain,
        maxRecipients: r.max_recipients,
        minSizeMb: r.min_size_mb,
        maxSizeMb: r.max_size_mb,
        hasAttachments: r.has_attachments,
        action: r.action,
        reason: r.reason,
      },
      action: r.action,
      reason: r.reason,
    };
  }

  // Никакое правило не сработало - по умолчанию HOLD
  return {
    matched: false,
    action: 'AUTO_HOLD',
    reason: 'No matching rule - default hold',
  };
}

function matchPattern(text: string, pattern: string): boolean {
  // Простая реализация ILIKE с поддержкой % и _
  const regex = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // экранируем спецсимволы
    .replace(/%/g, '.*') // % -> .*
    .replace(/_/g, '.'); // _ -> .
  
  const regexObj = new RegExp(`^${regex}$`, 'i');
  return regexObj.test(text);
}

function matchDomain(email: string, domainPattern: string): boolean {
  const domain = email.split('@')[1];
  if (!domain) return false;
  
  // Поддержка wildcard доменов
  if (domainPattern.includes('*')) {
    const regex = domainPattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    return new RegExp(`^${regex}$`, 'i').test(domain);
  }
  
  return domain.toLowerCase() === domainPattern.toLowerCase();
}

export async function createEmailRule(
  tenantId: string,
  rule: Omit<EmailRule, 'id' | 'tenantId'>
): Promise<string> {
  const result = await db.execute(sql`
    INSERT INTO email_rules (
      tenant_id, enabled, name, priority,
      match_from, match_to, match_subject, match_domain,
      max_recipients, min_size_mb, max_size_mb, has_attachments,
      action, reason
    ) VALUES (
      ${tenantId}, ${rule.enabled}, ${rule.name}, ${rule.priority},
      ${rule.matchFrom || null}, ${rule.matchTo || null}, ${rule.matchSubject || null}, ${rule.matchDomain || null},
      ${rule.maxRecipients || null}, ${rule.minSizeMb || null}, ${rule.maxSizeMb || null}, ${rule.hasAttachments || null},
      ${rule.action}, ${rule.reason}
    ) RETURNING id
  `);

  return (result.rows[0] as any).id;
}

export async function getEmailRules(tenantId: string): Promise<EmailRule[]> {
  const result = await db.execute(sql`
    SELECT id, tenant_id, enabled, name, priority,
           match_from, match_to, match_subject, match_domain,
           max_recipients, min_size_mb, max_size_mb, has_attachments,
           action, reason, created_at, updated_at
    FROM email_rules
    WHERE tenant_id = ${tenantId}
    ORDER BY priority ASC, created_at ASC
  `);

  return result.rows.map(row => {
    const r = row as any;
    return {
      id: r.id,
      tenantId: r.tenant_id,
      enabled: r.enabled,
      name: r.name,
      priority: r.priority,
      matchFrom: r.match_from,
      matchTo: r.match_to,
      matchSubject: r.match_subject,
      matchDomain: r.match_domain,
      maxRecipients: r.max_recipients,
      minSizeMb: r.min_size_mb,
      maxSizeMb: r.max_size_mb,
      hasAttachments: r.has_attachments,
      action: r.action,
      reason: r.reason,
    };
  });
}

