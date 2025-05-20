import {
  clients, type Client, type InsertClient,
  projects, type Project, type InsertProject,
  payments, type Payment, type InsertPayment,
  activities, type Activity, type InsertActivity,
  users, type User, type UpsertUser,
  ServiceTypes
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Client operations
  getClients(userId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient, userId: string): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByClient(clientId: number): Promise<Project[]>;
  createProject(project: InsertProject, userId: string): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Payment operations
  getPayments(userId: string): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByClient(clientId: number): Promise<Payment[]>;
  getPaymentsByProject(projectId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment, userId: string): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;

  // Activity operations
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity, userId: string): Promise<Activity>;

  // Dashboard operations
  getDashboardStats(userId: string): Promise<DashboardStats>;
}

export interface DashboardStats {
  activeClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Client operations
  async getClients(userId: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id));
    return client;
  }

  async createClient(clientData: InsertClient, userId: string): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values({
        ...clientData,
        userId
      })
      .returning();
    
    // Create activity for client creation
    await this.createActivity({
      type: 'client_added',
      description: `New client added: ${client.name}`,
      entityId: client.id,
      entityType: 'client'
    }, userId);
    
    return client;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id));
    
    if (!client) return undefined;
    
    const [updatedClient] = await db
      .update(clients)
      .set(clientData)
      .where(eq(clients.id, id))
      .returning();
    
    await this.createActivity({
      type: 'client_updated',
      description: `Client updated: ${updatedClient.name}`,
      entityId: id,
      entityType: 'client'
    }, client.userId);
    
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id));
    
    if (!client) return false;
    
    // Delete associated projects and payments
    const clientProjects = await this.getProjectsByClient(id);
    for (const project of clientProjects) {
      await this.deleteProject(project.id);
    }
    
    const clientPayments = await this.getPaymentsByClient(id);
    for (const payment of clientPayments) {
      await this.deletePayment(payment.id);
    }
    
    const deleted = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();
    
    if (deleted.length > 0) {
      await this.createActivity({
        type: 'client_deleted',
        description: `Client deleted: ${client.name}`,
        entityId: id,
        entityType: 'client'
      }, client.userId);
      return true;
    }
    
    return false;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async getProjectsByClient(clientId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt));
  }

  async createProject(projectData: InsertProject, userId: string): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({
        ...projectData,
        userId
      })
      .returning();
    
    await this.createActivity({
      type: 'project_created',
      description: `New project created: ${project.name}`,
      entityId: project.id,
      entityType: 'project'
    }, userId);
    
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    
    if (!project) return undefined;
    
    const [updatedProject] = await db
      .update(projects)
      .set(projectData)
      .where(eq(projects.id, id))
      .returning();
    
    await this.createActivity({
      type: 'project_updated',
      description: `Project updated: ${updatedProject.name}`,
      entityId: id,
      entityType: 'project'
    }, project.userId);
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    
    if (!project) return false;
    
    // Delete associated payments
    const projectPayments = await this.getPaymentsByProject(id);
    for (const payment of projectPayments) {
      await this.deletePayment(payment.id);
    }
    
    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    
    if (deleted.length > 0) {
      await this.createActivity({
        type: 'project_deleted',
        description: `Project deleted: ${project.name}`,
        entityId: id,
        entityType: 'project'
      }, project.userId);
      return true;
    }
    
    return false;
  }

  // Payment operations
  async getPayments(userId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByClient(clientId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.clientId, clientId))
      .orderBy(desc(payments.createdAt));
  }

  async getPaymentsByProject(projectId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.projectId, projectId))
      .orderBy(desc(payments.createdAt));
  }

  async createPayment(paymentData: InsertPayment, userId: string): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values({
        ...paymentData,
        userId
      })
      .returning();
    
    await this.createActivity({
      type: 'payment_created',
      description: `New payment created: $${payment.amount}`,
      entityId: payment.id,
      entityType: 'payment'
    }, userId);
    
    return payment;
  }

  async updatePayment(id: number, paymentData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    
    if (!payment) return undefined;
    
    // If payment status changed to paid, set paidDate if not already set
    let updatedData = { ...paymentData };
    if (paymentData.status === 'paid' && !payment.paidDate) {
      updatedData.paidDate = new Date();
    }
    
    const [updatedPayment] = await db
      .update(payments)
      .set(updatedData)
      .where(eq(payments.id, id))
      .returning();
    
    await this.createActivity({
      type: 'payment_updated',
      description: updatedPayment.status === 'paid' 
        ? `Payment marked as paid: $${updatedPayment.amount}`
        : `Payment updated: $${updatedPayment.amount}`,
      entityId: id,
      entityType: 'payment'
    }, payment.userId);
    
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<boolean> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    
    if (!payment) return false;
    
    const deleted = await db
      .delete(payments)
      .where(eq(payments.id, id))
      .returning();
    
    if (deleted.length > 0) {
      await this.createActivity({
        type: 'payment_deleted',
        description: `Payment deleted: $${payment.amount}`,
        entityId: id,
        entityType: 'payment'
      }, payment.userId);
      return true;
    }
    
    return false;
  }

  // Activity operations
  async getActivities(userId: string, limit?: number): Promise<Activity[]> {
    const query = db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }

  async createActivity(activityData: InsertActivity, userId: string): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({
        ...activityData,
        userId
      })
      .returning();
    
    return activity;
  }

  // Dashboard statistics
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Get active clients count
    const activeClients = (await db
      .select()
      .from(clients)
      .where(and(
        eq(clients.userId, userId),
        eq(clients.status, 'active')
      ))).length;
    
    // Get active projects count
    const activeProjects = (await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.userId, userId),
        eq(projects.status, 'in_progress')
      ))).length;
    
    // Calculate monthly revenue (paid payments in the current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const paidPayments = await db
      .select()
      .from(payments)
      .where(and(
        eq(payments.userId, userId),
        eq(payments.status, 'paid'),
        gte(payments.paidDate, firstDayOfMonth)
      ));
    
    const monthlyRevenue = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate pending invoices (sum of pending payments)
    const pendingPayments = await db
      .select()
      .from(payments)
      .where(and(
        eq(payments.userId, userId),
        eq(payments.status, 'pending')
      ));
    
    const pendingInvoices = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      activeClients,
      activeProjects,
      monthlyRevenue,
      pendingInvoices
    };
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();