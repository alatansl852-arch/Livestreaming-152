import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface LeaderboardEntry {
  rank: number;
  streamerId: string;
  name: string;
  avatar?: string;
  category: string;
  totalViews: number;
  ratingScore: number;
  subscribers: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left font-semibold">Rank</th>
              <th className="p-4 text-left font-semibold">Streamer</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-right font-semibold">Total Views</th>
              <th className="p-4 text-right font-semibold">Rating</th>
              <th className="p-4 text-right font-semibold">Subscribers</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.streamerId}
                className="border-b last:border-0 hover-elevate"
                data-testid={`row-streamer-${entry.streamerId}`}
              >
                <td className="p-4">
                  <div className="flex items-center justify-center">
                    <span
                      className={`font-mono text-lg font-bold ${
                        entry.rank === 1
                          ? "text-yellow-500"
                          : entry.rank === 2
                          ? "text-gray-400"
                          : entry.rank === 3
                          ? "text-orange-600"
                          : ""
                      }`}
                    >
                      #{entry.rank}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <Link href={`/streamer/${entry.streamerId}`}>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold hover:text-primary transition-colors">
                        {entry.name}
                      </span>
                    </div>
                  </Link>
                </td>
                <td className="p-4">
                  <Badge variant="secondary">{entry.category}</Badge>
                </td>
                <td className="p-4 text-right">
                  <span className="font-mono">{entry.totalViews.toLocaleString()}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-mono font-semibold text-primary">
                    {entry.ratingScore.toFixed(1)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-mono">{entry.subscribers.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
