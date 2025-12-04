// src/App.tsx
import { Route, Switch, useRoute } from "wouter";
import { AuthProvider, ProtectedRoute } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import StreamPage from "@/pages/StreamPage";
import StreamerPage from "@/pages/StreamerPage";
import CategoryPage from "@/pages/CategoryPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import DashboardPage from "@/pages/DashboardPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

function AppRouter() {
  const [isLogin] = useRoute("/login");
  const [isRegister] = useRoute("/register");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Render auth pages without layout
  if (isLogin || isRegister) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
      </Switch>
    );
  }

  // Render all other pages with layout
  return (
    <div className="flex h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] md:hidden">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/stream/:id" component={StreamPage} />
            <Route path="/streamer/:id" component={StreamerPage} />
            <Route path="/category/:category" component={CategoryPage} />
            <Route path="/leaderboard" component={LeaderboardPage} />
            <Route path="/about" component={AboutPage} />
            
            {/* Protected route - only for streamers */}
            <Route path="/dashboard">
              <ProtectedRoute requireStreamer>
                <DashboardPage />
              </ProtectedRoute>
            </Route>

            {/* 404 - Not Found */}
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;