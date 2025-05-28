"use server";

import { addScheduledPost } from "@/lib/firebase/firestore";
import type { GeneratedContent, SocialMediaPlatform, ScheduledPost } from "@/types";
import { revalidatePath } from "next/cache";

interface SchedulePostInput {
  userId: string;
  originalTopic?: string;
  generatedContent: GeneratedContent;
  platforms: SocialMediaPlatform[];
  scheduledTime: Date;
}

export async function schedulePostAction(
  input: SchedulePostInput
): Promise<{ success: boolean; postIds?: string[]; error?: string }> {
  const { userId, originalTopic, generatedContent, platforms, scheduledTime } = input;

  if (!userId) return { success: false, error: "User not authenticated." };
  if (platforms.length === 0) return { success: false, error: "Please select at least one platform." };
  if (!scheduledTime) return { success: false, error: "Please select a schedule time." };

  try {
    const postIds: string[] = [];
    for (const platform of platforms) {
      const postToSave: Omit<ScheduledPost, "id" | "userId" | "createdAt" | "updatedAt" | "status"> = {
        originalTopic,
        content: generatedContent.caption,
        hashtags: generatedContent.hashtags,
        shortFormHook: generatedContent.shortFormHook,
        imagePrompt: generatedContent.imagePrompt,
        videoPrompt: generatedContent.videoPrompt,
        platform,
        scheduledTime: new Date(scheduledTime), // Ensure it's a Date object
      };
      
      const postId = await addScheduledPost(userId, postToSave);
      postIds.push(postId);
    }
    
    revalidatePath("/dashboard");
    revalidatePath("/history");
    return { success: true, postIds };
  } catch (e) {
    console.error("Error scheduling post:", e);
    const error = e instanceof Error ? e.message : "An unknown error occurred while scheduling.";
    return { success: false, error };
  }
}
