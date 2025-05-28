import type { GeneratedContent, SocialMediaPlatform } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Image as ImageIcon, VideoIcon, Quote, Hash, CalendarPlus } from "lucide-react";

interface GeneratedContentCardProps {
  content: GeneratedContent;
  topic?: string;
  onSchedule: (content: GeneratedContent) => void;
  isScheduling?: boolean;
}

export function GeneratedContentCard({ content, topic, onSchedule, isScheduling }: GeneratedContentCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary mb-2">
          <Lightbulb className="h-6 w-6" />
          <CardTitle className="text-2xl">AI Content Suggestion</CardTitle>
        </div>
        {topic && <CardDescription>For topic: "{topic}"</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center"><Quote className="h-5 w-5 mr-2 text-muted-foreground" />Caption:</h3>
          <p className="text-foreground bg-secondary/50 p-3 rounded-md whitespace-pre-wrap">{content.caption}</p>
        </div>

        {content.hashtags && content.hashtags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center"><Hash className="h-5 w-5 mr-2 text-muted-foreground" />Hashtags:</h3>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary">#{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {content.shortFormHook && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center"><VideoIcon className="h-5 w-5 mr-2 text-muted-foreground" />TikTok/Shorts Hook:</h3>
            <p className="text-foreground italic bg-secondary/50 p-3 rounded-md">{content.shortFormHook}</p>
          </div>
        )}

        {content.imagePrompt && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-muted-foreground" />Image Prompt Idea:</h3>
            <p className="text-foreground bg-secondary/50 p-3 rounded-md">{content.imagePrompt}</p>
          </div>
        )}

        {content.videoPrompt && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center"><VideoIcon className="h-5 w-5 mr-2 text-muted-foreground" />Video Prompt Idea:</h3>
            <p className="text-foreground bg-secondary/50 p-3 rounded-md">{content.videoPrompt}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button size="lg" onClick={() => onSchedule(content)} disabled={isScheduling} className="w-full md:w-auto ml-auto">
          <CalendarPlus className="mr-2 h-5 w-5" />
          {isScheduling ? "Processing..." : "Schedule This Content"}
        </Button>
      </CardFooter>
    </Card>
  );
}
