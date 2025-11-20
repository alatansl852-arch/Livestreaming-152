import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SubscribeButton from "./SubscribeButton";

interface StreamerStats {
  subscribers: number;
  totalViews: number;
  avgViewers: number;
  rank: number;
}

interface StreamerProfileHeaderProps {
  streamerId: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  category: string;
  stats: StreamerStats;
}

export default function StreamerProfileHeader({
  streamerId,
  name,
  avatar,
  coverImage,
  category,
  stats,
}: StreamerProfileHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
        {coverImage && (
          <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="relative -mt-16 px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-4xl">{name[0]}</AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <h1 className="text-3xl font-bold" data-testid="text-streamer-name">{name}</h1>
              <Badge variant="secondary" className="mt-1">{category}</Badge>
            </div>
          </div>
          <div className="mb-2">
            <SubscribeButton streamerId={streamerId} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-primary" data-testid="text-subscribers">
                {stats.subscribers.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Subscribers</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold" data-testid="text-total-views">
                {stats.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold" data-testid="text-avg-viewers">
                {stats.avgViewers.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Avg Viewers</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="font-mono text-2xl font-bold text-accent-foreground" data-testid="text-rank">
                #{stats.rank}
              </p>
              <p className="text-sm text-muted-foreground">Rank</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
