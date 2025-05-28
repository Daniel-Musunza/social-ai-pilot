import type { Timestamp } from "firebase/firestore";

export type SocialMediaPlatform = "instagram" | "facebook" | "twitter" | "youtube" | "tiktok";

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
  shortFormHook?: string;
  imagePrompt?: string;
  videoPrompt?: string;
}

export interface ScheduledPost {
  id?: string; // Firestore document ID
  userId: string; // Firebase Auth UID
  originalTopic?: string; // Topic used for generation

  // Content details derived from GeneratedContent or edited by user
  content: string; // This is the caption
  hashtags: string[];
  shortFormHook?: string;
  imagePrompt?: string; // The image prompt associated with this specific scheduled post
  videoPrompt?: string; // The video prompt associated with this specific scheduled post
  
  // Scheduling details
  platform: SocialMediaPlatform;
  scheduledTime: Date | Timestamp; // Store as Firestore Timestamp, use Date in client/forms
  status: "scheduled" | "posted" | "failed";

  // Audit and metadata
  createdAt: Date | Timestamp; // Firestore Timestamp
  updatedAt?: Date | Timestamp; // Firestore Timestamp
  
  // Optional fields for display or future use
  livePostLink?: string;
  failureReason?: string;
  // analytics?: { likes?: number; views?: number; comments?: number };
}
