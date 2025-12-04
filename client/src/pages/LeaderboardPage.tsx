// src/pages/LeaderboardPage.tsx
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Users, TrendingUp } from "lucide-react";
import type { User } from "@shared/schema";

export default function LeaderboardPage() {
  const [streamers, setStreamers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const data = await response.json();
      setStreamers(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-lg text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">Top streamers ranked by reputation</p>
      </div>

      <div className="grid gap-4">
        {streamers.map((streamer, index) => (
          <Link key={streamer.id} href={`/streamer/${streamer.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-6">
                {/* Rank */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold">
                  {getRankIcon(index)}
                </div>

                {/* Avatar & Info */}
                <div className="flex flex-1 items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {streamer.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{streamer.username}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{streamer.totalSubscribers.toLocaleString()} subscribers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reputation Score */}
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Reputation</p>
                    <p className="text-lg font-bold">{streamer.reputation.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {streamers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No streamers found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 