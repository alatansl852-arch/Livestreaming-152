import 'dotenv/config';
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const sampleStreams = [
  {
    userId: 1,
    thumbnailUrl: "https://picsum.photos/seed/gaming1/400/225",
    isLive: true,
    viewerCount: 12470,
    streamerName: "ProGamer123",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer123",
    streamTitle: "Ranked Gameplay - Road to Champion!",
    category: "Gaming",
    description: "Join me as I climb the ranked ladder! We're aiming for Champion tier today.",
    likes: 1247,
    dislikes: 23,
  },
  {
    userId: 2,
    thumbnailUrl: "https://picsum.photos/seed/health1/400/225",
    isLive: true,
    viewerCount: 8934,
    streamerName: "FitnessGuru",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru",
    streamTitle: "Morning Yoga & Meditation Session",
    category: "Health",
    description: "Start your day right with yoga and meditation",
    likes: 892,
    dislikes: 12,
  },
  {
    userId: 3,
    thumbnailUrl: "https://picsum.photos/seed/academic1/400/225",
    isLive: true,
    viewerCount: 5621,
    streamerName: "TechTeacher",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechTeacher",
    streamTitle: "Introduction to Quantum Computing",
    category: "Academe",
    description: "Learn the fundamentals of quantum computing",
    likes: 567,
    dislikes: 8,
  },
  {
    userId: 4,
    thumbnailUrl: "https://picsum.photos/seed/social1/400/225",
    isLive: true,
    viewerCount: 15892,
    streamerName: "PodcastKing",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PodcastKing",
    streamTitle: "Deep Conversations About Life",
    category: "Social Talk",
    description: "Join our discussion about life, philosophy, and everything in between",
    likes: 1589,
    dislikes: 15,
  },
  {
    userId: 5,
    thumbnailUrl: "https://picsum.photos/seed/social2/400/225",
    isLive: true,
    viewerCount: 9234,
    streamerName: "ChatMaster",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ChatMaster",
    streamTitle: "Late Night Talk Show",
    category: "Social Talk",
    description: "Chatting with viewers and special guests!",
    likes: 923,
    dislikes: 18,
  },
  {
    userId: 6,
    thumbnailUrl: "https://picsum.photos/seed/creative1/400/225",
    isLive: true,
    viewerCount: 11245,
    streamerName: "ArtistPro",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArtistPro",
    streamTitle: "Digital Art Speed Drawing",
    category: "Creative",
    description: "Watch me create digital art from scratch",
    likes: 1124,
    dislikes: 5,
  },
  {
    userId: 7,
    thumbnailUrl: "https://picsum.photos/seed/creative2/400/225",
    isLive: true,
    viewerCount: 7456,
    streamerName: "DesignGuru",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignGuru",
    streamTitle: "UI/UX Design Process Live",
    category: "Creative",
    description: "Designing a mobile app interface from concept to final mockup",
    likes: 745,
    dislikes: 12,
  },
  {
    userId: 8,
    thumbnailUrl: "https://picsum.photos/seed/music1/400/225",
    isLive: true,
    viewerCount: 6789,
    streamerName: "MusicMaestro",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MusicMaestro",
    streamTitle: "Live Music Production Session",
    category: "Music",
    description: "Creating beats and melodies live!",
    likes: 678,
    dislikes: 10,
  },
  {
    userId: 9,
    thumbnailUrl: "https://picsum.photos/seed/gaming2/400/225",
    isLive: true,
    viewerCount: 2134,
    streamerName: "SpeedRunner99",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedRunner99",
    streamTitle: "World Record Attempt - Any%",
    category: "Gaming",
    description: "Attempting to break the world record!",
    likes: 213,
    dislikes: 7,
  },
  {
    userId: 10,
    thumbnailUrl: "https://picsum.photos/seed/health2/400/225",
    isLive: false,
    viewerCount: 1456,
    streamerName: "NutritionExpert",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NutritionExpert",
    streamTitle: "Healthy Meal Prep Tips",
    category: "Health",
    description: "Learn how to meal prep for the week",
    likes: 145,
    dislikes: 3,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create multiple users with unique usernames
    const usernames = [
      "ProGamer123",
      "FitnessGuru", 
      "TechTeacher",
      "PodcastKing",
      "ChatMaster",
      "ArtistPro",
      "DesignGuru",
      "MusicMaestro",
      "SpeedRunner99",
      "NutritionExpert"
    ];

    for (const username of usernames) {
      await storage.createUser({
        username: username,
        password: "password123",
      });
      console.log("✅ Created streamer:", username);
    }

    // Create test viewer
    await storage.createUser({
      username: "testviewer",
      password: "password123",
    });
    console.log("✅ Created viewer: testviewer");

    // Insert sample streams
    for (const stream of sampleStreams) {
      await storage.insertStream(stream);
      console.log("✅ Created stream:", stream.streamTitle);
    }

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }

  process.exit(0);
}

seed();