import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Users, Send } from "lucide-react";
import type { Stream, Comment } from "@shared/schema";

export default function StreamPage() {
  const [, params] = useRoute("/stream/:id");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [stream, setStream] = useState<Stream | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRatingType, setUserRatingType] = useState<"like" | "dislike" | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchStream();
      fetchComments();
      incrementViewCount();
      if (user) {
        checkRatingStatus();
      }
    }
  }, [params?.id, user]);

  const checkRatingStatus = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/streams/${params!.id}/rating-status?userId=${user.id}`
      );
      const data = await response.json();
      setUserRatingType(data.ratingType);
    } catch (err) {
      console.error("Error checking rating status:", err);
    }
  };

  const incrementViewCount = async () => {
    try {
      await fetch(`/api/streams/${params!.id}/view`, { method: "POST" });
    } catch (err) {
      console.error("Error incrementing view count:", err);
    }
  };

  const fetchStream = async () => {
    try {
      const response = await fetch(`/api/streams/${params!.id}`);
      if (!response.ok) throw new Error("Stream not found");
      const data = await response.json();
      setStream(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stream");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/streams/${params!.id}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to rate streams");
      return;
    }

    try {
      const response = await fetch(`/api/streams/${params!.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      await fetchStream();
      await checkRatingStatus();
    } catch (err) {
      console.error("Error liking stream:", err);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert("Please login to rate streams");
      return;
    }

    try {
      const response = await fetch(`/api/streams/${params!.id}/dislike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      await fetchStream();
      await checkRatingStatus();
    } catch (err) {
      console.error("Error disliking stream:", err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await fetch(`/api/streams/${params!.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          message: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleStreamerClick = () => {
    if (stream) {
      setLocation(`/streamer/${stream.userId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading stream...</p>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-destructive">{error || "Stream not found"}</p>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-3">
      {/* MAIN STREAM AREA */}
      <div className="lg:col-span-2 space-y-4">
        <div className="relative aspect-video w-full rounded-lg bg-black overflow-hidden">
          <img src={stream.thumbnailUrl} alt={stream.streamTitle} className="w-full h-full object-cover" />
          {stream.isLive && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-semibold">
              LIVE
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{stream.streamTitle}</h1>
          <p className="text-muted-foreground">{stream.category}</p>

          {stream.description && <p className="text-sm">{stream.description}</p>}

          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80"
              onClick={handleStreamerClick}
            >
              <Avatar>
                <AvatarFallback>{stream.streamerName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{stream.streamerName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{stream.viewerCount.toLocaleString()} viewers</span>
                </div>
              </div>
            </div>

            {/* LIKE / DISLIKE */}
            <div className="flex gap-2">
              <Button
                variant={userRatingType === "like" ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={!isAuthenticated}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> {stream.likes}
              </Button>

              <Button
                variant={userRatingType === "dislike" ? "default" : "outline"}
                size="sm"
                onClick={handleDislike}
                disabled={!isAuthenticated}
              >
                <ThumbsDown className="h-4 w-4 mr-1" /> {stream.dislikes}
              </Button>
            </div>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">Login to rate this stream</p>
          )}
        </div>
      </div>

      {/* CHAT SECTION */}
      <Card className="flex h-[calc(100vh-8rem)] flex-col lg:col-span-1">
        <div className="border-b p-4">
          <h2 className="font-semibold">Live Chat</h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-1">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {comment.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{comment.username}</p>
                    <p className="text-sm break-words">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">No comments yet.</p>
            )}
          </div>
        </ScrollArea>

        {isAuthenticated ? (
          <form onSubmit={handlePostComment} className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Send a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="border-t p-4 text-center text-sm text-muted-foreground">
            Login to chat
          </div>
        )}
      </Card>
    </div>
  );
}
