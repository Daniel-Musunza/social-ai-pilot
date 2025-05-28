"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getScheduledPosts } from "@/lib/firebase/firestore";
import type { ScheduledPost } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/content/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: posts, isLoading, error, refetch } = useQuery<ScheduledPost[]>({
    queryKey: ["scheduledPosts", user?.uid],
    queryFn: () => {
      if (!user?.uid) return Promise.resolve([]);
      return getScheduledPosts(user.uid);
    },
    enabled: !!user?.uid,
  });

  const summary = posts?.reduce(
    (acc, post) => {
      acc[post.status]++;
      acc.total++;
      return acc;
    },
    { scheduled: 0, posted: 0, failed: 0, total: 0 }
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Link href="/generate" passHref>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Post
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md flex items-center gap-3">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <p className="font-semibold">Error loading posts</p>
            <p className="text-sm">{(error as Error).message}. Please try again later or <Button variant="link" size="sm" onClick={() => refetch()} className="p-0 h-auto text-destructive hover:underline">refresh</Button>.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && summary && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{summary.scheduled}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Posted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{summary.posted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{summary.failed}</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {!isLoading && !error && posts && posts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.slice(0,8).map((post) => ( // Display up to 8 recent posts on dashboard
              <PostCard key={post.id} post={post} />
            ))}
          </div>
           {posts.length > 8 && (
            <div className="mt-8 text-center">
              <Link href="/history" passHref>
                <Button variant="outline">View All Posts</Button>
              </Link>
            </div>
          )}
        </>
      )}

      {!isLoading && !error && (!posts || posts.length === 0) && (
        <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
          <h3 className="text-xl font-semibold text-muted-foreground">No posts yet!</h3>
          <p className="text-muted-foreground mt-2 mb-4">Start by generating and scheduling your first social media post.</p>
          <Link href="/generate" passHref>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create First Post
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
