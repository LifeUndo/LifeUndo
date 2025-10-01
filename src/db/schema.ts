import { pgTable, serial, varchar, decimal, timestamp, text, jsonb, integer } from 'drizzle-orm/pg-core';

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  order_id: varchar('order_id', { length: 255 }).notNull().unique(),
  plan: varchar('plan', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('RUB'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paid_at: timestamp('paid_at'),
  raw: jsonb('raw'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Licenses table
export const licenses = pgTable('licenses', {
  id: serial('id').primaryKey(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  plan: varchar('plan', { length: 50 }),
  expires_at: timestamp('expires_at'),
  seats: integer('seats'),
  activated_at: timestamp('activated_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Feature flags table
export const feature_flags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: jsonb('value'),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Support tickets table
export const support_tickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  order_id: varchar('order_id', { length: 255 }),
  plan: varchar('plan', { length: 50 }),
  topic: varchar('topic', { length: 100 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('open'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});
