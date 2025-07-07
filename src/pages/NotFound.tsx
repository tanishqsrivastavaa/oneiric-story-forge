import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Moon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dream flex items-center justify-center relative overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-primary/20 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-3000" />
      </div>
      
      <div className="text-center space-y-8 px-4 relative z-10">
        <div className="flex justify-center">
          <Moon className="h-20 w-20 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-magical bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Lost in the Dream Realm
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The path you seek has dissolved into the mists of dreams. 
            Let us guide you back to reality.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/')}
          variant="magical"
          size="lg"
          className="group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Dreams
        </Button>
      </div>
    </div>
  );
};

export default NotFound;