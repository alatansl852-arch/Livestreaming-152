// src/pages/CategoryPage.tsx - UPDATED
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import StreamCard from "@/components/StreamCard";
import type { Stream } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:category");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.category) {
      fetchCategoryStreams();
    }
  }, [params?.category]);

  const fetchCategoryStreams = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/streams/category/${params!.category}`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams(data);
    } catch (error) {
      console.error("Error fetching category streams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-lg text-muted-foreground">Loading streams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold capitalize">{params?.category}</h1>
        <p className="text-muted-foreground">
          {streams.length} {streams.length === 1 ? "stream" : "streams"} in this category
        </p>
      </div>

      {streams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">
            No streams found in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {streams.map((stream) => (
            <StreamCard
              key={stream.id}
              id={stream.id.toString()}
              thumbnailUrl={stream.thumbnailUrl}
              isLive={stream.isLive}
              viewerCount={stream.viewerCount}
              streamerName={stream.streamerName}
              
              streamTitle={stream.streamTitle}
              category={stream.category}
              streamerId={stream.userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}