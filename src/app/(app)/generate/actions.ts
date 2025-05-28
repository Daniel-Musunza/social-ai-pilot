"use server";

import { generateSocialMediaPost as genkitGeneratePost } from "@/ai/flows/generate-social-media-post";
import type { GenerateSocialMediaPostInput, GenerateSocialMediaPostOutput } from "@/ai/flows/generate-social-media-post";
import type { GeneratedContent } from "@/types";

export async function generateContentAction(
  topic: string
): Promise<{ success: boolean; data?: GeneratedContent; error?: string }> {
  if (!topic || topic.trim() === "") {
    return { success: false, error: "Topic cannot be empty." };
  }

  try {
    const input: GenerateSocialMediaPostInput = { topic };
    const result: GenerateSocialMediaPostOutput = await genkitGeneratePost(input);
    
    // Adapt the Genkit output to our GeneratedContent type
    const adaptedResult: GeneratedContent = {
      caption: result.caption,
      hashtags: result.hashtags,
      shortFormHook: result.shortFormHook,
      imagePrompt: result.imagePrompt,
      videoPrompt: result.videoPrompt,
    };

    return { success: true, data: adaptedResult };
  } catch (e) {
    console.error("Error generating content:", e);
    const error = e instanceof Error ? e.message : "An unknown error occurred during content generation.";
    return { success: false, error };
  }
}
