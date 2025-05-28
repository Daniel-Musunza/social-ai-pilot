"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { GeneratedContentCard } from "@/components/content/GeneratedContentCard";
import type { GeneratedContent } from "@/types";
import { generateContentAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { ScheduleForm } from "@/components/forms/ScheduleForm";
import { useAuth } from "@/contexts/AuthContext";
import { schedulePostAction } from "../schedule/actions"; // Using schedule actions here

const generateFormSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(200, { message: "Topic must be at most 200 characters." }),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

export default function GeneratePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | undefined>(undefined);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(data: GenerateFormValues) {
    setIsLoading(true);
    setGeneratedContent(null);
    setShowScheduleForm(false);
    setCurrentTopic(data.topic);

    const result = await generateContentAction(data.topic);
    setIsLoading(false);

    if (result.success && result.data) {
      setGeneratedContent(result.data);
      toast({
        title: "Content Generated!",
        description: "Review the suggestions below and proceed to schedule.",
      });
    } else {
      toast({
        title: "Error Generating Content",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  const handleScheduleContent = (content: GeneratedContent) => {
    setGeneratedContent(content); // Ensure this is the content to be scheduled
    setShowScheduleForm(true);
  };

  const handleScheduleSubmit = async (values: { platforms: any[], scheduledTime: Date, originalTopic?: string, generatedContent: GeneratedContent }) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to schedule posts.", variant: "destructive" });
      return;
    }
    setIsScheduling(true);
    const result = await schedulePostAction({
      userId: user.uid,
      originalTopic: values.originalTopic,
      generatedContent: values.generatedContent,
      platforms: values.platforms,
      scheduledTime: values.scheduledTime,
    });
    setIsScheduling(false);

    if (result.success) {
      toast({
        title: "Post Scheduled!",
        description: `Successfully scheduled for ${values.platforms.join(', ')}.`,
      });
      setShowScheduleForm(false);
      setGeneratedContent(null); // Clear content after scheduling
      form.reset(); // Reset generation form
    } else {
      toast({
        title: "Scheduling Failed",
        description: result.error || "Could not schedule the post.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Enter a topic or keyword, and let our AI craft engaging social media content for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Topic / Keyword</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Benefits of mindfulness meditation', 'New features in our app', 'Healthy breakfast ideas'"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Content"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">AI is thinking... Please wait.</p>
        </div>
      )}

      {!isLoading && generatedContent && (
        <GeneratedContentCard 
            content={generatedContent} 
            topic={currentTopic}
            onSchedule={handleScheduleContent} 
            isScheduling={isScheduling}
        />
      )}
      
      {showScheduleForm && generatedContent && (
        <Card className="mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Schedule Your Post</CardTitle>
            <CardDescription>Choose platforms and time for the generated content.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleForm
              generatedContent={generatedContent}
              originalTopic={currentTopic}
              onSubmit={handleScheduleSubmit}
              isSubmitting={isScheduling}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
