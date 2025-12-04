// src/pages/DashboardPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, ThumbsUp, Users, TrendingUp, MoreVertical, 
  Video, Play, StopCircle, Edit, Trash2, Upload, X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Stream } from "@shared/schema";

const categories = [
  "Gaming",
  "Health",
  "Academe",
  "Social Talk",
  "Creative",
  "Music",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [myStreams, setMyStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoLiveDialog, setShowGoLiveDialog] = useState(false);
  const [goingLive, setGoingLive] = useState(false);
  
  // Go Live Form State
  const [streamTitle, setStreamTitle] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailData, setThumbnailData] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    avgRating: 0,
  });
  const [rank, setRank] = useState<number | null>(null);

  // Redirect viewers away from dashboard
  useEffect(() => {
    if (user && !user.isStreamer) {
      setLocation("/");
    }
  }, [user, setLocation]);

  useEffect(() => {
    if (user && user.isStreamer) {
      fetchMyStreams();
      fetchLeaderboardRank();
    }
  }, [user]);

  const fetchMyStreams = async () => {
    try {
      const response = await fetch(`/api/users/${user!.id}/streams`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setMyStreams(data);

      // Calculate stats
      const totalViews = data.reduce((sum: number, s: Stream) => sum + s.viewerCount, 0);
      const totalLikes = data.reduce((sum: number, s: Stream) => sum + s.likes, 0);
      const totalDislikes = data.reduce((sum: number, s: Stream) => sum + s.dislikes, 0);
      const avgRating = totalLikes + totalDislikes > 0
        ? (totalLikes / (totalLikes + totalDislikes)) * 10
        : 0;

      setStats({ totalViews, totalLikes, avgRating });
    } catch (error) {
      console.error("Error fetching streams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardRank = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const leaderboard = await response.json();
      const userRank = leaderboard.findIndex((u: any) => u.id === user!.id);
      setRank(userRank >= 0 ? userRank + 1 : null);
    } catch (error) {
      console.error("Error fetching rank:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview and base64 data
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
      setThumbnailData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailData(null);
  };

  const handleGoLive = async () => {
    if (!streamTitle.trim() || !thumbnailData) {
      alert("Please fill in all required fields and upload a thumbnail");
      return;
    }

    setGoingLive(true);
    try {
      const response = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          streamTitle,
          category,
          description,
          thumbnailUrl: thumbnailData, // Send base64 string
          streamerName: user!.username,
          streamerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user!.username}`,
          isLive: true,
          viewerCount: 0,
          likes: 0,
          dislikes: 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to create stream");
      
      const newStream = await response.json();
      
      // Close dialog and refresh
      setShowGoLiveDialog(false);
      resetForm();
      fetchMyStreams();
      
      // Redirect to the new stream
      setLocation(`/stream/${newStream.id}`);
    } catch (error) {
      console.error("Error going live:", error);
      alert("Failed to go live. Please try again.");
    } finally {
      setGoingLive(false);
    }
  };

  const handleEndStream = async (streamId: number) => {
    if (!confirm("Are you sure you want to end this stream?")) return;

    try {
      const response = await fetch(`/api/streams/${streamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLive: false }),
      });

      if (!response.ok) throw new Error("Failed to end stream");
      fetchMyStreams();
    } catch (error) {
      console.error("Error ending stream:", error);
      alert("Failed to end stream. Please try again.");
    }
  };

  const handleDeleteStream = async (streamId: number) => {
    if (!confirm("Are you sure you want to delete this stream? This cannot be undone.")) return;

    try {
      const response = await fetch(`/api/streams/${streamId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete stream");
      fetchMyStreams();
    } catch (error) {
      console.error("Error deleting stream:", error);
      alert("Failed to delete stream. Please try again.");
    }
  };

  const resetForm = () => {
    setStreamTitle("");
    setCategory("Gaming");
    setDescription("");
    setThumbnailPreview(null);
    setThumbnailData(null);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Show nothing if not a streamer (redirect happens in useEffect)
  if (!user?.isStreamer) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Streamer Dashboard</h1>
          <p className="text-muted-foreground">Manage your streams and track your performance</p>
        </div>
        <Button 
          size="lg" 
          onClick={() => setShowGoLiveDialog(true)}
          className="gap-2"
        >
          <Video className="h-5 w-5" />
          Go Live
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="mt-1 font-mono text-2xl font-bold">
                {stats.totalViews.toLocaleString()}
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
              <p className="mt-1 font-mono text-2xl font-bold">
                {user?.totalSubscribers.toLocaleString() || 0}
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
              <p className="mt-1 font-mono text-2xl font-bold text-primary">
                {stats.avgRating.toFixed(1)}
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
              <p className="mt-1 font-mono text-2xl font-bold text-accent-foreground">
                {rank ? `#${rank}` : "N/A"}
              </p>
            </div>
            <div className="rounded-full bg-accent/10 p-3">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* My Streams Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Streams</h2>
        </div>

        {myStreams.length === 0 ? (
          <Card className="p-12 text-center">
            <Video className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">No streams yet</p>
            <p className="mb-4 text-muted-foreground">Start your first stream to engage with your audience</p>
            <Button onClick={() => setShowGoLiveDialog(true)}>
              <Play className="mr-2 h-4 w-4" />
              Go Live Now
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {myStreams.map((stream) => (
              <Card key={stream.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={stream.thumbnailUrl} alt={stream.streamTitle} className="h-full w-full object-cover" />
                    {stream.isLive && (
                      <Badge variant="destructive" className="absolute left-2 top-2 animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{stream.streamTitle}</h3>
                    <p className="text-sm text-muted-foreground">{stream.category}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {stream.viewerCount.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {stream.likes.toLocaleString()} likes
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {stream.isLive ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleEndStream(stream.id)}
                      >
                        <StopCircle className="mr-2 h-4 w-4" />
                        End Stream
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteStream(stream.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Go Live Dialog */}
      <Dialog open={showGoLiveDialog} onOpenChange={setShowGoLiveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Go Live</DialogTitle>
            <DialogDescription>
              Set up your stream details before going live
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Stream Title *</Label>
              <Input
                id="title"
                placeholder="Enter your stream title"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell viewers what your stream is about"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail *</Label>
              
              {!thumbnailPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-destructive hover:bg-destructive/90 rounded-full text-destructive-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoLiveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGoLive} disabled={goingLive}>
              {goingLive ? "Going Live..." : "Start Stream"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}