// src/pages/HomePage.tsx - UPDATED
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import StreamCard from "@/components/StreamCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import type { Stream } from "@shared/schema";

const categories = [
  "All",
  "Gaming",
  "Health",
  "Academe",
  "Social Talk",
  "Creative",
  "Music",
];

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [trendingStreams, setTrendingStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreams();
    fetchTrendingStreams();
  }, [selectedCategory]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "All" 
        ? "/api/streams" 
        : `/api/streams/category/${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setStreams(data);
    } catch (error) {
      console.error("Error fetching streams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingStreams = async () => {
    try {
      const response = await fetch("/api/streams/trending");
      const data = await response.json();
      setTrendingStreams(data);
    } catch (error) {
      console.error("Error fetching trending streams:", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          {isAuthenticated ? `Welcome back, ${user?.username}!` : "Welcome to Gosu"}
        </h1>
        <p className="text-muted-foreground">
          {isAuthenticated && user?.isStreamer
            ? "Ready to go live? Head to your dashboard to start streaming."
            : "Discover amazing content creators streaming now"}
        </p>
      </div>

      {/* Trending Streams - Only show for All category */}
      {selectedCategory === "All" && trendingStreams.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingStreams.map((stream) => (
              <StreamCard 
                key={stream.id} 
                id={stream.id.toString()} 
                thumbnailUrl={stream.thumbnailUrl}
                isLive={stream.isLive}
                viewerCount={stream.viewerCount}
                streamerName={stream.streamerName}
                streamerAvatar={stream.streamerAvatar}
                streamTitle={stream.streamTitle}
                category={stream.category}
                streamerId={stream.userId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* All Streams */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">Loading streams...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {streams.map((stream) => (
              <StreamCard 
                key={stream.id} 
                id={stream.id.toString()} 
                thumbnailUrl={stream.thumbnailUrl}
                isLive={stream.isLive}
                viewerCount={stream.viewerCount}
                streamerName={stream.streamerName}
                streamerAvatar={stream.streamerAvatar}
                streamTitle={stream.streamTitle}
                category={stream.category}
                streamerId={stream.userId}
              />
            ))}
          </div>

          {streams.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No streams found in this category
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}