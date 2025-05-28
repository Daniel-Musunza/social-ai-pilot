"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getScheduledPosts } from "@/lib/firebase/firestore";
import type { ScheduledPost } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/content/PostCard";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, FileText, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type PostStatusFilter = "all" | ScheduledPost["status"];

export default function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<PostStatusFilter>("all");

  const { data: posts, isLoading, error, refetch } = useQuery<ScheduledPost[]>({
    queryKey: ["allScheduledPosts", user?.uid], // Different key from dashboard for all posts
    queryFn: () => {
      if (!user?.uid) return Promise.resolve([]);
      return getScheduledPosts(user.uid); // This function fetches all posts for the user
    },
    enabled: !!user?.uid,
  });

  const filteredPosts = posts?.filter(post => filter === "all" || post.status === filter);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <FileText className="mr-3 h-8 w-8 text-primary" /> Post History
        </h1>
         <Link href="/generate" passHref>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Post
          </Button>
        </Link>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as PostStatusFilter)} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-3 text-lg text-muted-foreground">Loading history...</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md flex items-center gap-3">
          <AlertTriangle className="h-6 w-6" />
           <div>
            <p className="font-semibold">Error loading history</p>
            <p className="text-sm">{(error as Error).message}. Please try again later or <Button variant="link" size="sm" onClick={() => refetch()} className="p-0 h-auto text-destructive hover:underline">refresh</Button>.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && filteredPosts && filteredPosts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!isLoading && !error && (!filteredPosts || filteredPosts.length === 0) && (
         <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
          <h3 className="text-xl font-semibold text-muted-foreground">
            {filter === "all" ? "No posts found." : `No ${filter} posts found.`}
          </h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {filter === "all" ? "Try creating some content!" : "There are no posts matching this filter."}
          </p>
          {filter === "all" && (
            <Link href="/generate" passHref>
                <Button>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create First Post
                </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
