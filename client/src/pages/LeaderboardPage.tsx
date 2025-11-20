import LeaderboardTable from "@/components/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//todo: remove mock functionality
const mockLeaderboard = [
  { rank: 1, streamerId: "1", name: "ProGamer123", category: "Gaming", totalViews: 1247890, ratingScore: 9.5, subscribers: 45200 },
  { rank: 2, streamerId: "2", name: "FitnessGuru", category: "Health", totalViews: 987654, ratingScore: 9.3, subscribers: 38500 },
  { rank: 3, streamerId: "3", name: "TechTeacher", category: "Academe", totalViews: 856432, ratingScore: 9.1, subscribers: 32100 },
  { rank: 4, streamerId: "4", name: "ArtistPro", category: "Creative", totalViews: 745123, ratingScore: 8.9, subscribers: 28900 },
  { rank: 5, streamerId: "5", name: "PodcastKing", category: "Social Talk", totalViews: 698456, ratingScore: 8.7, subscribers: 25600 },
  { rank: 6, streamerId: "6", name: "MusicMaestro", category: "Music", totalViews: 654321, ratingScore: 8.5, subscribers: 23400 },
  { rank: 7, streamerId: "7", name: "SpeedRunner99", category: "Gaming", totalViews: 612345, ratingScore: 8.3, subscribers: 21200 },
  { rank: 8, streamerId: "8", name: "NutritionExpert", category: "Health", totalViews: 589012, ratingScore: 8.1, subscribers: 19800 },
  { rank: 9, streamerId: "9", name: "CodeMaster", category: "Academe", totalViews: 567890, ratingScore: 7.9, subscribers: 18500 },
  { rank: 10, streamerId: "10", name: "VloggerDaily", category: "Social Talk", totalViews: 543210, ratingScore: 7.7, subscribers: 17100 },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Streamer Leaderboard</h1>
        <p className="text-muted-foreground">Top streamers ranked by performance and popularity</p>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList>
          <TabsTrigger value="overall" data-testid="tab-overall">Overall</TabsTrigger>
          <TabsTrigger value="weekly" data-testid="tab-weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly" data-testid="tab-monthly">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value="overall" className="mt-6">
          <LeaderboardTable entries={mockLeaderboard} />
        </TabsContent>
        <TabsContent value="weekly" className="mt-6">
          <LeaderboardTable entries={mockLeaderboard.slice(0, 5)} />
        </TabsContent>
        <TabsContent value="monthly" className="mt-6">
          <LeaderboardTable entries={mockLeaderboard.slice(0, 8)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
