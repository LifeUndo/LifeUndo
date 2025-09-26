import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Plans table
export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('RUB'),
  duration: integer('duration').notNull(), // days
  maxDevices: integer('max_devices').default(1),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 100 }).notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  planId: integer('plan_id').references(() => plans.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('RUB'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, paid, failed, cancelled
  email: varchar('email', { length: 255 }).notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 100 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('RUB'),
  provider: varchar('provider', { length: 20 }).default('freekassa'),
  providerId: varchar('provider_id', { length: 255 }),
  status: varchar('status', { length: 20 }).default('pending'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Licenses table
export const licenses = pgTable('licenses', {
  id: serial('id').primaryKey(),
  licenseKey: varchar('license_key', { length: 255 }).notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  planId: integer('plan_id').references(() => plans.id),
  orderId: varchar('order_id', { length: 100 }),
  maxDevices: integer('max_devices').default(1),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Activations table
export const activations = pgTable('activations', {
  id: serial('id').primaryKey(),
  licenseId: integer('license_id').references(() => licenses.id),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  deviceName: varchar('device_name', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  activatedAt: timestamp('activated_at').defaultNow(),
  lastSeen: timestamp('last_seen').defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  planId: integer('plan_id').references(() => plans.id),
  licenseId: integer('license_id').references(() => licenses.id),
  status: varchar('status', { length: 20 }).default('active'), // active, paused, cancelled
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  nextBillingDate: timestamp('next_billing_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Webhooks table
export const webhooks = pgTable('webhooks', {
  id: serial('id').primaryKey(),
  provider: varchar('provider', { length: 20 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  payload: json('payload').notNull(),
  signature: varchar('signature', { length: 255 }),
  status: varchar('status', { length: 20 }).default('received'), // received, processed, failed
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Export schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export const insertLicenseSchema = createInsertSchema(licenses);
export const selectLicenseSchema = createSelectSchema(licenses);

