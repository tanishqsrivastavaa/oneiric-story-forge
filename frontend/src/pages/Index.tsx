import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DreamForm } from "@/components/DreamForm";
import { DreamHistory } from "@/components/DreamHistory";
import { DreamGenerator } from "@/components/DreamGenerator";
import { Moon, Stars, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import dreamBackground from "@/assets/dream-background.jpg";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  const handleDreamSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-gradient-dream relative overflow-hidden"
      style={{
        backgroundImage: `url(${dreamBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay for better content readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-primary/20 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-3000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Logout Button */}
        <header className="text-center mb-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              Welcome, {email}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3 mb-4">
            <Moon className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-magical bg-clip-text text-transparent">
              Dream Journal
            </h1>
            <Stars className="h-8 w-8 text-accent animate-pulse delay-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Capture, explore, and visualize your nocturnal journeys in this mystical realm of dreams
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Dream Input and History */}
          <div className="space-y-8">
            <DreamForm onDreamSubmitted={handleDreamSubmitted} />
            <DreamHistory refreshTrigger={refreshTrigger} />
          </div>

          {/* Right Column - Dream Generation */}
          <div className="space-y-8">
            <DreamGenerator />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground/60">
          <p className="text-sm">
            "Dreams are the touchstones of our characters." - Henry David Thoreau
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;