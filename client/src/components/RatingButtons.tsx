import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RatingButtonsProps {
  initialLikes?: number;
  initialDislikes?: number;
  streamId: string;
}

export default function RatingButtons({ initialLikes = 0, initialDislikes = 0, streamId }: RatingButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userRating, setUserRating] = useState<'like' | 'dislike' | null>(null);

  const handleLike = () => {
    if (userRating === 'like') {
      setLikes(likes - 1);
      setUserRating(null);
    } else {
      setLikes(likes + 1);
      if (userRating === 'dislike') {
        setDislikes(dislikes - 1);
      }
      setUserRating('like');
    }
    console.log(`Stream ${streamId} liked`);
  };

  const handleDislike = () => {
    if (userRating === 'dislike') {
      setDislikes(dislikes - 1);
      setUserRating(null);
    } else {
      setDislikes(dislikes + 1);
      if (userRating === 'like') {
        setLikes(likes - 1);
      }
      setUserRating('dislike');
    }
    console.log(`Stream ${streamId} disliked`);
  };

  return (
    <div className="flex items-center gap-2" data-testid="rating-buttons">
      <Button
        variant={userRating === 'like' ? 'default' : 'secondary'}
        size="sm"
        className={cn("gap-2", userRating === 'like' && "bg-primary")}
        onClick={handleLike}
        data-testid="button-like"
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="font-mono">{likes.toLocaleString()}</span>
      </Button>
      <Button
        variant={userRating === 'dislike' ? 'destructive' : 'secondary'}
        size="sm"
        className="gap-2"
        onClick={handleDislike}
        data-testid="button-dislike"
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="font-mono">{dislikes.toLocaleString()}</span>
      </Button>
    </div>
  );
}
