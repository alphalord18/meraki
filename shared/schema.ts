import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
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
  registrationOpen: boolean("registration_open").default(true),
  maxParticipants: integer("max_participants").notNull()
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

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  phone: text("phone").notNull()
});

export const coordinators = pgTable("coordinators", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password").notNull() 
});

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  eventId: integer("event_id").references(() => events.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  grade: text("grade").notNull(),
  details: jsonb("details").notNull() 
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertSpeakerSchema = createInsertSchema(speakers).omit({ id: true });
export const insertSponsorSchema = createInsertSchema(sponsors).omit({ id: true });
export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true });
export const insertCoordinatorSchema = createInsertSchema(coordinators).omit({ id: true });
export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Speaker = typeof speakers.$inferSelect;
export type Sponsor = typeof sponsors.$inferSelect;
export type School = typeof schools.$inferSelect;
export type Coordinator = typeof coordinators.$inferSelect;
export type Participant = typeof participants.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertSpeaker = z.infer<typeof insertSpeakerSchema>;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertCoordinator = z.infer<typeof insertCoordinatorSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;

export const schoolFormSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters"),
  address: z.string().min(10, "Please enter complete address"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  pincode: z.string().length(6, "Enter valid 6-digit pincode"),
  phone: z.string().min(10, "Enter valid phone number")
});

export const coordinatorFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter valid email address"),
  phone: z.string().min(10, "Enter valid phone number")
});

export const participantFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter valid email address"),
  grade: z.string().min(1, "Grade is required"),
  details: z.record(z.string()) 
});