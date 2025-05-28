import { db } from "./config";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { ScheduledPost, GeneratedContent } from "@/types";

const POSTS_COLLECTION = "scheduledPosts";

// Helper to convert Firestore Timestamps to Dates in a post object
const postFromDoc = (docSnap: any): ScheduledPost => {
  const data = docSnap.data() as ScheduledPost;
  return {
    ...data,
    id: docSnap.id,
    scheduledTime: (data.scheduledTime as Timestamp)?.toDate(),
    createdAt: (data.createdAt as Timestamp)?.toDate(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
  };
};

export async function addScheduledPost(
  userId: string,
  postData: Omit<ScheduledPost, "id" | "userId" | "createdAt" | "updatedAt" | "status"> & { aiGenerated?: GeneratedContent }
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      userId,
      status: "scheduled",
      scheduledTime: Timestamp.fromDate(new Date(postData.scheduledTime)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding scheduled post: ", error);
    throw new Error("Failed to schedule post.");
  }
}

export async function getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("scheduledTime", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(postFromDoc);
  } catch (error) {
    console.error("Error fetching scheduled posts: ", error);
    throw new Error("Failed to fetch posts.");
  }
}

export async function updateScheduledPostStatus(postId: string, status: "posted" | "failed", failureReason?: string): Promise<void> {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const updateData: Partial<ScheduledPost> = { status, updatedAt: serverTimestamp() };
    if (status === "failed" && failureReason) {
      updateData.failureReason = failureReason;
    }
    await updateDoc(postRef, updateData);
  } catch (error) {
    console.error("Error updating post status: ", error);
    throw new Error("Failed to update post status.");
  }
}

// Add more functions as needed, e.g., deleteScheduledPost, getPostById etc.
