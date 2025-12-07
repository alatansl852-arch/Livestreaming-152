import { mysqlTable, varchar, int, boolean, timestamp, text } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";



export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isStreamer: boolean("is_streamer").notNull().default(true),
  reputation: int("reputation").notNull().default(0),
  totalSubscribers: int("total_subscribers").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

  

export const viewers = mysqlTable("viewers", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().unique(),
  viewerPreferences: text("viewer_preferences"),
  watchTimeMinutes: int("watch_time_minutes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const streamers = mysqlTable("streamers", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().unique(),
  streamerBio: text("streamer_bio"),
  totalStreams: int("total_streams").default(0),
  totalViews: int("total_views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});



export const streams = mysqlTable("streams", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  isLive: boolean("is_live").notNull().default(false),
  viewerCount: int("viewer_count").notNull().default(0),
  streamerName: varchar("streamer_name", { length: 255 }).notNull(),
  streamerAvatar: varchar("streamer_avatar", { length: 500 }),
  streamTitle: varchar("stream_title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }),
  likes: int("likes").notNull().default(0),
  dislikes: int("dislikes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  viewerId: int("viewer_id").notNull(),
  streamerId: int("streamer_id").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const comments = mysqlTable("comments", {
  id: int("id").primaryKey().autoincrement(),
  streamId: int("stream_id").notNull(),
  userId: int("user_id").notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const streamRatings = mysqlTable("stream_ratings", {
  id: int("id").primaryKey().autoincrement(),
  streamId: int("stream_id").notNull(),
  userId: int("user_id").notNull(),
  ratingType: varchar("rating_type", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isStreamer: true,
});

export const insertViewerSchema = createInsertSchema(viewers).omit({
  id: true,
  createdAt: true,
});

export const insertStreamerSchema = createInsertSchema(streamers).omit({
  id: true,
  createdAt: true,
});

export const insertStreamSchema = createInsertSchema(streams).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  subscribedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertStreamRatingSchema = createInsertSchema(streamRatings).omit({
  id: true,
  createdAt: true,
});



export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertViewer = z.infer<typeof insertViewerSchema>;
export type Viewer = typeof viewers.$inferSelect;

export type InsertStreamer = z.infer<typeof insertStreamerSchema>;
export type Streamer = typeof streamers.$inferSelect;

export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = typeof streams.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertStreamRating = z.infer<typeof insertStreamRatingSchema>;
export type StreamRating = typeof streamRatings.$inferSelect;