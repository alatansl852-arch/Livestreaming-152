import { useRoute } from "wouter";
import StreamerProfileHeader from "@/components/StreamerProfileHeader";
import StreamCard from "@/components/StreamCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';

//todo: remove mock functionality
const mockStreamerData = {
  streamerId: "1",
  name: "ProGamer123",
  category: "Gaming",
  coverImage: gamingThumb,
  stats: {
    subscribers: 12450,
    totalViews: 1247890,
    avgViewers: 3200,
    rank: 5,
  },
};

const mockStreams = [
  { id: "1", thumbnailUrl: gamingThumb, isLive: true, viewerCount: 12470, streamerName: "ProGamer123", streamTitle: "Ranked Gameplay - Road to Champion!", category: "Gaming" },
  { id: "2", thumbnailUrl: gamingThumb, isLive: false, viewerCount: 8934, streamerName: "ProGamer123", streamTitle: "Tournament Highlights", category: "Gaming" },
  { id: "3", thumbnailUrl: gamingThumb, isLive: false, viewerCount: 5621, streamerName: "ProGamer123", streamTitle: "Tips and Tricks Guide", category: "Gaming" },
];

export default function StreamerPage() {
  const [, params] = useRoute("/streamer/:id");

  return (
    <div className="space-y-6 p-6">
      <StreamerProfileHeader {...mockStreamerData} />

      <Tabs defaultValue="streams" className="w-full">
        <TabsList>
          <TabsTrigger value="streams" data-testid="tab-streams">Streams</TabsTrigger>
          <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="streams" className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockStreams.map((stream) => (
              <StreamCard key={stream.id} {...stream} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">About {mockStreamerData.name}</h3>
            <p className="text-muted-foreground">
              Professional gamer and content creator specializing in competitive gaming. 
              Streaming daily to bring you the best gameplay and tips!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
