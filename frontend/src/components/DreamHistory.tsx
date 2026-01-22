import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Moon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

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
  const { token } = useAuth();

  const fetchDreams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/dreams/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
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
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          <CardTitle className="text-xl text-foreground">Dream History</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Your captured dreams
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
                  className="p-4 rounded-lg bg-secondary/20 border border-border hover:bg-secondary/30 transition-colors"
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