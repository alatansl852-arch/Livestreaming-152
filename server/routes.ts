// server/routes.ts - COMPLETE VERSION with Debug Logging for Login
import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { streams, users, subscriptions, comments } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// Reputation calculation weights
const REPUTATION_WEIGHTS = {
  LIKE: 5,            // Each like = 5 points
  DISLIKE: 0,         // Each dislike = 0 points (no penalty)
  SUBSCRIBER: 5,      // Each subscriber = 5 points
  VIEW: 5,            // Each view = 5 points
  STREAM_BONUS: 100,  // Bonus for having a live stream
};

// Calculate reputation for a streamer
async function calculateReputation(streamerId: number): Promise<number> {
  try {
    // Get all streams by this streamer
    const streamerStreams = await db
      .select()
      .from(streams)
      .where(eq(streams.userId, streamerId));

    // Get user data
    const [streamer] = await db
      .select()
      .from(users)
      .where(eq(users.id, streamerId));

    if (!streamer) return 0;

    let reputation = 0;

    // Calculate from streams
    for (const stream of streamerStreams) {
      reputation += stream.likes * REPUTATION_WEIGHTS.LIKE;
      reputation += stream.dislikes * REPUTATION_WEIGHTS.DISLIKE;
      reputation += stream.viewerCount * REPUTATION_WEIGHTS.VIEW;
      
      if (stream.isLive) {
        reputation += REPUTATION_WEIGHTS.STREAM_BONUS;
      }
    }

    // Add subscriber bonus
    reputation += streamer.totalSubscribers * REPUTATION_WEIGHTS.SUBSCRIBER;

    // Ensure reputation is not negative
    return Math.max(0, Math.round(reputation));
  } catch (error) {
    console.error("Error calculating reputation:", error);
    return 0;
  }
}

// Update streamer reputation
async function updateStreamerReputation(streamerId: number): Promise<void> {
  const newReputation = await calculateReputation(streamerId);
  await db
    .update(users)
    .set({ reputation: newReputation })
    .where(eq(users.id, streamerId));
}

// Detect biased ratings (simplified version)
// A viewer is considered biased if they rate too many streams negatively
async function checkViewerBias(userId: number): Promise<boolean> {
  // This is a placeholder - you can enhance this with more sophisticated logic
  // For example: check if user's dislike ratio is > 80%
  return false; // For now, we don't filter biased users
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, isStreamer } = req.body;
      
      console.log("🔵 Registration attempt:", { username, isStreamer });
      
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
        
      if (existingUser) {
        console.log("❌ Username already exists:", username);
        return res.status(400).json({ message: "Username already exists" });
      }

      const [result] = await db.insert(users).values({
        username,
        password,
        isStreamer: isStreamer || false,
      });

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, result.insertId));

      console.log("✅ User registered successfully:", user.username);
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("❌ Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      console.log("🔵 Login attempt:");
      console.log("  - Username received:", `"${username}"`);
      console.log("  - Password received:", `"${password}"`);
      console.log("  - Username length:", username?.length);
      console.log("  - Password length:", password?.length);
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      
      console.log("  - User found in database:", user ? "YES" : "NO");
      
      if (user) {
        console.log("  - Database username:", `"${user.username}"`);
        console.log("  - Database password:", `"${user.password}"`);
        console.log("  - Username match:", user.username === username);
        console.log("  - Password match:", user.password === password);
        console.log("  - Username trimmed match:", user.username.trim() === username.trim());
        console.log("  - Password trimmed match:", user.password.trim() === password.trim());
      }
      
      if (!user) {
        console.log("❌ Login failed: User not found");
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      if (user.password !== password) {
        console.log("❌ Login failed: Password mismatch");
        return res.status(401).json({ message: "Invalid username or password" });
      }

      console.log("✅ Login successful for user:", user.username);
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("❌ Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Get all streams
  app.get("/api/streams", async (_req, res) => {
    try {
      const result = await db
        .select()
        .from(streams)
        .orderBy(desc(streams.createdAt));
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching streams:", error);
      res.status(500).json({ message: "Failed to fetch streams" });
    }
  });

  // Get live streams only
  app.get("/api/streams/live", async (_req, res) => {
    try {
      const result = await db
        .select()
        .from(streams)
        .where(eq(streams.isLive, true))
        .orderBy(desc(streams.viewerCount));
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching live streams:", error);
      res.status(500).json({ message: "Failed to fetch live streams" });
    }
  });

  // Get trending streams
  app.get("/api/streams/trending", async (_req, res) => {
    try {
      const result = await db
        .select()
        .from(streams)
        .where(eq(streams.isLive, true))
        .orderBy(desc(streams.viewerCount))
        .limit(4);
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching trending streams:", error);
      res.status(500).json({ message: "Failed to fetch trending streams" });
    }
  });

  // Get streams by category
  app.get("/api/streams/category/:category", async (req, res) => {
    try {
      const result = await db
        .select()
        .from(streams)
        .where(eq(streams.category, req.params.category))
        .orderBy(desc(streams.viewerCount));
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching streams by category:", error);
      res.status(500).json({ message: "Failed to fetch streams" });
    }
  });

  // Get single stream by ID
  app.get("/api/streams/:id", async (req, res) => {
    try {
      const [stream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, parseInt(req.params.id)));
      
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
      res.json(stream);
    } catch (error) {
      console.error("Error fetching stream:", error);
      res.status(500).json({ message: "Failed to fetch stream" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(req.params.id)));
        
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get streams by user ID
  app.get("/api/users/:id/streams", async (req, res) => {
    try {
      const result = await db
        .select()
        .from(streams)
        .where(eq(streams.userId, parseInt(req.params.id)))
        .orderBy(desc(streams.createdAt));
        
      res.json(result);
    } catch (error) {
      console.error("Error fetching user streams:", error);
      res.status(500).json({ message: "Failed to fetch user streams" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await db
        .select()
        .from(users)
        .where(eq(users.isStreamer, true))
        .orderBy(desc(users.reputation));
      
      const sanitized = leaderboard.map(({ password, ...user }) => user);
      res.json(sanitized);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Create new stream
  app.post("/api/streams", async (req, res) => {
    try {
      const [result] = await db.insert(streams).values(req.body);
      const [newStream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, result.insertId));
      
      // Update streamer reputation when going live
      await updateStreamerReputation(newStream.userId);
        
      res.status(201).json(newStream);
    } catch (error) {
      console.error("Error creating stream:", error);
      res.status(500).json({ message: "Failed to create stream" });
    }
  });

  // Update stream
  app.patch("/api/streams/:id", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      
      // Get the stream to find the owner
      const [stream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, streamId));
      
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }

      await db
        .update(streams)
        .set(req.body)
        .where(eq(streams.id, streamId));
        
      const [updatedStream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, streamId));
      
      // Update reputation after stream update
      await updateStreamerReputation(stream.userId);
        
      res.json(updatedStream);
    } catch (error) {
      console.error("Error updating stream:", error);
      res.status(500).json({ message: "Failed to update stream" });
    }
  });

  // Delete stream
  app.delete("/api/streams/:id", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      
      // Get stream info before deletion for reputation update
      const [stream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, streamId));
      
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }

      await db.delete(streams).where(eq(streams.id, streamId));
      
      // Update reputation after deletion
      await updateStreamerReputation(stream.userId);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting stream:", error);
      res.status(500).json({ message: "Failed to delete stream" });
    }
  });

  // Check subscription status
  app.get("/api/subscriptions/check", async (req, res) => {
    try {
      const { viewerId, streamerId } = req.query;
      
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(and(
          eq(subscriptions.viewerId, parseInt(viewerId as string)),
          eq(subscriptions.streamerId, parseInt(streamerId as string))
        ));

      res.json({ isSubscribed: !!subscription });
    } catch (error) {
      console.error("Error checking subscription:", error);
      res.status(500).json({ message: "Failed to check subscription" });
    }
  });

  // Subscribe to streamer - FIXED VERSION
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { viewerId, streamerId } = req.body;
      
      // Check if already subscribed
      const [existing] = await db
        .select()
        .from(subscriptions)
        .where(and(
          eq(subscriptions.viewerId, viewerId),
          eq(subscriptions.streamerId, streamerId)
        ));

      if (existing) {
        return res.status(400).json({ message: "Already subscribed" });
      }

      // Insert subscription
      await db.insert(subscriptions).values({ viewerId, streamerId });

      // FIXED: Count actual unique subscribers from subscriptions table
      const [result] = await db.execute(
        sql`SELECT COUNT(DISTINCT viewer_id) as count FROM subscriptions WHERE streamer_id = ${streamerId}`
      );
      const actualCount = (result as any)[0].count;

      // Update user's totalSubscribers with the actual count
      await db
        .update(users)
        .set({ totalSubscribers: actualCount })
        .where(eq(users.id, streamerId));
      
      // Update reputation
      await updateStreamerReputation(streamerId);

      res.json({ message: "Subscribed successfully" });
    } catch (error) {
      console.error("Error subscribing:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Unsubscribe from streamer - FIXED VERSION
  app.post("/api/unsubscribe", async (req, res) => {
    try {
      const { viewerId, streamerId } = req.body;
      
      // Delete subscription
      await db
        .delete(subscriptions)
        .where(and(
          eq(subscriptions.viewerId, viewerId),
          eq(subscriptions.streamerId, streamerId)
        ));

      // FIXED: Count actual unique subscribers from subscriptions table
      const [result] = await db.execute(
        sql`SELECT COUNT(DISTINCT viewer_id) as count FROM subscriptions WHERE streamer_id = ${streamerId}`
      );
      const actualCount = (result as any)[0].count;

      // Update user's totalSubscribers with the actual count
      await db
        .update(users)
        .set({ totalSubscribers: actualCount })
        .where(eq(users.id, streamerId));
      
      // Update reputation
      await updateStreamerReputation(streamerId);

      res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
    }
  });

  // Get comments for a stream
  app.get("/api/streams/:id/comments", async (req, res) => {
    try {
      const streamComments = await db
        .select()
        .from(comments)
        .where(eq(comments.streamId, parseInt(req.params.id)))
        .orderBy(desc(comments.createdAt))
        .limit(100);
      
      res.json(streamComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Post comment
  app.post("/api/streams/:id/comments", async (req, res) => {
    try {
      const { userId, username, message } = req.body;
      const streamId = parseInt(req.params.id);
      
      await db.insert(comments).values({
        userId,
        username,
        streamId,
        message,
      });

      res.json({ message: "Comment posted successfully" });
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ message: "Failed to post comment" });
    }
  });

  // ============================================================
  // RATING SYSTEM WITH LIMITS - ONE RATING PER USER PER STREAM
  // ============================================================

  // Check if user has rated a stream
  app.get("/api/streams/:id/rating-status", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);

      // Query the stream_ratings table
      const [rating] = await db.execute(
        sql`SELECT * FROM stream_ratings WHERE stream_id = ${streamId} AND user_id = ${userId}`
      );

      if (!rating || (rating as any).length === 0) {
        return res.json({ hasRated: false, ratingType: null });
      }

      res.json({ 
        hasRated: true, 
        ratingType: (rating as any)[0].rating_type 
      });
    } catch (error) {
      console.error("Error checking rating status:", error);
      res.status(500).json({ message: "Failed to check rating status" });
    }
  });

  // Like stream - WITH ONE RATING PER USER LIMIT
  app.post("/api/streams/:id/like", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      const userId = parseInt(req.body.userId);

      if (!userId) {
        return res.status(401).json({ message: "Must be logged in to rate" });
      }

      // Check if user already rated this stream
      const [existingRating] = await db.execute(
        sql`SELECT * FROM stream_ratings WHERE stream_id = ${streamId} AND user_id = ${userId}`
      );

      if (existingRating && (existingRating as any).length > 0) {
        const currentRating = (existingRating as any)[0].rating_type;
        
        if (currentRating === 'like') {
          return res.status(400).json({ message: "You already liked this stream" });
        }
        
        // User previously disliked, now wants to like
        // Remove dislike count, add like count
        await db.execute(
          sql`UPDATE streams SET dislikes = GREATEST(dislikes - 1, 0), likes = likes + 1 WHERE id = ${streamId}`
        );
        
        // Update rating type from 'dislike' to 'like'
        await db.execute(
          sql`UPDATE stream_ratings SET rating_type = 'like' WHERE stream_id = ${streamId} AND user_id = ${userId}`
        );
      } else {
        // New rating - first time rating this stream
        await db.execute(
          sql`UPDATE streams SET likes = likes + 1 WHERE id = ${streamId}`
        );
        
        // Record in stream_ratings table
        await db.execute(
          sql`INSERT INTO stream_ratings (stream_id, user_id, rating_type) VALUES (${streamId}, ${userId}, 'like')`
        );
      }

      // Get stream to find owner for reputation update
      const [stream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, streamId));
      
      if (stream) {
        await updateStreamerReputation(stream.userId);
      }

      res.json({ message: "Stream liked" });
    } catch (error) {
      console.error("Error liking stream:", error);
      res.status(500).json({ message: "Failed to like stream" });
    }
  });

  // Dislike stream - WITH ONE RATING PER USER LIMIT
  app.post("/api/streams/:id/dislike", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      const userId = parseInt(req.body.userId);

      if (!userId) {
        return res.status(401).json({ message: "Must be logged in to rate" });
      }

      // Check if user already rated this stream
      const [existingRating] = await db.execute(
        sql`SELECT * FROM stream_ratings WHERE stream_id = ${streamId} AND user_id = ${userId}`
      );

      if (existingRating && (existingRating as any).length > 0) {
        const currentRating = (existingRating as any)[0].rating_type;
        
        if (currentRating === 'dislike') {
          return res.status(400).json({ message: "You already disliked this stream" });
        }
        
        // User previously liked, now wants to dislike
        // Remove like count, add dislike count
        await db.execute(
          sql`UPDATE streams SET likes = GREATEST(likes - 1, 0), dislikes = dislikes + 1 WHERE id = ${streamId}`
        );
        
        // Update rating type from 'like' to 'dislike'
        await db.execute(
          sql`UPDATE stream_ratings SET rating_type = 'dislike' WHERE stream_id = ${streamId} AND user_id = ${userId}`
        );
      } else {
        // New rating - first time rating this stream
        await db.execute(
          sql`UPDATE streams SET dislikes = dislikes + 1 WHERE id = ${streamId}`
        );
        
        // Record in stream_ratings table
        await db.execute(
          sql`INSERT INTO stream_ratings (stream_id, user_id, rating_type) VALUES (${streamId}, ${userId}, 'dislike')`
        );
      }

      // Get stream to find owner for reputation update
      const [stream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, streamId));
      
      if (stream) {
        await updateStreamerReputation(stream.userId);
      }

      res.json({ message: "Stream disliked" });
    } catch (error) {
      console.error("Error disliking stream:", error);
      res.status(500).json({ message: "Failed to dislike stream" });
    }
  });

  // Increment view count - WITH REPUTATION UPDATE
  app.post("/api/streams/:id/view", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      
      const [stream] = await db
        .select()
        .from(streams)
        .where(eq(streams.id, streamId));
      
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }

      await db
        .update(streams)
        .set({ viewerCount: sql`viewer_count + 1` })
        .where(eq(streams.id, streamId));
      
      // Update reputation (views contribute to reputation)
      await updateStreamerReputation(stream.userId);

      res.json({ message: "View counted" });
    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ message: "Failed to increment view count" });
    }
  });

  // ============================================================
  // REPORTS SYSTEM
  // ============================================================

  // Submit a report
  app.post("/api/reports", async (req, res) => {
    try {
      const { type, targetId, targetName, reason, details } = req.body;
      
      // Validate required fields
      if (!type || !targetId || !targetName || !reason) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate type
      if (type !== "stream" && type !== "streamer") {
        return res.status(400).json({ message: "Invalid report type" });
      }

      // Insert the report into the database
      await db.execute(
        sql`INSERT INTO reports (type, target_id, target_name, reason, details, status) 
            VALUES (${type}, ${targetId}, ${targetName}, ${reason}, ${details || null}, 'pending')`
      );

      res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
      console.error("Error submitting report:", error);
      res.status(500).json({ message: "Failed to submit report" });
    }
  });

  // Get all reports (for admin panel)
  app.get("/api/reports", async (_req, res) => {
    try {
      const allReports = await db.execute(
        sql`SELECT * FROM reports ORDER BY reported_at DESC`
      );
      
      res.json(allReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Get report by ID
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const [report] = await db.execute(
        sql`SELECT * FROM reports WHERE id = ${reportId}`
      );
      
      if (!report || (report as any).length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json((report as any)[0]);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  // Update report status (for admin)
  app.patch("/api/reports/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ["pending", "reviewed", "resolved"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      await db.execute(
        sql`UPDATE reports SET status = ${status} WHERE id = ${reportId}`
      );
      
      const [updatedReport] = await db.execute(
        sql`SELECT * FROM reports WHERE id = ${reportId}`
      );
      
      res.json((updatedReport as any)[0]);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  // Delete report (for admin)
  app.delete("/api/reports/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      
      await db.execute(
        sql`DELETE FROM reports WHERE id = ${reportId}`
      );
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ message: "Failed to delete report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}