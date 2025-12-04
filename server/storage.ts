import { db } from "./db";
import { users, streams, type InsertUser, type InsertStream, type User, type Stream } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stream operations
  getAllStreams(): Promise<Stream[]>;
  getLiveStreams(): Promise<Stream[]>;
  getStreamById(id: number): Promise<Stream | undefined>;
  getStreamsByCategory(category: string): Promise<Stream[]>;
  getStreamsByUserId(userId: number): Promise<Stream[]>;
  insertStream(stream: InsertStream): Promise<Stream>;
  updateStream(id: number, stream: Partial<InsertStream>): Promise<Stream | undefined>;
  deleteStream(id: number): Promise<void>;
}

class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(insertUser);
    return await this.getUser(newUser.insertId) as User;
  }

  // Stream operations
  async getAllStreams(): Promise<Stream[]> {
    return await db.select().from(streams).orderBy(desc(streams.createdAt));
  }

  async getLiveStreams(): Promise<Stream[]> {
    return await db.select().from(streams).where(eq(streams.isLive, true)).orderBy(desc(streams.viewerCount));
  }

  async getStreamById(id: number): Promise<Stream | undefined> {
    const [stream] = await db.select().from(streams).where(eq(streams.id, id));
    return stream;
  }

  async getStreamsByCategory(category: string): Promise<Stream[]> {
    return await db.select().from(streams).where(eq(streams.category, category)).orderBy(desc(streams.viewerCount));
  }

  async getStreamsByUserId(userId: number): Promise<Stream[]> {
    return await db.select().from(streams).where(eq(streams.userId, userId)).orderBy(desc(streams.createdAt));
  }

  async insertStream(stream: InsertStream): Promise<Stream> {
    const [newStream] = await db.insert(streams).values(stream);
    return await this.getStreamById(newStream.insertId) as Stream;
  }

  async updateStream(id: number, stream: Partial<InsertStream>): Promise<Stream | undefined> {
    await db.update(streams).set(stream).where(eq(streams.id, id));
    return await this.getStreamById(id);
  }

  async deleteStream(id: number): Promise<void> {
    await db.delete(streams).where(eq(streams.id, id));
  }
}

export const storage = new DatabaseStorage();