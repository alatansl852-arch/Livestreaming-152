import { useQuery } from "@tanstack/react-query";
import StreamCard from "@/components/StreamCard";
import { Flame } from "lucide-react";
import type { Stream } from "@shared/schema";

export default function TrendingPage() {
  // Fetch top 4 trending streams
  const { data: streams = [], isLoading } = useQuery<Stream[]>({
    queryKey: ["/api/streams/trending"],
  });

  if (isLoading) {
    return <div className="p-6">Loading trending streams...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Flame className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold">Trending Now</h1>
          <p className="text-muted-foreground">The hottest streams on Gosu right now</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((stream, index) => (
          <div key={stream.id} className="relative">
            <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-bold text-white shadow-lg">
              {index + 1}
            </div>
            <StreamCard
              id={stream.id.toString()}
              thumbnailUrl={stream.thumbnailUrl}
              isLive={stream.isLive}
              viewerCount={stream.viewerCount}
              streamerName={stream.streamerName}
              streamTitle={stream.streamTitle}
              category={stream.category}
            />
          </div>
        ))}
      </div>

      {streams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">No trending streams right now</p>
        </div>
      )}
    </div>
  );
}