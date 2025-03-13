import {
  type User, type Event, type BlogPost, type Speaker, type Sponsor,
  type InsertUser, type InsertEvent, type InsertBlogPost, type InsertSpeaker, type InsertSponsor,
  type Participant, type InsertParticipant
} from "@shared/schema";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";

// Firebase Configuration 
const firebaseConfig = {
  projectId: "merakifest-d9822",
  // ... your firebase config ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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
  
  // School operations
  getSchool(id: string): Promise<School | undefined>;
  updateSchool(id: string, data: Partial<School>): Promise<School>;

  // Participant operations
  getParticipantsBySchool(schoolId: string): Promise<Participant[]>;
  updateParticipant(id: string, data: Partial<Participant>): Promise<Participant>;
  createParticipant(participant: InsertParticipant):Promise<Participant>;

}

export class FirebaseStorage implements IStorage {
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


  // User operations (These will need Firebase integration)
  async getUser(id: number): Promise<User | undefined> {
      // Implement Firebase retrieval
      return undefined;
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    // Implement Firebase retrieval
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Implement Firebase creation
    return { ...userData, id: 1} as User;
  }

  // Event operations (These will need Firebase integration)
    async getAllEvents(): Promise<Event[]> {
      // Implement Firebase retrieval
      return [];
    }

    async getEvent(id: number): Promise<Event | undefined> {
      // Implement Firebase retrieval
      return undefined;
    }

    async createEvent(eventData: InsertEvent): Promise<Event> {
      // Implement Firebase creation
      return { ...eventData, id: 1 } as Event;
    }

  // Blog operations (These will need Firebase integration)
    async getAllBlogPosts(): Promise<BlogPost[]> {
      // Implement Firebase retrieval
      return [];
    }

    async getBlogPost(id: number): Promise<BlogPost | undefined> {
      // Implement Firebase retrieval
      return undefined;
    }

    async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
      // Implement Firebase creation
      return { ...postData, id: 1, createdAt: new Date() } as BlogPost;
    }

  // Speaker operations (These will need Firebase integration)
    async getAllSpeakers(): Promise<Speaker[]> {
      // Implement Firebase retrieval
      return [];
    }

    async getSpeaker(id: number): Promise<Speaker | undefined> {
      // Implement Firebase retrieval
      return undefined;
    }

    async createSpeaker(speakerData: InsertSpeaker): Promise<Speaker> {
      // Implement Firebase creation
      return { ...speakerData, id: 1 } as Speaker;
    }

  // Sponsor operations (These will need Firebase integration)
    async getAllSponsors(): Promise<Sponsor[]> {
      // Implement Firebase retrieval
      return [];
    }

    async getSponsor(id: number): Promise<Sponsor | undefined> {
      // Implement Firebase retrieval
      return undefined;
    }

    async createSponsor(sponsorData: InsertSponsor): Promise<Sponsor> {
      // Implement Firebase creation
      return { ...sponsorData, id: 1 } as Sponsor;
    }

  async getParticipantsBySchool(schoolId: string): Promise<Participant[]> {
    const q = query(collection(db, "participants"), where("schoolId", "==", schoolId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
  }

  async updateParticipant(id: string, data: Partial<Participant>): Promise<Participant> {
    await updateDoc(doc(db, "participants", id), data);
    const docSnap = await doc(db, "participants", id).get();
    return { id: docSnap.id, ...docSnap.data() } as Participant;
  }

  async createParticipant(participantData:InsertParticipant): Promise<Participant>{
    const docRef = await addDoc(collection(db, "participants"), participantData);
    return {id: docRef.id, ...participantData} as Participant;
  }
  
  async getSchool(id: string): Promise<School | undefined> {
    try {
      const schoolRef = doc(db, "schools", id);
      const schoolSnap = await getDoc(schoolRef);
      
      if (schoolSnap.exists()) {
        return { id: schoolSnap.id, ...schoolSnap.data() } as School;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching school:", error);
      return undefined;
    }
  }
  
  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    const schoolRef = doc(db, "schools", id);
    await updateDoc(schoolRef, data);
    
    const updatedDoc = await getDoc(schoolRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as School;
  }
}

export const storage = new FirebaseStorage();