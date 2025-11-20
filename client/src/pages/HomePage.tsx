import { useState } from "react";
import StreamCard from "@/components/StreamCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gamingThumb from '@assets/generated_images/Gaming_stream_thumbnail_09f29da0.png';
import healthThumb from '@assets/generated_images/Health_fitness_stream_thumbnail_2a0f7b09.png';
import academicThumb from '@assets/generated_images/Academic_education_stream_thumbnail_5d5b7405.png';
import socialThumb from '@assets/generated_images/Social_talk_stream_thumbnail_0417e73c.png';
import creativeThumb from '@assets/generated_images/Creative_art_stream_thumbnail_e197751c.png';
import musicThumb from '@assets/generated_images/Music_production_stream_thumbnail_fb5e3c3d.png';

//todo: remove mock functionality
const mockStreams = [
  { id: "1", thumbnailUrl: gamingThumb, isLive: true, viewerCount: 12470, streamerName: "ProGamer123", streamTitle: "Ranked Gameplay - Road to Champion!", category: "Gaming" },
  { id: "2", thumbnailUrl: healthThumb, isLive: true, viewerCount: 8934, streamerName: "FitnessGuru", streamTitle: "Morning Yoga & Meditation Session", category: "Health" },
  { id: "3", thumbnailUrl: academicThumb, isLive: true, viewerCount: 5621, streamerName: "TechTeacher", streamTitle: "Introduction to Quantum Computing", category: "Academe" },
  { id: "4", thumbnailUrl: socialThumb, isLive: true, viewerCount: 4892, streamerName: "PodcastKing", streamTitle: "Deep Conversations About Life", category: "Social Talk" },
  { id: "5", thumbnailUrl: creativeThumb, isLive: false, viewerCount: 3245, streamerName: "ArtistPro", streamTitle: "Digital Art Speed Drawing", category: "Creative" },
  { id: "6", thumbnailUrl: musicThumb, isLive: true, viewerCount: 6789, streamerName: "MusicMaestro", streamTitle: "Live Music Production Session", category: "Music" },
  { id: "7", thumbnailUrl: gamingThumb, isLive: true, viewerCount: 2134, streamerName: "SpeedRunner99", streamTitle: "World Record Attempt - Any%", category: "Gaming" },
  { id: "8", thumbnailUrl: healthThumb, isLive: false, viewerCount: 1456, streamerName: "NutritionExpert", streamTitle: "Healthy Meal Prep Tips", category: "Health" },
];

const categories = [
  "All",
  "Gaming",
  "Health",
  "Academe",
  "Social Talk",
  "Creative",
  "Music",
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStreams = selectedCategory === "All" 
    ? mockStreams 
    : mockStreams.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Live Streams</h1>
        <p className="text-muted-foreground">Discover amazing content creators streaming now</p>
      </div>

      <div className="flex flex-wrap gap-2" data-testid="category-filters">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            data-testid={`button-category-${cat.toLowerCase().replace(' ', '-')}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStreams.map((stream) => (
          <StreamCard key={stream.id} {...stream} />
        ))}
      </div>

      {filteredStreams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">No streams found in this category</p>
        </div>
      )}
    </div>
  );
}
