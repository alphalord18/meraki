import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").default("user")
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull(),
  registrationOpen: boolean("registration_open").default(true)
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(), 
  userId: integer("user_id").references(() => users.id),
  eventId: integer("event_id").references(() => events.id),
  status: text("status").default("pending")
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const speakers = pgTable("speakers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
  eventId: integer("event_id").references(() => events.id)
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(),
  logoUrl: text("logo_url"),
  website: text("website")
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertSpeakerSchema = createInsertSchema(speakers).omit({ id: true });
export const insertSponsorSchema = createInsertSchema(sponsors).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Speaker = typeof speakers.$inferSelect;
export type Sponsor = typeof sponsors.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertSpeaker = z.infer<typeof insertSpeakerSchema>;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
