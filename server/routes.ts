import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertBlogPostSchema, insertSpeakerSchema, insertSponsorSchema } from "@shared/schema";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Events endpoints
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Blog posts endpoints
  app.get("/api/blog-posts", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  // Speakers endpoints
  app.get("/api/speakers", async (_req, res) => {
    try {
      const speakers = await storage.getAllSpeakers();
      res.json(speakers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch speakers" });
    }
  });

  app.post("/api/speakers", async (req, res) => {
    try {
      const data = insertSpeakerSchema.parse(req.body);
      const speaker = await storage.createSpeaker(data);
      res.json(speaker);
    } catch (error) {
      res.status(400).json({ message: "Invalid speaker data" });
    }
  });

  // Sponsors endpoints
  app.get("/api/sponsors", async (_req, res) => {
    try {
      const sponsors = await storage.getAllSponsors();
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsors" });
    }
  });

  app.post("/api/sponsors", async (req, res) => {
    try {
      const data = insertSponsorSchema.parse(req.body);
      const sponsor = await storage.createSponsor(data);
      res.json(sponsor);
    } catch (error) {
      res.status(400).json({ message: "Invalid sponsor data" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactSchema.parse(req.body);
      // In a real app, you would send an email or store the contact form submission
      res.json({ message: "Contact form submitted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
