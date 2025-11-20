import LeaderboardTable from '../LeaderboardTable';

const mockEntries = [
  { rank: 1, streamerId: "1", name: "ProGamer123", category: "Gaming", totalViews: 1247890, ratingScore: 9.5, subscribers: 45200 },
  { rank: 2, streamerId: "2", name: "FitnessGuru", category: "Health", totalViews: 987654, ratingScore: 9.3, subscribers: 38500 },
  { rank: 3, streamerId: "3", name: "TechTeacher", category: "Academe", totalViews: 856432, ratingScore: 9.1, subscribers: 32100 },
  { rank: 4, streamerId: "4", name: "ArtistPro", category: "Creative", totalViews: 745123, ratingScore: 8.9, subscribers: 28900 },
  { rank: 5, streamerId: "5", name: "PodcastKing", category: "Social Talk", totalViews: 698456, ratingScore: 8.7, subscribers: 25600 },
];

export default function LeaderboardTableExample() {
  return (
    <div className="p-4">
      <LeaderboardTable entries={mockEntries} />
    </div>
  );
}
