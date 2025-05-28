"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function SchedulePage() {
  // This page might be used if navigating directly with content to schedule,
  // or could be enhanced to load a draft post.
  // For now, scheduling is integrated into the /generate page after content creation.
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Schedule Post</CardTitle>
          <CardDescription>
            This page is for scheduling content. Currently, scheduling is initiated from the 'Generate Content' page after AI suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
           <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground">
            To schedule a new post, please first generate content using our AI tool.
          </p>
          <Link href="/generate" passHref>
            <Button size="lg">Go to Generate Content</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
