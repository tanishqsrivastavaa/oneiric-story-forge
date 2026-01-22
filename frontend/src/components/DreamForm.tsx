import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface DreamFormProps {
  onDreamSubmitted: (narrative: string) => void;
}

export function DreamForm({ onDreamSubmitted }: DreamFormProps) {
  const [dreamText, setDreamText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dreamText.trim()) {
      toast({
        title: "Dream Required",
        description: "Please enter your dream before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, save the dream with JWT token
      const saveResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: dreamText
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save dream');
      }

      // Then, get the AI-generated response
      const narrativeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dream-response/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!narrativeResponse.ok) {
        throw new Error('Failed to generate dream narrative');
      }

      const narrativeData = await narrativeResponse.json();

      toast({
        title: "Dream Captured ✨",
        description: "Your dream has been safely stored in the dream realm.",
      });

      setDreamText("");
      onDreamSubmitted(narrativeData.response);

      // Return the AI response for future use
      return narrativeData;

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to capture your dream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
            <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
          </svg>
          Capture Your Dream
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Share your nocturnal journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your dream..."
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              className="min-h-32 bg-input border-border focus:border-primary transition-colors resize-none"
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground text-right">
              {dreamText.length} characters
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting || !dreamText.trim()}
          >
            {isSubmitting ? "Saving..." : "Submit Dream"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}