import { pgTable, serial, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(), // free, pro_m, pro_y, vip, team
  title: varchar("title", { length: 120 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  amount: integer("amount").notNull(), // in minor units
  period: varchar("period", { length: 16 }).notNull() // month, year, lifetime, seat
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  planCode: varchar("plan_code", { length: 40 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("pending"), // pending, paid, failed, expired
  provider: varchar("provider", { length: 24 }).notNull().default("fk"),
  providerOrderId: varchar("provider_order_id", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: "set null" })
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  provider: varchar("provider", { length: 24 }).notNull(),
  providerTxnId: varchar("provider_txn_id", { length: 64 }),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  status: varchar("status", { length: 24 }).notNull(), // success, failed
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: "set null" })
});

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 96 }).notNull().unique(),
  planCode: varchar("plan_code", { length: 40 }).notNull(),
  issuedTo: varchar("issued_to", { length: 255 }).notNull(),
  devicesLimit: integer("devices_limit").notNull().default(3),
  expiresAt: timestamp("expires_at", { withTimezone: true }), // null for lifetime
  meta: jsonb("meta").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  revoked: boolean("revoked").notNull().default(false),
  tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: "set null" })
});

export const activations = pgTable("activations", {
  id: serial("id").primaryKey(),
  licenseId: integer("license_id").notNull(),
  deviceId: varchar("device_id", { length: 64 }).notNull(),
  deviceName: varchar("device_name", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  revoked: boolean("revoked").notNull().default(false)
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  planCode: varchar("plan_code", { length: 40 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("active"), // active, paused, canceled
  nextInvoiceAt: timestamp("next_invoice_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 24 }).notNull(),
  event: varchar("event", { length: 64 }).notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: "set null" })
});

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  theme: jsonb("theme").$type<Record<string, unknown>>().default({}),
  faviconUrl: varchar("favicon_url", { length: 255 }),
  primaryColor: varchar("primary_color", { length: 7 }).default("#0066CC"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const tenantDomains = pgTable("tenant_domains", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const apiUsage = pgTable("api_usage", {
  id: serial("id").primaryKey(),
  ym: varchar("ym", { length: 7 }).notNull(), // YYYY-MM
  apiKeyId: integer("api_key_id").notNull().references(() => apiKeys.id),
  calls: integer("calls").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const tenantPlans = pgTable("tenant_plans", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  planCode: varchar("plan_code", { length: 40 }).notNull(),
  title: varchar("title", { length: 120 }),
  currency: varchar("currency", { length: 8 }),
  amount: integer("amount"),
  period: varchar("period", { length: 16 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const statusBanners = pgTable("status_banners", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  active: boolean("active").notNull().default(false),
  title: varchar("title", { length: 160 }),
  message: text("message"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 64 }).notNull(),
  subject: varchar("subject", { length: 160 }).notNull(),
  bodyMd: text("body_md").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  hash: varchar("hash", { length: 128 }).notNull().unique(),
  planCode: varchar("plan_code", { length: 40 }).notNull().default('dev'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  revoked: boolean("revoked").notNull().default(false),
  tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: "set null" })
});
