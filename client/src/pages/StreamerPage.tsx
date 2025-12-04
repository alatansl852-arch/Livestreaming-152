// src/pages/StreamerProfilePage.tsx - CLEAN VERSION (NO REPORT FEATURE)
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import StreamCard from "@/components/StreamCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Users, Video } from "lucide-react";
import type { Stream, User } from "@shared/schema";

export default function StreamerProfilePage() {
  const [, params] = useRoute("/streamer/:id");
  const { user: currentUser, isAuthenticated } = useAuth();
  const [streamer, setStreamer] = useState<User | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchStreamerData();
      fetchStreamerStreams();
      if (currentUser) {
        checkSubscription();
      }
    }
  }, [params?.id, currentUser]);

  const fetchStreamerData = async () => {
    try {
      const response = await fetch(`/api/users/${params!.id}`);
      if (!response.ok) throw new Error("Streamer not found");
      const data = await response.json();
      setStreamer(data);
    } catch (error) {
      console.error("Error fetching streamer:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreamerStreams = async () => {
    try {
      const response = await fetch(`/api/users/${params!.id}/streams`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams(data);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  const checkSubscription = async () => {
    try {
      const response = await fetch(
        `/api/subscriptions/check?viewerId=${currentUser!.id}&streamerId=${params!.id}`
      );
      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) return;

    try {
      const endpoint = isSubscribed ? "/api/unsubscribe" : "/api/subscribe";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viewerId: currentUser.id,
          streamerId: parseInt(params!.id),
        }),
      });

      if (!response.ok) throw new Error("Failed to update subscription");

      setIsSubscribed(!isSubscribed);
      fetchStreamerData();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!streamer) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-lg text-destructive">Streamer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-3xl">
                {streamer.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{streamer.username}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{streamer.totalSubscribers} subscribers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{streamer.reputation} reputation</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>{streams.length} streams</span>
                </div>
              </div>
            </div>
          </div>

          {isAuthenticated && currentUser?.id !== streamer.id && (
            <div className="flex gap-2">
              <Button
                onClick={handleSubscribe}
                variant={isSubscribed ? "outline" : "default"}
                size="lg"
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Streams */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {streams.filter((s) => s.isLive).length > 0 ? "Live Now" : "Recent Streams"}
        </h2>

        {streams.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">No streams yet</p>
          </Card>
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
