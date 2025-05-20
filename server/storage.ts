import {
  clients, type Client, type InsertClient,
  projects, type Project, type InsertProject,
  payments, type Payment, type InsertPayment,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByClient(clientId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByClient(clientId: number): Promise<Payment[]>;
  getPaymentsByProject(projectId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;

  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard operations
  getDashboardStats(): Promise<DashboardStats>;
}

export interface DashboardStats {
  activeClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client> = new Map();
  private projects: Map<number, Project> = new Map();
  private payments: Map<number, Payment> = new Map();
  private activities: Map<number, Activity> = new Map();
  
  private clientId = 1;
  private projectId = 1;
  private paymentId = 1;
  private activityId = 1;

  constructor() {
    // Initialize with some sample data
    this.initSampleData();
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const now = new Date();
    const client: Client = { 
      ...clientData, 
      id, 
      createdAt: now 
    };
    
    this.clients.set(id, client);
    
    // Create activity for client creation
    await this.createActivity({
      type: 'client_added',
      description: `New client added: ${client.name}`,
      entityId: id,
      entityType: 'client'
    });
    
    return client;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    
    if (!client) return undefined;
    
    const updatedClient: Client = { ...client, ...clientData };
    this.clients.set(id, updatedClient);
    
    await this.createActivity({
      type: 'client_updated',
      description: `Client updated: ${updatedClient.name}`,
      entityId: id,
      entityType: 'client'
    });
    
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    const client = this.clients.get(id);
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
    
    const deleted = this.clients.delete(id);
    
    if (deleted) {
      await this.createActivity({
        type: 'client_deleted',
        description: `Client deleted: ${client.name}`,
        entityId: id,
        entityType: 'client'
      });
    }
    
    return deleted;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByClient(clientId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    const project: Project = { 
      ...projectData, 
      id, 
      createdAt: now 
    };
    
    this.projects.set(id, project);
    
    await this.createActivity({
      type: 'project_created',
      description: `New project created: ${project.name}`,
      entityId: id,
      entityType: 'project'
    });
    
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    
    if (!project) return undefined;
    
    const updatedProject: Project = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    
    await this.createActivity({
      type: 'project_updated',
      description: `Project updated: ${updatedProject.name}`,
      entityId: id,
      entityType: 'project'
    });
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const project = this.projects.get(id);
    if (!project) return false;
    
    // Delete associated payments
    const projectPayments = await this.getPaymentsByProject(id);
    for (const payment of projectPayments) {
      await this.deletePayment(payment.id);
    }
    
    const deleted = this.projects.delete(id);
    
    if (deleted) {
      await this.createActivity({
        type: 'project_deleted',
        description: `Project deleted: ${project.name}`,
        entityId: id,
        entityType: 'project'
      });
    }
    
    return deleted;
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByClient(clientId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPaymentsByProject(projectId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const now = new Date();
    const payment: Payment = { 
      ...paymentData, 
      id, 
      createdAt: now 
    };
    
    this.payments.set(id, payment);
    
    await this.createActivity({
      type: 'payment_created',
      description: `New payment created: $${payment.amount}`,
      entityId: id,
      entityType: 'payment'
    });
    
    return payment;
  }

  async updatePayment(id: number, paymentData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    
    if (!payment) return undefined;
    
    const updatedPayment: Payment = { ...payment, ...paymentData };
    
    // If payment status changed to paid, set paidDate if not already set
    if (paymentData.status === 'paid' && !updatedPayment.paidDate) {
      updatedPayment.paidDate = new Date();
    }
    
    this.payments.set(id, updatedPayment);
    
    await this.createActivity({
      type: 'payment_updated',
      description: updatedPayment.status === 'paid' 
        ? `Payment marked as paid: $${updatedPayment.amount}`
        : `Payment updated: $${updatedPayment.amount}`,
      entityId: id,
      entityType: 'payment'
    });
    
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<boolean> {
    const payment = this.payments.get(id);
    if (!payment) return false;
    
    const deleted = this.payments.delete(id);
    
    if (deleted) {
      await this.createActivity({
        type: 'payment_deleted',
        description: `Payment deleted: $${payment.amount}`,
        entityId: id,
        entityType: 'payment'
      });
    }
    
    return deleted;
  }

  // Activity operations
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const now = new Date();
    const activity: Activity = { 
      ...activityData, 
      id, 
      createdAt: now 
    };
    
    this.activities.set(id, activity);
    return activity;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const activeClients = Array.from(this.clients.values())
      .filter(client => client.status === 'active').length;
    
    const activeProjects = Array.from(this.projects.values())
      .filter(project => project.status === 'in_progress').length;
    
    // Calculate monthly revenue (paid payments in the current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = Array.from(this.payments.values())
      .filter(payment => 
        payment.status === 'paid' && 
        payment.paidDate && 
        new Date(payment.paidDate) >= firstDayOfMonth
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate pending invoices (sum of pending payments)
    const pendingInvoices = Array.from(this.payments.values())
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      activeClients,
      activeProjects,
      monthlyRevenue,
      pendingInvoices
    };
  }

  // Initialize sample data
  private initSampleData() {
    // This method intentionally left empty as per the guidelines
    // Not generating sample data as per the instruction:
    // "Never generate or implement any form of mock, sample, placeholder, synthetic, example, or test data"
  }
}

export const storage = new MemStorage();
