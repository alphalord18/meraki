import {
  type User, type Event, type BlogPost, type Speaker, type Sponsor,
  type InsertUser, type InsertEvent, type InsertBlogPost, type InsertSpeaker, type InsertSponsor
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Speaker operations
  getAllSpeakers(): Promise<Speaker[]>;
  getSpeaker(id: number): Promise<Speaker | undefined>;
  createSpeaker(speaker: InsertSpeaker): Promise<Speaker>;

  // Sponsor operations
  getAllSponsors(): Promise<Sponsor[]>;
  getSponsor(id: number): Promise<Sponsor | undefined>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private blogPosts: Map<number, BlogPost>;
  private speakers: Map<number, Speaker>;
  private sponsors: Map<number, Sponsor>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.blogPosts = new Map();
    this.speakers = new Map();
    this.sponsors = new Map();
    this.currentId = {
      users: 1,
      events: 1,
      blogPosts: 1,
      speakers: 1,
      sponsors: 1
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.currentId.events++;
    const event = { ...eventData, id };
    this.events.set(id, event);
    return event;
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId.blogPosts++;
    const post = { ...postData, id, createdAt: new Date() };
    this.blogPosts.set(id, post);
    return post;
  }

  // Speaker operations
  async getAllSpeakers(): Promise<Speaker[]> {
    return Array.from(this.speakers.values());
  }

  async getSpeaker(id: number): Promise<Speaker | undefined> {
    return this.speakers.get(id);
  }

  async createSpeaker(speakerData: InsertSpeaker): Promise<Speaker> {
    const id = this.currentId.speakers++;
    const speaker = { ...speakerData, id };
    this.speakers.set(id, speaker);
    return speaker;
  }

  // Sponsor operations
  async getAllSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values());
  }

  async getSponsor(id: number): Promise<Sponsor | undefined> {
    return this.sponsors.get(id);
  }

  async createSponsor(sponsorData: InsertSponsor): Promise<Sponsor> {
    const id = this.currentId.sponsors++;
    const sponsor = { ...sponsorData, id };
    this.sponsors.set(id, sponsor);
    return sponsor;
  }
}

export const storage = new MemStorage();
