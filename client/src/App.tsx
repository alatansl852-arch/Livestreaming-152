import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HomePage from "@/pages/HomePage";
import StreamPage from "@/pages/StreamPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import StreamerPage from "@/pages/StreamerPage";
import DashboardPage from "@/pages/DashboardPage";
import CategoryPage from "@/pages/CategoryPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/stream/:id" component={StreamPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/streamer/:id" component={StreamerPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/category/:category" component={CategoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 md:hidden">
                <div 
                  className="absolute inset-0 bg-black/50" 
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="absolute left-0 top-16 bottom-0 z-50">
                  <Sidebar onNavigate={() => setSidebarOpen(false)} />
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
