import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Moon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Dream {
  id: string;
  content: string;
  created_at: string;
}

interface DreamHistoryProps {
  refreshTrigger: number;
}

export function DreamHistory({ refreshTrigger }: DreamHistoryProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchDreams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/dreams/user?user_id=Tanishq%20Srivastava');
      if (response.ok) {
        const data = await response.json();
        setDreams(data);
      } else {
        throw new Error('Failed to fetch dreams');
      }
    } catch (error) {
      toast({
        title: "Failed to Load Dreams",
          description: "Unable to retrieve your dream history.",
          variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-dream">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          <CardTitle className="text-xl">Dream Journal</CardTitle>
        </div>
        <CardDescription>
          Your personal collection of nocturnal adventures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-spin" />
                Loading dreams...
              </div>
            </div>
          ) : dreams.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Moon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No dreams captured yet</p>
              <p className="text-sm text-muted-foreground/70">Submit your first dream above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dreams.map((dream) => (
                <div
                  key={dream.id}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-smooth"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(dream.created_at)}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {dream.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}