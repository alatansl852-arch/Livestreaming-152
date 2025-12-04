// src/components/Sidebar.tsx
import { Link, useLocation } from "wouter";
import { Home, Flame, Trophy, LayoutDashboard, Gamepad2, Heart, GraduationCap, Users, Palette, Music, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const categories = [
  { name: "Gaming", icon: Gamepad2, path: "/category/Gaming" },
  { name: "Health", icon: Heart, path: "/category/Health" },
  { name: "Academe", icon: GraduationCap, path: "/category/Academe" },
  { name: "Social Talk", icon: Users, path: "/category/Social Talk" },
  { name: "Creative", icon: Palette, path: "/category/Creative" },
  { name: "Music", icon: Music, path: "/category/Music" },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <nav className="flex flex-1 flex-col p-4">
        {/* Main Navigation and Categories - Scrollable Area */}
        <div className="flex-1 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Link href="/" onClick={handleClick}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/") && location === "/"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </div>
            </Link>

            <Link href="/leaderboard" onClick={handleClick}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/leaderboard")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Trophy className="h-5 w-5" />
                <span>Leaderboard</span>
              </div>
            </Link>

            {/* Only show Dashboard for streamers */}
            {isAuthenticated && user?.isStreamer && (
              <Link href="/dashboard" onClick={handleClick}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive("/dashboard")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
              </Link>
            )}
          </div>

          {/* Categories Section */}
          <div className="pt-6">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.name} href={category.path} onClick={handleClick}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive(category.path)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{category.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* About Link - Pinned to Bottom */}
        <div className="mt-4 border-t pt-4">
          <Link href="/about" onClick={handleClick}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive("/about")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
}