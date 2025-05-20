import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

// Client Schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company").notNull(),
  website: text("website"),
  address: text("address"),
  notes: text("notes"),
  status: text("status").default("active").notNull(), // active, inactive, pending
  service: text("service").default("web_design").notNull(), // web_design, seo, social_media, custom
  customService: text("custom_service"), // only used when service is custom
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: varchar("user_id").notNull(), // The user who owns this client
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  userId: true, // This will be set by the server
});

// Project Schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  clientId: integer("client_id").notNull(),
  status: text("status").default("in_progress").notNull(), // in_progress, completed, review, on_hold, cancelled
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  budget: doublePrecision("budget"),
  progress: integer("progress").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: varchar("user_id").notNull(), // The user who owns this project
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  userId: true, // This will be set by the server
});

// Payment Schema
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  projectId: integer("project_id"),
  amount: doublePrecision("amount").notNull(),
  status: text("status").default("pending").notNull(), // pending, paid, overdue, cancelled
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  invoiceNumber: text("invoice_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: varchar("user_id").notNull(), // The user who owns this payment
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  userId: true, // This will be set by the server
});

// Activity Schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // client_added, project_created, payment_received, etc.
  description: text("description").notNull(),
  entityId: integer("entity_id"), // can be client_id, project_id, or payment_id
  entityType: text("entity_type"), // client, project, payment
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: varchar("user_id").notNull(), // The user who owns this activity
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  userId: true, // This will be set by the server
});

// Type exports
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Service types for the service dropdown in client form
export const ServiceTypes = {
  WEB_DESIGN: 'web_design',
  SEO: 'seo',
  SOCIAL_MEDIA: 'social_media',
  CUSTOM: 'custom'
} as const;

export type ServiceType = typeof ServiceTypes[keyof typeof ServiceTypes];
