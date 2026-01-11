import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Image, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export function DreamGenerator() {
  const [collectiveDream, setCollectiveDream] = useState("");
  const [dreamImage, setDreamImage] = useState("");
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const generateCollectiveDream = async () => {
    setIsGeneratingNarrative(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/dream-response/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCollectiveDream(data.response);
        toast({
          title: "Collective Dream Generated ✨",
          description: "The dream realm has spoken through your experiences.",
        });
      } else {
        throw new Error('Failed to generate collective dream');
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to weave your collective dream narrative.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  const generateDreamImage = async () => {
    console.log("'Generate Dream Image' button clicked");
    setIsGeneratingImage(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/dream-generate/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDreamImage(data.image_url);
        toast({
          title: "Dream Image Created 🎨",
          description: "Your dreams have taken visual form.",
        });
      } else {
        throw new Error('Failed to generate dream image');
      }
    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: "Unable to visualize your dreams at this time.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Collective Dream Generation */}
      <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-dream">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Collective Dream Narrative</CardTitle>
          </div>
          <CardDescription>
            Generate a unified story from your dream experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateCollectiveDream}
            disabled={isGeneratingNarrative}
            variant="mystical"
            className="w-full"
          >
            {isGeneratingNarrative ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Weaving Dream Narrative...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate Collective Dream
              </div>
            )}
          </Button>

          {collectiveDream && (
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Your Collective Dream
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed italic">
                "{collectiveDream}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dream Image Generation */}
      <Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-dream">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-accent" />
            <CardTitle className="text-xl">Dream Visualization</CardTitle>
          </div>
          <CardDescription>
            Transform your dreams into ethereal imagery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateDreamImage}
            disabled={isGeneratingImage}
            variant="ethereal"
            className="w-full"
          >
            {isGeneratingImage ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Manifesting Dream Vision...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Generate Dream Image
              </div>
            )}
          </Button>

          {dreamImage && (
            <div className="rounded-lg overflow-hidden shadow-glow">
              <img
                src={dreamImage}
                alt="Generated dream visualization"
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}