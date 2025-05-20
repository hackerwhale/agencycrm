import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertProjectSchema, 
  insertPaymentSchema,
  insertActivitySchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for clients
  app.get("/api/clients", async (_req: Request, res: Response) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients", error: (error as Error).message });
    }
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }

      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client", error: (error as Error).message });
    }
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    try {
      const validation = insertClientSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid client data", 
          errors: validation.error.format() 
        });
      }

      const newClient = await storage.createClient(validation.data);
      res.status(201).json(newClient);
    } catch (error) {
      res.status(500).json({ message: "Failed to create client", error: (error as Error).message });
    }
  });

  app.patch("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }

      // Create a partial schema for validation
      const partialClientSchema = insertClientSchema.partial();
      const validation = partialClientSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid client data", 
          errors: validation.error.format() 
        });
      }

      const updatedClient = await storage.updateClient(id, validation.data);
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client", error: (error as Error).message });
    }
  });

  app.delete("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }

      const success = await storage.deleteClient(id);
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client", error: (error as Error).message });
    }
  });

  // API routes for projects
  app.get("/api/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects", error: (error as Error).message });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project", error: (error as Error).message });
    }
  });

  app.get("/api/clients/:clientId/projects", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }

      const projects = await storage.getProjectsByClient(clientId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client projects", error: (error as Error).message });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const validation = insertProjectSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid project data", 
          errors: validation.error.format() 
        });
      }

      // Verify client exists
      const client = await storage.getClient(validation.data.clientId);
      if (!client) {
        return res.status(400).json({ message: "Client not found" });
      }

      const newProject = await storage.createProject(validation.data);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to create project", error: (error as Error).message });
    }
  });

  app.patch("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const partialProjectSchema = insertProjectSchema.partial();
      const validation = partialProjectSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid project data", 
          errors: validation.error.format() 
        });
      }

      // If clientId is provided, verify client exists
      if (validation.data.clientId) {
        const client = await storage.getClient(validation.data.clientId);
        if (!client) {
          return res.status(400).json({ message: "Client not found" });
        }
      }

      const updatedProject = await storage.updateProject(id, validation.data);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project", error: (error as Error).message });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project", error: (error as Error).message });
    }
  });

  // API routes for payments
  app.get("/api/payments", async (_req: Request, res: Response) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments", error: (error as Error).message });
    }
  });

  app.get("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment ID" });
      }

      const payment = await storage.getPayment(id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment", error: (error as Error).message });
    }
  });

  app.get("/api/clients/:clientId/payments", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }

      const payments = await storage.getPaymentsByClient(clientId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client payments", error: (error as Error).message });
    }
  });

  app.get("/api/projects/:projectId/payments", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const payments = await storage.getPaymentsByProject(projectId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project payments", error: (error as Error).message });
    }
  });

  app.post("/api/payments", async (req: Request, res: Response) => {
    try {
      const validation = insertPaymentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid payment data", 
          errors: validation.error.format() 
        });
      }

      // Verify client exists
      const client = await storage.getClient(validation.data.clientId);
      if (!client) {
        return res.status(400).json({ message: "Client not found" });
      }

      // If projectId is provided, verify project exists
      if (validation.data.projectId) {
        const project = await storage.getProject(validation.data.projectId);
        if (!project) {
          return res.status(400).json({ message: "Project not found" });
        }
      }

      const newPayment = await storage.createPayment(validation.data);
      res.status(201).json(newPayment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment", error: (error as Error).message });
    }
  });

  app.patch("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment ID" });
      }

      const partialPaymentSchema = insertPaymentSchema.partial();
      const validation = partialPaymentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid payment data", 
          errors: validation.error.format() 
        });
      }

      // If clientId is provided, verify client exists
      if (validation.data.clientId) {
        const client = await storage.getClient(validation.data.clientId);
        if (!client) {
          return res.status(400).json({ message: "Client not found" });
        }
      }

      // If projectId is provided, verify project exists
      if (validation.data.projectId) {
        const project = await storage.getProject(validation.data.projectId);
        if (!project) {
          return res.status(400).json({ message: "Project not found" });
        }
      }

      const updatedPayment = await storage.updatePayment(id, validation.data);
      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.json(updatedPayment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment", error: (error as Error).message });
    }
  });

  app.delete("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment ID" });
      }

      const success = await storage.deletePayment(id);
      if (!success) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment", error: (error as Error).message });
    }
  });

  // API routes for activities
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities", error: (error as Error).message });
    }
  });

  // API route for dashboard statistics
  app.get("/api/dashboard/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
