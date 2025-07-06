import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dream">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-magical bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! This dream doesn't exist</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-magical text-primary-foreground rounded-lg hover:shadow-glow hover:scale-105 transition-smooth font-medium"
        >
          Return to Dream Realm
        </a>
      </div>
    </div>
  );
};

export default NotFound;
