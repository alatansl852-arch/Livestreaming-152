import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface StreamCardProps {
  id: string;
  thumbnailUrl: string;
  isLive: boolean;
  viewerCount: number;
  streamerName: string;
  streamerAvatar?: string;
  streamTitle: string;
  category: string;
}

export default function StreamCard({
  id,
  thumbnailUrl,
  isLive,
  viewerCount,
  streamerName,
  streamerAvatar,
  streamTitle,
  category,
}: StreamCardProps) {
  return (
    <Link href={`/stream/${id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-stream-${id}`}>
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={thumbnailUrl}
            alt={streamTitle}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {isLive && (
            <div className="absolute left-2 top-2">
              <Badge variant="destructive" className="animate-pulse font-semibold" data-testid="badge-live">
                LIVE
              </Badge>
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Eye className="h-3 w-3" />
            <span data-testid={`text-viewers-${id}`}>{viewerCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={streamerAvatar} />
              <AvatarFallback>{streamerName[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-sm" data-testid={`text-title-${id}`}>
                {streamTitle}
              </h3>
              <p className="truncate text-sm text-muted-foreground" data-testid={`text-streamer-${id}`}>
                {streamerName}
              </p>
              <Badge variant="secondary" className="mt-1 text-xs" data-testid={`badge-category-${id}`}>
                {category}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
