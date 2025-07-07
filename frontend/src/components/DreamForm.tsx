import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DreamFormProps {
  onDreamSubmitted: () => void;
}

export function DreamForm({ onDreamSubmitted }: DreamFormProps) {
  const [dreamText, setDreamText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      // First, save the dream
      const saveResponse = await fetch('http://127.0.0.1:8000/dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: 'user001',
          text: dreamText
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save dream');
      }

      // Then, get the AI-generated response
      const narrativeResponse = await fetch('http://localhost:8000/dream-response/user?user_id=user001');
      
      if (!narrativeResponse.ok) {
        throw new Error('Failed to generate dream narrative');
      }

      const narrativeData = await narrativeResponse.json();

      toast({
        title: "Dream Captured ✨",
        description: "Your dream has been safely stored in the dream realm.",
      });
      
      setDreamText("");
      onDreamSubmitted();
      
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
    <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-dream">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Moon className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-magical bg-clip-text text-transparent">
          Capture Your Dream
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Share your nocturnal journey with the dream collective
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your dream... What did you see, feel, or experience in the realm of sleep?"
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              className="min-h-32 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none transition-smooth"
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground text-right">
              {dreamText.length} characters
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="magical"
            className="w-full"
            disabled={isSubmitting || !dreamText.trim()}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                Capturing Dream...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Submit Dream
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}