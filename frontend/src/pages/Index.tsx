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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logout Button */}
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-primary">
                <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
              </svg>
              <h1 className="text-3xl font-bold text-foreground">
                Somnia
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{email}</span>
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
          <p className="text-muted-foreground max-w-2xl">
            Capture and explore your dreams
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
      </div>
    </div>
  );
};

export default Index;