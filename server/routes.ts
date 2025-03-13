import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertBlogPostSchema, insertSpeakerSchema, insertSponsorSchema, schoolFormSchema, participantFormSchema } from "@shared/schema";
import { z } from "zod";
import { adminDb } from "./firebase-admin"; // Added import for Firebase Admin SDK

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

  // Schools endpoints
  app.get("/api/schools/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const school = await storage.getSchool(id);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school" });
    }
  });

  app.put("/api/schools/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = schoolFormSchema.parse(req.body);
      const school = await storage.updateSchool(id, data);
      res.json(school);
    } catch (error) {
      res.status(400).json({ message: "Invalid school data" });
    }
  });

  // Participants endpoints
  app.get("/api/participants", async (req, res) => {
    try {
      const schoolId = req.query.schoolId;
      if (!schoolId) {
        return res.status(400).json({ message: "School ID is required" });
      }

      const participants = await storage.getParticipantsBySchool(schoolId as string);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  app.put("/api/participants/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = participantFormSchema.parse(req.body);
      const participant = await storage.updateParticipant(id, data);
      res.json(participant);
    } catch (error) {
      res.status(400).json({ message: "Invalid participant data" });
    }
  });

  // Firebase School Update Endpoint
  app.put("/api/schools/firebase/:id", async (req, res) => { // Route for Firebase school update
    try {
      const { id } = req.params;
      const schoolData = req.body;

      const schoolRef = adminDb.collection("schools").doc(id);
      await schoolRef.update(schoolData);

      res.status(200).json({ success: true, message: "School updated successfully (Firebase)" });
    } catch (error) {
      console.error("Error updating school:", error);
      res.status(500).json({ success: false, message: "Failed to update school (Firebase)" });
    }
  });

  app.put("/api/participants/firebase/:id", async (req, res) => { // New route for Firebase participant update
    try {
      const { id } = req.params;
      const participantData = req.body;

      const participantRef = adminDb.collection("participants").doc(id);
      await participantRef.update(participantData);

      res.status(200).json({ success: true, message: "Participant updated successfully (Firebase)" });
    } catch (error) {
      console.error("Error updating participant:", error);
      res.status(500).json({ success: false, message: "Failed to update participant (Firebase)" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}