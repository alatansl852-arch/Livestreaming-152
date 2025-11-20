import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, Users, TrendingUp, MoreVertical } from "lucide-react";
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';

//todo: remove mock functionality
const mockDashboardStats = {
  totalViews: 1247890,
  totalSubscribers: 12450,
  avgRating: 9.5,
  currentRank: 5,
};

const mockMyStreams = [
  { id: "1", title: "Ranked Gameplay - Road to Champion!", thumbnail: gamingThumb, views: 12470, likes: 1247, isLive: true },
  { id: "2", title: "Tournament Highlights", thumbnail: gamingThumb, views: 8934, likes: 892, isLive: false },
  { id: "3", title: "Tips and Tricks Guide", thumbnail: gamingThumb, views: 5621, likes: 567, isLive: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Streamer Dashboard</h1>
          <p className="text-muted-foreground">Manage your streams and track your performance</p>
        </div>
        <Button size="lg" data-testid="button-go-live">
          Go Live
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="mt-1 font-mono text-2xl font-bold" data-testid="text-total-views">
                {mockDashboardStats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Subscribers</p>
              <p className="mt-1 font-mono text-2xl font-bold" data-testid="text-subscribers">
                {mockDashboardStats.totalSubscribers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary" data-testid="text-rating">
                {mockDashboardStats.avgRating.toFixed(1)}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Rank</p>
              <p className="mt-1 font-mono text-2xl font-bold text-accent-foreground" data-testid="text-rank">
                #{mockDashboardStats.currentRank}
              </p>
            </div>
            <div className="rounded-full bg-accent/10 p-3">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Streams</h2>
          <Button variant="outline" data-testid="button-create-stream">
            Create New Stream
          </Button>
        </div>

        <div className="space-y-3">
          {mockMyStreams.map((stream) => (
            <Card key={stream.id} className="p-4 hover-elevate" data-testid={`card-stream-${stream.id}`}>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={stream.thumbnail} alt={stream.title} className="h-full w-full object-cover" />
                  {stream.isLive && (
                    <Badge variant="destructive" className="absolute left-2 top-2 animate-pulse">
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{stream.title}</h3>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {stream.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {stream.likes.toLocaleString()} likes
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" data-testid={`button-options-${stream.id}`}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
