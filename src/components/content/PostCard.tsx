import type { ScheduledPost } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "./PlatformIcon";
import { CalendarClock, CheckCircle2, AlertTriangle, Hourglass, LinkIcon, MessageSquareWarning } from "lucide-react";
import { format } from "date-fns";

interface PostCardProps {
  post: ScheduledPost;
}

export function PostCard({ post }: PostCardProps) {
  const getStatusBadgeVariant = (status: ScheduledPost["status"]) => {
    switch (status) {
      case "posted":
        return "default"; // Greenish or primary
      case "failed":
        return "destructive";
      case "scheduled":
      default:
        return "secondary"; // Bluish or neutral
    }
  };

  const getStatusIcon = (status: ScheduledPost["status"]) => {
    switch (status) {
      case "posted":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "scheduled":
      default:
        return <Hourglass className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const formattedDate = post.scheduledTime ? format(new Date(post.scheduledTime.toString()), "PPpp") : 'N/A';

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <PlatformIcon platform={post.platform} className="h-8 w-8" />
          <Badge variant={getStatusBadgeVariant(post.status)} className="capitalize flex items-center gap-1">
            {getStatusIcon(post.status)}
            {post.status}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg line-clamp-2">{post.content}</CardTitle>
         {post.originalTopic && <CardDescription>Topic: {post.originalTopic}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
            ))}
          </div>
        )}
        <div className="text-sm text-muted-foreground flex items-center">
          <CalendarClock className="h-4 w-4 mr-2" />
          Scheduled for: {formattedDate}
        </div>
        {post.status === "failed" && post.failureReason && (
           <p className="text-xs text-destructive flex items-center">
             <MessageSquareWarning className="h-4 w-4 mr-1 flex-shrink-0" /> Failure: {post.failureReason}
           </p>
        )}
      </CardContent>
      {post.livePostLink && (
        <CardFooter>
           <a
            href={post.livePostLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center"
          >
            <LinkIcon className="h-4 w-4 mr-1" /> View Post
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
