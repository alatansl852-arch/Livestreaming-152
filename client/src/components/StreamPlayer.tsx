import { Play } from "lucide-react";

interface StreamPlayerProps {
  thumbnailUrl: string;
  isLive: boolean;
}

export default function StreamPlayer({ thumbnailUrl, isLive }: StreamPlayerProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black" data-testid="stream-player">
      <img
        src={thumbnailUrl}
        alt="Stream"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 hover-elevate active-elevate-2 cursor-pointer">
            <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
          </div>
          {isLive ? (
            <p className="text-lg font-semibold text-white">Stream is Live</p>
          ) : (
            <p className="text-lg font-semibold text-white">Stream Offline</p>
          )}
        </div>
      </div>
    </div>
  );
}
