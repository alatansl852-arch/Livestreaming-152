import { useRoute } from "wouter";
import StreamPlayer from "@/components/StreamPlayer";
import Chat from "@/components/Chat";
import RatingButtons from "@/components/RatingButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SubscribeButton from "@/components/SubscribeButton";
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';

//todo: remove mock functionality
const mockStreamData = {
  id: "1",
  thumbnailUrl: gamingThumb,
  isLive: true,
  viewerCount: 12470,
  streamerName: "ProGamer123",
  streamerId: "streamer1",
  streamTitle: "Ranked Gameplay - Road to Champion!",
  category: "Gaming",
  description: "Join me as I climb the ranked ladder! We're aiming for Champion tier today. Thanks for all your support!",
  likes: 1247,
  dislikes: 23,
};

export default function StreamPage() {
  const [, params] = useRoute("/stream/:id");
  const streamId = params?.id || "1";

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="p-6">
          <div className="space-y-4">
            <StreamPlayer thumbnailUrl={mockStreamData.thumbnailUrl} isLive={mockStreamData.isLive} />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold" data-testid="text-stream-title">
                  {mockStreamData.streamTitle}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant={mockStreamData.isLive ? "destructive" : "secondary"}>
                    {mockStreamData.isLive ? "LIVE" : "OFFLINE"}
                  </Badge>
                  <Badge variant="secondary">{mockStreamData.category}</Badge>
                  <span className="text-sm text-muted-foreground" data-testid="text-viewer-count">
                    {mockStreamData.viewerCount.toLocaleString()} viewers
                  </span>
                </div>
              </div>
              <RatingButtons 
                initialLikes={mockStreamData.likes} 
                initialDislikes={mockStreamData.dislikes} 
                streamId={streamId}
              />
            </div>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback>{mockStreamData.streamerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{mockStreamData.streamerName}</h3>
                    <p className="text-sm text-muted-foreground">Content Creator</p>
                  </div>
                </div>
                <SubscribeButton streamerId={mockStreamData.streamerId} />
              </div>
            </Card>

            <Tabs defaultValue="about" className="w-full">
              <TabsList>
                <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
                <TabsTrigger value="chat" data-testid="tab-chat">Chat Replay</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-4">
                <Card className="p-4">
                  <h3 className="mb-2 font-semibold">Stream Description</h3>
                  <p className="text-muted-foreground">{mockStreamData.description}</p>
                </Card>
              </TabsContent>
              <TabsContent value="chat">
                <Card className="p-4">
                  <p className="text-muted-foreground">Chat replay for this stream</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="hidden h-full w-96 lg:block">
        <Chat />
      </div>
    </div>
  );
}
