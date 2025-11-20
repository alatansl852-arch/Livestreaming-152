import { useRoute } from "wouter";
import StreamCard from "@/components/StreamCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';
import healthThumb from '@assets/generated_images/Health_fitness_stream_thumbnail_2a0f7b09.png';
import academicThumb from '@assets/generated_images/Academic_education_stream_thumbnail_5d5b7405.png';

//todo: remove mock functionality
const mockCategoryStreams: Record<string, any[]> = {
  gaming: [
    { id: "1", thumbnailUrl: gamingThumb, isLive: true, viewerCount: 12470, streamerName: "ProGamer123", streamTitle: "Ranked Gameplay", category: "Gaming" },
    { id: "7", thumbnailUrl: gamingThumb, isLive: true, viewerCount: 2134, streamerName: "SpeedRunner99", streamTitle: "World Record Attempt", category: "Gaming" },
  ],
  health: [
    { id: "2", thumbnailUrl: healthThumb, isLive: true, viewerCount: 8934, streamerName: "FitnessGuru", streamTitle: "Morning Yoga Session", category: "Health" },
    { id: "8", thumbnailUrl: healthThumb, isLive: false, viewerCount: 1456, streamerName: "NutritionExpert", streamTitle: "Healthy Meal Prep", category: "Health" },
  ],
  academe: [
    { id: "3", thumbnailUrl: academicThumb, isLive: true, viewerCount: 5621, streamerName: "TechTeacher", streamTitle: "Quantum Computing 101", category: "Academe" },
  ],
};

const categoryInfo: Record<string, { title: string; description: string }> = {
  gaming: { title: "Gaming", description: "Watch the best gaming streams and esports competitions" },
  health: { title: "Health & Fitness", description: "Fitness routines, yoga, and wellness content" },
  academe: { title: "Academic & Education", description: "Learn from expert educators and tutors" },
  "social-talk": { title: "Social Talk", description: "Engaging conversations and podcasts" },
  creative: { title: "Creative", description: "Art, design, and creative content" },
  trending: { title: "Trending", description: "What's hot right now on StreamHub" },
};

export default function CategoryPage() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category || "gaming";
  const info = categoryInfo[category] || categoryInfo.gaming;
  const streams = mockCategoryStreams[category] || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{info.title}</h1>
          <p className="text-muted-foreground">{info.description}</p>
        </div>
        <Select defaultValue="viewers">
          <SelectTrigger className="w-48" data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewers">Most Viewers</SelectItem>
            <SelectItem value="recent">Recently Started</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((stream) => (
          <StreamCard key={stream.id} {...stream} />
        ))}
      </div>

      {streams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">No streams in this category right now</p>
        </div>
      )}
    </div>
  );
}
