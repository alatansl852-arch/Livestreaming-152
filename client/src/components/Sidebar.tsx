import { Gamepad2, Heart, GraduationCap, MessageCircle, Palette, TrendingUp, Home, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Gaming", icon: Gamepad2, path: "/category/gaming" },
  { name: "Health", icon: Heart, path: "/category/health" },
  { name: "Academe", icon: GraduationCap, path: "/category/academe" },
  { name: "Social Talk", icon: MessageCircle, path: "/category/social-talk" },
  { name: "Creative", icon: Palette, path: "/category/creative" },
  { name: "Trending", icon: TrendingUp, path: "/category/trending" },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function Sidebar({ className, onNavigate }: SidebarProps) {
  const [location] = useLocation();

  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-card", className)}>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 px-2 text-sm font-semibold text-muted-foreground">Menu</h3>
            <div className="space-y-1">
              <Link href="/" onClick={handleClick}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-3", location === "/" && "bg-sidebar-accent")}
                  data-testid="link-home"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Link href="/leaderboard" onClick={handleClick}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-3", location === "/leaderboard" && "bg-sidebar-accent")}
                  data-testid="link-leaderboard"
                >
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </Button>
              </Link>
              <Link href="/dashboard" onClick={handleClick}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-3", location === "/dashboard" && "bg-sidebar-accent")}
                  data-testid="link-dashboard"
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-3 px-2 text-sm font-semibold text-muted-foreground">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link key={category.name} href={category.path} onClick={handleClick}>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-3", location === category.path && "bg-sidebar-accent")}
                    data-testid={`link-category-${category.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <category.icon className="h-5 w-5" />
                    {category.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
