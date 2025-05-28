"use client";

import type { GeneratedContent, SocialMediaPlatform } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input"; // For time input
import { cn } from "@/lib/utils";
import { format, setHours, setMinutes, parse } from "date-fns";
import { CalendarIcon, ClockIcon, Loader2 } from "lucide-react";
import { PlatformIcon } from "../content/PlatformIcon";
import { useState } from "react";

const availablePlatforms: { id: SocialMediaPlatform; label: string }[] = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "twitter", label: "Twitter/X" },
  { id: "youtube", label: "YouTube Shorts" },
  { id: "tiktok", label: "TikTok" },
];

const scheduleFormSchema = z.object({
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one platform.",
  }),
  scheduledDate: z.date({
    required_error: "A date is required.",
  }),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour).",
  }),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
  generatedContent: GeneratedContent;
  originalTopic?: string;
  onSubmit: (values: { platforms: SocialMediaPlatform[], scheduledTime: Date, originalTopic?: string, generatedContent: GeneratedContent }) => Promise<void>;
  isSubmitting: boolean;
}

export function ScheduleForm({ generatedContent, originalTopic, onSubmit, isSubmitting }: ScheduleFormProps) {
  const defaultScheduledTime = new Date();
  defaultScheduledTime.setHours(defaultScheduledTime.getHours() + 1, 0, 0, 0); // Default to one hour from now, on the hour

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      platforms: [],
      scheduledDate: defaultScheduledTime,
      scheduledTime: format(defaultScheduledTime, "HH:mm"),
    },
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function handleSubmit(data: ScheduleFormValues) {
    const [hours, minutes] = data.scheduledTime.split(":").map(Number);
    let finalScheduledDateTime = setMinutes(setHours(data.scheduledDate, hours), minutes);

    // Ensure the scheduled time is in the future
    if (finalScheduledDateTime <= new Date()) {
        form.setError("scheduledTime", { type: "manual", message: "Scheduled time must be in the future." });
        // Also possible to set error on scheduledDate
        form.setError("scheduledDate", { type: "manual", message: "Scheduled date/time must be in the future."});
        return;
    }
    
    await onSubmit({
        platforms: data.platforms as SocialMediaPlatform[],
        scheduledTime: finalScheduledDateTime,
        originalTopic,
        generatedContent,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="platforms"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg font-semibold">Platforms</FormLabel>
                <FormDescription>Select the social media platforms to post to.</FormDescription>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {availablePlatforms.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="platforms"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                            <PlatformIcon platform={item.id} className="h-5 w-5" />
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel className="text-lg font-semibold">Schedule Date</FormLabel>
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            field.onChange(date);
                            setShowDatePicker(false);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormDescription>Select the date for your post.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="scheduledTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-lg font-semibold">Schedule Time (24-hour)</FormLabel>
                <div className="relative">
                    <FormControl>
                    <Input type="time" {...field} className="pl-10"/>
                    </FormControl>
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <FormDescription>Enter time in HH:MM format (e.g., 14:30 for 2:30 PM).</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto" size="lg">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Scheduling..." : "Confirm Schedule"}
        </Button>
      </form>
    </Form>
  );
}
