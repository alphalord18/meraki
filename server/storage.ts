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

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample events
    const sampleEvents: InsertEvent[] = [
      {
        title: "Poetry Slam Competition",
        description: "Express your thoughts through verses in this competitive poetry event",
        date: new Date("2025-03-20"),
        category: "Competition",
        registrationOpen: true,
        maxParticipants: 3
      },
      {
        title: "Creative Writing Workshop",
        description: "Learn the art of storytelling from experienced authors",
        date: new Date("2025-03-21"),
        category: "Workshop",
        registrationOpen: true,
        maxParticipants: 2
      },
      {
        title: "Literary Debate",
        description: "Engage in intellectual discourse on contemporary literary topics",
        date: new Date("2025-03-22"),
        category: "Competition",
        registrationOpen: true,
        maxParticipants: 4
      }
    ];

    sampleEvents.forEach(event => this.createEvent(event));

    // Sample blog posts
    const samplePosts: InsertBlogPost[] = [
      {
        title: "The Evolution of Modern Literature",
        content: "Exploring how digital age has transformed storytelling...",
        authorId: 1,
        published: true
      },
      {
        title: "Why Poetry Matters in 2025",
        content: "The continuing relevance of poetic expression in our fast-paced world...",
        authorId: 1,
        published: true
      },
      {
        title: "Literary Festivals: A Global Perspective",
        content: "How literary events are shaping cultural exchange worldwide...",
        authorId: 1,
        published: true
      }
    ];

    samplePosts.forEach(post => this.createBlogPost(post));

    // Sample speakers
    const sampleSpeakers: InsertSpeaker[] = [
      {
        name: "Dr. Sarah Johnson",
        bio: "Award-winning poet and professor of Creative Writing at Literary University",
        imageUrl: "https://picsum.photos/200",
        eventId: 1
      },
      {
        name: "Michael Chen",
        bio: "Bestselling author and creative writing workshop facilitator",
        imageUrl: "https://picsum.photos/201",
        eventId: 2
      },
      {
        name: "Priya Patel",
        bio: "Literary critic and cultural commentator for The Literary Review",
        imageUrl: "https://picsum.photos/202",
        eventId: 3
      }
    ];

    sampleSpeakers.forEach(speaker => this.createSpeaker(speaker));

    // Sample sponsors
    const sampleSponsors: InsertSponsor[] = [
      {
        name: "Wordsmith Publishing House",
        tier: "Platinum",
        logoUrl: "https://picsum.photos/203",
        website: "https://example.com/wordsmith"
      },
      {
        name: "Literary Cafe Chain",
        tier: "Gold",
        logoUrl: "https://picsum.photos/204",
        website: "https://example.com/literary-cafe"
      },
      {
        name: "Global Books",
        tier: "Silver",
        logoUrl: "https://picsum.photos/205",
        website: "https://example.com/global-books"
      }
    ];

    sampleSponsors.forEach(sponsor => this.createSponsor(sponsor));
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