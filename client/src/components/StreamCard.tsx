// src/components/StreamCard.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useLocation } from "wouter";

interface StreamCardProps {
  id: string;
  thumbnailUrl: string;
  isLive: boolean;
  viewerCount: number;
  streamerName: string;
  streamerAvatar?: string;
  streamTitle: string;
  category: string;
  streamerId?: number;
}

export default function StreamCard({
  id,
  thumbnailUrl,
  isLive,
  viewerCount,
  streamerName,
  streamTitle,
  category,
  streamerId,
}: StreamCardProps) {
  const [, setLocation] = useLocation();

  const handleStreamClick = () => {
    setLocation(`/stream/${id}`);
  };

  const handleStreamerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (streamerId) {
      setLocation(`/streamer/${streamerId}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={handleStreamClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={streamTitle}
          className="h-full w-full object-cover"
        />
        {isLive && (
          <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
            LIVE
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
          <Users className="h-3 w-3" />
          <span>{viewerCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{streamerName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {streamTitle}
            </h3>
            <p 
              className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
              onClick={handleStreamerClick}
            >
              {streamerName}
            </p>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}